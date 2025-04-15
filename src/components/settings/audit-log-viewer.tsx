import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  User, 
  Calendar, 
  Search, 
  LogIn, 
  LogOut, 
  Key, 
  Lock, 
  Unlock, 
  AlertCircle, 
  Settings, 
  FileText, 
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Download,
  X,
  Filter,
  Clock,
  Mail as MailIcon
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
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
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  ip: string;
  userAgent: string;
  details: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const MOCK_AUDIT_LOG: AuditLogEntry[] = Array.from({ length: 100 }, (_, i) => {
  const date = new Date();
  date.setHours(date.getHours() - i);
  
  const actions = [
    'login_success', 'login_failed', 'logout', 'password_changed', 
    'account_locked', 'account_unlocked', 'mfa_enabled', 'mfa_disabled',
    'user_created', 'user_updated', 'user_deleted', 'permission_changed',
    'data_exported', 'data_imported', 'settings_changed', 'task_created',
    'task_updated', 'task_deleted', 'api_access', 'session_expired'
  ];
  
  const action = actions[Math.floor(Math.random() * actions.length)];
  
  const getSeverity = (action: string): 'low' | 'medium' | 'high' | 'critical' => {
    if (action.includes('login_failed') || action.includes('account_locked')) return 'high';
    if (action.includes('user_deleted') || action.includes('permission_changed')) return 'medium';
    if (action.includes('password_changed') || action.includes('mfa')) return 'medium';
    if (action.includes('data_exported') || action.includes('data_imported')) return 'medium';
    return 'low';
  };
  
  const randomUser = () => {
    const users = [
      { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
      { id: '2', name: 'Employee User', email: 'employee@example.com', role: 'employee' },
      { id: '3', name: 'Client User', email: 'client@example.com', role: 'client' },
      { id: '4', name: 'Test User', email: 'test@example.com', role: 'client' }
    ];
    return users[Math.floor(Math.random() * users.length)];
  };
  
  const user = randomUser();
  
  const getDetails = (action: string) => {
    switch (action) {
      case 'login_success':
        return { method: 'password', rememberMe: Math.random() > 0.5 };
      case 'login_failed':
        return { 
          email: user.email, 
          reason: Math.random() > 0.5 ? 'invalid_password' : 'user_not_found',
          attemptNumber: Math.floor(Math.random() * 5) + 1
        };
      case 'account_locked':
        return { 
          email: user.email, 
          reason: 'max_failed_attempts', 
          attemptsCount: 5,
          lockDuration: 15
        };
      case 'password_changed':
        return { method: Math.random() > 0.5 ? 'user_initiated' : 'admin_initiated' };
      case 'user_created':
      case 'user_updated':
        return { 
          targetUser: { id: Math.random().toString(), name: 'New User', email: 'new@example.com' },
          changes: { role: Math.random() > 0.5 ? 'client' : 'employee' }
        };
      case 'permission_changed':
        return {
          targetUser: { id: user.id, name: user.name, email: user.email },
          permissions: ['view_reports', 'create_task'],
          previous: ['view_reports']
        };
      case 'data_exported':
        return { 
          dataType: Math.random() > 0.5 ? 'users' : 'tasks',
          format: ['csv', 'json', 'xlsx'][Math.floor(Math.random() * 3)],
          recordCount: Math.floor(Math.random() * 1000) + 50
        };
      default:
        return {};
    }
  };
  
  return {
    id: `log-${i}-${Math.random().toString(36).substring(2, 9)}`,
    timestamp: date.toISOString(),
    action,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    userRole: user.role,
    ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    userAgent: Math.random() > 0.5 
      ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    details: getDetails(action),
    severity: getSeverity(action)
  };
});

const getActionIcon = (action: string) => {
  if (action.includes('login_success')) return <LogIn className="h-4 w-4" />;
  if (action.includes('login_failed')) return <AlertCircle className="h-4 w-4" />;
  if (action.includes('logout')) return <LogOut className="h-4 w-4" />;
  if (action.includes('password')) return <Key className="h-4 w-4" />;
  if (action.includes('account_locked')) return <Lock className="h-4 w-4" />;
  if (action.includes('account_unlocked')) return <Unlock className="h-4 w-4" />;
  if (action.includes('mfa')) return <Shield className="h-4 w-4" />;
  if (action.includes('user_')) return <User className="h-4 w-4" />;
  if (action.includes('data_')) return <FileText className="h-4 w-4" />;
  if (action.includes('settings')) return <Settings className="h-4 w-4" />;
  if (action.includes('session')) return <Clock className="h-4 w-4" />;
  return <FileText className="h-4 w-4" />;
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const getSeverityBadge = (severity: 'low' | 'medium' | 'high' | 'critical') => {
  switch (severity) {
    case 'critical':
      return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Critical</Badge>;
    case 'high':
      return <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">High</Badge>;
    case 'medium':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Medium</Badge>;
    case 'low':
    default:
      return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Low</Badge>;
  }
};

const formatActionName = (action: string) => {
  return action
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface FilterOptions {
  action: string;
  user: string;
  severity: string;
  startDate: string;
  endDate: string;
  searchTerm: string;
}

export function AuditLogViewer() {
  const { toast } = useToast();
  const { hasPermission } = useAuth();
  const [loading, setLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({
    action: '',
    user: '',
    severity: '',
    startDate: '',
    endDate: '',
    searchTerm: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const logsPerPage = 10;
  
  useEffect(() => {
    const fetchAuditLogs = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAuditLogs(MOCK_AUDIT_LOG);
        setFilteredLogs(MOCK_AUDIT_LOG);
      } catch (error) {
        toast({
          title: 'Error fetching audit logs',
          description: 'There was an error fetching the audit logs. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (hasPermission('auditLog')) {
      fetchAuditLogs();
    }
  }, [toast, hasPermission]);
  
  useEffect(() => {
    let result = [...auditLogs];
    
    if (filters.action) {
      result = result.filter(log => log.action.includes(filters.action));
    }
    
    if (filters.user) {
      result = result.filter(log => log.userId === filters.user || log.userEmail?.includes(filters.user));
    }
    
    if (filters.severity) {
      result = result.filter(log => log.severity === filters.severity);
    }
    
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      result = result.filter(log => new Date(log.timestamp) >= startDate);
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999); // End of day
      result = result.filter(log => new Date(log.timestamp) <= endDate);
    }
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(log => 
        log.action.toLowerCase().includes(searchLower) ||
        log.userEmail?.toLowerCase().includes(searchLower) ||
        log.userName?.toLowerCase().includes(searchLower) ||
        log.ip.includes(searchLower) ||
        JSON.stringify(log.details).toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredLogs(result);
    setCurrentPage(1);
  }, [filters, auditLogs]);
  
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const resetFilters = () => {
    setFilters({
      action: '',
      user: '',
      severity: '',
      startDate: '',
      endDate: '',
      searchTerm: '',
    });
  };
  
  const refreshLogs = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAuditLogs(MOCK_AUDIT_LOG);
      setFilteredLogs(MOCK_AUDIT_LOG);
      toast({
        title: 'Audit logs refreshed',
        description: 'The audit logs have been refreshed.',
      });
    } catch (error) {
      toast({
        title: 'Error refreshing audit logs',
        description: 'There was an error refreshing the audit logs. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const exportLogs = () => {
    toast({
      title: 'Export started',
      description: 'Audit logs export has started. You will be notified when it is complete.',
    });
    
    setTimeout(() => {
      toast({
        title: 'Export complete',
        description: 'Audit logs have been exported successfully.',
      });
    }, 2000);
  };
  
  const uniqueUsers = Array.from(new Set(auditLogs.map(log => log.userEmail))).filter(Boolean) as string[];
  
  const uniqueActions = Array.from(new Set(auditLogs.map(log => log.action))).sort();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">Security Audit Log</CardTitle>
          <CardDescription>View and monitor security events and user activities</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshLogs}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportLogs}
            disabled={loading}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search audit logs..."
                  className="pl-8"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-1 whitespace-nowrap"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
            
            {showFilters && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Action Type</label>
                  <Select
                    value={filters.action}
                    onValueChange={(value) => setFilters({...filters, action: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Actions</SelectItem>
                      {uniqueActions.map((action) => (
                        <SelectItem key={action} value={action}>
                          {formatActionName(action)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">User</label>
                  <Select
                    value={filters.user}
                    onValueChange={(value) => setFilters({...filters, user: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Users" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Users</SelectItem>
                      {uniqueUsers.map((user) => (
                        <SelectItem key={user} value={user}>{user}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Severity</label>
                  <Select
                    value={filters.severity}
                    onValueChange={(value) => setFilters({...filters, severity: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Severities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Severities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      placeholder="From"
                      value={filters.startDate}
                      onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                    />
                    <Input
                      type="date"
                      placeholder="To"
                      value={filters.endDate}
                      onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex items-end md:col-span-2 lg:col-span-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetFilters}
                    className="gap-1 ml-auto"
                  >
                    <X className="h-4 w-4" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead className="text-center">Severity</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading audit logs...
                    </TableCell>
                  </TableRow>
                ) : currentLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No audit logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentLogs.map((log) => (
                    <React.Fragment key={log.id}>
                      <TableRow>
                        <TableCell className="font-mono text-xs">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getActionIcon(log.action)}
                            <span>{formatActionName(log.action)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{log.userName || 'Unknown'}</span>
                            <span className="text-xs text-muted-foreground">{log.userEmail}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-xs">{log.ip}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          {getSeverityBadge(log.severity)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Collapsible>
                            <CollapsibleTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                              >
                                {expandedLogId === log.id ? 'Hide' : 'View'}
                                {expandedLogId === log.id ? (
                                  <ChevronUp className="ml-1 h-4 w-4" />
                                ) : (
                                  <ChevronDown className="ml-1 h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          </Collapsible>
                        </TableCell>
                      </TableRow>
                      {expandedLogId === log.id && (
                        <TableRow className="bg-muted/50">
                          <TableCell colSpan={6} className="py-3">
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-1">User Information</h4>
                                  <div className="text-sm space-y-1">
                                    <div className="flex items-center gap-2">
                                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                                      <span className="font-medium">{log.userName || 'Unknown'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <MailIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                      <span>{log.userEmail || 'Unknown'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                                      <span>Role: {log.userRole}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Technical Details</h4>
                                  <div className="text-sm space-y-1">
                                    <div className="font-mono text-xs">IP: {log.ip}</div>
                                    <div className="font-mono text-xs truncate max-w-md" title={log.userAgent}>
                                      UA: {log.userAgent}
                                    </div>
                                    <div className="font-mono text-xs">
                                      Time: {formatTimestamp(log.timestamp)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <Separator />
                              
                              <div>
                                <h4 className="text-sm font-medium mb-1">Event Details</h4>
                                <div className="rounded-md bg-muted p-2 font-mono text-xs">
                                  <pre className="whitespace-pre-wrap break-all">
                                    {JSON.stringify(log.details, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {!loading && filteredLogs.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstLog + 1}-{Math.min(indexOfLastLog, filteredLogs.length)} of {filteredLogs.length} logs
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(Math.max(1, currentPage - 1));
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNumber);
                          }}
                          isActive={currentPage === pageNumber}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(totalPages);
                        }}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(Math.min(totalPages, currentPage + 1));
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div>
            Security audit logs are retained for 90 days in accordance with compliance requirements.
          </div>
          <div>
            Last refreshed: {new Date().toLocaleString()}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
