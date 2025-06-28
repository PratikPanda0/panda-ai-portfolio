
-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blogs table to replace the mock data
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content JSONB NOT NULL, -- Store rich text content as JSON
  image_url TEXT,
  category TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  read_time TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Pratik Kumar Panda',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog_tags table for managing tags
CREATE TABLE public.blog_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  UNIQUE(blog_id, tag)
);

-- Enable RLS for security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for blogs (public read access)
CREATE POLICY "Anyone can view blogs" 
  ON public.blogs 
  FOR SELECT 
  TO PUBLIC
  USING (true);

-- Create policies for blog_tags (public read access)
CREATE POLICY "Anyone can view blog tags" 
  ON public.blog_tags 
  FOR SELECT 
  TO PUBLIC
  USING (true);

-- Insert sample admin user (password: admin123)
INSERT INTO public.admin_users (email, password_hash) 
VALUES ('admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert sample blog data
INSERT INTO public.blogs (title, excerpt, content, image_url, category, date, read_time) VALUES
('Getting Started with Generative AI in Enterprise Applications', 
 'Exploring how to integrate AI-powered features into business applications using modern frameworks and cloud services.',
 '[{"type":"heading","level":2,"content":"Introduction"},{"type":"paragraph","content":"Generative AI is revolutionizing how we build enterprise applications. In this comprehensive guide, we''ll explore the practical aspects of integrating AI-powered features into business applications."}]',
 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
 'AI',
 '2024-01-15',
 '8 min read');

-- Insert tags for the sample blog
INSERT INTO public.blog_tags (blog_id, tag) 
SELECT id, unnest(ARRAY['AI', 'Enterprise', 'Cloud', 'Machine Learning', 'Business Intelligence'])
FROM public.blogs WHERE title = 'Getting Started with Generative AI in Enterprise Applications';
