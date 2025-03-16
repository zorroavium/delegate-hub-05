
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useEmployeeStore, Employee } from '@/store/useEmployeeStore';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function EmployeeManagement() {
  const { employees, addEmployee, updateEmployee, removeEmployee } = useEmployeeStore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Partial<Employee> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const colorOptions = [
    { value: 'bg-blue-500', label: 'Blue' },
    { value: 'bg-green-500', label: 'Green' },
    { value: 'bg-purple-500', label: 'Purple' },
    { value: 'bg-red-500', label: 'Red' },
    { value: 'bg-yellow-500', label: 'Yellow' },
    { value: 'bg-indigo-500', label: 'Indigo' },
    { value: 'bg-pink-500', label: 'Pink' },
  ];

  const departmentOptions = [
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Design', label: 'Design' },
    { value: 'Product', label: 'Product' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Sales', label: 'Sales' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'on-leave', label: 'On Leave' },
  ];

  const handleNewEmployee = () => {
    setEditingEmployee({
      name: '',
      role: '',
      department: 'Engineering',
      email: '',
      phone: '',
      location: '',
      avatar: '',
      color: 'bg-blue-500',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      skills: [],
    });
    setIsEditing(false);
    setOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee({ ...employee });
    setIsEditing(true);
    setOpen(true);
  };

  const handleSaveEmployee = () => {
    if (!editingEmployee || !editingEmployee.name || !editingEmployee.role) {
      toast({
        title: "Error",
        description: "Name and role are required",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing && editingEmployee.id) {
        updateEmployee(editingEmployee.id, editingEmployee);
        toast({
          title: "Success",
          description: "Employee updated successfully",
        });
      } else {
        // Generate avatar from name if not provided
        if (!editingEmployee.avatar) {
          const nameParts = editingEmployee.name.split(' ');
          const avatar = nameParts.map(part => part[0]).join('').toUpperCase();
          editingEmployee.avatar = avatar;
        }
        
        addEmployee(editingEmployee as Omit<Employee, 'id'>);
        toast({
          title: "Success",
          description: "Employee added successfully",
        });
      }
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save employee",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmployee = (id: string) => {
    try {
      removeEmployee(id);
      toast({
        title: "Success",
        description: "Employee removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove employee",
        variant: "destructive",
      });
    }
  };

  const handleSkillChange = (skillsText: string) => {
    if (editingEmployee) {
      const skillsArray = skillsText.split(',').map(skill => skill.trim()).filter(Boolean);
      setEditingEmployee({ ...editingEmployee, skills: skillsArray });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingEmployee) {
      setEditingEmployee({ ...editingEmployee, [e.target.name]: e.target.value });
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    if (editingEmployee) {
      setEditingEmployee({ ...editingEmployee, [field]: value });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="space-y-1.5">
            <CardTitle>Employees Management</CardTitle>
            <CardDescription>
              Add, edit and remove employees from your organization
            </CardDescription>
            </div>
          </div>
          <Button onClick={handleNewEmployee}>
            <Plus size={16} className="mr-2" />
            Add Employee
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {employees.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No employees found. Add an employee to get started.
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-3 text-left font-medium">Name</th>
                    <th className="p-3 text-left font-medium">Role</th>
                    <th className="p-3 text-left font-medium">Department</th>
                    <th className="p-3 text-left font-medium">Status</th>
                    <th className="p-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id} className="border-t">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${employee.color}`}>
                            {employee.avatar}
                          </div>
                          <span>{employee.name}</span>
                        </div>
                      </td>
                      <td className="p-3">{employee.role}</td>
                      <td className="p-3">{employee.department}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          employee.status === "active" ? "bg-green-100 text-green-800" : 
                          employee.status === "inactive" ? "bg-gray-100 text-gray-800" : 
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {employee.status.replace("-", " ")}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditEmployee(employee)}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteEmployee(employee.id)}
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update employee information and role in your organization.' 
                : 'Add a new employee to your organization.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Jane Doe" 
                  value={editingEmployee?.name || ''} 
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input 
                  id="role" 
                  name="role" 
                  placeholder="UI Designer" 
                  value={editingEmployee?.role || ''} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="jane@example.com" 
                  value={editingEmployee?.email || ''} 
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  placeholder="+1 (555) 123-4567" 
                  value={editingEmployee?.phone || ''} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('department', value)} 
                  defaultValue={editingEmployee?.department || 'Engineering'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('status', value as 'active' | 'inactive' | 'on-leave')} 
                  defaultValue={editingEmployee?.status || 'active'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                name="location" 
                placeholder="San Francisco, CA" 
                value={editingEmployee?.location || ''} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar Initials</Label>
                <Input 
                  id="avatar" 
                  name="avatar" 
                  placeholder="JD" 
                  maxLength={2} 
                  value={editingEmployee?.avatar || ''} 
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Avatar Color</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('color', value)} 
                  defaultValue={editingEmployee?.color || 'bg-blue-500'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Input 
                id="joinDate" 
                name="joinDate" 
                type="date" 
                value={editingEmployee?.joinDate || ''} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma separated)</Label>
              <Input 
                id="skills" 
                name="skills" 
                placeholder="React, TypeScript, UI Design" 
                value={editingEmployee?.skills?.join(', ') || ''} 
                onChange={(e) => handleSkillChange(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              <X size={16} className="mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveEmployee}>
              <Check size={16} className="mr-2" />
              {isEditing ? 'Update Employee' : 'Add Employee'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
