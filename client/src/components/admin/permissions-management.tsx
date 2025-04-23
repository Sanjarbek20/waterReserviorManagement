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
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Edit, Trash, Plus, CheckCircle, XCircle, Info, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PermissionsManagement() {
  const { toast } = useToast();
  const [isAddPermissionDialogOpen, setIsAddPermissionDialogOpen] = useState(false);
  const [isEditPermissionDialogOpen, setIsEditPermissionDialogOpen] = useState(false);
  const [isDeletePermissionDialogOpen, setIsDeletePermissionDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for permissions
  const permissions = [
    { 
      id: 1, 
      name: 'user.view', 
      displayName: 'View Users',
      description: 'Allows viewing user list and details',
      module: 'User Management',
      isSystem: true,
      createdAt: '2023-08-01',
      rolesCount: 4
    },
    { 
      id: 2, 
      name: 'user.create', 
      displayName: 'Create Users',
      description: 'Allows creating new user accounts',
      module: 'User Management',
      isSystem: true,
      createdAt: '2023-08-01',
      rolesCount: 2
    },
    { 
      id: 3, 
      name: 'user.edit', 
      displayName: 'Edit Users',
      description: 'Allows editing existing user accounts',
      module: 'User Management',
      isSystem: true,
      createdAt: '2023-08-01',
      rolesCount: 2
    },
    { 
      id: 4, 
      name: 'user.delete', 
      displayName: 'Delete Users',
      description: 'Allows deleting user accounts',
      module: 'User Management',
      isSystem: true,
      createdAt: '2023-08-01',
      rolesCount: 1
    },
    { 
      id: 5, 
      name: 'role.view', 
      displayName: 'View Roles',
      description: 'Allows viewing role list and details',
      module: 'Role Management',
      isSystem: true,
      createdAt: '2023-08-01',
      rolesCount: 3
    },
    { 
      id: 6, 
      name: 'role.create', 
      displayName: 'Create Roles',
      description: 'Allows creating new roles',
      module: 'Role Management',
      isSystem: true,
      createdAt: '2023-08-01',
      rolesCount: 2
    },
    { 
      id: 7, 
      name: 'role.edit', 
      displayName: 'Edit Roles',
      description: 'Allows editing existing roles',
      module: 'Role Management',
      isSystem: true,
      createdAt: '2023-08-01',
      rolesCount: 2
    },
    { 
      id: 8, 
      name: 'role.delete', 
      displayName: 'Delete Roles',
      description: 'Allows deleting non-system roles',
      module: 'Role Management',
      isSystem: true,
      createdAt: '2023-08-01',
      rolesCount: 1
    },
    { 
      id: 9, 
      name: 'permission.view', 
      displayName: 'View Permissions',
      description: 'Allows viewing permission list and details',
      module: 'Permission Management',
      isSystem: true,
      createdAt: '2023-08-01',
      rolesCount: 3
    },
    { 
      id: 10, 
      name: 'permission.assign', 
      displayName: 'Assign Permissions',
      description: 'Allows assigning permissions to roles',
      module: 'Permission Management',
      isSystem: true,
      createdAt: '2023-08-01',
      rolesCount: 2
    },
    { 
      id: 11, 
      name: 'reservoir.view', 
      displayName: 'View Reservoirs',
      description: 'Allows viewing reservoir list and details',
      module: 'Reservoir Management',
      isSystem: true,
      createdAt: '2023-08-01',
      rolesCount: 4
    },
    { 
      id: 12, 
      name: 'reservoir.edit', 
      displayName: 'Edit Reservoirs',
      description: 'Allows editing reservoir data',
      module: 'Reservoir Management',
      isSystem: true,
      createdAt: '2023-08-01',
      rolesCount: 2
    },
    { 
      id: 13, 
      name: 'allocation.view', 
      displayName: 'View Allocations',
      description: 'Allows viewing water allocation list and details',
      module: 'Water Allocation',
      isSystem: true,
      createdAt: '2023-08-01',
      rolesCount: 4
    },
    { 
      id: 14, 
      name: 'allocation.create', 
      displayName: 'Create Allocations',
      description: 'Allows creating new water allocations',
      module: 'Water Allocation',
      isSystem: true,
      createdAt: '2023-08-01',
      rolesCount: 2
    },
    { 
      id: 15, 
      name: 'allocation.approve', 
      displayName: 'Approve Allocations',
      description: 'Allows approving water allocation requests',
      module: 'Water Allocation',
      isSystem: true,
      createdAt: '2023-08-01',
      rolesCount: 2
    },
    { 
      id: 16, 
      name: 'report.view', 
      displayName: 'View Reports',
      description: 'Allows viewing reports',
      module: 'Reporting',
      isSystem: true,
      createdAt: '2023-08-01',
      rolesCount: 3
    },
    { 
      id: 17, 
      name: 'report.export', 
      displayName: 'Export Reports',
      description: 'Allows exporting reports in different formats',
      module: 'Reporting',
      isSystem: true,
      createdAt: '2023-08-01',
      rolesCount: 2
    },
    { 
      id: 18, 
      name: 'custom.action', 
      displayName: 'Custom Action',
      description: 'Custom permission for specific actions',
      module: 'Custom',
      isSystem: false,
      createdAt: '2023-08-05',
      rolesCount: 1
    }
  ];

  // Get unique modules for select filter
  const modules = Array.from(new Set(permissions.map(p => p.module)));

  // Filter permissions based on search query
  const filteredPermissions = permissions.filter(permission => {
    if (!searchQuery) return true;
    
    return (
      permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permission.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permission.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Form state for add/edit permission
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    module: ''
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      displayName: '',
      description: '',
      module: ''
    });
  };

  // Set up form for editing a permission
  const setupEditForm = (permission: any) => {
    setSelectedPermission(permission);
    setFormData({
      name: permission.name,
      displayName: permission.displayName,
      description: permission.description,
      module: permission.module
    });
    setIsEditPermissionDialogOpen(true);
  };

  // Add permission handler
  const handleAddPermission = () => {
    // Validation
    if (!formData.name || !formData.displayName || !formData.module) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Please fill in all required fields."
      });
      return;
    }

    // Name format validation (lowercase with dots)
    if (!/^[a-z]+(\.[a-z]+)*$/.test(formData.name)) {
      toast({
        variant: "destructive",
        title: "Invalid permission name",
        description: "Permission name should be lowercase with dots separating words (e.g., 'user.create')."
      });
      return;
    }

    // In a real app, you would make an API call here
    console.log('Adding permission:', formData);
    
    toast({
      title: "Permission added",
      description: `Permission "${formData.displayName}" has been created successfully.`
    });
    
    resetForm();
    setIsAddPermissionDialogOpen(false);
  };

  // Edit permission handler
  const handleEditPermission = () => {
    // Validation
    if (!formData.name || !formData.displayName || !formData.module) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Please fill in all required fields."
      });
      return;
    }

    // Name format validation (lowercase with dots) for non-system permissions
    if (!selectedPermission.isSystem && !/^[a-z]+(\.[a-z]+)*$/.test(formData.name)) {
      toast({
        variant: "destructive",
        title: "Invalid permission name",
        description: "Permission name should be lowercase with dots separating words (e.g., 'user.create')."
      });
      return;
    }

    // In a real app, you would make an API call here
    console.log('Editing permission:', selectedPermission.id, formData);
    
    toast({
      title: "Permission updated",
      description: `Permission "${formData.displayName}" has been updated successfully.`
    });
    
    resetForm();
    setIsEditPermissionDialogOpen(false);
  };

  // Delete permission handler
  const handleDeletePermission = () => {
    // In a real app, you would make an API call here
    console.log('Deleting permission:', selectedPermission.id);
    
    toast({
      title: "Permission deleted",
      description: `Permission "${selectedPermission.displayName}" has been deleted successfully.`
    });
    
    setIsDeletePermissionDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Permission Management</CardTitle>
          <CardDescription>
            Manage system permissions for different modules
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search permissions..."
              className="w-[200px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => {
            resetForm();
            setIsAddPermissionDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Permission
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Display Name</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPermissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No permissions found matching your search
                  </TableCell>
                </TableRow>
              ) : (
                filteredPermissions.map((permission) => (
                  <TableRow key={permission.id} className={permission.isSystem ? 'bg-muted/50' : ''}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <span>{permission.name}</span>
                        {permission.isSystem && (
                          <Badge variant="secondary" className="ml-2 text-xs">System</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{permission.displayName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{permission.module}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={permission.description}>
                      {permission.description}
                    </TableCell>
                    <TableCell>{permission.rolesCount}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setupEditForm(permission)}
                        disabled={permission.isSystem} // Can't edit system permissions
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive"
                        disabled={permission.isSystem} // Can't delete system permissions
                        onClick={() => {
                          setSelectedPermission(permission);
                          setIsDeletePermissionDialogOpen(true);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>

      {/* Add Permission Dialog */}
      <Dialog open={isAddPermissionDialogOpen} onOpenChange={setIsAddPermissionDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add New Permission</DialogTitle>
            <DialogDescription>
              Create a new permission for the system
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name*
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="e.g. report.generate"
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
                placeholder="e.g. Generate Reports"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="module" className="text-right">
                Module*
              </Label>
              <Input
                id="module"
                name="module"
                value={formData.module}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="e.g. Reporting"
                list="moduleList"
              />
              <datalist id="moduleList">
                {modules.map((module, index) => (
                  <option key={index} value={module} />
                ))}
              </datalist>
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
                placeholder="Describe what this permission allows users to do"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddPermissionDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddPermission}>
              Create Permission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Permission Dialog */}
      <Dialog open={isEditPermissionDialogOpen} onOpenChange={setIsEditPermissionDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Edit Permission</DialogTitle>
            <DialogDescription>
              Update permission details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name*
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                disabled={selectedPermission?.isSystem} // Can't change system permission names
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="module" className="text-right">
                Module*
              </Label>
              <Input
                id="module"
                name="module"
                value={formData.module}
                onChange={handleInputChange}
                className="col-span-3"
                disabled={selectedPermission?.isSystem} // Can't change module for system permissions
                list="moduleList"
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditPermissionDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleEditPermission}>
              Update Permission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Permission Confirmation */}
      <AlertDialog open={isDeletePermissionDialogOpen} onOpenChange={setIsDeletePermissionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the permission
              <strong> {selectedPermission?.displayName}</strong> and remove it from any roles that use it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePermission} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}