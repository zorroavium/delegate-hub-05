
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useEmployeeStore, Employee } from '@/store/useEmployeeStore';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash, Plus } from 'lucide-react';
import { z } from 'zod';

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

export const EmployeeManagement = () => {
  const { employees, addEmployee, updateEmployee, removeEmployee } = useEmployeeStore();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editFormErrors, setEditFormErrors] = useState<Record<string, string>>({});
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Employee Management</CardTitle>
            <CardDescription>
              Manage your team members and their access to the system.
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <Plus size={16} />
            Add Employee
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      employee.status === 'active' ? 'bg-green-100 text-green-800' : 
                      employee.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(employee)}
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openDeleteDialog(employee)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {employees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                    No employees found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Employee</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this employee? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedEmployee && (
              <div className="py-4">
                <p className="text-center font-medium">{selectedEmployee.name}</p>
                <p className="text-center text-muted-foreground">{selectedEmployee.email}</p>
              </div>
            )}
            <DialogFooter>
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
