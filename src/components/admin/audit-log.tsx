
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Shield, Download, Calendar, Clock, Search } from 'lucide-react';

// Sample audit log data
const auditLogs = [
  { id: 1, user: 'admin@example.com', action: 'login', target: 'system', timestamp: '2025-04-15T14:30:00', ip: '192.168.1.1', status: 'success' },
  { id: 2, user: 'employee@example.com', action: 'view', target: 'tasks', timestamp: '2025-04-15T13:45:00', ip: '192.168.1.2', status: 'success' },
  { id: 3, user: 'admin@example.com', action: 'update', target: 'user settings', timestamp: '2025-04-15T12:20:00', ip: '192.168.1.1', status: 'success' },
  { id: 4, user: 'client@example.com', action: 'login', target: 'system', timestamp: '2025-04-15T11:10:00', ip: '192.168.1.3', status: 'failed' },
  { id: 5, user: 'employee@example.com', action: 'create', target: 'task', timestamp: '2025-04-15T10:05:00', ip: '192.168.1.2', status: 'success' },
  { id: 6, user: 'admin@example.com', action: 'delete', target: 'task', timestamp: '2025-04-15T09:30:00', ip: '192.168.1.1', status: 'success' },
  { id: 7, user: 'unknown', action: 'login', target: 'system', timestamp: '2025-04-15T08:45:00', ip: '192.168.1.4', status: 'failed' },
  { id: 8, user: 'employee@example.com', action: 'export', target: 'reports', timestamp: '2025-04-15T07:20:00', ip: '192.168.1.2', status: 'success' },
];

export function AuditLog() {
  const [filterAction, setFilterAction] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter logs based on selected filters and search term
  const filteredLogs = auditLogs.filter(log => {
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesAction && matchesStatus && (searchTerm === '' || matchesSearch);
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Security Audit Log
        </CardTitle>
        <CardDescription>
          Review all security-related events and activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search logs..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filter Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.user}</TableCell>
                    <TableCell className="capitalize">{log.action}</TableCell>
                    <TableCell>{log.target}</TableCell>
                    <TableCell>{log.ip}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(log.timestamp)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(log.status)}>
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
