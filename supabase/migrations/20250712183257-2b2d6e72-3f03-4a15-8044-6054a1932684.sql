
-- Create a table to store the global visitor counter
CREATE TABLE public.visitor_counter (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Ensures only one row
  count BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the initial row with count 0
INSERT INTO public.visitor_counter (id, count) VALUES (1, 0);

-- Create a function to increment the visitor count atomically
CREATE OR REPLACE FUNCTION public.increment_visitor_count()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count BIGINT;
BEGIN
  UPDATE public.visitor_counter 
  SET count = count + 1, updated_at = now() 
  WHERE id = 1 
  RETURNING count INTO new_count;
  
  RETURN new_count;
END;
$$;

-- Enable RLS but allow public access for visitor counting
ALTER TABLE public.visitor_counter ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the visitor count
CREATE POLICY "Anyone can view visitor count" 
  ON public.visitor_counter 
  FOR SELECT 
  USING (true);

-- Allow the function to update the count (function has SECURITY DEFINER)
CREATE POLICY "Function can update visitor count" 
  ON public.visitor_counter 
  FOR UPDATE 
  USING (true);
