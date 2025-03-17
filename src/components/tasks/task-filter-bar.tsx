
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  ChevronDown, 
  Filter, 
  SlidersHorizontal,
  User
} from "lucide-react";
import { Employee } from '@/components/employees/employee-profile';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TaskFilterBarProps {
  selectedPriority: string | null;
  selectedEmployee: string | null;
  showThisWeek: boolean;
  onPriorityChange: (priority: string) => void;
  onEmployeeChange: (employeeId: string | null) => void;
  onWeekChange: () => void;
  onClearFilters: () => void;
  employees: Employee[];
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  selectedPriority,
  selectedEmployee,
  showThisWeek,
  onPriorityChange,
  onEmployeeChange,
  onWeekChange,
  onClearFilters,
  employees
}) => {
  // Get selected employee data
  const getSelectedEmployee = () => {
    if (!selectedEmployee) return null;
    return employees.find(e => e.id === selectedEmployee);
  };
  
  const selectedEmployeeData = getSelectedEmployee();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-1">
          <Filter size={16} />
          <span className="hidden md:inline">Filter</span>
          {(selectedPriority || selectedEmployee || showThisWeek) && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 inline-flex items-center justify-center ml-1">
              {(selectedPriority ? 1 : 0) + (selectedEmployee ? 1 : 0) + (showThisWeek ? 1 : 0)}
            </span>
          )}
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={onWeekChange}>
          <Calendar size={16} className="mr-2" />
          <span>Due this week</span>
          {showThisWeek && <CheckCircle2 size={16} className="ml-auto text-green-500" />}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <AlertTriangle size={16} className="mr-2" />
            <span>Priority</span>
            {selectedPriority && <span className="ml-auto text-xs capitalize">{selectedPriority}</span>}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => onPriorityChange('high')}>
              <span>High priority</span>
              {selectedPriority === 'high' && <CheckCircle2 size={16} className="ml-auto text-green-500" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPriorityChange('medium')}>
              <span>Medium priority</span>
              {selectedPriority === 'medium' && <CheckCircle2 size={16} className="ml-auto text-green-500" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPriorityChange('low')}>
              <span>Low priority</span>
              {selectedPriority === 'low' && <CheckCircle2 size={16} className="ml-auto text-green-500" />}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <User size={16} className="mr-2" />
            <span>Assigned to</span>
            {selectedEmployeeData && (
              <div className="ml-auto flex items-center gap-1.5">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className={selectedEmployeeData.color}>
                    {selectedEmployeeData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="max-h-[300px] overflow-y-auto">
            <DropdownMenuItem onClick={() => onEmployeeChange(null)}>
              <span>Show all</span>
              {!selectedEmployee && <CheckCircle2 size={16} className="ml-auto text-green-500" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            
            {/* Group employees by department */}
            {Object.entries(
              employees.reduce((acc, employee) => {
                if (!acc[employee.department]) {
                  acc[employee.department] = [];
                }
                acc[employee.department].push(employee);
                return acc;
              }, {} as Record<string, Employee[]>)
            ).map(([department, deptEmployees]) => (
              <React.Fragment key={department}>
                <DropdownMenuItem disabled className="opacity-50 font-medium">
                  {department}
                </DropdownMenuItem>
                
                {deptEmployees.map((employee) => (
                  <DropdownMenuItem 
                    key={employee.id} 
                    onClick={() => onEmployeeChange(employee.id)}
                    className="pl-6"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className={employee.color}>
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{employee.name}</span>
                    </div>
                    {selectedEmployee === employee.id && <CheckCircle2 size={16} className="ml-auto text-green-500" />}
                  </DropdownMenuItem>
                ))}
              </React.Fragment>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onClearFilters}>
          <SlidersHorizontal size={16} className="mr-2" />
          Clear all filters
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
