import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, EyeOff, Edit, Trash, UserPlus, Shield, User } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function UsersManagement() {
  const { toast } = useToast();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Mock data - in a real app, fetch from API
  const users = [
    { 
      id: 1, 
      username: 'superadmin', 
      firstName: 'Super', 
      lastName: 'Admin',
      role: 'super_admin',
      email: 'superadmin@example.com',
      isActive: true,
      lastLogin: '2023-08-10 14:30',
      permissions: ['all']
    },
    { 
      id: 2, 
      username: 'admin', 
      firstName: 'Admin', 
      lastName: 'User',
      role: 'admin',
      email: 'admin@example.com',
      isActive: true,
      lastLogin: '2023-08-09 09:15',
      permissions: ['read', 'write', 'manage_users']
    },
    { 
      id: 3, 
      username: 'data_admin', 
      firstName: 'Data', 
      lastName: 'Manager',
      role: 'data_admin',
      email: 'dataadmin@example.com',
      isActive: true,
      lastLogin: '2023-08-08 16:45',
      permissions: ['read', 'write_data']
    },
    { 
      id: 4, 
      username: 'farmer1', 
      firstName: 'John', 
      lastName: 'Doe',
      role: 'farmer',
      email: 'john.doe@example.com',
      isActive: true,
      lastLogin: '2023-08-07 11:20',
      permissions: ['read_own']
    }
  ];

  // Role options for the select input
  const roleOptions = [
    { value: 'super_admin', label: 'Super Administrator' },
    { value: 'admin', label: 'Administrator' },
    { value: 'data_admin', label: 'Data Administrator' },
    { value: 'farmer', label: 'Farmer' }
  ];

  // Form state for add/edit user
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'farmer',
    isActive: true,
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle role selection
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  // Handle active status change
  const handleActiveChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      role: 'farmer',
      isActive: true,
    });
  };

  // Set up form for editing a user
  const setupEditForm = (user: any) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: '', // Don't set password for editing
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email || '',
      role: user.role,
      isActive: user.isActive,
    });
    setIsEditUserDialogOpen(true);
  };

  // Add user handler
  const handleAddUser = () => {
    // Validation
    if (!formData.username || !formData.password || !formData.firstName || !formData.lastName) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Please fill in all required fields."
      });
      return;
    }

    // In a real app, you would make an API call here
    console.log('Adding user:', formData);
    
    toast({
      title: "User added",
      description: `User ${formData.username} has been created successfully.`
    });
    
    resetForm();
    setIsAddUserDialogOpen(false);
  };

  // Edit user handler
  const handleEditUser = () => {
    // Validation
    if (!formData.username || !formData.firstName || !formData.lastName) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Please fill in all required fields."
      });
      return;
    }

    // In a real app, you would make an API call here
    console.log('Editing user:', selectedUser.id, formData);
    
    toast({
      title: "User updated",
      description: `User ${formData.username} has been updated successfully.`
    });
    
    resetForm();
    setIsEditUserDialogOpen(false);
  };

  // Delete user handler
  const handleDeleteUser = () => {
    // In a real app, you would make an API call here
    console.log('Deleting user:', selectedUser.id);
    
    toast({
      title: "User deleted",
      description: `User ${selectedUser.username} has been deleted successfully.`
    });
    
    setIsDeleteUserDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage users and their access to the system
          </CardDescription>
        </div>
        <Button onClick={() => {
          resetForm();
          setIsAddUserDialogOpen(true);
        }} className="ml-auto">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {user.role === 'super_admin' && (
                        <Shield className="mr-1 h-4 w-4 text-red-500" />
                      )}
                      {user.role === 'admin' && (
                        <Shield className="mr-1 h-4 w-4 text-blue-500" />
                      )}
                      {user.role === 'data_admin' && (
                        <Shield className="mr-1 h-4 w-4 text-green-500" />
                      )}
                      {user.role === 'farmer' && (
                        <User className="mr-1 h-4 w-4 text-gray-500" />
                      )}
                      {(() => {
                        switch(user.role) {
                          case 'super_admin':
                            return 'Super Administrator';
                          case 'admin':
                            return 'Administrator';
                          case 'data_admin':
                            return 'Data Administrator';
                          case 'farmer':
                            return 'Farmer';
                          default:
                            return user.role;
                        }
                      })()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setupEditForm(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive"
                      disabled={user.role === 'super_admin'} // Prevent deleting super admin
                      onClick={() => {
                        setSelectedUser(user);
                        setIsDeleteUserDialogOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account in the system
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username*
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password*
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name*
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name*
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role*
              </Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Active Status
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Checkbox 
                  id="isActive" 
                  checked={formData.isActive}
                  onCheckedChange={handleActiveChange}
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  User is active
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddUser}>
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the user details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username*
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="col-span-3"
                disabled={selectedUser?.role === 'super_admin'}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Leave blank to keep current password"
                value={formData.password}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name*
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name*
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role*
              </Label>
              <Select 
                value={formData.role} 
                onValueChange={handleRoleChange}
                disabled={selectedUser?.role === 'super_admin'} // Can't change superadmin role
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Active Status
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Checkbox 
                  id="isActive" 
                  checked={formData.isActive}
                  onCheckedChange={handleActiveChange}
                  disabled={selectedUser?.role === 'super_admin'} // Can't disable superadmin
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  User is active
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleEditUser}>
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation */}
      <AlertDialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account
              for <strong>{selectedUser?.username}</strong> and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}