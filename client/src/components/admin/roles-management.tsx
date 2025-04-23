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
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit, Trash, Shield, Plus, Info } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function RolesManagement() {
  const { toast } = useToast();
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);
  const [isDeleteRoleDialogOpen, setIsDeleteRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  
  // Mock data for roles
  const roles = [
    { 
      id: 1, 
      name: 'super_admin', 
      displayName: 'Super Administrator',
      description: 'Complete system access with all permissions',
      createdAt: '2023-08-01',
      updatedAt: '2023-08-01',
      permissionCount: 'All',
      isSystem: true,
      isActive: true
    },
    { 
      id: 2, 
      name: 'admin', 
      displayName: 'Administrator',
      description: 'System administration access with limited permissions',
      createdAt: '2023-08-01',
      updatedAt: '2023-08-01',
      permissionCount: 15,
      isSystem: true,
      isActive: true
    },
    { 
      id: 3, 
      name: 'data_admin', 
      displayName: 'Data Administrator',
      description: 'Data management access with focus on data-related operations',
      createdAt: '2023-08-01',
      updatedAt: '2023-08-01',
      permissionCount: 10,
      isSystem: true,
      isActive: true
    },
    { 
      id: 4, 
      name: 'farmer', 
      displayName: 'Farmer',
      description: 'Regular user with limited access to own data',
      createdAt: '2023-08-01',
      updatedAt: '2023-08-05',
      permissionCount: 5,
      isSystem: true,
      isActive: true
    },
    { 
      id: 5, 
      name: 'guest', 
      displayName: 'Guest',
      description: 'Minimal access for demonstration purposes',
      createdAt: '2023-08-03',
      updatedAt: '2023-08-03',
      permissionCount: 2,
      isSystem: false,
      isActive: false
    }
  ];

  // Mock data for permissions
  const allPermissions = [
    { id: 1, name: 'user.view', displayName: 'View Users', module: 'User Management' },
    { id: 2, name: 'user.create', displayName: 'Create Users', module: 'User Management' },
    { id: 3, name: 'user.edit', displayName: 'Edit Users', module: 'User Management' },
    { id: 4, name: 'user.delete', displayName: 'Delete Users', module: 'User Management' },
    { id: 5, name: 'role.view', displayName: 'View Roles', module: 'Role Management' },
    { id: 6, name: 'role.create', displayName: 'Create Roles', module: 'Role Management' },
    { id: 7, name: 'role.edit', displayName: 'Edit Roles', module: 'Role Management' },
    { id: 8, name: 'role.delete', displayName: 'Delete Roles', module: 'Role Management' },
    { id: 9, name: 'permission.view', displayName: 'View Permissions', module: 'Permission Management' },
    { id: 10, name: 'permission.assign', displayName: 'Assign Permissions', module: 'Permission Management' },
    { id: 11, name: 'reservoir.view', displayName: 'View Reservoirs', module: 'Reservoir Management' },
    { id: 12, name: 'reservoir.edit', displayName: 'Edit Reservoirs', module: 'Reservoir Management' },
    { id: 13, name: 'allocation.view', displayName: 'View Allocations', module: 'Water Allocation' },
    { id: 14, name: 'allocation.create', displayName: 'Create Allocations', module: 'Water Allocation' },
    { id: 15, name: 'allocation.approve', displayName: 'Approve Allocations', module: 'Water Allocation' }
  ];

  // Group permissions by module
  const groupedPermissions = allPermissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, typeof allPermissions>);

  // Form state for add/edit role
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    isActive: true,
    permissions: [] as number[]
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle active status change
  const handleActiveChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };

  // Handle permission selection
  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          permissions: [...prev.permissions, permissionId]
        };
      } else {
        return {
          ...prev,
          permissions: prev.permissions.filter(id => id !== permissionId)
        };
      }
    });
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      displayName: '',
      description: '',
      isActive: true,
      permissions: []
    });
  };

  // Set up form for editing a role
  const setupEditForm = (role: any) => {
    setSelectedRole(role);
    // In a real app, you would fetch the role's permissions
    const mockPermissions = role.name === 'super_admin' 
      ? allPermissions.map(p => p.id) 
      : role.name === 'admin' 
        ? [1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15]
        : role.name === 'data_admin'
          ? [1, 5, 9, 11, 12, 13, 14]
          : [11, 13];

    setFormData({
      name: role.name,
      displayName: role.displayName,
      description: role.description,
      isActive: role.isActive,
      permissions: mockPermissions
    });
    setIsEditRoleDialogOpen(true);
  };

  // Add role handler
  const handleAddRole = () => {
    // Validation
    if (!formData.name || !formData.displayName) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Please fill in all required fields."
      });
      return;
    }

    // In a real app, you would make an API call here
    console.log('Adding role:', formData);
    
    toast({
      title: "Role added",
      description: `Role "${formData.displayName}" has been created successfully.`
    });
    
    resetForm();
    setIsAddRoleDialogOpen(false);
  };

  // Edit role handler
  const handleEditRole = () => {
    // Validation
    if (!formData.name || !formData.displayName) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Please fill in all required fields."
      });
      return;
    }

    // In a real app, you would make an API call here
    console.log('Editing role:', selectedRole.id, formData);
    
    toast({
      title: "Role updated",
      description: `Role "${formData.displayName}" has been updated successfully.`
    });
    
    resetForm();
    setIsEditRoleDialogOpen(false);
  };

  // Delete role handler
  const handleDeleteRole = () => {
    // In a real app, you would make an API call here
    console.log('Deleting role:', selectedRole.id);
    
    toast({
      title: "Role deleted",
      description: `Role "${selectedRole.displayName}" has been deleted successfully.`
    });
    
    setIsDeleteRoleDialogOpen(false);
  };

  // Permission selection component
  const PermissionSelector = () => (
    <div className="space-y-4 max-h-[300px] overflow-auto pr-2">
      {Object.entries(groupedPermissions).map(([module, permissions]) => (
        <div key={module} className="space-y-2">
          <div className="font-semibold text-sm">{module}</div>
          <div className="ml-2 space-y-1">
            {permissions.map(permission => (
              <div key={permission.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`permission-${permission.id}`}
                  checked={formData.permissions.includes(permission.id)}
                  onCheckedChange={(checked) => handlePermissionChange(permission.id, !!checked)}
                  disabled={selectedRole?.name === 'super_admin'} // Can't modify super_admin permissions
                />
                <label
                  htmlFor={`permission-${permission.id}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {permission.displayName}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Role Management</CardTitle>
          <CardDescription>
            Manage roles and their associated permissions
          </CardDescription>
        </div>
        <Button onClick={() => {
          resetForm();
          setIsAddRoleDialogOpen(true);
        }} className="ml-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Display Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id} className={role.isSystem ? 'bg-muted/50' : ''}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Shield className={`h-4 w-4 ${
                        role.name === 'super_admin' ? 'text-red-500' :
                        role.name === 'admin' ? 'text-blue-500' :
                        role.name === 'data_admin' ? 'text-green-500' :
                        'text-gray-500'
                      }`} />
                      <span>{role.name}</span>
                      {role.isSystem && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          System
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{role.displayName}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={role.description}>
                    {role.description}
                  </TableCell>
                  <TableCell>{role.permissionCount}</TableCell>
                  <TableCell>
                    {role.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setupEditForm(role)}
                      disabled={role.name === 'super_admin'} // Can't edit super_admin
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive"
                      disabled={role.isSystem} // Can't delete system roles
                      onClick={() => {
                        setSelectedRole(role);
                        setIsDeleteRoleDialogOpen(true);
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

      {/* Add Role Dialog */}
      <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>
              Create a new role with specific permissions
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Role Name*
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="e.g. operator"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="displayName" className="text-right">
                Display Name*
              </Label>
              <Input
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="e.g. System Operator"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Describe the role's purpose and responsibilities"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Status
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
                  Role is active
                </label>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 pt-2">
              <Label className="text-right">
                Permissions
              </Label>
              <div className="col-span-3">
                <PermissionSelector />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddRole}>
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditRoleDialogOpen} onOpenChange={setIsEditRoleDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update role details and permissions
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Role Name*
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                disabled={selectedRole?.isSystem} // Can't change system role names
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="displayName" className="text-right">
                Display Name*
              </Label>
              <Input
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Status
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Checkbox 
                  id="isActive" 
                  checked={formData.isActive}
                  onCheckedChange={handleActiveChange}
                  disabled={selectedRole?.name === 'super_admin'} // Can't disable super_admin
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Role is active
                </label>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 pt-2">
              <Label className="text-right">
                Permissions
              </Label>
              <div className="col-span-3">
                <PermissionSelector />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleEditRole}
              disabled={selectedRole?.name === 'super_admin'} // Can't edit super_admin
            >
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Confirmation */}
      <AlertDialog open={isDeleteRoleDialogOpen} onOpenChange={setIsDeleteRoleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the role
              <strong> {selectedRole?.displayName}</strong> and could affect users assigned to this role.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRole} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}