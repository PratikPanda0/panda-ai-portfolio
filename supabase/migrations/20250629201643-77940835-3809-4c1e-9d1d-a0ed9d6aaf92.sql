
-- Create a table for storing admin replies to contact messages
CREATE TABLE public.contact_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_message_id UUID NOT NULL REFERENCES public.contact_messages(id) ON DELETE CASCADE,
  reply_content JSON NOT NULL,
  reply_html TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sent_by TEXT DEFAULT 'admin'
);

-- Add an index for better query performance
CREATE INDEX idx_contact_replies_message_id ON public.contact_replies(contact_message_id);
CREATE INDEX idx_contact_replies_sent_at ON public.contact_replies(sent_at DESC);

-- Enable Row Level Security
ALTER TABLE public.contact_replies ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to view all replies
CREATE POLICY "Authenticated users can view all replies" 
  ON public.contact_replies 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Create policy for authenticated users to insert replies
CREATE POLICY "Authenticated users can insert replies" 
  ON public.contact_replies 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);
