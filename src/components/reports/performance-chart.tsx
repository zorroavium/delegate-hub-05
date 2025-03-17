
import React, { useEffect } from 'react';
import { 
  BarChart as RechartsBarChart, 
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
import { ClickableBar } from './clickable-bar';
import { useNavigate } from 'react-router-dom';

// Colors for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const TaskDistributionChart = () => {
  const { tasks } = useTaskStore();
  const navigate = useNavigate();
  
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
    
    // Ensure we always have some data for demonstration
    if (Object.keys(statusCount).length === 0) {
      return [
        { name: 'Pending', tasks: 5, originalStatus: 'pending' },
        { name: 'In Progress', tasks: 3, originalStatus: 'in-progress' },
        { name: 'Completed', tasks: 2, originalStatus: 'completed' }
      ];
    }
    
    return Object.keys(statusCount).map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
      tasks: statusCount[status],
      originalStatus: status // Keep the original status ID for navigation
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
    
    // Ensure we always have some data for demonstration
    if (Object.keys(priorityCount).length === 0) {
      return [
        { name: 'High', tasks: 3, originalPriority: 'high' },
        { name: 'Medium', tasks: 5, originalPriority: 'medium' },
        { name: 'Low', tasks: 2, originalPriority: 'low' }
      ];
    }
    
    return Object.keys(priorityCount).map(priority => ({
      name: priority.charAt(0).toUpperCase() + priority.slice(1),
      tasks: priorityCount[priority],
      originalPriority: priority // Keep the original priority for navigation
    }));
  };
  
  const tasksByStatus = getTasksByStatus();
  const tasksByPriority = getTasksByPriority();
  
  // Handle chart clicks to navigate to filtered tasks
  useEffect(() => {
    const handleChartClick = (event: CustomEvent) => {
      const { payload, dataKey } = event.detail;
      
      if (dataKey === 'tasks' && payload.originalStatus) {
        navigate(`/tasks?status=${payload.originalStatus}`);
      } else if (dataKey === 'priority' && payload.name) {
        navigate(`/tasks?priority=${payload.name.toLowerCase()}`);
      }
    };
    
    document.addEventListener('chart-click', handleChartClick as EventListener);
    
    return () => {
      document.removeEventListener('chart-click', handleChartClick as EventListener);
    };
  }, [navigate]);
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Tasks by Status</CardTitle>
          <CardDescription>Distribution of tasks across different statuses. Click on a bar to see tasks.</CardDescription>
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
              <ClickableBar dataKey="tasks" fill="#8884d8" name="Number of Tasks" />
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
                onClick={(data) => {
                  const event = new CustomEvent('chart-click', {
                    detail: {
                      payload: { name: data.originalPriority },
                      dataKey: 'priority'
                    }
                  });
                  document.dispatchEvent(event);
                }}
              >
                {tasksByPriority.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cursor="pointer" />
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
  const navigate = useNavigate();
  
  // Calculate tasks completed by each employee
  const getTasksByEmployee = () => {
    const employeeTaskCount: { [key: string]: number } = {};
    const employeeCompletedCount: { [key: string]: number } = {};
    const employeeIds: { [key: string]: string } = {};
    
    // First count actual tasks
    tasks.forEach(task => {
      if (task.assignee?.name && task.assignee?.id && task.assignee.id !== 'unassigned') {
        const employeeName = task.assignee.name;
        const employeeId = task.assignee.id;
        
        employeeIds[employeeName] = employeeId;
        
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
      }
    });
    
    // Check if we have any data, if not use sample data
    if (Object.keys(employeeTaskCount).length === 0) {
      return [
        { name: 'Sarah Johnson', assigned: 8, completed: 5, employeeId: '101' },
        { name: 'Mike Anderson', assigned: 6, completed: 3, employeeId: '102' },
        { name: 'Emily Chen', assigned: 7, completed: 6, employeeId: '103' },
        { name: 'Alex Thompson', assigned: 5, completed: 2, employeeId: '104' }
      ];
    }
    
    return Object.keys(employeeTaskCount)
      .map(name => ({
        name: name,
        assigned: employeeTaskCount[name],
        completed: employeeCompletedCount[name] || 0,
        employeeId: employeeIds[name]
      }))
      .sort((a, b) => b.assigned - a.assigned)
      .slice(0, 5); // Get top 5 employees by task count
  };
  
  // Calculate average completion rate by department
  const getPerformanceByDepartment = () => {
    const departmentMap: Record<string, { totalTasks: number, completedTasks: number }> = {};
    
    // Initialize departments from employees
    employees.forEach(employee => {
      if (employee.department && !departmentMap[employee.department]) {
        departmentMap[employee.department] = { totalTasks: 0, completedTasks: 0 };
      }
    });
    
    // Check if we have any departments, if not use sample data
    if (Object.keys(departmentMap).length === 0) {
      return [
        { name: 'Marketing', completionRate: 75 },
        { name: 'Engineering', completionRate: 60 },
        { name: 'Design', completionRate: 85 },
        { name: 'Product', completionRate: 50 }
      ];
    }
    
    // Count tasks by department
    tasks.forEach(task => {
      if (task.assignee?.id) {
        const employee = employees.find(e => e.id === task.assignee.id);
        if (employee?.department && departmentMap[employee.department]) {
          departmentMap[employee.department].totalTasks++;
          
          if (task.status === 'completed') {
            departmentMap[employee.department].completedTasks++;
          }
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
  
  // Handle click on employee bar to navigate to their tasks
  useEffect(() => {
    const handleChartClick = (event: CustomEvent) => {
      const { payload, dataKey } = event.detail;
      
      if (payload && payload.employeeId) {
        navigate(`/tasks?employee=${payload.employeeId}`);
      }
    };
    
    document.addEventListener('chart-click', handleChartClick as EventListener);
    
    return () => {
      document.removeEventListener('chart-click', handleChartClick as EventListener);
    };
  }, [navigate]);
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Tasks by Employee</CardTitle>
          <CardDescription>Assigned vs completed tasks per employee. Click on a bar to see their tasks.</CardDescription>
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
              <ClickableBar dataKey="assigned" fill="#8884d8" name="Tasks Assigned" />
              <ClickableBar dataKey="completed" fill="#82ca9d" name="Tasks Completed" />
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
              <ClickableBar dataKey="completionRate" fill="#82ca9d" name="Completion Rate (%)" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
