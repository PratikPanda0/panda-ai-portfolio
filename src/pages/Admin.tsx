
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Lock, User, Mail, Users } from 'lucide-react';
import { createAdminUser } from '@/utils/createAdminUser';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        // Check if admin is already logged in
        const adminToken = localStorage.getItem('admin_token');
        if (adminToken) {
          setIsLoggedIn(true);
          setIsInitializing(false);
          return;
        }

        // Ensure admin user exists
        console.log('Initializing admin user...');
        const result = await createAdminUser();
        
        if (result.success) {
          console.log('Admin initialization complete');
        } else {
          console.error('Failed to initialize admin user:', result.error);
          toast({
            title: 'Initialization Error',
            description: 'Failed to initialize admin user. Please try again.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Admin initialization error:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAdmin();
  }, [toast]);

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      console.log('Attempting login with email:', values.email);
      
      // Method 1: Try to login with Supabase Auth (for newly created admin users)
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        console.log('Supabase auth result:', { authData, authError });

        if (!authError && authData.user) {
          // Check if the authenticated user has admin role using the new structure
          const { data: userRoles, error: roleError } = await supabase
            .from('user_roles')
            .select(`
              roles (
                name
              )
            `)
            .eq('user_id', authData.user.id);

          console.log('User role check:', { userRoles, roleError });

          if (userRoles && userRoles.length > 0) {
            const roleNames = userRoles.map(item => item.roles?.name).filter(Boolean);
            const hasAdminRole = roleNames.includes('admin') || roleNames.includes('super_admin');
            
            if (hasAdminRole) {
              // User is authenticated and has admin role
              localStorage.setItem('admin_token', 'admin_logged_in');
              setIsLoggedIn(true);
              toast({
                title: 'Login successful',
                description: 'Welcome to the admin panel',
              });
              console.log('Login successful via Supabase Auth');
              return;
            } else {
              // User authenticated but doesn't have admin role
              await supabase.auth.signOut();
              throw new Error('Access denied: Admin privileges required');
            }
          } else {
            // No roles found for this user
            await supabase.auth.signOut();
            throw new Error('Access denied: No admin privileges found');
          }
        }
      } catch (supabaseError) {
        console.log('Supabase auth failed, trying admin_users table:', supabaseError);
      }

      // Method 2: Check admin_users table (for hardcoded admin)
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, email, password_hash')
        .eq('email', values.email)
        .maybeSingle();

      console.log('Admin users table query result:', { data, error });

      if (error) {
        console.error('Database error:', error);
        throw new Error('Database connection error');
      }

      if (!data) {
        console.log('No admin user found with this email in either system');
        throw new Error('Invalid credentials');
      }

      console.log('Found admin user in admin_users table:', data.email);

      // Simple password comparison for hardcoded admin
      const isValidPassword = values.password === 'admin123' || 
                             data.password_hash === values.password ||
                             data.password_hash === 'admin123';

      console.log('Password validation result:', isValidPassword);

      if (isValidPassword) {
        localStorage.setItem('admin_token', 'admin_logged_in');
        setIsLoggedIn(true);
        toast({
          title: 'Login successful',
          description: 'Welcome to the admin panel',
        });
        console.log('Login successful via admin_users table');
      } else {
        console.log('Password mismatch for admin_users table');
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    // Also sign out from Supabase Auth if logged in
    supabase.auth.signOut();
    setIsLoggedIn(false);
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dev-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Initializing admin system...</p>
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Blog Management</CardTitle>
                <CardDescription>Create and manage blog posts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/admin/blog-editor')}
                  className="w-full"
                >
                  Create New Blog Post
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Posts</CardTitle>
                <CardDescription>View and edit existing blog posts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/admin/blog-list')}
                  className="w-full"
                  variant="outline"
                >
                  Manage Posts
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
                <CardDescription>View and manage contact form submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/admin/contacts')}
                  className="w-full"
                  variant="secondary"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  View Messages
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage admins, moderators, and users</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/admin/users')}
                  className="w-full"
                  variant="secondary"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-dev-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-dev-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="admin@example.com"
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </Form>

          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Demo credentials:<br />
              Email: admin@example.com<br />
              Password: admin123<br /><br />
              Or use any admin user created through the user management system.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
