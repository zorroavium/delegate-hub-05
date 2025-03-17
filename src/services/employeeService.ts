
// Employee-related data service
export interface RoleCategory {
  category: string;
  roles: string[];
}

export const roleCategories: RoleCategory[] = [
  {
    category: "Leadership Roles",
    roles: ["Senior Partner", "Partner", "Associate Partner"]
  },
  {
    category: "Operations",
    roles: []
  },
  {
    category: "Audit & Assurance",
    roles: [
      "Audit Manager",
      "Assistant Manager",
      "Associate",
      "Audit Assistant",
      "Articled Audit Assistant"
    ]
  }
];

export const departmentOptions = [
  { value: "Engineering", label: "Engineering" },
  { value: "Marketing", label: "Marketing" },
  { value: "Design", label: "Design" },
  { value: "Product", label: "Product" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "Finance", label: "Finance" },
  { value: "Sales", label: "Sales" },
  { value: "Audit", label: "Audit" },
  { value: "Operations", label: "Operations" },
  { value: "Leadership", label: "Leadership" }
];

export const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "on-leave", label: "On Leave" }
];

export const colorOptions = [
  { value: "bg-blue-500", label: "Blue" },
  { value: "bg-green-500", label: "Green" },
  { value: "bg-purple-500", label: "Purple" },
  { value: "bg-red-500", label: "Red" },
  { value: "bg-yellow-500", label: "Yellow" },
  { value: "bg-indigo-500", label: "Indigo" },
  { value: "bg-pink-500", label: "Pink" }
];

// Function to get all roles as a flat array
export const getAllRoles = (): string[] => {
  return roleCategories.flatMap(category => category.roles);
};

// Get roles by category
export const getRolesByCategory = (category: string): string[] => {
  const foundCategory = roleCategories.find(c => c.category === category);
  return foundCategory ? foundCategory.roles : [];
};
