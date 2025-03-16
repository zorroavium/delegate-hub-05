
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Mock data for initial store
const tasksMock = [
  {
    id: '1',
    title: 'Update website content',
    description: 'Update the company website with new product information and ensure all links are working correctly. Coordinate with the marketing team to get the latest product descriptions and images.',
    status: 'in-progress',
    priority: 'high' as const,
    dueDate: '2023-06-15',
    progress: 60,
    assignee: {
      id: '101',
      name: 'Sarah Johnson',
      avatar: 'SJ',
      color: 'bg-blue-500'
    },
    activities: [
      {
        id: '101',
        userId: '101',
        userName: 'Sarah Johnson',
        userAvatar: 'SJ',
        action: 'created this task',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ]
  },
  {
    id: '2',
    title: 'Prepare quarterly report',
    description: 'Compile sales and marketing data for Q2 2023.',
    status: 'pending',
    priority: 'medium' as const,
    dueDate: '2023-06-30',
    progress: 20,
    assignee: {
      id: '102',
      name: 'Mike Anderson',
      avatar: 'MA',
      color: 'bg-green-500'
    },
    activities: [
      {
        id: '201',
        userId: '102',
        userName: 'Mike Anderson',
        userAvatar: 'MA',
        action: 'created this task',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ]
  },
  {
    id: '3',
    title: 'Client presentation',
    description: 'Create presentation slides for the upcoming client meeting.',
    status: 'pending',
    priority: 'high' as const,
    dueDate: '2023-06-10',
    progress: 0,
    assignee: {
      id: '103',
      name: 'Emily Chen',
      avatar: 'EC',
      color: 'bg-purple-500'
    },
    activities: [
      {
        id: '301',
        userId: '103',
        userName: 'Emily Chen',
        userAvatar: 'EC',
        action: 'created this task',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ]
  },
  {
    id: '4',
    title: 'System maintenance',
    description: 'Perform routine maintenance on servers and databases.',
    status: 'completed',
    priority: 'low' as const,
    dueDate: '2023-06-05',
    progress: 100,
    assignee: {
      id: '104',
      name: 'Alex Thompson',
      avatar: 'AT',
      color: 'bg-yellow-500'
    },
    activities: [
      {
        id: '401',
        userId: '104',
        userName: 'Alex Thompson',
        userAvatar: 'AT',
        action: 'created this task',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '402',
        userId: '104',
        userName: 'Alex Thompson',
        userAvatar: 'AT',
        action: 'marked as completed',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ]
  },
  {
    id: '5',
    title: 'Update mobile app',
    description: 'Push new features to the mobile application.',
    status: 'in-progress',
    priority: 'medium' as const,
    dueDate: '2023-06-20',
    progress: 40,
    assignee: {
      id: '101',
      name: 'Sarah Johnson',
      avatar: 'SJ',
      color: 'bg-blue-500'
    },
    activities: [
      {
        id: '501',
        userId: '101',
        userName: 'Sarah Johnson',
        userAvatar: 'SJ',
        action: 'created this task',
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '502',
        userId: '102',
        userName: 'Mike Anderson',
        userAvatar: 'MA',
        action: 'changed status from Pending to In Progress',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ]
  },
  {
    id: '6',
    title: 'Social media campaign',
    description: 'Launch new social media marketing campaign.',
    status: 'completed',
    priority: 'high' as const,
    dueDate: '2023-06-01',
    progress: 100,
    assignee: {
      id: '103',
      name: 'Emily Chen',
      avatar: 'EC',
      color: 'bg-purple-500'
    },
    activities: [
      {
        id: '601',
        userId: '103',
        userName: 'Emily Chen',
        userAvatar: 'EC',
        action: 'created this task',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '602',
        userId: '103',
        userName: 'Emily Chen',
        userAvatar: 'EC',
        action: 'marked as completed',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ]
  },
];

export interface TaskActivity {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  timestamp: string;
  comment?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  progress: number;
  assignee: {
    id: string;
    name: string;
    avatar?: string;
    color?: string;
  };
  activities: TaskActivity[];
}

interface TaskStore {
  tasks: Task[];
  getTaskById: (id: string) => Task | undefined;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addActivity: (taskId: string, activity: Omit<TaskActivity, 'id'>) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: tasksMock,
      
      getTaskById: (id: string) => {
        return get().tasks.find(task => task.id === id);
      },
      
      addTask: (task: Task) => {
        set(state => ({
          tasks: [task, ...state.tasks]
        }));
      },
      
      updateTask: (id: string, updates: Partial<Task>) => {
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === id ? { ...task, ...updates } : task
          )
        }));
      },
      
      addActivity: (taskId: string, activity: Omit<TaskActivity, 'id'>) => {
        const newActivity = {
          ...activity,
          id: Date.now().toString(),
        };
        
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === taskId 
              ? { ...task, activities: [newActivity, ...task.activities] } 
              : task
          )
        }));
      }
    }),
    {
      name: 'task-storage',
      storage: createJSONStorage(() => localStorage), // Using localStorage as a fallback if IndexedDB is not available
    }
  )
);
