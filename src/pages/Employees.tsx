
import React, { useState } from "react";
import { SidebarLayout } from "@/components/layout/sidebar";
import { EmployeeProfile } from "@/components/employees/employee-profile";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { useTaskStore } from "@/store/useTaskStore";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, BarChart2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmployeesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const { employees } = useEmployeeStore();
  const { tasks } = useTaskStore();
  
  const handleEmployeeClick = (employee: any) => {
    setSelectedEmployee(employee);
  };
  
  const handleCloseProfile = () => {
    setSelectedEmployee(null);
  };

  // Calculate employee performance stats
  const getEmployeeStats = (employeeId: string) => {
    const employeeTasks = tasks.filter(task => task.assignee.id === employeeId);
    const totalTasks = employeeTasks.length;
    const completedTasks = employeeTasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = employeeTasks.filter(task => task.status === 'in-progress').length;
    const pendingTasks = employeeTasks.filter(task => task.status === 'pending').length;
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  };
  
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
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
            </div>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((employee) => {
              const stats = getEmployeeStats(employee.id);
              return (
                <div 
                  key={employee.id} 
                  className="glass-card p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${employee.color}`}>
                      {employee.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{employee.name}</h3>
                      <p className="text-muted-foreground">{employee.role}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Department:</span> {employee.department}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Location:</span> {employee.location || 'N/A'}
                    </p>
                  </div>
                  
                  <div className="mt-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      employee.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : 
                      employee.status === "inactive" ? "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400" : 
                      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}>
                      {employee.status.replace("-", " ")}
                    </span>
                  </div>
                  
                  {/* Performance metrics */}
                  <div className="mt-5 pt-4 border-t border-border">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">Task Completion</h4>
                      <span className="text-sm font-medium">{stats.completionRate}%</span>
                    </div>
                    <Progress value={stats.completionRate} className="h-2 mb-3" />
                    
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div className="flex flex-col items-center justify-center p-2 bg-muted/60 rounded-md">
                        <div className="flex items-center gap-1 mb-1">
                          <Clock size={14} className="text-blue-500" />
                          <span className="text-xs font-medium">Pending</span>
                        </div>
                        <span className="text-lg font-bold">{stats.pendingTasks}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 bg-muted/60 rounded-md">
                        <div className="flex items-center gap-1 mb-1">
                          <BarChart2 size={14} className="text-amber-500" />
                          <span className="text-xs font-medium">Active</span>
                        </div>
                        <span className="text-lg font-bold">{stats.inProgressTasks}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 bg-muted/60 rounded-md">
                        <div className="flex items-center gap-1 mb-1">
                          <CheckCircle size={14} className="text-green-500" />
                          <span className="text-xs font-medium">Done</span>
                        </div>
                        <span className="text-lg font-bold">{stats.completedTasks}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
                              <div className="flex gap-1 items-center">
                                <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                  {stats.pendingTasks}
                                </span>
                                <Clock size={14} className="text-blue-500" />
                              </div>
                              <div className="flex gap-1 items-center">
                                <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                  {stats.inProgressTasks}
                                </span>
                                <BarChart2 size={14} className="text-amber-500" />
                              </div>
                              <div className="flex gap-1 items-center">
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
      
      {/* Employee Profile Dialog */}
      {selectedEmployee && (
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
