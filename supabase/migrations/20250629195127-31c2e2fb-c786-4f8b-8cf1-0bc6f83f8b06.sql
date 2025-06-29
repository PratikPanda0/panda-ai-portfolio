
-- Create a table for contact messages
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_read BOOLEAN NOT NULL DEFAULT false,
  reply_status TEXT DEFAULT 'pending' CHECK (reply_status IN ('pending', 'replied', 'archived'))
);

-- Add an index for better query performance
CREATE INDEX idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX idx_contact_messages_is_read ON public.contact_messages(is_read);
CREATE INDEX idx_contact_messages_reply_status ON public.contact_messages(reply_status);

-- Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (allows anyone to insert contact messages)
CREATE POLICY "Anyone can insert contact messages" 
  ON public.contact_messages 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy for admin access (allows authenticated users to view all messages)
CREATE POLICY "Authenticated users can view all contact messages" 
  ON public.contact_messages 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Create policy for admin updates (allows authenticated users to update messages)
CREATE POLICY "Authenticated users can update contact messages" 
  ON public.contact_messages 
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);
