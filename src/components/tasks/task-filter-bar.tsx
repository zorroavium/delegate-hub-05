
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
import { Avatar } from '@/components/ui/avatar';

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
  // Get selected employee name
  const getSelectedEmployeeName = () => {
    if (!selectedEmployee) return null;
    const employee = employees.find(e => e.id === selectedEmployee);
    return employee ? employee.name : null;
  };
  
  // Group employees by department
  const groupedEmployees = employees.reduce((acc, employee) => {
    const department = employee.department || 'Other';
    if (!acc[department]) {
      acc[department] = [];
    }
    acc[department].push(employee);
    return acc;
  }, {} as Record<string, Employee[]>);
  
  // Sort departments alphabetically
  const departments = Object.keys(groupedEmployees).sort();
  
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
            {selectedEmployee && <span className="ml-auto text-xs truncate max-w-[80px]">{getSelectedEmployeeName()}</span>}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="max-h-[300px] overflow-y-auto">
            <DropdownMenuItem onClick={() => onEmployeeChange(null)}>
              <span>Show all</span>
              {!selectedEmployee && <CheckCircle2 size={16} className="ml-auto text-green-500" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            
            {departments.map(department => (
              <React.Fragment key={department}>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                  {department}
                </div>
                {groupedEmployees[department].map((employee) => (
                  <DropdownMenuItem key={employee.id} onClick={() => onEmployeeChange(employee.id)}>
                    <div className="flex items-center w-full">
                      <Avatar className={`h-6 w-6 mr-2 ${employee.color || 'bg-primary'}`}>
                        <div className="flex items-center justify-center w-full h-full text-white text-xs">
                          {employee.avatar || employee.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </Avatar>
                      <span className="truncate">{employee.name}</span>
                      {selectedEmployee === employee.id && <CheckCircle2 size={16} className="ml-auto text-green-500" />}
                    </div>
                  </DropdownMenuItem>
                ))}
                {department !== departments[departments.length - 1] && <DropdownMenuSeparator />}
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
