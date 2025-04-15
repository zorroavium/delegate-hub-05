import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Shield, Filter, Download, Search, Info, AlertTriangle, X, RefreshCw, Calendar, Clock } from 'lucide-react';
import { format, subDays, isAfter, parseISO } from 'date-fns';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface AuditLogEntry {
  timestamp: string;
  action: string;
  userId: string;
  ip: string;
  details: Record<string, any>;
}

interface FilterState {
  action: string;
  timeRange: string;
  searchTerm: string;
  userId: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

export function AuditLog() {
  const { getSecurityAuditLog } = useAuth();
  const { toast } = useToast();
  
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [initialLoadComplete, setInitialLoadComplete] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  const [filters, setFilters] = useState<FilterState>({
    action: 'all',
    timeRange: '7days',
    searchTerm: '',
    userId: null,
    startDate: subDays(new Date(), 7),
    endDate: new Date(),
  });
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const logsPerPage = 10;
  
  const isMounted = useRef<boolean>(true);
  const dataFetchedRef = useRef<boolean>(false);
  
  const uniqueUserIds = Array.from(new Set(logs.map(log => log.userId)));
  
  const dateRangePresets = {
    'today': { start: new Date(), end: new Date() },
    '24hours': { start: subDays(new Date(), 1), end: new Date() },
    '7days': { start: subDays(new Date(), 7), end: new Date() },
    '30days': { start: subDays(new Date(), 30), end: new Date() },
    '90days': { start: subDays(new Date(), 90), end: new Date() },
  };

  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (dataFetchedRef.current && !refreshing) return;
    
    const fetchLogs = async () => {
      if (!isMounted.current) return;
      
      try {
        const auditLogs = await getSecurityAuditLog();
        if (isMounted.current) {
          setLogs(auditLogs);
          dataFetchedRef.current = true;
          setRefreshing(false);
          setInitialLoadComplete(true);
        }
      } catch (error) {
        if (isMounted.current) {
          console.error('Failed to fetch audit logs:', error);
          toast({
            title: "Error",
            description: "Failed to fetch audit logs.",
            variant: "destructive",
          });
          setRefreshing(false);
          setInitialLoadComplete(true);
        }
      }
    };

    fetchLogs();
  }, [getSecurityAuditLog, toast, refreshing]);

  useEffect(() => {
    if (!initialLoadComplete) return;
    
    let filtered = [...logs];
    
    if (filters.action !== 'all') {
      filtered = filtered.filter(log => log.action.includes(filters.action));
    }
    
    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(log => {
        const logDate = parseISO(log.timestamp);
        return (
          isAfter(logDate, filters.startDate!) && 
          isAfter(new Date(filters.endDate!.setHours(23, 59, 59, 999)), logDate)
        );
      });
    }
    
    if (filters.userId) {
      filtered = filtered.filter(log => log.userId === filters.userId);
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(term) ||
        log.userId.toLowerCase().includes(term) ||
        log.ip.toLowerCase().includes(term) ||
        (log.details && JSON.stringify(log.details).toLowerCase().includes(term))
      );
    }
    
    setFilteredLogs(filtered);
    setCurrentPage(1);
  }, [logs, filters, initialLoadComplete]);

  const handleDateRangeChange = (range: string) => {
    if (range === 'custom') {
      setFilters(prev => ({
        ...prev,
        timeRange: 'custom',
      }));
    } else {
      const preset = dateRangePresets[range as keyof typeof dateRangePresets];
      setFilters(prev => ({
        ...prev,
        timeRange: range,
        startDate: preset.start,
        endDate: preset.end,
      }));
    }
  };

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setFilters(prev => ({
      ...prev,
      timeRange: 'custom',
      startDate: start,
      endDate: end,
    }));
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      action: 'all',
      timeRange: '7days',
      searchTerm: '',
      userId: null,
      startDate: dateRangePresets['7days'].start,
      endDate: dateRangePresets['7days'].end,
    });
  };

  const refreshLogs = useCallback(async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    dataFetchedRef.current = false;
  }, [refreshing]);

  const exportLogs = () => {
    const formattedLogs = filteredLogs.map(log => ({
      timestamp: formatTimestamp(log.timestamp),
      action: log.action.replace(/_/g, ' '),
      userId: log.userId,
      ip: log.ip,
      details: JSON.stringify(log.details)
    }));
    
    const header = ['Timestamp', 'Action', 'User ID', 'IP Address', 'Details'];
    
    const csvContent = [
      header.join(','),
      ...formattedLogs.map(row => 
        Object.values(row).map(cell => 
          typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : `"${cell}"`)
        .join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `security-audit-log-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Export Successful',
      description: `${filteredLogs.length} log entries exported to CSV.`,
    });
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'yyyy-MM-dd HH:mm:ss');
    } catch (error) {
      return timestamp;
    }
  };

  const actionTypes = ['all', ...Array.from(new Set(logs.map(log => {
    const parts = log.action.split('_');
    return parts[0] || 'unknown';
  })))];

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const getActionBadgeStyles = (action: string) => {
    if (action.includes('login_success') || action.includes('_success')) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    }
    if (action.includes('login_failed') || action.includes('_failed') || action.includes('_error')) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
    if (action.includes('account_locked')) {
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    }
    if (action.includes('password_')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
    if (action.includes('mfa_')) {
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security Audit Log
            </CardTitle>
            <CardDescription>
              Track and analyze security events for compliance and threat detection
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn("flex items-center gap-2", refreshing && "opacity-50")}
              onClick={refreshLogs}
              disabled={refreshing}
            >
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={exportLogs}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.print()}>
                  Print Logs
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-1 items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={filters.searchTerm}
                onChange={(e) => updateFilter('searchTerm', e.target.value)}
                className="flex-1"
              />
              {filters.searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updateFilter('searchTerm', '')}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={filters.action}
                onValueChange={(value) => updateFilter('action', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === 'all' ? 'All actions' : `${type.charAt(0).toUpperCase() + type.slice(1)} events`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Select
                value={filters.timeRange}
                onValueChange={handleDateRangeChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="24hours">Last 24 hours</SelectItem>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {filters.timeRange === 'custom' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {filters.startDate && filters.endDate 
                        ? `${format(filters.startDate, 'MMM d')} - ${format(filters.endDate, 'MMM d, yyyy')}`
                        : 'Select dates'}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">Custom date range picker would be implemented here</p>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            
            {uniqueUserIds.length > 0 && (
              <div className="flex items-center gap-2">
                <Select
                  value={filters.userId || ''}
                  onValueChange={(value) => updateFilter('userId', value === '' ? null : value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All users</SelectItem>
                    {uniqueUserIds.map((userId) => (
                      <SelectItem key={userId} value={userId}>
                        {userId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {(filters.action !== 'all' || filters.searchTerm || filters.userId || filters.timeRange !== '7days') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {refreshing ? (
          <div className="flex h-60 items-center justify-center">
            <div className="text-center space-y-3">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
              <p className="text-sm text-muted-foreground">Refreshing audit logs...</p>
            </div>
          </div>
        ) : !initialLoadComplete ? (
          <div className="flex h-60 items-center justify-center">
            <div className="text-center space-y-3">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
              <p className="text-sm text-muted-foreground">Loading audit logs...</p>
            </div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center space-y-3 rounded-md border border-dashed p-6 text-center">
            <AlertTriangle className="h-10 w-10 text-muted-foreground/60" />
            <div>
              <p className="text-lg font-medium">No logs found</p>
              <p className="text-sm text-muted-foreground">No logs match your current filters</p>
            </div>
            {(filters.action !== 'all' || filters.searchTerm || filters.userId || filters.timeRange !== '7days') && (
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead className="w-10">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentLogs.map((log, index) => (
                    <TableRow key={`${log.timestamp}-${index}`}>
                      <TableCell className="whitespace-nowrap font-mono text-xs">
                        {formatTimestamp(log.timestamp)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getActionBadgeStyles(log.action)}>
                          {log.action.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[180px] truncate">
                        {log.userId}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {log.ip}
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Info className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="max-w-xs">
                              <pre className="text-xs whitespace-pre-wrap">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => changePage(Math.max(1, currentPage - 1))}
                      className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    let pageNum;
                    
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => changePage(pageNum)}
                          isActive={currentPage === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => changePage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="border-t p-4 text-sm text-muted-foreground">
        <div className="flex flex-wrap justify-between w-full">
          <div>Showing {filteredLogs.length > 0 ? `${indexOfFirstLog + 1}-${Math.min(indexOfLastLog, filteredLogs.length)}` : '0'} of {filteredLogs.length} entries</div>
          <div className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className="flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    Retention policy: 90 days
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">
                    For compliance reasons, audit logs are retained for 90 days. 
                    Export data you need to keep for longer periods.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
