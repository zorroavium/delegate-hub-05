import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { AuthProvider, UserRole } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { SessionTimeout } from '@/components/auth/session-timeout';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Tasks from './pages/Tasks';
import Employees from './pages/Employees';
import Calendar from './pages/Calendar';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Notifications from './pages/Notifications';
import TaskDetail from './pages/TaskDetail';
import NotFound from './pages/NotFound';

// Styles
import './App.css';

// Create a client with enhanced configuration for enterprise apps
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replacing cacheTime which is deprecated)
      refetchOnWindowFocus: true, // Refetch on window focus for real-time updates
      retry: 3, // Retry failed requests 3 times
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    },
    mutations: {
      retry: 2,
      retryDelay: 1000,
    },
  },
});

// State persistence component with enhanced error handling
function StatePersistence() {
  const tasks = useTaskStore(state => state.tasks);
  const addTask = useTaskStore(state => state.addTask);
  const employees = useEmployeeStore(state => state.employees);
  const addEmployee = useEmployeeStore(state => state.addEmployee);

  // Save state to localStorage whenever it changes with error handling
  useEffect(() => {
    if (tasks.length > 0) {
      try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
        // Consider implementing a fallback storage mechanism
      }
    }
  }, [tasks]);

  useEffect(() => {
    if (employees.length > 0) {
      try {
        localStorage.setItem('employees', JSON.stringify(employees));
      } catch (error) {
        console.error('Error saving employees to localStorage:', error);
      }
    }
  }, [employees]);

  // Load state from localStorage on initial render with enhanced validation
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        // Basic validation before loading
        if (Array.isArray(parsedTasks) && parsedTasks.length > 0) {
          // Only set tasks if the store is empty
          if (tasks.length === 0) {
            parsedTasks.forEach((task: any) => {
              // Additional validation could be added here
              if (task && typeof task === 'object' && task.id) {
                addTask(task);
              }
            });
          }
        }
      }
    } catch (e) {
      console.error('Error loading tasks from localStorage', e);
    }

    try {
      const savedEmployees = localStorage.getItem('employees');
      if (savedEmployees) {
        const parsedEmployees = JSON.parse(savedEmployees);
        // Basic validation before loading
        if (Array.isArray(parsedEmployees) && parsedEmployees.length > 0) {
          // Only set employees if the store is empty
          if (employees.length === 0) {
            parsedEmployees.forEach((employee: any) => {
              // Additional validation could be added here
              if (employee && typeof employee === 'object' && employee.id) {
                addEmployee(employee);
              }
            });
          }
        }
      }
    } catch (e) {
      console.error('Error loading employees from localStorage', e);
    }
  }, [addTask, addEmployee, tasks.length, employees.length]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <LanguageProvider>
            <AuthProvider>
              <StatePersistence />
              <SessionTimeout />
              <Routes>
                {/* Public route */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected routes with enhanced security */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/tasks" element={
                  <ProtectedRoute>
                    <Tasks />
                  </ProtectedRoute>
                } />
                <Route path="/task/:id" element={
                  <ProtectedRoute>
                    <TaskDetail />
                  </ProtectedRoute>
                } />
                <Route path="/employees" element={
                  <ProtectedRoute allowedRoles={['admin', 'manager' as UserRole]}>
                    <Employees />
                  </ProtectedRoute>
                } />
                <Route path="/calendar" element={
                  <ProtectedRoute>
                    <Calendar />
                  </ProtectedRoute>
                } />
                <Route path="/reports" element={
                  <ProtectedRoute allowedRoles={['admin', 'manager' as UserRole]}>
                    <Reports />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin']} requireMFA={true} minSecurityLevel={2}>
                    <Admin />
                  </ProtectedRoute>
                } />
                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </AuthProvider>
          </LanguageProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
