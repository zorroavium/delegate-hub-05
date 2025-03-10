
import React, { useState } from "react";
import { SidebarLayout } from "@/components/layout/sidebar";
import { EmployeeProfile, Employee } from "@/components/employees/employee-profile";

// Mock employee data
const employeesData: Employee[] = [
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
  {
    id: "4",
    name: "David Kim",
    role: "Product Manager",
    department: "Product",
    email: "david.kim@example.com",
    phone: "+1 (555) 345-6789",
    location: "Chicago, IL",
    avatar: "DK",
    color: "bg-yellow-500",
    joinDate: "2017-11-03",
    status: "on-leave",
    skills: ["Product Strategy", "Agile", "User Stories", "Roadmapping"],
  },
  {
    id: "5",
    name: "Jessica Patel",
    role: "HR Specialist",
    department: "Human Resources",
    email: "j.patel@example.com",
    phone: "+1 (555) 456-7890",
    location: "Boston, MA",
    avatar: "JP",
    color: "bg-red-500",
    joinDate: "2019-09-22",
    status: "active",
    skills: ["Recruiting", "Employee Relations", "Benefits Administration"],
  },
  {
    id: "6",
    name: "Robert Washington",
    role: "Financial Analyst",
    department: "Finance",
    email: "r.washington@example.com",
    phone: "+1 (555) 567-8901",
    location: "Miami, FL",
    avatar: "RW",
    color: "bg-indigo-500",
    joinDate: "2021-01-15",
    status: "inactive",
    skills: ["Financial Reporting", "Budgeting", "Forecasting", "Excel"],
  },
];

const EmployeesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
  };
  
  const handleCloseProfile = () => {
    setSelectedEmployee(null);
  };
  
  return (
    <SidebarLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Employees</h1>
          <div className="space-x-2">
            <button
              className={`px-3 py-1 rounded ${viewMode === "grid" ? "bg-primary text-white" : "bg-gray-200"}`}
              onClick={() => setViewMode("grid")}
            >
              Grid
            </button>
            <button
              className={`px-3 py-1 rounded ${viewMode === "list" ? "bg-primary text-white" : "bg-gray-200"}`}
              onClick={() => setViewMode("list")}
            >
              List
            </button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employeesData.map((employee) => (
              <div 
                key={employee.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleEmployeeClick(employee)}
              >
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${employee.color}`}>
                      {employee.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{employee.name}</h3>
                      <p className="text-gray-600">{employee.role}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Department:</span> {employee.department}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {employee.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Location:</span> {employee.location}
                    </p>
                  </div>
                  <div className="mt-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      employee.status === "active" ? "bg-green-100 text-green-800" : 
                      employee.status === "inactive" ? "bg-gray-100 text-gray-800" : 
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {employee.status.replace("-", " ")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employeesData.map((employee) => (
                  <tr 
                    key={employee.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleEmployeeClick(employee)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${employee.color}`}>
                          {employee.avatar}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        employee.status === "active" ? "bg-green-100 text-green-800" : 
                        employee.status === "inactive" ? "bg-gray-100 text-gray-800" : 
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {employee.status.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
