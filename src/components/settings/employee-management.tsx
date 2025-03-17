
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useEmployeeStore, Employee } from '@/store/useEmployeeStore';
import { departmentOptions } from '@/services/employeeService';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash, Plus, ArrowUpDown, Search, UserPlus, DownloadCloud, Filter } from 'lucide-react';
import { z } from 'zod';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Define validation schema
const employeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  department: z.string().min(1, "Department is required"),
  status: z.enum(["active", "inactive", "on-leave"]),
  phone: z.string().optional(),
  skills: z.array(z.string()),
  location: z.string().min(1, "Location is required"),
  joinDate: z.string().min(1, "Join date is required")
});

type SortField = 'name' | 'role' | 'department' | 'status' | 'joinDate';
type SortDirection = 'asc' | 'desc';

export const EmployeeManagement = () => {
  const { employees, addEmployee, updateEmployee, removeEmployee } = useEmployeeStore();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editFormErrors, setEditFormErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{field: SortField, direction: SortDirection}>({
    field: 'name',
    direction: 'asc'
  });
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    status: 'active' as 'active' | 'inactive' | 'on-leave',
    phone: '',
    skills: [] as string[],
    avatar: '',
    color: 'bg-blue-500',
    location: '',
    joinDate: new Date().toISOString().split('T')[0]
  });

  // Sort and filter employees
  const filteredEmployees = useMemo(() => {
    let result = [...employees];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(employee => 
        employee.name.toLowerCase().includes(query) || 
        employee.email.toLowerCase().includes(query) ||
        employee.role.toLowerCase().includes(query)
      );
    }
    
    // Apply department filter
    if (filterDepartment !== "all") {
      result = result.filter(employee => employee.department === filterDepartment);
    }
    
    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter(employee => employee.status === filterStatus);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch(sortConfig.field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'role':
          comparison = a.role.localeCompare(b.role);
          break;
        case 'department':
          comparison = a.department.localeCompare(b.department);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'joinDate':
          comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
          break;
        default:
          comparison = 0;
      }
      
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [employees, searchQuery, filterDepartment, filterStatus, sortConfig]);

  const handleSort = (field: SortField) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const validateForm = (data: any, setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>) => {
    try {
      employeeSchema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleAddEmployee = () => {
    if (!validateForm(newEmployee, setFormErrors)) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive"
      });
      return;
    }

    const avatarInitials = newEmployee.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();

    const employee = {
      ...newEmployee,
      avatar: avatarInitials,
    };

    addEmployee(employee);
    toast({
      title: "Employee added",
      description: `${newEmployee.name} has been added to the team.`,
    });
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditEmployee = () => {
    if (!selectedEmployee) return;

    if (!validateForm(selectedEmployee, setEditFormErrors)) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive"
      });
      return;
    }

    updateEmployee(selectedEmployee.id, selectedEmployee);
    toast({
      title: "Employee updated",
      description: `${selectedEmployee.name}'s information has been updated.`,
    });
    setIsEditDialogOpen(false);
  };

  const handleDeleteEmployee = () => {
    if (!selectedEmployee) return;

    removeEmployee(selectedEmployee.id);
    toast({
      title: "Employee removed",
      description: `${selectedEmployee.name} has been removed from the team.`,
    });
    setIsDeleteDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewEmployee(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSelectedEmployee(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSelectChange = (name: string, value: string) => {
    setSelectedEmployee(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setNewEmployee({
      name: '',
      email: '',
      role: '',
      department: '',
      status: 'active' as 'active' | 'inactive' | 'on-leave',
      phone: '',
      skills: [] as string[],
      avatar: '',
      color: 'bg-blue-500',
      location: '',
      joinDate: new Date().toISOString().split('T')[0]
    });
    setFormErrors({});
  };

  const openEditDialog = (employee: any) => {
    setSelectedEmployee({ ...employee });
    setIsEditDialogOpen(true);
    setEditFormErrors({});
  };

  const openDeleteDialog = (employee: any) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const skillsArray = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
    
    if (isEdit && selectedEmployee) {
      setSelectedEmployee(prev => ({
        ...prev,
        skills: skillsArray,
      }));
    } else {
      setNewEmployee(prev => ({
        ...prev,
        skills: skillsArray,
      }));
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Role", "Department", "Email", "Status", "Join Date"];
    
    // Convert the employee data to CSV rows
    const csvRows = [
      headers.join(','),
      ...filteredEmployees.map(employee => [
        employee.name,
        employee.role,
        employee.department,
        employee.email,
        employee.status,
        employee.joinDate
      ].join(','))
    ];
    
    // Create a Blob with the CSV content
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create a link to download the CSV file
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'employees.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export successful",
      description: "Employee data has been exported to CSV.",
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterDepartment("all");
    setFilterStatus("all");
    setSortConfig({
      field: 'name',
      direction: 'asc'
    });
  };

  // Get status badge color
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'on-leave':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get the avatar background color
  const getAvatarColor = (color: string) => {
    switch (color) {
      case 'bg-blue-500':
        return 'bg-blue-500 text-white';
      case 'bg-green-500':
        return 'bg-green-500 text-white';
      case 'bg-purple-500':
        return 'bg-purple-500 text-white';
      case 'bg-red-500':
        return 'bg-red-500 text-white';
      case 'bg-yellow-500':
        return 'bg-yellow-500 text-white';
      case 'bg-indigo-500':
        return 'bg-indigo-500 text-white';
      case 'bg-pink-500':
        return 'bg-pink-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Get sorted employees
  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) return <ArrowUpDown size={14} className="ml-1 opacity-50" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUpDown size={14} className="ml-1 text-blue-500" /> 
      : <ArrowUpDown size={14} className="ml-1 text-blue-500 rotate-180" />;
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl md:text-2xl text-primary">Employee Management</CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage your team members and their access to the system.
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-1"
              size="sm"
            >
              <UserPlus size={16} />
              <span className="ml-1">Add Employee</span>
            </Button>
            <Button
              onClick={exportToCSV}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <DownloadCloud size={16} />
              <span className="ml-1">Export CSV</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-[160px] text-sm">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Leadership">Leadership</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Audit & Assurance">Audit & Assurance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px] text-sm">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={clearFilters} className="text-sm flex items-center gap-1">
              <Filter size={14} />
              Clear
            </Button>
          </div>
        </div>

        {/* Table with enhanced UI */}
        <div className="rounded-md border overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow>
                <TableHead className="w-[250px] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleSort('name')}>
                  <div className="flex items-center">
                    Employee
                    {getSortIcon('name')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleSort('role')}>
                  <div className="flex items-center">
                    Role
                    {getSortIcon('role')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleSort('department')}>
                  <div className="flex items-center">
                    Department
                    {getSortIcon('department')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleSort('status')}>
                  <div className="flex items-center">
                    Status
                    {getSortIcon('status')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleSort('joinDate')}>
                  <div className="flex items-center">
                    Join Date
                    {getSortIcon('joinDate')}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className={getAvatarColor(employee.color)}>
                        <AvatarFallback>{employee.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{employee.name}</span>
                        <span className="text-xs text-muted-foreground">{employee.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {employee.department}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeStyle(employee.status)}>
                      {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(employee.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(employee)}
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-8 w-8"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(employee)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredEmployees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    {searchQuery || filterDepartment || filterStatus ? 
                      "No employees match the current filters" :
                      "No employees found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredEmployees.length} of {employees.length} employees
        </div>

        {/* Add Employee Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new team member.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    name="name"
                    value={newEmployee.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={formErrors.name ? "border-red-500" : ""}
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={handleInputChange}
                    placeholder="john.doe@example.com"
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
                  <Select
                    value={newEmployee.role}
                    onValueChange={(value) => handleSelectChange('role', value)}
                  >
                    <SelectTrigger id="role" className={formErrors.role ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Senior Partner">Senior Partner</SelectItem>
                      <SelectItem value="Partner">Partner</SelectItem>
                      <SelectItem value="Associate Partner">Associate Partner</SelectItem>
                      <SelectItem value="Operations Director">Operations Director</SelectItem>
                      <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                      <SelectItem value="Audit Manager">Audit Manager</SelectItem>
                      <SelectItem value="Assistant Manager">Assistant Manager</SelectItem>
                      <SelectItem value="Associate">Associate</SelectItem>
                      <SelectItem value="Audit Assistant">Audit Assistant</SelectItem>
                      <SelectItem value="Articled Audit Assistant">Articled Audit Assistant</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.role && <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
                  <Select
                    value={newEmployee.department}
                    onValueChange={(value) => handleSelectChange('department', value)}
                  >
                    <SelectTrigger id="department" className={formErrors.department ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Leadership">Leadership</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Audit & Assurance">Audit & Assurance</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.department && <p className="text-red-500 text-xs mt-1">{formErrors.department}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                  <Select
                    value={newEmployee.status}
                    onValueChange={(value) => handleSelectChange('status', value as 'active' | 'inactive' | 'on-leave')}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="on-leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={newEmployee.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                  <Input
                    id="location"
                    name="location"
                    value={newEmployee.location}
                    onChange={handleInputChange}
                    placeholder="New York, NY"
                    className={formErrors.location ? "border-red-500" : ""}
                  />
                  {formErrors.location && <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joinDate">Join Date <span className="text-red-500">*</span></Label>
                  <Input
                    id="joinDate"
                    name="joinDate"
                    type="date"
                    value={newEmployee.joinDate}
                    onChange={handleInputChange}
                    className={formErrors.joinDate ? "border-red-500" : ""}
                  />
                  {formErrors.joinDate && <p className="text-red-500 text-xs mt-1">{formErrors.joinDate}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input
                  id="skills"
                  name="skills"
                  value={Array.isArray(newEmployee.skills) ? newEmployee.skills.join(', ') : ''}
                  onChange={(e) => handleSkillsChange(e)}
                  placeholder="Auditing, Tax Planning, Financial Analysis"
                />
                <p className="text-xs text-muted-foreground">Separate multiple skills with commas</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddEmployee}>
                Add Employee
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Employee Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
              <DialogDescription>
                Update employee information.
              </DialogDescription>
            </DialogHeader>
            {selectedEmployee && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Full Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="edit-name"
                      name="name"
                      value={selectedEmployee.name}
                      onChange={handleEditInputChange}
                      className={editFormErrors.name ? "border-red-500" : ""}
                    />
                    {editFormErrors.name && <p className="text-red-500 text-xs mt-1">{editFormErrors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email <span className="text-red-500">*</span></Label>
                    <Input
                      id="edit-email"
                      name="email"
                      type="email"
                      value={selectedEmployee.email}
                      onChange={handleEditInputChange}
                      className={editFormErrors.email ? "border-red-500" : ""}
                    />
                    {editFormErrors.email && <p className="text-red-500 text-xs mt-1">{editFormErrors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Role <span className="text-red-500">*</span></Label>
                    <Select
                      value={selectedEmployee.role}
                      onValueChange={(value) => handleEditSelectChange('role', value)}
                    >
                      <SelectTrigger id="edit-role" className={editFormErrors.role ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Senior Partner">Senior Partner</SelectItem>
                        <SelectItem value="Partner">Partner</SelectItem>
                        <SelectItem value="Associate Partner">Associate Partner</SelectItem>
                        <SelectItem value="Operations Director">Operations Director</SelectItem>
                        <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                        <SelectItem value="Audit Manager">Audit Manager</SelectItem>
                        <SelectItem value="Assistant Manager">Assistant Manager</SelectItem>
                        <SelectItem value="Associate">Associate</SelectItem>
                        <SelectItem value="Audit Assistant">Audit Assistant</SelectItem>
                        <SelectItem value="Articled Audit Assistant">Articled Audit Assistant</SelectItem>
                      </SelectContent>
                    </Select>
                    {editFormErrors.role && <p className="text-red-500 text-xs mt-1">{editFormErrors.role}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-department">Department <span className="text-red-500">*</span></Label>
                    <Select
                      value={selectedEmployee.department}
                      onValueChange={(value) => handleEditSelectChange('department', value)}
                    >
                      <SelectTrigger id="edit-department" className={editFormErrors.department ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Leadership">Leadership</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Audit & Assurance">Audit & Assurance</SelectItem>
                      </SelectContent>
                    </Select>
                    {editFormErrors.department && <p className="text-red-500 text-xs mt-1">{editFormErrors.department}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status <span className="text-red-500">*</span></Label>
                    <Select
                      value={selectedEmployee.status}
                      onValueChange={(value) => handleEditSelectChange('status', value as 'active' | 'inactive' | 'on-leave')}
                    >
                      <SelectTrigger id="edit-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="on-leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input
                      id="edit-phone"
                      name="phone"
                      value={selectedEmployee.phone}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-location">Location <span className="text-red-500">*</span></Label>
                    <Input
                      id="edit-location"
                      name="location"
                      value={selectedEmployee.location}
                      onChange={handleEditInputChange}
                      className={editFormErrors.location ? "border-red-500" : ""}
                    />
                    {editFormErrors.location && <p className="text-red-500 text-xs mt-1">{editFormErrors.location}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-joinDate">Join Date <span className="text-red-500">*</span></Label>
                    <Input
                      id="edit-joinDate"
                      name="joinDate"
                      type="date"
                      value={selectedEmployee.joinDate?.split('T')[0]}
                      onChange={handleEditInputChange}
                      className={editFormErrors.joinDate ? "border-red-500" : ""}
                    />
                    {editFormErrors.joinDate && <p className="text-red-500 text-xs mt-1">{editFormErrors.joinDate}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-skills">Skills (comma separated)</Label>
                  <Input
                    id="edit-skills"
                    name="skills"
                    value={Array.isArray(selectedEmployee.skills) ? selectedEmployee.skills.join(', ') : ''}
                    onChange={(e) => handleSkillsChange(e, true)}
                    placeholder="Auditing, Tax Planning, Financial Analysis"
                  />
                  <p className="text-xs text-muted-foreground">Separate multiple skills with commas</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditEmployee}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Employee Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-red-600">Delete Employee</DialogTitle>
              <DialogDescription className="text-center">
                Are you sure you want to delete this employee? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedEmployee && (
              <div className="py-6 flex flex-col items-center justify-center">
                <Avatar className={`h-16 w-16 ${getAvatarColor(selectedEmployee.color)}`}>
                  <AvatarFallback className="text-xl">{selectedEmployee.avatar}</AvatarFallback>
                </Avatar>
                <p className="text-center mt-4 font-medium text-lg">{selectedEmployee.name}</p>
                <p className="text-center text-muted-foreground">{selectedEmployee.role}</p>
                <p className="text-center text-muted-foreground">{selectedEmployee.email}</p>
              </div>
            )}
            <DialogFooter className="flex sm:justify-center gap-2">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteEmployee}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
