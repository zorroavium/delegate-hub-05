
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';

// Pages
import Index from './pages/Index';
import Tasks from './pages/Tasks';
import Employees from './pages/Employees';
import Calendar from './pages/Calendar';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import TaskDetail from './pages/TaskDetail';
import NotFound from './pages/NotFound';

// Styles
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Keep data fresh
      refetchOnWindowFocus: false, // Don't refetch on focus
      retry: 1, // Only retry once
    },
  },
});

// State persistence component
function StatePersistence() {
  const tasks = useTaskStore(state => state.tasks);
  const addTask = useTaskStore(state => state.addTask);
  const employees = useEmployeeStore(state => state.employees);
  const addEmployee = useEmployeeStore(state => state.addEmployee);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem('employees', JSON.stringify(employees));
    }
  }, [employees]);

  // Load state from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Only set tasks if the store is empty
        if (tasks.length === 0 && parsedTasks.length > 0) {
          parsedTasks.forEach((task: any) => addTask(task));
        }
      } catch (e) {
        console.error('Error loading tasks from localStorage', e);
      }
    }

    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      try {
        const parsedEmployees = JSON.parse(savedEmployees);
        // Only set employees if the store is empty
        if (employees.length === 0 && parsedEmployees.length > 0) {
          parsedEmployees.forEach((employee: any) => addEmployee(employee));
        }
      } catch (e) {
        console.error('Error loading employees from localStorage', e);
      }
    }
  }, [addTask, addEmployee, tasks.length, employees.length]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <StatePersistence />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/task/:id" element={<TaskDetail />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
