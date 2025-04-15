import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Shield, 
  Mail, 
  Calendar, 
  Lock, 
  Unlock, 
  MoreHorizontal,
  Edit,
  Trash,
  ShieldCheck,
  ShieldOff,
  Key,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth, User, UserRole } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define our mock users API
const mockApi = {
  fetchUsers: async (): Promise<User[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock users from our AuthContext
    const mockUsers = [
      {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin' as UserRole,
        lastLogin: new Date().toISOString(),
        passwordLastChanged: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        requiresPasswordChange: false,
        mfaEnabled: true,
        failedLoginAttempts: 0,
        isLocked: false,
      },
      {
        id: '2',
        email: 'employee@example.com',
        name: 'Employee User',
        role: 'employee' as UserRole,
        lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        passwordLastChanged: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        requiresPasswordChange: false,
        mfaEnabled: false,
        failedLoginAttempts: 0,
        isLocked: false,
      },
      {
        id: '3',
        email: 'client@example.com',
        name: 'Client User',
        role: 'client' as UserRole,
        lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        passwordLastChanged: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        requiresPasswordChange: false,
        mfaEnabled: false,
        failedLoginAttempts: 1,
        isLocked: false,
      },
      {
        id: '4',
        email: 'locked@example.com',
        name: 'Locked User',
        role: 'client' as UserRole,
        lastLogin: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        passwordLastChanged: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        requiresPasswordChange: true,
        mfaEnabled: false,
        failedLoginAttempts: 5,
        isLocked: true,
        lockUntil: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes from now
      },
    ];
    
    return mockUsers;
  },
  
  createUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate a mock ID and return the user
    return {
      id: Math.random().toString(36).substring(2, 9),
      ...userData,
      lastLogin: '',
      passwordLastChanged: new Date().toISOString(),
      failedLoginAttempts: 0,
      isLocked: false,
    };
  },
  
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Return the updated user
    return {
      id,
      email: userData.email || 'unknown@example.com',
      name: userData.name || 'Unknown User',
      role: userData.role || 'client',
      lastLogin: userData.lastLogin || '',
      passwordLastChanged: userData.passwordLastChanged || new Date().toISOString(),
      requiresPasswordChange: userData.requiresPasswordChange || false,
      mfaEnabled: userData.mfaEnabled || false,
      failedLoginAttempts: userData.failedLoginAttempts || 0,
      isLocked: userData.isLocked || false,
    };
  },
  
  deleteUser: async (id: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Return success
    return true;
  },
  
  lockUnlockUser: async (id: string, lock: boolean): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return success
    return true;
  },
  
  resetPassword: async (id: string): Promise<string> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Return a temporary password
    return 'TempPass' + Math.random().toString(36).substring(2, 7);
  }
};

// Updated User form schema to include 'manager' role
const userFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Must be a valid email' }),
  role: z.enum(['admin', 'employee', 'client', 'manager'], { 
    required_error: 'Please select a role' 
  }),
  requiresPasswordChange: z.boolean().default(true),
  mfaEnabled: z.boolean().default(false),
});

type UserFormValues = z.infer<typeof userFormSchema>;

