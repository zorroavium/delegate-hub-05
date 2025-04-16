import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useEmployeeStore } from './useEmployeeStore';

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
      id: '1', // Fixed ID to match employee store
      name: 'Sarah Johnson',
      avatar: 'SJ',
      color: 'bg-purple-500' // Fixed color to match employee store
    },
    activities: [
      {
        id: '101',
        userId: '1', // Fixed ID to match employee store
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
      id: '4', // Fixed ID to match employee store (David Wilson)
      name: 'David Wilson',
      avatar: 'DW',
      color: 'bg-green-500'
    },
    activities: [
      {
        id: '201',
        userId: '4', // Fixed ID to match employee store
        userName: 'David Wilson',
        userAvatar: 'DW',
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
      id: '7', // Fixed ID to match employee store (Sophia Martinez)
      name: 'Sophia Martinez',
      avatar: 'SM',
      color: 'bg-pink-500'
    },
    activities: [
      {
        id: '301',
        userId: '7', // Fixed ID to match employee store
        userName: 'Sophia Martinez',
        userAvatar: 'SM',
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
      id: '6', // Fixed ID to match employee store (Robert Taylor)
      name: 'Robert Taylor',
      avatar: 'RT',
      color: 'bg-red-500'
    },
    activities: [
      {
        id: '401',
        userId: '6', // Fixed ID to match employee store
        userName: 'Robert Taylor',
        userAvatar: 'RT',
        action: 'created this task',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '402',
        userId: '6', // Fixed ID to match employee store
        userName: 'Robert Taylor',
        userAvatar: 'RT',
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
      id: '1', // Fixed ID to match employee store
      name: 'Sarah Johnson',
      avatar: 'SJ',
      color: 'bg-purple-500' // Fixed color to match employee store
    },
    activities: [
      {
        id: '501',
        userId: '1', // Fixed ID to match employee store
        userName: 'Sarah Johnson',
        userAvatar: 'SJ',
        action: 'created this task',
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '502',
        userId: '4', // Fixed ID to match employee store (David Wilson)
        userName: 'David Wilson',
        userAvatar: 'DW',
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
      id: '2', // Fixed ID to match employee store (Michael Chen)
      name: 'Michael Chen',
      avatar: 'MC',
      color: 'bg-blue-500'
    },
    activities: [
      {
        id: '601',
        userId: '2', // Fixed ID to match employee store
        userName: 'Michael Chen',
        userAvatar: 'MC',
        action: 'created this task',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '602',
        userId: '2', // Fixed ID to match employee store
        userName: 'Michael Chen',
        userAvatar: 'MC',
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

export interface TaskAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
  url?: string;
  uploadedAt: string;
  uploadedBy: {
    id: string;
    name: string;
  };
}

export interface TaskTimeEntry {
  id: string;
  userId: string;
  userName: string;
  started: string;
  ended?: string;
  duration?: number; // in seconds
  description?: string;
}

export interface RecurringConfig {
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval: number; // Every X days/weeks/months
  endAfter?: number; // End after X occurrences
  endDate?: string; // End on specific date
  daysOfWeek?: number[]; // For weekly: 0 = Sunday, 6 = Saturday
  dayOfMonth?: number; // For monthly
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
  attachments?: TaskAttachment[];
  timeEntries?: TaskTimeEntry[];
  dependencies?: string[]; // Array of task IDs that this task depends on
  isRecurring?: boolean;
  recurringConfig?: RecurringConfig;
  parentTaskId?: string; // For recurring instances
  template?: boolean; // Is this task a template?
  templateId?: string; // If created from template, the ID of the template
  reminderSent?: boolean;
  estimatedHours?: number;
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  tasks: Omit<Task, 'id' | 'dueDate' | 'activities' | 'assignee'>[];
}

interface TaskStore {
  tasks: Task[];
  templates: TaskTemplate[];
  getTaskById: (id: string) => Task | undefined;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addActivity: (taskId: string, activity: Omit<TaskActivity, 'id'>) => void;
  syncTaskAssignees: () => void;
  addTaskAttachment: (taskId: string, attachment: Omit<TaskAttachment, 'id'>) => void;
  removeTaskAttachment: (taskId: string, attachmentId: string) => void;
  addTimeEntry: (taskId: string, entry: Omit<TaskTimeEntry, 'id'>) => void;
  updateTimeEntry: (taskId: string, entryId: string, updates: Partial<TaskTimeEntry>) => void;
  stopTimeEntry: (taskId: string, entryId: string) => void;
  addTaskDependency: (taskId: string, dependsOnTaskId: string) => void;
  removeTaskDependency: (taskId: string, dependsOnTaskId: string) => void;
  createFromTemplate: (templateId: string, dueDate: string, assigneeId: string) => string;
  addTemplate: (template: Omit<TaskTemplate, 'id'>) => void;
  updateTemplate: (id: string, updates: Partial<Omit<TaskTemplate, 'id'>>) => void;
  deleteTemplate: (id: string) => void;
  createRecurringTasks: (task: Task) => void;
  checkDueDateReminders: () => Task[];
  getTaskDependencies: (taskId: string) => { dependsOn: Task[], dependedOnBy: Task[] };
  exportTasks: () => string;
  importTasks: (jsonData: string) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: tasksMock,
      templates: [],
      
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
      
      deleteTask: (id: string) => {
        set(state => ({
          tasks: state.tasks.filter(task => task.id !== id)
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
      },
      
      syncTaskAssignees: () => {
        const employees = useEmployeeStore.getState().employees;
        
        set(state => ({
          tasks: state.tasks.map(task => {
            const matchedEmployee = employees.find(emp => 
              emp.name.toLowerCase() === task.assignee.name.toLowerCase()
            );
            
            if (matchedEmployee) {
              return {
                ...task,
                assignee: {
                  id: matchedEmployee.id,
                  name: matchedEmployee.name,
                  avatar: matchedEmployee.avatar,
                  color: matchedEmployee.color
                },
                activities: task.activities.map(activity => {
                  if (activity.userName.toLowerCase() === matchedEmployee.name.toLowerCase()) {
                    return {
                      ...activity,
                      userId: matchedEmployee.id
                    };
                  }
                  return activity;
                })
              };
            }
            
            return task;
          })
        }));
      },
      
      addTaskAttachment: (taskId: string, attachment: Omit<TaskAttachment, 'id'>) => {
        const newAttachment = {
          ...attachment,
          id: Date.now().toString(),
        };
        
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === taskId 
              ? { 
                  ...task, 
                  attachments: [...(task.attachments || []), newAttachment] 
                } 
              : task
          )
        }));
      },
      
      removeTaskAttachment: (taskId: string, attachmentId: string) => {
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === taskId && task.attachments
              ? { 
                  ...task, 
                  attachments: task.attachments.filter(att => att.id !== attachmentId) 
                } 
              : task
          )
        }));
      },
      
      addTimeEntry: (taskId: string, entry: Omit<TaskTimeEntry, 'id'>) => {
        const newEntry = {
          ...entry,
          id: Date.now().toString(),
        };
        
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === taskId 
              ? { 
                  ...task, 
                  timeEntries: [...(task.timeEntries || []), newEntry] 
                } 
              : task
          )
        }));
      },
      
      updateTimeEntry: (taskId: string, entryId: string, updates: Partial<TaskTimeEntry>) => {
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === taskId && task.timeEntries
              ? { 
                  ...task, 
                  timeEntries: task.timeEntries.map(entry =>
                    entry.id === entryId ? { ...entry, ...updates } : entry
                  )
                } 
              : task
          )
        }));
      },
      
      stopTimeEntry: (taskId: string, entryId: string) => {
        const now = new Date().toISOString();
        const task = get().tasks.find(t => t.id === taskId);
        
        if (task && task.timeEntries) {
          const entry = task.timeEntries.find(e => e.id === entryId);
          
          if (entry && !entry.ended) {
            const startTime = new Date(entry.started).getTime();
            const endTime = new Date(now).getTime();
            const duration = Math.round((endTime - startTime) / 1000); // duration in seconds
            
            get().updateTimeEntry(taskId, entryId, {
              ended: now,
              duration
            });
          }
        }
      },
      
      addTaskDependency: (taskId: string, dependsOnTaskId: string) => {
        const dependsOnTask = get().getTaskById(dependsOnTaskId);
        if (dependsOnTask?.dependencies?.includes(taskId)) {
          console.error("Circular dependency detected");
          return;
        }
        
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === taskId
              ? { 
                  ...task, 
                  dependencies: [...(task.dependencies || []), dependsOnTaskId] 
                } 
              : task
          )
        }));
      },
      
      removeTaskDependency: (taskId: string, dependsOnTaskId: string) => {
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === taskId && task.dependencies
              ? { 
                  ...task, 
                  dependencies: task.dependencies.filter(id => id !== dependsOnTaskId) 
                } 
              : task
          )
        }));
      },
      
      createFromTemplate: (templateId: string, dueDate: string, assigneeId: string) => {
        const template = get().templates.find(t => t.id === templateId);
        if (!template) return '';
        
        const employees = useEmployeeStore.getState().employees;
        const assignee = employees.find(e => e.id === assigneeId);
        
        if (!assignee) return '';
        
        const newTaskId = crypto.randomUUID();
        
        const newTask: Task = {
          id: newTaskId,
          title: template.name,
          description: template.description,
          status: 'pending',
          priority: 'medium',
          dueDate,
          progress: 0,
          assignee: {
            id: assignee.id,
            name: assignee.name,
            avatar: assignee.avatar,
            color: assignee.color
          },
          activities: [{
            id: Date.now().toString(),
            userId: assignee.id,
            userName: assignee.name,
            userAvatar: assignee.avatar || assignee.name.split(' ').map(n => n[0]).join(''),
            action: 'created this task from template',
            timestamp: new Date().toISOString(),
          }],
          templateId
        };
        
        get().addTask(newTask);
        return newTaskId;
      },
      
      addTemplate: (template: Omit<TaskTemplate, 'id'>) => {
        const newTemplate: TaskTemplate = {
          ...template,
          id: crypto.randomUUID(),
        };
        
        set(state => ({
          templates: [...state.templates, newTemplate]
        }));
      },
      
      updateTemplate: (id: string, updates: Partial<Omit<TaskTemplate, 'id'>>) => {
        set(state => ({
          templates: state.templates.map(template => 
            template.id === id ? { ...template, ...updates } : template
          )
        }));
      },
      
      deleteTemplate: (id: string) => {
        set(state => ({
          templates: state.templates.filter(template => template.id !== id)
        }));
      },
      
      createRecurringTasks: (task: Task) => {
        if (!task.isRecurring || !task.recurringConfig) return;
        
        const config = task.recurringConfig;
        let nextDate = new Date(task.dueDate);
        const occurrences = [];
        const endDate = config.endDate ? new Date(config.endDate) : null;
        
        for (let i = 0; i < (config.endAfter || 5); i++) {
          if (config.frequency === 'daily') {
            nextDate = new Date(nextDate.setDate(nextDate.getDate() + config.interval));
          } else if (config.frequency === 'weekly') {
            nextDate = new Date(nextDate.setDate(nextDate.getDate() + (7 * config.interval)));
          } else if (config.frequency === 'monthly') {
            nextDate = new Date(nextDate.setMonth(nextDate.getMonth() + config.interval));
          }
          
          if (endDate && nextDate > endDate) break;
          
          const formattedDate = nextDate.toISOString().split('T')[0];
          
          const newTask: Task = {
            ...task,
            id: crypto.randomUUID(),
            dueDate: formattedDate,
            parentTaskId: task.id,
            activities: [{
              id: Date.now().toString(),
              userId: task.assignee.id,
              userName: task.assignee.name,
              userAvatar: task.assignee.avatar || '',
              action: 'created as recurring task',
              timestamp: new Date().toISOString(),
            }]
          };
          
          occurrences.push(newTask);
        }
        
        occurrences.forEach(task => get().addTask(task));
      },
      
      checkDueDateReminders: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const reminderSettings = useStatusStore.getState().reminderSettings;
        if (!reminderSettings.enabled) return [];
        
        const reminderThreshold = new Date(today);
        reminderThreshold.setDate(today.getDate() + reminderSettings.daysBefore);
        
        const tasksDueSoon = get().tasks.filter(task => {
          if (task.status === 'completed') return false;
          if (task.reminderSent) return false;
          
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          
          return dueDate <= reminderThreshold && dueDate >= today;
        });
        
        tasksDueSoon.forEach(task => {
          get().updateTask(task.id, { reminderSent: true });
        });
        
        return tasksDueSoon;
      },
      
      getTaskDependencies: (taskId: string) => {
        const allTasks = get().tasks;
        const currentTask = allTasks.find(t => t.id === taskId);
        
        if (!currentTask) return { dependsOn: [], dependedOnBy: [] };
        
        const dependsOn = currentTask.dependencies 
          ? allTasks.filter(t => currentTask.dependencies?.includes(t.id))
          : [];
          
        const dependedOnBy = allTasks.filter(t => 
          t.dependencies?.includes(taskId)
        );
        
        return { dependsOn, dependedOnBy };
      },
      
      exportTasks: () => {
        const data = {
          tasks: get().tasks,
          templates: get().templates
        };
        return JSON.stringify(data);
      },
      
      importTasks: (jsonData: string) => {
        try {
          const data = JSON.parse(jsonData);
          if (data.tasks) {
            set({ tasks: data.tasks });
          }
          if (data.templates) {
            set({ templates: data.templates });
          }
        } catch (error) {
          console.error("Error importing tasks:", error);
        }
      }
    }),
    {
      name: 'task-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            state.syncTaskAssignees();
          }
        };
      }
    }
  )
);
