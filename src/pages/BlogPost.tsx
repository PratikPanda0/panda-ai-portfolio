
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchBlogPost(id);
    }
  }, [id]);

  const fetchBlogPost = async (blogId: string) => {
    try {
      setIsLoading(true);
      
      const { data: blog, error: blogError } = await supabase
        .from('blogs')
        .select(`
          *,
          blog_tags (tag)
        `)
        .eq('id', blogId)
        .single();

      if (blogError) throw blogError;

      if (blog) {
        const transformedPost = {
          id: blog.id,
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          image: blog.image_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop",
          category: blog.category,
          date: blog.date,
          readTime: blog.read_time,
          tags: blog.blog_tags?.map((tag: any) => tag.tag) || [],
          author: blog.author
        };
        
        setPost(transformedPost);
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast({
        title: 'Error loading blog post',
        description: 'Failed to load the blog post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = (content: any[]) => {
    if (!Array.isArray(content)) return null;

    return content.map((block, index) => {
      switch (block.type) {
        case 'heading':
          const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
          return (
            <HeadingTag key={index} className="gradient-text font-bold mt-8 mb-4">
              {block.content}
            </HeadingTag>
          );
        
        case 'quote':
          return (
            <blockquote key={index} className="border-l-4 border-dev-primary pl-6 my-6 italic text-lg">
              {block.content}
            </blockquote>
          );
        
        case 'code':
          return (
            <pre key={index} className="bg-black text-green-400 p-4 rounded-lg my-6 overflow-x-auto">
              <code>{block.content}</code>
            </pre>
          );
        
        case 'list':
          const items = block.content.split('\n').filter((item: string) => item.trim());
          return (
            <ul key={index} className="list-disc list-inside space-y-2 my-6">
              {items.map((item: string, itemIndex: number) => (
                <li key={itemIndex}>{item.trim()}</li>
              ))}
            </ul>
          );
        
        default:
          return (
            <p key={index} className="mb-4 leading-relaxed">
              {block.content}
            </p>
          );
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-20">
          <div className="container-custom mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Loading...</h1>
              <p className="text-muted-foreground">Fetching blog post...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-20">
        <article className="py-12 px-4">
          <div className="container-custom mx-auto max-w-4xl">
            {/* Navigation */}
            <Link to="/blog" className="inline-flex items-center text-dev-primary hover:text-dev-primary/80 mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>

            {/* Article Meta */}
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4">{post.category}</Badge>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 gradient-text">
                {post.title}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-6">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {post.readTime}
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-12">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:gradient-text prose-a:text-dev-primary hover:prose-a:text-dev-primary/80">
              {post.content && Array.isArray(post.content) ? (
                renderContent(post.content)
              ) : (
                <p>Content not available</p>
              )}
            </div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Back to Blog */}
            <div className="mt-12 text-center">
              <Link to="/blog">
                <Button size="lg">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to All Articles
                </Button>
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
