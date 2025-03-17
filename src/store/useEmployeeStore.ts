
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

// Default employees with expanded mock data
const defaultEmployees: Employee[] = [
  // Leadership Roles
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Senior Partner",
    department: "Leadership",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    avatar: "SJ",
    color: "bg-purple-500",
    joinDate: "2012-05-12",
    status: "active",
    skills: ["Strategic Planning", "Client Relations", "Risk Management", "Auditing"],
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Partner",
    department: "Leadership",
    email: "michael.chen@example.com",
    phone: "+1 (555) 987-6543",
    location: "San Francisco, CA",
    avatar: "MC",
    color: "bg-blue-500",
    joinDate: "2014-02-15",
    status: "active",
    skills: ["Financial Advisory", "Mergers & Acquisitions", "Strategic Planning", "Client Management"],
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Associate Partner",
    department: "Leadership",
    email: "emily.r@example.com",
    phone: "+1 (555) 234-5678",
    location: "Chicago, IL",
    avatar: "ER",
    color: "bg-indigo-500",
    joinDate: "2016-07-10",
    status: "active",
    skills: ["Team Leadership", "Business Development", "Financial Analysis", "Regulatory Compliance"],
  },
  // Operations
  {
    id: "4",
    name: "David Wilson",
    role: "Operations Director",
    department: "Operations",
    email: "david.wilson@example.com",
    phone: "+1 (555) 345-6789",
    location: "Boston, MA",
    avatar: "DW",
    color: "bg-green-500",
    joinDate: "2017-03-22",
    status: "active",
    skills: ["Process Optimization", "Project Management", "Team Coordination", "Resource Planning"],
  },
  {
    id: "5",
    name: "Jessica Lee",
    role: "Operations Manager",
    department: "Operations",
    email: "jessica.lee@example.com",
    phone: "+1 (555) 456-7890",
    location: "Austin, TX",
    avatar: "JL",
    color: "bg-yellow-500",
    joinDate: "2018-11-05",
    status: "on-leave",
    skills: ["Workflow Design", "Change Management", "Staff Training", "Quality Control"],
  },
  // Audit & Assurance
  {
    id: "6",
    name: "Robert Taylor",
    role: "Audit Manager",
    department: "Audit & Assurance",
    email: "robert.taylor@example.com",
    phone: "+1 (555) 567-8901",
    location: "Seattle, WA",
    avatar: "RT",
    color: "bg-red-500",
    joinDate: "2018-06-14",
    status: "active",
    skills: ["Risk Assessment", "Audit Planning", "Financial Statement Analysis", "Team Leadership"],
  },
  {
    id: "7",
    name: "Sophia Martinez",
    role: "Assistant Manager",
    department: "Audit & Assurance",
    email: "sophia.martinez@example.com",
    phone: "+1 (555) 678-9012",
    location: "Denver, CO",
    avatar: "SM",
    color: "bg-pink-500",
    joinDate: "2019-08-30",
    status: "active",
    skills: ["Audit Methodology", "Client Communications", "Process Improvement", "Financial Analysis"],
  },
  {
    id: "8",
    name: "James Thompson",
    role: "Associate",
    department: "Audit & Assurance",
    email: "james.thompson@example.com",
    phone: "+1 (555) 789-0123",
    location: "Philadelphia, PA",
    avatar: "JT",
    color: "bg-blue-500",
    joinDate: "2020-02-18",
    status: "active",
    skills: ["Analytical Skills", "Risk Assessment", "Financial Statement Preparation", "Regulatory Knowledge"],
  },
  {
    id: "9",
    name: "Olivia Parker",
    role: "Audit Assistant",
    department: "Audit & Assurance",
    email: "olivia.parker@example.com",
    phone: "+1 (555) 890-1234",
    location: "Atlanta, GA",
    avatar: "OP",
    color: "bg-green-500",
    joinDate: "2021-05-10",
    status: "active",
    skills: ["Data Analysis", "Documentation", "Attention to Detail", "Organizational Skills"],
  },
  {
    id: "10",
    name: "Ethan Williams",
    role: "Articled Audit Assistant",
    department: "Audit & Assurance",
    email: "ethan.williams@example.com",
    phone: "+1 (555) 901-2345",
    location: "Miami, FL",
    avatar: "EW",
    color: "bg-purple-500",
    joinDate: "2022-01-25",
    status: "inactive",
    skills: ["Audit Testing", "Working Paper Preparation", "Professional Standards", "Time Management"],
  }
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
