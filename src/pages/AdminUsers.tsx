import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, UserPlus, Trash2, Crown, Shield, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const userSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().min(1, 'Please select a role'),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserWithRole {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  roles: string[];
  is_active?: boolean;
  password?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [currentUserRoles, setCurrentUserRoles] = useState<string[]>([]);
  const [userPasswords, setUserPasswords] = useState<{[key: string]: string}>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: '',
    },
  });

  // Check admin access and load users
  useEffect(() => {
    const initializePage = async () => {
      try {
        // Check if user is logged in to admin panel (using localStorage check)
        const adminToken = localStorage.getItem('admin_token');
        if (!adminToken) {
          toast({
            title: 'Access Denied',
            description: 'Please login to admin panel first.',
            variant: 'destructive',
          });
          navigate('/admin');
          return;
        }

        // Load roles first
        await loadRoles();
        // Get current user's roles
        await getCurrentUserRoles();
        // Load users and their stored passwords
        await loadUsers();
        // Load stored passwords from localStorage
        loadStoredPasswords();
      } catch (error) {
        console.error('Error initializing page:', error);
        toast({
          title: 'Error',
          description: 'Failed to initialize user management page.',
          variant: 'destructive',
        });
      }
    };

    initializePage();
  }, [navigate, toast]);

  const loadStoredPasswords = () => {
    try {
      const storedPasswords = localStorage.getItem('admin_user_passwords');
      if (storedPasswords) {
        const parsedPasswords = JSON.parse(storedPasswords);
        setUserPasswords(parsedPasswords);
        console.log('Loaded stored passwords:', Object.keys(parsedPasswords));
      }
    } catch (error) {
      console.error('Error loading stored passwords:', error);
    }
  };

  const savePasswordToStorage = (userId: string, password: string) => {
    try {
      const currentPasswords = { ...userPasswords };
      currentPasswords[userId] = password;
      
      localStorage.setItem('admin_user_passwords', JSON.stringify(currentPasswords));
      setUserPasswords(currentPasswords);
      console.log('Saved password for user:', userId);
    } catch (error) {
      console.error('Error saving password to storage:', error);
    }
  };

  const loadRoles = async () => {
    try {
      console.log('Loading roles...');
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      console.log('Roles query result:', { rolesData, rolesError });

      if (rolesError) {
        console.error('Roles error:', rolesError);
        throw rolesError;
      }

      setRoles(rolesData || []);
      console.log('Loaded roles:', rolesData);
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  };

  const getCurrentUserRoles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('Getting roles for current user:', user.id);
        
        const { data: userRoleData, error: userRoleError } = await supabase
          .from('user_roles')
          .select(`
            roles (
              name
            )
          `)
          .eq('user_id', user.id);
        
        console.log('Current user roles query result:', { userRoleData, userRoleError });
        
        if (userRoleError) {
          console.error('Error fetching current user roles:', userRoleError);
          return;
        }
        
        const roleNames = userRoleData?.map(item => item.roles?.name).filter(Boolean) || [];
        setCurrentUserRoles(roleNames);
        console.log('Current user roles:', roleNames);
      }
    } catch (error) {
      console.error('Error getting current user roles:', error);
    }
  };

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      console.log('Starting to load users...');
      
      // Get profiles first
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Profiles query result:', { profiles, profilesError });

      if (profilesError) {
        console.error('Profiles error:', profilesError);
        throw profilesError;
      }

      if (!profiles || profiles.length === 0) {
        console.log('No profiles found');
        setUsers([]);
        return;
      }

      // Get all user roles with role names using the new structure
      const { data: userRoleData, error: userRoleError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          roles (
            name
          )
        `);

      console.log('User roles query result:', { userRoleData, userRoleError });

      if (userRoleError) {
        console.error('User roles error:', userRoleError);
        // Don't throw here, continue without roles
      }

      // Combine profiles with their roles
      const usersWithRoles: UserWithRole[] = profiles.map(profile => {
        const userRoles = userRoleData?.filter(roleData => roleData.user_id === profile.id) || [];
        const roleNames = userRoles.map(roleData => roleData.roles?.name).filter(Boolean) as string[];
        
        console.log(`Profile ${profile.id} (${profile.email}) has roles:`, roleNames);
        return {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          created_at: profile.created_at,
          roles: roleNames,
          is_active: true, // Mock active status
        };
      });

      console.log('Final users with roles:', usersWithRoles);
      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: UserFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Creating user with values:', values);
      
      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      console.log('Auth signup result:', { authData, authError });

      if (authError) throw authError;

      if (authData.user) {
        console.log('User created successfully:', authData.user.id);

        // Store the actual password for display purposes
        savePasswordToStorage(authData.user.id, values.password);

        // Find the role ID for the selected role
        const selectedRole = roles.find(role => role.id === values.role);
        if (!selectedRole) {
          throw new Error('Selected role not found');
        }

        // Assign role to the new user using role ID
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role_id: values.role,
            assigned_by: null
          });

        console.log('Role assignment result:', { roleError });

        if (roleError) {
          console.error('Role assignment failed:', roleError);
          throw roleError;
        }

        toast({
          title: 'Success',
          description: `${selectedRole.name} user created successfully`,
        });

        form.reset();
        
        // Wait a bit for the trigger to create the profile, then reload
        setTimeout(() => {
          loadUsers();
        }, 1000);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create user',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, is_active: !currentStatus }
          : user
      ));

      toast({
        title: 'Success',
        description: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive',
      });
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      // Delete user roles first
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (roleError) throw roleError;

      // Delete profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      // Remove stored password
      const currentPasswords = { ...userPasswords };
      delete currentPasswords[userId];
      localStorage.setItem('admin_user_passwords', JSON.stringify(currentPasswords));
      setUserPasswords(currentPasswords);

      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });

      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    }
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="h-4 w-4 text-purple-500" />;
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'moderator':
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-yellow-100 text-yellow-800';
      case 'moderator':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Check if current user is super_admin
  const isSuperAdmin = currentUserRoles.includes('super_admin');
  
  // Check if current user can create users (super_admin or admin, but not moderator)
  const canCreateUsers = isSuperAdmin || currentUserRoles.includes('admin');
  
  // Check if current user can see passwords and actions (only super_admin)
  const canSeePasswords = isSuperAdmin;
  const canDeleteUsers = isSuperAdmin;

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/admin')}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
            <h1 className="text-3xl font-bold gradient-text">User Management</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Add User Form - Only show to super_admin and admin */}
          {canCreateUsers && (
            <Card className="xl:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Add New User
                </CardTitle>
                <CardDescription>
                  Create admin, moderator, or regular users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="John" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Doe" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="john@example.com" />
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
                            <Input {...field} type="password" placeholder="••••••••" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roles
                                .filter(role => {
                                  // Only super_admin can create other super_admins
                                  if (role.name === 'super_admin') {
                                    return isSuperAdmin;
                                  }
                                  // Admin can create admin, moderator, and user
                                  if (currentUserRoles.includes('admin')) {
                                    return ['admin', 'moderator', 'user'].includes(role.name);
                                  }
                                  return true;
                                })
                                .map(role => (
                                  <SelectItem key={role.id} value={role.id}>
                                    {role.name.replace('_', ' ')}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Creating...' : 'Create User'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Users List */}
          <Card className={canCreateUsers ? "xl:col-span-3" : "xl:col-span-4"}>
            <CardHeader>
              <CardTitle>All Users ({users.length})</CardTitle>
              <CardDescription>
                Manage all users, their roles, and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dev-primary"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead>Status</TableHead>
                        {canSeePasswords && <TableHead>Password</TableHead>}
                        <TableHead>Created</TableHead>
                        {canDeleteUsers && <TableHead>Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.first_name} {user.last_name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {user.roles.length > 0 ? (
                                user.roles.map((role) => (
                                  <div
                                    key={role}
                                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getRoleBadgeColor(role)}`}
                                  >
                                    {getRoleIcon(role)}
                                    {role.replace('_', ' ')}
                                  </div>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-sm">No roles</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={user.is_active}
                                onCheckedChange={() => toggleUserStatus(user.id, user.is_active || false)}
                              />
                              <span className={`text-sm ${user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                {user.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </TableCell>
                          {canSeePasswords && (
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm">
                                  {showPasswords[user.id] 
                                    ? (userPasswords[user.id] || 'Not available') 
                                    : '••••••••'
                                  }
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => togglePasswordVisibility(user.id)}
                                >
                                  {showPasswords[user.id] ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          )}
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          {canDeleteUsers && (
                            <TableCell>
                              <Button
                                onClick={() => deleteUser(user.id)}
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                      {users.length === 0 && !isLoading && (
                        <TableRow>
                          <TableCell colSpan={canSeePasswords && canDeleteUsers ? 7 : canSeePasswords || canDeleteUsers ? 6 : 5} className="text-center py-8 text-muted-foreground">
                            No users found. {canCreateUsers ? 'Create a new user to get started.' : 'Contact a super admin to add users.'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
