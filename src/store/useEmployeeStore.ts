
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  color: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  skills: string[];
}

interface EmployeeState {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Omit<Employee, 'id'>>) => void;
  removeEmployee: (id: string) => void;
  getEmployeeById: (id: string) => Employee | undefined;
}

// Default employees
const defaultEmployees: Employee[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Marketing Director",
    department: "Marketing",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    avatar: "SJ",
    color: "bg-blue-500",
    joinDate: "2018-05-12",
    status: "active",
    skills: ["Content Strategy", "Digital Marketing", "Brand Management"],
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Senior Developer",
    department: "Engineering",
    email: "michael.chen@example.com",
    phone: "+1 (555) 987-6543",
    location: "San Francisco, CA",
    avatar: "MC",
    color: "bg-green-500",
    joinDate: "2019-02-15",
    status: "active",
    skills: ["JavaScript", "React", "Node.js", "TypeScript"],
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "UX Designer",
    department: "Design",
    email: "emily.r@example.com",
    phone: "+1 (555) 234-5678",
    location: "Austin, TX",
    avatar: "ER",
    color: "bg-purple-500",
    joinDate: "2020-07-10",
    status: "active",
    skills: ["UI/UX Design", "Wireframing", "Prototyping", "User Research"],
  },
];

export const useEmployeeStore = create<EmployeeState>()(
  persist(
    (set, get) => ({
      employees: defaultEmployees,
      
      addEmployee: (employee) => set((state) => {
        const newEmployee: Employee = {
          ...employee,
          id: crypto.randomUUID(),
        };
        return { employees: [...state.employees, newEmployee] };
      }),
      
      updateEmployee: (id, updatedEmployee) => set((state) => ({
        employees: state.employees.map((employee) => 
          employee.id === id ? { ...employee, ...updatedEmployee } : employee
        ),
      })),
      
      removeEmployee: (id) => set((state) => ({
        employees: state.employees.filter((employee) => employee.id !== id)
      })),

      getEmployeeById: (id) => {
        return get().employees.find(employee => employee.id === id);
      }
    }),
    {
      name: 'employee-store',
    }
  )
);
