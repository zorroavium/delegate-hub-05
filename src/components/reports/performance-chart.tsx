
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
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTaskStore } from '@/store/useTaskStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { ClickableBar } from './clickable-bar';
import { useNavigate } from 'react-router-dom';

// Colors for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Sample data for when actual task data is not available
const sampleTaskStatusData = [
  { name: 'Pending', tasks: 8, originalStatus: 'pending' },
  { name: 'In Progress', tasks: 5, originalStatus: 'in-progress' },
  { name: 'Completed', tasks: 12, originalStatus: 'completed' },
  { name: 'Cancelled', tasks: 3, originalStatus: 'cancelled' }
];

const sampleTaskPriorityData = [
  { name: 'High', tasks: 7, originalPriority: 'high' },
  { name: 'Medium', tasks: 12, originalPriority: 'medium' },
  { name: 'Low', tasks: 9, originalPriority: 'low' }
];

// Sample employee performance data
const sampleEmployeeData = [
  { name: 'Sarah Johnson', assigned: 12, completed: 9, employeeId: '101' },
  { name: 'Mike Anderson', assigned: 8, completed: 5, employeeId: '102' },
  { name: 'Emily Chen', assigned: 10, completed: 8, employeeId: '103' },
  { name: 'Alex Thompson', assigned: 7, completed: 4, employeeId: '104' }
];

// Sample department performance data
const sampleDepartmentData = [
  { name: 'Marketing', completionRate: 75, tasksCompleted: 15, totalTasks: 20 },
  { name: 'Engineering', completionRate: 82, tasksCompleted: 23, totalTasks: 28 },
  { name: 'Design', completionRate: 65, tasksCompleted: 13, totalTasks: 20 },
  { name: 'Product', completionRate: 90, tasksCompleted: 18, totalTasks: 20 }
];

// Sample productivity trend data over time
const productivityTrendData = [
  { month: 'Jan', tasks: 20, completion: 65 },
  { month: 'Feb', tasks: 25, completion: 70 },
  { month: 'Mar', tasks: 18, completion: 60 },
  { month: 'Apr', tasks: 27, completion: 75 },
  { month: 'May', tasks: 32, completion: 80 },
  { month: 'Jun', tasks: 30, completion: 78 }
];

export const TaskDistributionChart = () => {
  const { tasks } = useTaskStore();
  const navigate = useNavigate();
  
  // Calculate task distribution by status with fallback to sample data
  const getTasksByStatus = () => {
    const statusCount: { [key: string]: number } = {};
    
    tasks.forEach(task => {
      if (statusCount[task.status]) {
        statusCount[task.status]++;
      } else {
        statusCount[task.status] = 1;
      }
    });
    
    // If no real data, use sample data
    if (Object.keys(statusCount).length === 0) {
      return sampleTaskStatusData;
    }
    
    return Object.keys(statusCount).map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
      tasks: statusCount[status],
      originalStatus: status
    }));
  };
  
  // Calculate task distribution by priority with fallback to sample data
  const getTasksByPriority = () => {
    const priorityCount: { [key: string]: number } = {};
    
    tasks.forEach(task => {
      if (priorityCount[task.priority]) {
        priorityCount[task.priority]++;
      } else {
        priorityCount[task.priority] = 1;
      }
    });
    
    // If no real data, use sample data
    if (Object.keys(priorityCount).length === 0) {
      return sampleTaskPriorityData;
    }
    
    return Object.keys(priorityCount).map(priority => ({
      name: priority.charAt(0).toUpperCase() + priority.slice(1),
      tasks: priorityCount[priority],
      originalPriority: priority
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
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Task Productivity Trends</CardTitle>
          <CardDescription>Monthly task and completion rate trends</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={productivityTrendData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="tasks" stroke="#8884d8" fillOpacity={1} fill="url(#colorTasks)" />
              <Area type="monotone" dataKey="completion" stroke="#82ca9d" fillOpacity={1} fill="url(#colorCompletion)" />
            </AreaChart>
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
  
  // Get task data by employee with fallback to sample data
  const getTasksByEmployee = () => {
    const employeeTaskCount: { [key: string]: number } = {};
    const employeeCompletedCount: { [key: string]: number } = {};
    const employeeIds: { [key: string]: string } = {};
    
    // Count actual tasks
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
    
    // If no real data, use sample data
    if (Object.keys(employeeTaskCount).length === 0) {
      return sampleEmployeeData;
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
  
  // Get department performance data with fallback to sample data
  const getPerformanceByDepartment = () => {
    const departmentMap: Record<string, { totalTasks: number, completedTasks: number }> = {};
    
    // Initialize departments from employees
    employees.forEach(employee => {
      if (employee.department && !departmentMap[employee.department]) {
        departmentMap[employee.department] = { totalTasks: 0, completedTasks: 0 };
      }
    });
    
    // If no departments, use sample data
    if (Object.keys(departmentMap).length === 0) {
      return sampleDepartmentData;
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
    
    // Map departments to chart data format
    const deptData = Object.keys(departmentMap).map(dept => {
      const totalTasks = departmentMap[dept].totalTasks;
      const completedTasks = departmentMap[dept].completedTasks;
      const completionRate = totalTasks > 0 
        ? Math.round((completedTasks / totalTasks) * 100) 
        : 0;
      
      return {
        name: dept,
        completionRate: completionRate,
        tasksCompleted: completedTasks,
        totalTasks: totalTasks
      };
    });
    
    // If no calculated data, return sample data
    return deptData.length > 0 ? deptData : sampleDepartmentData;
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
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Employee Efficiency Matrix</CardTitle>
          <CardDescription>Task completion efficiency by employee over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[
                { name: 'Week 1', Sarah: 85, Mike: 72, Emily: 90, Alex: 67 },
                { name: 'Week 2', Sarah: 87, Mike: 76, Emily: 92, Alex: 70 },
                { name: 'Week 3', Sarah: 89, Mike: 78, Emily: 88, Alex: 73 },
                { name: 'Week 4', Sarah: 84, Mike: 80, Emily: 91, Alex: 76 },
                { name: 'Week 5', Sarah: 88, Mike: 79, Emily: 94, Alex: 78 },
                { name: 'Week 6', Sarah: 90, Mike: 82, Emily: 93, Alex: 81 }
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Sarah" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Mike" stroke="#82ca9d" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Emily" stroke="#ffc658" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Alex" stroke="#ff7300" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
