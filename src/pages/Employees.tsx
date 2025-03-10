
import React, { useState } from 'react';
import { SidebarLayout } from '@/components/layout/sidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  MessageSquare, 
  Clock, 
  Briefcase, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  User, 
  Filter 
} from 'lucide-react';

// Mock data for employees
const employeesMock = [
  {
    id: '101',
    name: 'Sarah Johnson',
    role: 'Project Manager',
    department: 'Operations',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'SJ',
    avatarColor: 'bg-blue-500',
    status: 'active',
    workload: 85,
    tasksCompleted: 28,
    tasksPending: 5,
  },
  {
    id: '102',
    name: 'Mike Anderson',
    role: 'Senior Developer',
    department: 'Engineering',
    email: 'mike.a@example.com',
    phone: '+1 (555) 234-5678',
    avatar: 'MA',
    avatarColor: 'bg-green-500',
    status: 'active',
    workload: 70,
    tasksCompleted: 24,
    tasksPending: 8,
  },
  {
    id: '103',
    name: 'Emily Chen',
    role: 'Marketing Specialist',
    department: 'Marketing',
    email: 'emily.c@example.com',
    phone: '+1 (555) 345-6789',
    avatar: 'EC',
    avatarColor: 'bg-purple-500',
    status: 'active',
    workload: 60,
    tasksCompleted: 18,
    tasksPending: 4,
  },
  {
    id: '104',
    name: 'Alex Thompson',
    role: 'Systems Administrator',
    department: 'IT Support',
    email: 'alex.t@example.com',
    phone: '+1 (555) 456-7890',
    avatar: 'AT',
    avatarColor: 'bg-yellow-500',
    status: 'away',
    workload: 45,
    tasksCompleted: 15,
    tasksPending: 2,
  },
  {
    id: '105',
    name: 'Jessica Miller',
    role: 'UI/UX Designer',
    department: 'Design',
    email: 'jessica.m@example.com',
    phone: '+1 (555) 567-8901',
    avatar: 'JM',
    avatarColor: 'bg-pink-500',
    status: 'active',
    workload: 75,
    tasksCompleted: 22,
    tasksPending: 6,
  },
  {
    id: '106',
    name: 'David Wilson',
    role: 'Content Creator',
    department: 'Marketing',
    email: 'david.w@example.com',
    phone: '+1 (555) 678-9012',
    avatar: 'DW',
    avatarColor: 'bg-indigo-500',
    status: 'on-leave',
    workload: 0,
    tasksCompleted: 12,
    tasksPending: 0,
  },
  {
    id: '107',
    name: 'Lisa Brown',
    role: 'HR Specialist',
    department: 'Human Resources',
    email: 'lisa.b@example.com',
    phone: '+1 (555) 789-0123',
    avatar: 'LB',
    avatarColor: 'bg-red-500',
    status: 'active',
    workload: 50,
    tasksCompleted: 16,
    tasksPending: 3,
  },
  {
    id: '108',
    name: 'Robert Garcia',
    role: 'Financial Analyst',
    department: 'Finance',
    email: 'robert.g@example.com',
    phone: '+1 (555) 890-1234',
    avatar: 'RG',
    avatarColor: 'bg-teal-500',
    status: 'active',
    workload: 65,
    tasksCompleted: 20,
    tasksPending: 5,
  },
];

// Department summary for analytics
const departmentSummary = [
  { name: 'Operations', employees: 5, activeProjects: 8, completionRate: 78 },
  { name: 'Engineering', employees: 12, activeProjects: 10, completionRate: 85 },
  { name: 'Marketing', employees: 8, activeProjects: 6, completionRate: 72 },
  { name: 'Design', employees: 6, activeProjects: 7, completionRate: 80 },
  { name: 'Human Resources', employees: 3, activeProjects: 2, completionRate: 90 },
];

