
-- Insert some test contact messages to verify the functionality
INSERT INTO public.contact_messages (name, email, subject, message, is_read, reply_status) 
VALUES 
  ('John Doe', 'john@example.com', 'Website Inquiry', 'Hello, I am interested in your services. Could you please provide more information about your web development offerings?', false, 'pending'),
  ('Jane Smith', 'jane@example.com', 'Project Consultation', 'I would like to schedule a consultation for my upcoming project. When would be a good time to discuss?', true, 'replied'),
  ('Mike Johnson', 'mike@example.com', 'Technical Support', 'I am experiencing some issues with the contact form on your website. Could you help me resolve this?', false, 'pending'),
  ('Sarah Wilson', 'sarah@example.com', 'Partnership Opportunity', 'We are looking for development partners and would like to explore potential collaboration opportunities.', true, 'archived');
