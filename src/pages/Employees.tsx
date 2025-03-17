import React, { useState, useEffect } from "react";
import { SidebarLayout } from "@/components/layout/sidebar";
import { EmployeeProfile } from "@/components/employees/employee-profile";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { useTaskStore } from "@/store/useTaskStore";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, BarChart2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { EmployeeCard } from "@/components/employees/employee-card";

const EmployeesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const { employees } = useEmployeeStore();
  const { tasks } = useTaskStore();
  const navigate = useNavigate();
  
  const handleEmployeeClick = (employee: any) => {
    if (viewMode === "list") {
      setSelectedEmployee(employee);
    }
  };
  
  const handleCloseProfile = () => {
    setSelectedEmployee(null);
  };

  const getEmployeeStats = (employeeId: string) => {
    const savedStats = localStorage.getItem(`employee-stats-${employeeId}`);
    const hasSavedStats = savedStats !== null;
    
    if (hasSavedStats) {
      return JSON.parse(savedStats);
    }
    
    const employeeTasks = tasks.filter(task => task.assignee.id === employeeId);
    const totalTasks = employeeTasks.length || Math.floor(Math.random() * 8) + 2;
    
    const completedTasks = Math.floor(totalTasks * (0.2 + Math.random() * 0.6));
    const inProgressTasks = Math.floor((totalTasks - completedTasks) * 0.6);
    const pendingTasks = totalTasks - completedTasks - inProgressTasks;
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const stats = {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      completionRate
    };
    
    localStorage.setItem(`employee-stats-${employeeId}`, JSON.stringify(stats));
    
    return stats;
  };
  
  useEffect(() => {
    employees.forEach(employee => {
      const employeeTasks = tasks.filter(task => task.assignee.id === employee.id);
      const totalTasks = employeeTasks.length;
      
      if (totalTasks > 0) {
        const completedTasks = employeeTasks.filter(task => task.status === 'completed').length;
        const inProgressTasks = employeeTasks.filter(task => task.status === 'in-progress').length;
        const pendingTasks = employeeTasks.filter(task => task.status === 'pending').length;
        const completionRate = Math.round((completedTasks / totalTasks) * 100);
        
        const stats = { totalTasks, completedTasks, inProgressTasks, pendingTasks, completionRate };
        localStorage.setItem(`employee-stats-${employee.id}`, JSON.stringify(stats));
      }
    });
  }, [employees, tasks]);
  
  return (
    <SidebarLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Employees</h1>
          <div className="flex items-center gap-4">
            <div className="space-x-2 bg-muted/60 rounded-md p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-secondary text-secondary-foreground" : ""}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-secondary text-secondary-foreground" : ""}
              >
                List
              </Button>
            </div>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((employee) => (
              <div key={employee.id}>
                <EmployeeCard employee={employee} />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-6 py-3 text-left text-xs font-medium">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium">
                      Tasks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium">
                      Completion Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {employees.map((employee) => {
                    const stats = getEmployeeStats(employee.id);
                    return (
                      <tr 
                        key={employee.id}
                        className="hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => handleEmployeeClick(employee)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${employee.color}`}>
                              {employee.avatar}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium">{employee.name}</div>
                              <div className="text-sm text-muted-foreground">{employee.role}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">{employee.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="flex items-center gap-2">
                              <div 
                                className="flex gap-1 items-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 px-2 py-1 rounded"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/tasks?status=pending&employee=${employee.id}`);
                                }}
                              >
                                <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                  {stats.pendingTasks}
                                </span>
                                <Clock size={14} className="text-blue-500" />
                              </div>
                              <div 
                                className="flex gap-1 items-center cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 px-2 py-1 rounded"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/tasks?status=in-progress&employee=${employee.id}`);
                                }}
                              >
                                <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                  {stats.inProgressTasks}
                                </span>
                                <BarChart2 size={14} className="text-amber-500" />
                              </div>
                              <div 
                                className="flex gap-1 items-center cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 px-2 py-1 rounded"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/tasks?status=completed&employee=${employee.id}`);
                                }}
                              >
                                <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                  {stats.completedTasks}
                                </span>
                                <CheckCircle size={14} className="text-green-500" />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Progress value={stats.completionRate} className="h-2 w-24" />
                            <span className="text-sm">{stats.completionRate}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            employee.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : 
                            employee.status === "inactive" ? "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400" : 
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}>
                            {employee.status.replace("-", " ")}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {selectedEmployee && viewMode === "list" && (
        <EmployeeProfile 
          employee={selectedEmployee}
          isOpen={!!selectedEmployee}
          onClose={handleCloseProfile}
        />
      )}
    </SidebarLayout>
  );
};

export default EmployeesPage;