// Employee Card for Grid View
const EmployeeCard = ({ employee }: { employee: any }) => {
  const statusColors = {
    active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
    away: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
    'on-leave': "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
  };
  
  const statusColor = statusColors[employee.status as keyof typeof statusColors] || statusColors.active;
  
  // Determine workload color
  let workloadColor = "text-green-600";
  if (employee.workload > 75) {
    workloadColor = "text-red-600";
  } else if (employee.workload > 50) {
    workloadColor = "text-yellow-600";
  }
  
  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <Avatar className={`h-12 w-12 ${employee.avatarColor}`}>
              <span className="text-white">{employee.avatar}</span>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{employee.name}</h3>
              <p className="text-sm text-muted-foreground">{employee.role}</p>
            </div>
          </div>
          <Badge className={statusColor}>
            {employee.status === 'on-leave' ? 'On Leave' : employee.status}
          </Badge>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="text-muted-foreground" />
            <span className="text-sm">{employee.department}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-muted-foreground" />
            <span className="text-sm">{employee.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-muted-foreground" />
            <span className="text-sm">{employee.phone}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Workload</span>
            <span className={`text-sm font-medium ${workloadColor}`}>{employee.workload}%</span>
          </div>
          <Progress 
            value={employee.workload} 
            className="h-2" 
            indicatorClassName={
              employee.workload > 75 
                ? "bg-red-500" 
                : employee.workload > 50 
                  ? "bg-yellow-500" 
                  : "bg-green-500"
            }
          />
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-1">
            <CheckCircle2 size={14} className="text-green-600" />
            <span className="text-sm">{employee.tasksCompleted} completed</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-yellow-600" />
            <span className="text-sm">{employee.tasksPending} pending</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Employee Row for Table View
const EmployeeRow = ({ employee }: { employee: any }) => {
  const statusColors = {
    active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
    away: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
    'on-leave': "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
  };
  
  const statusColor = statusColors[employee.status as keyof typeof statusColors] || statusColors.active;
  
  return (
    <tr className="border-b hover:bg-muted/50">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <Avatar className={`h-8 w-8 ${employee.avatarColor}`}>
            <span className="text-xs text-white">{employee.avatar}</span>
          </Avatar>
          <div>
            <div className="font-medium">{employee.name}</div>
            <div className="text-sm text-muted-foreground">{employee.email}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">{employee.role}</td>
      <td className="py-3 px-4">{employee.department}</td>
      <td className="py-3 px-4">
        <Badge className={statusColor}>
          {employee.status === 'on-leave' ? 'On Leave' : employee.status}
        </Badge>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <Progress 
            value={employee.workload} 
            className="h-2 w-24" 
            indicatorClassName={
              employee.workload > 75 
                ? "bg-red-500" 
                : employee.workload > 50 
                  ? "bg-yellow-500" 
                  : "bg-green-500"
            }
          />
          <span className="text-sm">{employee.workload}%</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">{employee.tasksCompleted}</span>
          <span className="text-muted-foreground text-sm">/ {employee.tasksCompleted + employee.tasksPending}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex items-center gap-2">
              <User size={14} />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Mail size={14} />
              Send Email
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <MessageSquare size={14} />
              Message
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 text-red-600">
              <AlertTriangle size={14} />
              Report Issue
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};

const EmployeesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('grid');
  const [filterDepartment, setFilterDepartment] = useState('all');
  
  // Filter employees based on search query and department filter
  const filteredEmployees = employeesMock.filter(employee => {
    // Apply department filter
    if (filterDepartment !== 'all' && employee.department.toLowerCase() !== filterDepartment) {
      return false;
    }
    
    // Apply search query
    if (searchQuery && !employee.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <div className="w-full md:w-auto flex flex-wrap gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search employees..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Filter size={16} />
                  <span className="hidden md:inline">Department</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setFilterDepartment('all')}>
                  All Departments
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterDepartment('operations')}>
                  Operations
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterDepartment('engineering')}>
                  Engineering
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterDepartment('marketing')}>
                  Marketing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterDepartment('design')}>
                  Design
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterDepartment('human resources')}>
                  Human Resources
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <Plus size={16} className="mr-1" />
              Add Employee
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="team" className="w-full">
          <TabsList>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="team" className="mt-6">
            <div className="flex justify-end mb-4">
              <div className="flex border rounded-md overflow-hidden">
                <button
                  className={`px-3 py-1 text-sm ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
                  onClick={() => setView('grid')}
                >
                  Grid
                </button>
                <button
                  className={`px-3 py-1 text-sm ${view === 'table' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
                  onClick={() => setView('table')}
                >
                  Table
                </button>
              </div>
            </div>
            
            {view === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEmployees.map(employee => (
                  <EmployeeCard key={employee.id} employee={employee} />
                ))}
                {filteredEmployees.length === 0 && (
                  <div className="col-span-full py-10 text-center">
                    <p className="text-muted-foreground">No employees found matching your criteria.</p>
                  </div>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left py-3 px-4">Employee</th>
                          <th className="text-left py-3 px-4">Role</th>
                          <th className="text-left py-3 px-4">Department</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Workload</th>
                          <th className="text-left py-3 px-4">Tasks</th>
                          <th className="text-right py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEmployees.map(employee => (
                          <EmployeeRow key={employee.id} employee={employee} />
                        ))}
                        {filteredEmployees.length === 0 && (
                          <tr>
                            <td colSpan={7} className="py-10 text-center text-muted-foreground">
                              No employees found matching your criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="departments" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left py-3 px-4">Department</th>
                        <th className="text-left py-3 px-4">Employees</th>
                        <th className="text-left py-3 px-4">Active Projects</th>
                        <th className="text-left py-3 px-4">Completion Rate</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentSummary.map((dept, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{dept.name}</td>
                          <td className="py-3 px-4">{dept.employees}</td>
                          <td className="py-3 px-4">{dept.activeProjects}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Progress 
                                value={dept.completionRate} 
                                className="h-2 w-24" 
                                indicatorClassName={
                                  dept.completionRate > 80 
                                    ? "bg-green-500" 
                                    : dept.completionRate > 60 
                                      ? "bg-yellow-500" 
                                      : "bg-red-500"
                                }
                              />
                              <span className="text-sm">{dept.completionRate}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm">View Details</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departmentSummary.map((dept, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{dept.name}</span>
                          <span className="text-sm text-muted-foreground">{dept.employees} employees</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${(dept.employees / employeesMock.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Workload Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Overloaded (>75%)</h4>
                      <div className="flex flex-wrap gap-2">
                        {employeesMock
                          .filter(emp => emp.workload > 75)
                          .map(emp => (
                            <div key={emp.id} className="flex items-center gap-2 bg-muted p-2 rounded">
                              <Avatar className={`h-6 w-6 ${emp.avatarColor}`}>
                                <span className="text-[10px] text-white">{emp.avatar}</span>
                              </Avatar>
                              <span className="text-sm">{emp.name}</span>
                              <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500">
                                {emp.workload}%
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Balanced (25-75%)</h4>
                      <div className="flex flex-wrap gap-2">
                        {employeesMock
                          .filter(emp => emp.workload >= 25 && emp.workload <= 75)
                          .map(emp => (
                            <div key={emp.id} className="flex items-center gap-2 bg-muted p-2 rounded">
                              <Avatar className={`h-6 w-6 ${emp.avatarColor}`}>
                                <span className="text-[10px] text-white">{emp.avatar}</span>
                              </Avatar>
                              <span className="text-sm">{emp.name}</span>
                              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
                                {emp.workload}%
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Available (<25%)</h4>
                      <div className="flex flex-wrap gap-2">
                        {employeesMock
                          .filter(emp => emp.workload < 25)
                          .map(emp => (
                            <div key={emp.id} className="flex items-center gap-2 bg-muted p-2 rounded">
                              <Avatar className={`h-6 w-6 ${emp.avatarColor}`}>
                                <span className="text-[10px] text-white">{emp.avatar}</span>
                              </Avatar>
                              <span className="text-sm">{emp.name}</span>
                              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500">
                                {emp.workload}%
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default EmployeesPage;
