
import React from 'react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTaskStore } from '@/store/useTaskStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';

// Colors for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const TaskDistributionChart = () => {
  const { tasks } = useTaskStore();
  
  // Calculate task distribution by status
  const getTasksByStatus = () => {
    const statusCount: { [key: string]: number } = {};
    
    tasks.forEach(task => {
      if (statusCount[task.status]) {
        statusCount[task.status]++;
      } else {
        statusCount[task.status] = 1;
      }
    });
    
    return Object.keys(statusCount).map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
      tasks: statusCount[status]
    }));
  };
  
  // Calculate task distribution by priority
  const getTasksByPriority = () => {
    const priorityCount: { [key: string]: number } = {};
    
    tasks.forEach(task => {
      if (priorityCount[task.priority]) {
        priorityCount[task.priority]++;
      } else {
        priorityCount[task.priority] = 1;
      }
    });
    
    return Object.keys(priorityCount).map(priority => ({
      name: priority.charAt(0).toUpperCase() + priority.slice(1),
      tasks: priorityCount[priority]
    }));
  };
  
  const tasksByStatus = getTasksByStatus();
  const tasksByPriority = getTasksByPriority();
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Tasks by Status</CardTitle>
          <CardDescription>Distribution of tasks across different statuses</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={tasksByStatus}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tasks" fill="#8884d8" name="Number of Tasks" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Tasks by Priority</CardTitle>
          <CardDescription>Distribution of tasks across different priorities</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={tasksByPriority}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="tasks"
              >
                {tasksByPriority.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export const TeamPerformanceChart = () => {
  const { tasks } = useTaskStore();
  const { employees } = useEmployeeStore();
  
  // Calculate tasks completed by each employee
  const getTasksByEmployee = () => {
    const employeeTaskCount: { [key: string]: number } = {};
    const employeeCompletedCount: { [key: string]: number } = {};
    
    tasks.forEach(task => {
      const employeeName = task.assignee.name;
      
      if (employeeTaskCount[employeeName]) {
        employeeTaskCount[employeeName]++;
      } else {
        employeeTaskCount[employeeName] = 1;
      }
      
      if (task.status === 'completed') {
        if (employeeCompletedCount[employeeName]) {
          employeeCompletedCount[employeeName]++;
        } else {
          employeeCompletedCount[employeeName] = 1;
        }
      }
    });
    
    return Object.keys(employeeTaskCount)
      .map(name => ({
        name: name,
        assigned: employeeTaskCount[name],
        completed: employeeCompletedCount[name] || 0
      }))
      .sort((a, b) => b.assigned - a.assigned)
      .slice(0, 5); // Get top 5 employees by task count
  };
  
  // Calculate average completion time by department
  const getPerformanceByDepartment = () => {
    const departmentMap: Record<string, { totalTasks: number, completedTasks: number }> = {};
    
    employees.forEach(employee => {
      if (!departmentMap[employee.department]) {
        departmentMap[employee.department] = { totalTasks: 0, completedTasks: 0 };
      }
    });
    
    tasks.forEach(task => {
      const employeeDept = employees.find(e => e.id === task.assignee.id)?.department || 'Unknown';
      
      if (departmentMap[employeeDept]) {
        departmentMap[employeeDept].totalTasks++;
        
        if (task.status === 'completed') {
          departmentMap[employeeDept].completedTasks++;
        }
      }
    });
    
    return Object.keys(departmentMap).map(dept => ({
      name: dept,
      completionRate: departmentMap[dept].totalTasks > 0 
        ? Math.round((departmentMap[dept].completedTasks / departmentMap[dept].totalTasks) * 100) 
        : 0
    }));
  };
  
  const tasksByEmployee = getTasksByEmployee();
  const performanceByDepartment = getPerformanceByDepartment();
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Tasks by Employee</CardTitle>
          <CardDescription>Assigned vs completed tasks per employee</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={tasksByEmployee}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="assigned" fill="#8884d8" name="Tasks Assigned" />
              <Bar dataKey="completed" fill="#82ca9d" name="Tasks Completed" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Performance by Department</CardTitle>
          <CardDescription>Task completion rate per department</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={performanceByDepartment}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
              <Legend />
              <Bar dataKey="completionRate" fill="#82ca9d" name="Completion Rate (%)" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
