
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ArrowLeft, Calendar, Clock, ArrowUpDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Mock blog data with proper image URLs
const blogPosts = [
  {
    id: 1,
    title: "Getting Started with Generative AI in Enterprise Applications",
    excerpt: "Exploring how to integrate AI-powered features into business applications using modern frameworks and cloud services.",
    content: "Full blog content would go here...",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    category: "AI",
    date: "2024-01-15",
    readTime: "8 min read",
    tags: ["AI", "Enterprise", "Cloud", "Machine Learning", "Business Intelligence"]
  },
  {
    id: 2,
    title: "Building Scalable React Applications with TypeScript",
    excerpt: "Best practices for structuring large-scale React applications with TypeScript for better maintainability.",
    content: "Full blog content would go here...",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
    category: "Development",
    date: "2024-01-10",
    readTime: "12 min read",
    tags: ["React", "TypeScript", "Architecture", "Frontend", "JavaScript"]
  },
  {
    id: 3,
    title: "Azure DevOps: Streamlining CI/CD Pipelines",
    excerpt: "How to set up efficient continuous integration and deployment pipelines using Azure DevOps services.",
    content: "Full blog content would go here...",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop",
    category: "DevOps",
    date: "2024-01-05",
    readTime: "10 min read",
    tags: ["Azure", "DevOps", "CI/CD", "Automation", "Deployment"]
  },
  {
    id: 4,
    title: "The Future of Web Development: Trends to Watch in 2024",
    excerpt: "Analyzing emerging technologies and frameworks that are shaping the future of web development.",
    content: "Full blog content would go here...",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop",
    category: "Technology",
    date: "2024-01-01",
    readTime: "6 min read",
    tags: ["Web Development", "Trends", "Future", "Innovation", "Technology"]
  }
];

const categories = ["All", "AI", "Development", "DevOps", "Technology"];

// Get all unique tags from blog posts
const getAllTags = () => {
  const allTags = blogPosts.flatMap(post => post.tags);
  return ["All", ...Array.from(new Set(allTags))];
};

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  useEffect(() => {
    let filtered = [...blogPosts];

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by tag
    if (selectedTag !== 'All') {
      filtered = filtered.filter(post => post.tags.includes(selectedTag));
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory, selectedTag, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="container-custom mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <Link to="/" className="inline-flex items-center text-dev-primary hover:text-dev-primary/80 mb-8">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Tech Blog
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Insights, tutorials, and thoughts on modern software development
              </p>

              {/* Search Bar */}
              <div className="relative max-w-md mx-auto mb-8">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="text-xs"
                    >
                      <Filter className="h-3 w-3 mr-1" />
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tag Filter and Date Sort */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAllTags().map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSortOrder}
                  className="flex items-center gap-2"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  Date {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-12 px-4">
          <div className="container-custom mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted">
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
                  
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg leading-tight mb-2">
                      {post.title}
                    </CardTitle>
                    
                    <CardDescription className="text-sm">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center text-xs text-muted-foreground mb-4">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime}
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Link to={`/blog/${post.id}`} className="w-full">
                      <Button className="w-full">
                        Read More
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No articles found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
