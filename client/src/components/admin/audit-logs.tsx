import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Calendar, 
  FileDown, 
  Activity, 
  User, 
  Shield, 
  Settings, 
  Database,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function AuditLogs() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  
  // Mock data for audit logs
  const auditLogs = [
    {
      id: 1,
      timestamp: '2023-08-10 14:35:22',
      user: 'superadmin',
      module: 'User Management',
      action: 'CREATE',
      description: 'Created new user account: "operator1"',
      status: 'SUCCESS',
      ipAddress: '192.168.1.10',
      details: {
        username: 'operator1',
        role: 'admin',
        email: 'operator1@example.com'
      }
    },
    {
      id: 2,
      timestamp: '2023-08-10 14:38:17',
      user: 'admin',
      module: 'Water Allocation',
      action: 'UPDATE',
      description: 'Updated water allocation #123 for farmer "John Doe"',
      status: 'SUCCESS',
      ipAddress: '192.168.1.15',
      details: {
        allocationId: 123,
        farmerId: 45,
        amount: '5000m³',
        previousAmount: '3000m³'
      }
    },
    {
      id: 3,
      timestamp: '2023-08-10 15:05:33',
      user: 'data_admin',
      module: 'Reservoir Management',
      action: 'UPDATE',
      description: 'Updated water level for reservoir "East Reservoir"',
      status: 'SUCCESS',
      ipAddress: '192.168.1.22',
      details: {
        reservoirId: 2,
        newLevel: '320000m³',
        previousLevel: '310000m³'
      }
    },
    {
      id: 4,
      timestamp: '2023-08-10 15:22:41',
      user: 'admin',
      module: 'User Management',
      action: 'DELETE',
      description: 'Attempted to delete user account "superadmin"',
      status: 'FAILED',
      ipAddress: '192.168.1.15',
      details: {
        reason: 'Insufficient permissions. Cannot delete superadmin account.'
      }
    },
    {
      id: 5,
      timestamp: '2023-08-10 15:30:05',
      user: 'superadmin',
      module: 'System Configuration',
      action: 'UPDATE',
      description: 'Updated system settings',
      status: 'SUCCESS',
      ipAddress: '192.168.1.10',
      details: {
        changes: {
          sessionTimeout: '60 minutes',
          previousValue: '30 minutes'
        }
      }
    },
    {
      id: 6,
      timestamp: '2023-08-10 15:45:19',
      user: 'admin',
      module: 'Reporting',
      action: 'READ',
      description: 'Generated water usage report',
      status: 'SUCCESS',
      ipAddress: '192.168.1.15',
      details: {
        reportType: 'Monthly Water Usage',
        format: 'PDF',
        period: 'July 2023'
      }
    },
    {
      id: 7,
      timestamp: '2023-08-10 16:10:52',
      user: 'farmer1',
      module: 'Water Request',
      action: 'CREATE',
      description: 'Submitted new water request',
      status: 'PENDING',
      ipAddress: '192.168.1.30',
      details: {
        requestId: 234,
        amount: '2000m³',
        cropType: 'Wheat',
        fieldSize: '50 hectares'
      }
    },
    {
      id: 8,
      timestamp: '2023-08-10 16:15:33',
      user: 'data_admin',
      module: 'Data Management',
      action: 'EXPORT',
      description: 'Exported reservoir data',
      status: 'SUCCESS',
      ipAddress: '192.168.1.22',
      details: {
        format: 'CSV',
        records: 15,
        timeframe: 'Last 30 days'
      }
    },
    {
      id: 9,
      timestamp: '2023-08-10 16:30:27',
      user: 'superadmin',
      module: 'Role Management',
      action: 'UPDATE',
      description: 'Updated permissions for role "data_admin"',
      status: 'SUCCESS',
      ipAddress: '192.168.1.10',
      details: {
        roleId: 3,
        addedPermissions: ['report.export'],
        removedPermissions: []
      }
    },
    {
      id: 10,
      timestamp: '2023-08-10 16:45:18',
      user: 'system',
      module: 'Backup',
      action: 'CREATE',
      description: 'Automated system backup executed',
      status: 'SUCCESS',
      ipAddress: 'localhost',
      details: {
        backupId: 45,
        size: '256MB',
        location: '/backups/2023-08-10/'
      }
    },
    {
      id: 11,
      timestamp: '2023-08-10 17:00:05',
      user: 'admin',
      module: 'Security',
      action: 'LOGIN',
      description: 'User login',
      status: 'SUCCESS',
      ipAddress: '192.168.1.15',
      details: {
        browser: 'Chrome 115.0.0',
        os: 'Windows 10',
        loginTime: '2023-08-10 17:00:01'
      }
    },
    {
      id: 12,
      timestamp: '2023-08-10 17:15:42',
      user: 'unknown',
      module: 'Security',
      action: 'LOGIN',
      description: 'Failed login attempt for username "admin"',
      status: 'FAILED',
      ipAddress: '192.168.1.100',
      details: {
        reason: 'Invalid password',
        attemptNumber: 3
      }
    }
  ];

  // Get unique modules, actions, statuses for filters
  const modules = ['all', ...Array.from(new Set(auditLogs.map(log => log.module)))];
  const actions = ['all', ...Array.from(new Set(auditLogs.map(log => log.action)))];
  const statuses = ['all', ...Array.from(new Set(auditLogs.map(log => log.status)))];

  // Apply filters to audit logs
  const filteredLogs = auditLogs.filter(log => {
    // Search filter
    const matchesSearch = !searchQuery || 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Module filter
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
    
    // Action filter
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    
    // Date range filter
    const logDate = new Date(log.timestamp);
    const matchesFromDate = !fromDate || logDate >= fromDate;
    const matchesToDate = !toDate || logDate <= new Date(toDate.setHours(23, 59, 59, 999));
    
    return matchesSearch && matchesModule && matchesAction && matchesStatus && matchesFromDate && matchesToDate;
  });

  // Handle export
  const handleExport = () => {
    toast({
      title: "Export initiated",
      description: "Audit logs are being exported to CSV file"
    });
    // In a real app, you would trigger an API call to generate and download the file
  };

  // Get icon based on module
  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'User Management':
        return <User className="h-4 w-4" />;
      case 'Role Management':
        return <Shield className="h-4 w-4" />;
      case 'Water Allocation':
        return <Activity className="h-4 w-4" />;
      case 'Reservoir Management':
        return <Database className="h-4 w-4" />;
      case 'System Configuration':
        return <Settings className="h-4 w-4" />;
      case 'Security':
        return <Shield className="h-4 w-4" />;
      case 'Backup':
        return <Database className="h-4 w-4" />;
      case 'Data Management':
        return <Database className="h-4 w-4" />;
      case 'Reporting':
        return <FileDown className="h-4 w-4" />;
      case 'Water Request':
        return <Activity className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  // Get icon and style based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Success
          </Badge>
        );
      case 'FAILED':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Info className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Audit Logs</CardTitle>
          <CardDescription>
            System activity logs for security and compliance
          </CardDescription>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <FileDown className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search logs..."
              className="w-[200px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by module" />
            </SelectTrigger>
            <SelectContent>
              {modules.map(module => (
                <SelectItem key={module} value={module}>
                  {module === 'all' ? 'All Modules' : module}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              {actions.map(action => (
                <SelectItem key={action} value={action}>
                  {action === 'all' ? 'All Actions' : action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {fromDate && toDate ? (
                  `${format(fromDate, 'dd/MM/yyyy')} - ${format(toDate, 'dd/MM/yyyy')}`
                ) : (
                  <span>Pick date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex space-x-2 p-3">
                <div className="space-y-1">
                  <div className="text-xs font-medium">From</div>
                  <CalendarComponent
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                    initialFocus
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium">To</div>
                  <CalendarComponent
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    initialFocus
                    disabled={(date) => date < (fromDate || new Date(0))}
                  />
                </div>
              </div>
              <div className="flex justify-end p-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFromDate(undefined);
                    setToDate(undefined);
                  }}
                  className="mr-2"
                >
                  Clear
                </Button>
                <Button size="sm">Apply</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No audit logs found matching your search criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">{log.timestamp}</TableCell>
                    <TableCell>
                      <span className="font-medium">{log.user}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getModuleIcon(log.module)}
                        <span className="ml-2">{log.module}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate" title={log.description}>
                      {log.description}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(log.status)}
                    </TableCell>
                    <TableCell>{log.ipAddress}</TableCell>
                    <TableCell className="text-right">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px]" align="end">
                          <div className="space-y-2">
                            <h4 className="font-medium">Event Details</h4>
                            <div className="text-sm space-y-1">
                              <div className="bg-muted p-2 rounded-md">
                                <pre className="text-xs overflow-auto">
                                  {JSON.stringify(log.details, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}