// User management component
export function UserManagement() {
  const { toast } = useToast();
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  
  const createForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'client',
      requiresPasswordChange: true,
      mfaEnabled: false,
    },
  });
  
  const editForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'client',
      requiresPasswordChange: false,
      mfaEnabled: false,
    },
  });
  
  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await mockApi.fetchUsers();
      setUsers(data);
    } catch (error) {
      toast({
        title: 'Error fetching users',
        description: 'There was an error fetching users. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Create user
  const handleCreateUser = async (data: UserFormValues) => {
    try {
      const newUser = await mockApi.createUser({
        ...data,
        name: data.name, // Ensure name is explicitly provided
        email: data.email, // Ensure email is explicitly provided
        role: data.role, // Ensure role is explicitly provided
        lastLogin: '',
        passwordLastChanged: new Date().toISOString(),
        failedLoginAttempts: 0,
        isLocked: false,
      });
      
      setUsers(prev => [...prev, newUser]);
      setCreateDialogOpen(false);
      createForm.reset();
      
      toast({
        title: 'User created',
        description: `User ${data.name} was successfully created.`,
      });
    } catch (error) {
      toast({
        title: 'Error creating user',
        description: 'There was an error creating the user. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Edit user
  const handleEditUser = async (data: UserFormValues) => {
    if (!selectedUser) return;
    
    try {
      const updatedUser = await mockApi.updateUser(selectedUser.id, {
        ...data,
      });
      
      setUsers(prev => prev.map(user => user.id === selectedUser.id ? updatedUser : user));
      setEditDialogOpen(false);
      setSelectedUser(null);
      
      toast({
        title: 'User updated',
        description: `User ${data.name} was successfully updated.`,
      });
    } catch (error) {
      toast({
        title: 'Error updating user',
        description: 'There was an error updating the user. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await mockApi.deleteUser(selectedUser.id);
      
      setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      
      toast({
        title: 'User deleted',
        description: `User ${selectedUser.name} was successfully deleted.`,
      });
    } catch (error) {
      toast({
        title: 'Error deleting user',
        description: 'There was an error deleting the user. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Lock/unlock user
  const handleLockUnlockUser = async (user: User, lock: boolean) => {
    try {
      await mockApi.lockUnlockUser(user.id, lock);
      
      setUsers(prev => prev.map(u => {
        if (u.id === user.id) {
          return {
            ...u,
            isLocked: lock,
            lockUntil: lock ? new Date(Date.now() + 30 * 60 * 1000).toISOString() : undefined,
            failedLoginAttempts: lock ? u.failedLoginAttempts : 0,
          };
        }
        return u;
      }));
      
      toast({
        title: lock ? 'User locked' : 'User unlocked',
        description: `User ${user.name} was successfully ${lock ? 'locked' : 'unlocked'}.`,
      });
    } catch (error) {
      toast({
        title: `Error ${lock ? 'locking' : 'unlocking'} user`,
        description: `There was an error ${lock ? 'locking' : 'unlocking'} the user. Please try again.`,
        variant: 'destructive',
      });
    }
  };
  
  // Reset password
  const handleResetPassword = async () => {
    if (!selectedUser) return;
    
    try {
      const tempPass = await mockApi.resetPassword(selectedUser.id);
      
      setTempPassword(tempPass);
      
      // Update the user's passwordLastChanged and requiresPasswordChange
      setUsers(prev => prev.map(u => {
        if (u.id === selectedUser.id) {
          return {
            ...u,
            passwordLastChanged: new Date().toISOString(),
            requiresPasswordChange: true,
          };
        }
        return u;
      }));
      
      toast({
        title: 'Password reset',
        description: `Password for ${selectedUser.name} was successfully reset.`,
      });
    } catch (error) {
      toast({
        title: 'Error resetting password',
        description: 'There was an error resetting the password. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Open edit dialog
  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    editForm.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      requiresPasswordChange: user.requiresPasswordChange || false,
      mfaEnabled: user.mfaEnabled || false,
    });
    setEditDialogOpen(true);
  };
  
  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };
  
  // Get role badge color
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'employee':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'client':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'manager':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">User Management</CardTitle>
          <CardDescription>Manage user accounts, roles, and security settings</CardDescription>
        </div>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          disabled={!hasPermission('manageUsers')}
        >
          <UserIcon className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <p>Loading users...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Security</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)} variant="outline">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">{formatDate(user.lastLogin)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.isLocked ? (
                      <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        <Lock className="mr-1 h-3 w-3" />
                        Locked
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <Unlock className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1.5">
                      {user.mfaEnabled && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          <ShieldCheck className="mr-1 h-3 w-3" />
                          MFA
                        </Badge>
                      )}
                      
                      {user.requiresPasswordChange && (
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                          <Key className="mr-1 h-3 w-3" />
                          Reset
                        </Badge>
                      )}
                      
                      {user.passwordLastChanged && new Date(user.passwordLastChanged).getTime() < Date.now() - 60 * 24 * 60 * 60 * 1000 && (
                        <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          <Clock className="mr-1 h-3 w-3" />
                          Old Pwd
                        </Badge>
                      )}
                      
                      {user.failedLoginAttempts > 2 && !user.isLocked && (
                        <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          {user.failedLoginAttempts} Attempts
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openEditDialog(user)}
                          disabled={!hasPermission('manageUsers')}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setResetPasswordDialogOpen(true);
                          }}
                          disabled={!hasPermission('manageUsers')}
                        >
                          <Key className="mr-2 h-4 w-4" />
                          Reset Password
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        {user.isLocked ? (
                          <DropdownMenuItem
                            onClick={() => handleLockUnlockUser(user, false)}
                            disabled={!hasPermission('manageUsers')}
                          >
                            <Unlock className="mr-2 h-4 w-4" />
                            Unlock Account
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleLockUnlockUser(user, true)}
                            disabled={!hasPermission('manageUsers')}
                          >
                            <Lock className="mr-2 h-4 w-4" />
                            Lock Account
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setDeleteDialogOpen(true);
                          }}
                          disabled={!hasPermission('manageUsers')}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      
      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system. They will receive an email with their initial password.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateUser)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="john.doe@example.com" type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This determines the user's permissions in the system.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createForm.control}
                name="requiresPasswordChange"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Require password change on first login
                      </FormLabel>
                      <FormDescription>
                        User will need to set a new password when they first log in.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={createForm.control}
                name="mfaEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Enable Multi-Factor Authentication
                      </FormLabel>
                      <FormDescription>
                        User will be required to set up MFA during first login.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create User</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditUser)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="requiresPasswordChange"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Require password change on next login
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="mfaEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Multi-Factor Authentication
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="font-medium">{selectedUser.name}</div>
                <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
                <div className="mt-1">
                  <Badge className={getRoleBadgeColor(selectedUser.role)} variant="outline">
                    {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteUser}
                >
                  Delete User
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialogOpen} onOpenChange={(open) => {
        setResetPasswordDialogOpen(open);
        if (!open) setTempPassword(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset User Password</DialogTitle>
            <DialogDescription>
              {tempPassword 
                ? "A temporary password has been generated. The user will need to change it on next login."
                : "Reset the user's password. They will receive a temporary password."}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="font-medium">{selectedUser.name}</div>
                <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
              </div>
              
              {tempPassword ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Temporary Password:</div>
                  <div className="rounded-md bg-muted p-3 font-mono text-center text-lg">
                    {tempPassword}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This password is displayed only once. Make sure to copy it now.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground">
                    The user will be required to change their password upon next login.
                  </p>
                </div>
              )}
              
              <DialogFooter>
                {tempPassword ? (
                  <Button onClick={() => setResetPasswordDialogOpen(false)}>
                    Close
                  </Button>
                ) : (
                  <>
                    <Button type="button" variant="outline" onClick={() => setResetPasswordDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleResetPassword}
                    >
                      Reset Password
                    </Button>
                  </>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
