
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Mock blog data (in a real app, this would come from an API)
const blogPosts = [
  {
    id: 1,
    title: "Getting Started with Generative AI in Enterprise Applications",
    excerpt: "Exploring how to integrate AI-powered features into business applications using modern frameworks and cloud services.",
    content: `
      <h2>Introduction</h2>
      <p>Generative AI is revolutionizing how we build enterprise applications. In this comprehensive guide, we'll explore the practical aspects of integrating AI-powered features into business applications.</p>
      
      <h2>Key Considerations</h2>
      <p>When implementing generative AI in enterprise environments, several factors need careful consideration:</p>
      <ul>
        <li>Data privacy and security</li>
        <li>Scalability requirements</li>
        <li>Integration with existing systems</li>
        <li>Cost optimization</li>
      </ul>
      
      <h2>Implementation Strategy</h2>
      <p>A successful AI integration requires a well-planned approach. Start with pilot projects to understand the technology's capabilities and limitations in your specific context.</p>
      
      <h2>Best Practices</h2>
      <p>Here are some proven best practices for implementing generative AI:</p>
      <ol>
        <li>Start with clear use cases</li>
        <li>Ensure data quality</li>
        <li>Monitor performance continuously</li>
        <li>Plan for regular model updates</li>
      </ol>
      
      <h2>Conclusion</h2>
      <p>Generative AI offers tremendous opportunities for enterprise applications. With careful planning and implementation, organizations can unlock significant value while maintaining security and compliance standards.</p>
    `,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    category: "AI",
    date: "2024-01-15",
    readTime: "8 min read",
    tags: ["AI", "Enterprise", "Cloud", "Machine Learning", "Business Intelligence"],
    author: "Pratik Kumar Panda"
  },
  {
    id: 2,
    title: "Building Scalable React Applications with TypeScript",
    excerpt: "Best practices for structuring large-scale React applications with TypeScript for better maintainability.",
    content: `
      <h2>Why TypeScript for React?</h2>
      <p>TypeScript brings static typing to JavaScript, making React applications more robust and maintainable. This is especially important in large-scale applications where code complexity can quickly become overwhelming.</p>
      
      <h2>Project Structure</h2>
      <p>A well-organized project structure is crucial for scalability:</p>
      <ul>
        <li>Feature-based folder organization</li>
        <li>Shared components and utilities</li>
        <li>Clear separation of concerns</li>
      </ul>
      
      <h2>Type Safety Best Practices</h2>
      <p>Leveraging TypeScript's type system effectively requires following certain patterns and practices that ensure both safety and developer experience.</p>
      
      <h2>Performance Considerations</h2>
      <p>Large applications need careful attention to performance. We'll cover lazy loading, code splitting, and other optimization techniques.</p>
    `,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
    category: "Development",
    date: "2024-01-10",
    readTime: "12 min read",
    tags: ["React", "TypeScript", "Architecture", "Frontend", "JavaScript"],
    author: "Pratik Kumar Panda"
  },
  {
    id: 3,
    title: "Azure DevOps: Streamlining CI/CD Pipelines",
    excerpt: "How to set up efficient continuous integration and deployment pipelines using Azure DevOps services.",
    content: `
      <h2>Setting Up Your Pipeline</h2>
      <p>Azure DevOps provides comprehensive tools for building, testing, and deploying applications. Let's explore how to create efficient CI/CD pipelines.</p>
      
      <h2>Pipeline Configuration</h2>
      <p>YAML-based pipeline configuration offers flexibility and version control for your deployment processes.</p>
      
      <h2>Best Practices</h2>
      <p>Follow these guidelines for optimal pipeline performance and reliability.</p>
    `,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop",
    category: "DevOps",
    date: "2024-01-05",
    readTime: "10 min read",
    tags: ["Azure", "DevOps", "CI/CD", "Automation", "Deployment"],
    author: "Pratik Kumar Panda"
  },
  {
    id: 4,
    title: "The Future of Web Development: Trends to Watch in 2024",
    excerpt: "Analyzing emerging technologies and frameworks that are shaping the future of web development.",
    content: `
      <h2>Emerging Technologies</h2>
      <p>The web development landscape continues to evolve rapidly. Here are the key trends shaping 2024 and beyond.</p>
      
      <h2>Framework Evolution</h2>
      <p>Modern frameworks are becoming more powerful and developer-friendly, enabling faster development cycles.</p>
      
      <h2>The AI Revolution</h2>
      <p>AI-powered development tools are changing how we write, test, and deploy code.</p>
    `,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop",
    category: "Technology",
    date: "2024-01-01",
    readTime: "6 min read",
    tags: ["Web Development", "Trends", "Future", "Innovation", "Technology"],
    author: "Pratik Kumar Panda"
  }
];

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === parseInt(id || '0'));

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
        {/* Article Header */}
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
            <div 
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:gradient-text prose-a:text-dev-primary hover:prose-a:text-dev-primary/80"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
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
