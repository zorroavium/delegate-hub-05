
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Briefcase, Calendar, User } from 'lucide-react';
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  avatar?: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  skills: string[];
  color?: string;
}

interface EmployeeProfileProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
}

export const EmployeeProfile: React.FC<EmployeeProfileProps> = ({
  employee,
  isOpen,
  onClose
}) => {
  const { updateEmployee } = useEmployeeStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const statusColors = {
    'active': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    'on-leave': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
  };

  const handleEditEmployee = () => {
    // Close the profile dialog
    onClose();
    
    // Navigate to the settings page and open the employee management section
    navigate("/settings");
    
    // Set a timeout to allow the page to render before triggering the edit
    setTimeout(() => {
      const event = new CustomEvent("edit-employee", { detail: { employeeId: employee.id } });
      document.dispatchEvent(event);
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Employee Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <Avatar className={`h-20 w-20 ${employee.color || 'bg-primary'}`}>
              {employee.avatar ? (
                <span className="text-xl text-white">{employee.avatar}</span>
              ) : (
                <span className="text-xl text-white">{employee.name.split(' ').map(n => n[0]).join('')}</span>
              )}
            </Avatar>
            
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">{employee.name}</h2>
              <p className="text-muted-foreground">{employee.role}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <Badge className={statusColors[employee.status]}>
                  {employee.status.replace('-', ' ')}
                </Badge>
                <Badge variant="outline">{employee.department}</Badge>
              </div>
            </div>
          </div>
          
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <a href={`mailto:${employee.email}`} className="text-primary hover:underline">
                  {employee.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <a href={`tel:${employee.phone}`} className="text-primary hover:underline">
                  {employee.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{employee.location || 'Not specified'}</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Employment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Department</p>
                  <p className="text-muted-foreground">{employee.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Role</p>
                  <p className="text-muted-foreground">{employee.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Join Date</p>
                  <p className="text-muted-foreground">{employee.joinDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {employee.skills && employee.skills.length > 0 ? (
                  employee.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">No skills listed</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={handleEditEmployee}>Edit Profile</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
