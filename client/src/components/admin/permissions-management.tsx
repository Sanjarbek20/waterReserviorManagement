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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Edit, Trash, PlusCircle, Shield, KeyRound } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Permission {
  id: number;
  name: string;
  description: string;
  category: string;
  createdAt?: string;
  isSystemPermission: boolean;
}

export default function PermissionsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  
  const [newPermission, setNewPermission] = useState({
    name: '',
    description: '',
    category: 'General'
  });

  // Pre-defined categories for permissions
  const categories = [
    'General',
    'User Management',
    'Role Management',
    'Resource Access',
    'Data Management',
    'System Settings',
    'Reports',
    'Reservoirs',
    'Water Allocation',
    'Monitoring',
    'Analytics'
  ];

  // Fetch permissions
  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['/api/admin/permissions'],
    queryFn: async () => {
      try {
        const res = await apiRequest('GET', '/api/admin/permissions');
        return await res.json();
      } catch (error) {
        console.error('Error fetching permissions:', error);
        toast({
          title: "Error",
          description: "Failed to fetch permissions",
          variant: "destructive"
        });
        return [];
      }
    }
  });

  // Create permission mutation
  const createPermissionMutation = useMutation({
    mutationFn: async (permissionData: typeof newPermission) => {
      const res = await apiRequest('POST', '/api/admin/permissions', permissionData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/permissions'] });
      toast({
        title: "Success",
        description: "Permission created successfully",
      });
      setIsAddDialogOpen(false);
      setNewPermission({
        name: '',
        description: '',
        category: 'General'
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create permission",
        variant: "destructive"
      });
    }
  });

  // Update permission mutation
  const updatePermissionMutation = useMutation({
    mutationFn: async (permissionData: Partial<Permission>) => {
      const { id, ...data } = permissionData;
      const res = await apiRequest('PUT', `/api/admin/permissions/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/permissions'] });
      toast({
        title: "Success",
        description: "Permission updated successfully",
      });
      setIsEditDialogOpen(false);
      setSelectedPermission(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update permission",
        variant: "destructive"
      });
    }
  });

  // Delete permission mutation
  const deletePermissionMutation = useMutation({
    mutationFn: async (permissionId: number) => {
      const res = await apiRequest('DELETE', `/api/admin/permissions/${permissionId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/permissions'] });
      toast({
        title: "Success",
        description: "Permission deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setPermissionToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete permission",
        variant: "destructive"
      });
    }
  });

  const handleCreatePermission = () => {
    if (!newPermission.name || !newPermission.category) {
      toast({
        title: "Validation Error",
        description: "Name and category are required",
        variant: "destructive"
      });
      return;
    }
    createPermissionMutation.mutate(newPermission);
  };

  const handleUpdatePermission = () => {
    if (!selectedPermission) return;
    
    updatePermissionMutation.mutate(selectedPermission);
  };

  const handleDeletePermission = () => {
    if (!permissionToDelete) return;
    
    deletePermissionMutation.mutate(permissionToDelete.id);
  };

  const openEditDialog = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (permission: Permission) => {
    setPermissionToDelete(permission);
    setIsDeleteDialogOpen(true);
  };

  // Group permissions by category
  const groupedPermissions = permissions.reduce((acc, permission) => {
    const category = permission.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading permissions...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>System Permissions</CardTitle>
            <CardDescription>Manage permissions that can be assigned to roles</CardDescription>
          </div>
          <Button 
            variant="default" 
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Permission
          </Button>
        </CardHeader>
        <CardContent>
          {Object.entries(groupedPermissions).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No permissions found
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedPermissions).map(([category, perms]) => (
                <div key={category} className="space-y-4">
                  <h3 className="text-md font-semibold text-blue-600 border-b pb-2">{category}</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Permission Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {perms.map((permission) => (
                          <TableRow key={permission.id}>
                            <TableCell className="font-medium">{permission.name}</TableCell>
                            <TableCell>{permission.description}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                permission.isSystemPermission 
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {permission.isSystemPermission ? 'System' : 'Custom'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditDialog(permission)}
                                  disabled={permission.isSystemPermission}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => openDeleteDialog(permission)}
                                  disabled={permission.isSystemPermission}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Permission Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Permission</DialogTitle>
            <DialogDescription>
              Create a new permission that can be assigned to roles
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="permission-name" className="text-right">
                Name
              </Label>
              <Input
                id="permission-name"
                value={newPermission.name}
                onChange={(e) => setNewPermission({...newPermission, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="permission-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="permission-description"
                value={newPermission.description}
                onChange={(e) => setNewPermission({...newPermission, description: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="permission-category" className="text-right">
                Category
              </Label>
              <Select 
                value={newPermission.category} 
                onValueChange={(value) => setNewPermission({...newPermission, category: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePermission}
              disabled={createPermissionMutation.isPending}
            >
              {createPermissionMutation.isPending ? "Creating..." : "Create Permission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Permission Dialog */}
      {selectedPermission && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Permission</DialogTitle>
              <DialogDescription>
                Update permission details
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-permission-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-permission-name"
                  value={selectedPermission.name}
                  onChange={(e) => setSelectedPermission({...selectedPermission, name: e.target.value})}
                  className="col-span-3"
                  disabled={selectedPermission.isSystemPermission}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-permission-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-permission-description"
                  value={selectedPermission.description}
                  onChange={(e) => setSelectedPermission({...selectedPermission, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-permission-category" className="text-right">
                  Category
                </Label>
                <Select 
                  value={selectedPermission.category} 
                  onValueChange={(value) => setSelectedPermission({...selectedPermission, category: value})}
                  disabled={selectedPermission.isSystemPermission}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdatePermission}
                disabled={updatePermissionMutation.isPending || selectedPermission.isSystemPermission}
              >
                {updatePermissionMutation.isPending ? "Updating..." : "Update Permission"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Permission Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Permission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the permission "{permissionToDelete?.name}"? 
              This action cannot be undone, and roles using this permission will lose access to it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePermission}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deletePermissionMutation.isPending}
            >
              {deletePermissionMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}