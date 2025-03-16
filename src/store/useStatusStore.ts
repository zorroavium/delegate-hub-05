
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StatusConfig {
  id: string;
  name: string;
  color: string;
  order: number;
}

interface StatusState {
  statuses: StatusConfig[];
  setStatuses: (statuses: StatusConfig[]) => void;
  addStatus: (status: Omit<StatusConfig, 'id' | 'order'>) => void;
  updateStatus: (id: string, status: Partial<Omit<StatusConfig, 'id'>>) => void;
  removeStatus: (id: string) => void;
  reorderStatuses: (startIndex: number, endIndex: number) => void;
}

// Default statuses
const defaultStatuses: StatusConfig[] = [
  { id: 'pending', name: 'Pending', color: 'bg-status-pending', order: 0 },
  { id: 'in-progress', name: 'In Progress', color: 'bg-status-in-progress', order: 1 },
  { id: 'completed', name: 'Completed', color: 'bg-status-completed', order: 2 },
  { id: 'delayed', name: 'Delayed', color: 'bg-status-delayed', order: 3 },
];

export const useStatusStore = create<StatusState>()(
  persist(
    (set) => ({
      statuses: defaultStatuses,
      
      setStatuses: (statuses: StatusConfig[]) => set({ statuses }),
      
      addStatus: (status) => set((state) => {
        const newStatus: StatusConfig = {
          ...status,
          id: crypto.randomUUID(),
          order: state.statuses.length,
        };
        return { statuses: [...state.statuses, newStatus] };
      }),
      
      updateStatus: (id, updatedStatus) => set((state) => ({
        statuses: state.statuses.map((status) => 
          status.id === id ? { ...status, ...updatedStatus } : status
        ),
      })),
      
      removeStatus: (id) => set((state) => {
        // Filter out the status to remove
        const filteredStatuses = state.statuses.filter((status) => status.id !== id);
        
        // Reorder the remaining statuses
        return {
          statuses: filteredStatuses.map((status, index) => ({
            ...status,
            order: index,
          })),
        };
      }),
      
      reorderStatuses: (startIndex, endIndex) => set((state) => {
        const result = Array.from(state.statuses);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        
        return {
          statuses: result.map((status, index) => ({
            ...status,
            order: index,
          })),
        };
      }),
    }),
    {
      name: 'task-status-store',
    }
  )
);
