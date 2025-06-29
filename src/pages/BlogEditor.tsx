import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import AdvancedRichTextEditor from '@/components/AdvancedRichTextEditor';

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  readTime: z.string().min(1, 'Read time is required'),
  tags: z.string().min(1, 'At least one tag is required'),
});

const categories = ['AI', 'Development', 'DevOps', 'Technology', 'Design', 'Business'];

const BlogEditor = () => {
  const [content, setContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof blogSchema>>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      category: '',
      imageUrl: '',
      readTime: '',
      tags: '',
    },
  });

  useEffect(() => {
    // Check admin authentication
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) {
      navigate('/admin');
      return;
    }

    // If editing, load the blog post
    if (id) {
      loadBlogPost(id);
    }
  }, [id, navigate]);

  const loadBlogPost = async (blogId: string) => {
    try {
      const { data: blog, error: blogError } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', blogId)
        .single();

      if (blogError) throw blogError;

      const { data: tags, error: tagsError } = await supabase
        .from('blog_tags')
        .select('tag')
        .eq('blog_id', blogId);

      if (tagsError) throw tagsError;

      form.reset({
        title: blog.title,
        excerpt: blog.excerpt,
        category: blog.category,
        imageUrl: blog.image_url || '',
        readTime: blog.read_time,
        tags: tags.map(t => t.tag).join(', '),
      });

      if (blog.content && Array.isArray(blog.content)) {
        setContent(blog.content);
      } else if (blog.content) {
        try {
          const parsedContent = typeof blog.content === 'string' 
            ? JSON.parse(blog.content) 
            : blog.content;
          setContent(Array.isArray(parsedContent) ? parsedContent : []);
        } catch {
          setContent([]);
        }
      } else {
        setContent([]);
      }
    } catch (error) {
      console.error('Error loading blog post:', error);
      toast({
        title: 'Error loading blog post',
        description: 'Failed to load the blog post for editing',
        variant: 'destructive',
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof blogSchema>) => {
    setIsLoading(true);
    try {
      const blogData = {
        title: values.title,
        excerpt: values.excerpt,
        content: content,
        image_url: values.imageUrl || null,
        category: values.category,
        read_time: values.readTime,
        updated_at: new Date().toISOString(),
      };

      let blogId;

      if (id) {
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', id);

        if (error) throw error;
        blogId = id;

        await supabase
          .from('blog_tags')
          .delete()
          .eq('blog_id', id);
      } else {
        const { data, error } = await supabase
          .from('blogs')
          .insert(blogData)
          .select('id')
          .single();

        if (error) throw error;
        blogId = data.id;
      }

      const tags = values.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      if (tags.length > 0) {
        const tagData = tags.map(tag => ({
          blog_id: blogId,
          tag: tag,
        }));

        await supabase
          .from('blog_tags')
          .insert(tagData);
      }

      toast({
        title: id ? 'Blog updated' : 'Blog created',
        description: `Blog post has been ${id ? 'updated' : 'created'} successfully`,
      });

      navigate('/admin/blog-list');
    } catch (error) {
      console.error('Error saving blog:', error);
      toast({
        title: 'Error saving blog',
        description: 'Failed to save the blog post',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderPreviewContent = () => {
    return content.map((block, index) => {
      switch (block.type) {
        case 'heading':
          const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
          return (
            <HeadingTag key={index} className={`font-bold mb-4 ${
              block.level === 1 ? 'text-3xl' : 
              block.level === 2 ? 'text-2xl' : 'text-xl'
            }`}>
              <div dangerouslySetInnerHTML={{ __html: block.content }} />
            </HeadingTag>
          );
        case 'quote':
          return (
            <blockquote key={index} className="border-l-4 border-dev-primary pl-4 italic my-4">
              <div dangerouslySetInnerHTML={{ __html: block.content }} />
            </blockquote>
          );
        case 'code':
          return (
            <pre key={index} className="bg-black text-green-400 p-4 rounded my-4 overflow-x-auto">
              <code>{block.content}</code>
            </pre>
          );
        case 'list':
          const items = block.content.split('\n').filter((item: string) => item.trim());
          return (
            <ul key={index} className="list-disc list-inside my-4 space-y-1">
              {items.map((item: string, itemIndex: number) => (
                <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item.trim() }} />
              ))}
            </ul>
          );
        case 'ordered-list':
          const orderedItems = block.content.split('\n').filter((item: string) => item.trim());
          return (
            <ol key={index} className="list-decimal list-inside my-4 space-y-1">
              {orderedItems.map((item: string, itemIndex: number) => (
                <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item.trim() }} />
              ))}
            </ol>
          );
        case 'link':
          return (
            <p key={index} className="my-4">
              <a 
                href={block.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {block.content}
              </a>
            </p>
          );
        case 'image':
          return (
            <div key={index} className="my-4">
              <img 
                src={block.url} 
                alt={block.content} 
                className="max-w-full h-auto rounded"
              />
              {block.content && (
                <p className="text-sm text-muted-foreground mt-2">{block.content}</p>
              )}
            </div>
          );
        default:
          return (
            <p key={index} className="my-4">
              <div dangerouslySetInnerHTML={{ __html: block.content }} />
            </p>
          );
      }
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/blog-list')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog List
            </Button>
            <h1 className="text-2xl font-bold">
              {id ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {isPreview ? 'Edit' : 'Preview'}
            </Button>
          </div>
        </div>

        {!isPreview ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter blog title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Brief description of the blog post"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/image.jpg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="readTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Read Time</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="5 min read" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma-separated)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="React, TypeScript, Web Development" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <AdvancedRichTextEditor content={content} onChange={setContent} />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {isLoading ? 'Saving...' : (id ? 'Update Post' : 'Create Post')}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <h1 className="text-3xl font-bold mb-4">{form.watch('title')}</h1>
                <p className="text-muted-foreground mb-6">{form.watch('excerpt')}</p>
                <div className="space-y-4">
                  {renderPreviewContent()}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BlogEditor;
