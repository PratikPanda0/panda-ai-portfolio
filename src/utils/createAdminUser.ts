
import { supabase } from '@/integrations/supabase/client';

export const createAdminUser = async () => {
  try {
    console.log('Creating admin user...');
    
    // Check if admin user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('admin_users')
      .select('id, email')
      .eq('email', 'admin@example.com')
      .maybeSingle();

    if (checkError) {
      console.error('Error checking for existing admin user:', checkError);
      return { success: false, error: checkError.message };
    }

    if (existingUser) {
      console.log('Admin user already exists:', existingUser);
      return { success: true, message: 'Admin user already exists' };
    }

    // Create admin user
    const { data, error } = await supabase
      .from('admin_users')
      .insert([
        {
          email: 'admin@example.com',
          password_hash: 'admin123' // In production, this should be properly hashed
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating admin user:', error);
      return { success: false, error: error.message };
    }

    console.log('Admin user created successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
