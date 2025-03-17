
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash, Plus } from 'lucide-react';

export const EmployeeManagement = () => {
  const { employees, addEmployee, updateEmployee, removeEmployee } = useEmployeeStore();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    status: 'active',
    phone: '',
    skills: [],
    avatar: '',
    color: 'bg-blue-500',
    location: '',
    joinDate: new Date().toISOString().split('T')[0]
  });

  const handleAddEmployee = () => {
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
      status: 'active',
      phone: '',
      skills: [],
      avatar: '',
      color: 'bg-blue-500',
      location: '',
      joinDate: new Date().toISOString().split('T')[0]
    });
  };

  const openEditDialog = (employee: any) => {
    setSelectedEmployee({ ...employee });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (employee: any) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
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
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newEmployee.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={handleInputChange}
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newEmployee.role}
                    onValueChange={(value) => handleSelectChange('role', value)}
                  >
                    <SelectTrigger id="role">
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={newEmployee.department}
                    onValueChange={(value) => handleSelectChange('department', value)}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Leadership">Leadership</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Audit & Assurance">Audit & Assurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newEmployee.status}
                    onValueChange={(value) => handleSelectChange('status', value)}
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
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={newEmployee.location}
                    onChange={handleInputChange}
                    placeholder="New York, NY"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joinDate">Join Date</Label>
                  <Input
                    id="joinDate"
                    name="joinDate"
                    type="date"
                    value={newEmployee.joinDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input
                  id="skills"
                  name="skills"
                  value={Array.isArray(newEmployee.skills) ? newEmployee.skills.join(', ') : ''}
                  onChange={(e) => {
                    const skillsArray = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
                    setNewEmployee(prev => ({
                      ...prev,
                      skills: skillsArray,
                    }));
                  }}
                  placeholder="Auditing, Tax Planning, Financial Analysis"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
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
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      name="name"
                      value={selectedEmployee.name}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      name="email"
                      type="email"
                      value={selectedEmployee.email}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Role</Label>
                    <Select
                      value={selectedEmployee.role}
                      onValueChange={(value) => handleEditSelectChange('role', value)}
                    >
                      <SelectTrigger id="edit-role">
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-department">Department</Label>
                    <Select
                      value={selectedEmployee.department}
                      onValueChange={(value) => handleEditSelectChange('department', value)}
                    >
                      <SelectTrigger id="edit-department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Leadership">Leadership</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Audit & Assurance">Audit & Assurance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={selectedEmployee.status}
                      onValueChange={(value) => handleEditSelectChange('status', value)}
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
                    <Label htmlFor="edit-location">Location</Label>
                    <Input
                      id="edit-location"
                      name="location"
                      value={selectedEmployee.location}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-joinDate">Join Date</Label>
                    <Input
                      id="edit-joinDate"
                      name="joinDate"
                      type="date"
                      value={selectedEmployee.joinDate?.split('T')[0]}
                      onChange={handleEditInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-skills">Skills (comma separated)</Label>
                  <Input
                    id="edit-skills"
                    name="skills"
                    value={Array.isArray(selectedEmployee.skills) ? selectedEmployee.skills.join(', ') : ''}
                    onChange={(e) => {
                      const skillsArray = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
                      setSelectedEmployee(prev => ({
                        ...prev,
                        skills: skillsArray,
                      }));
                    }}
                  />
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
