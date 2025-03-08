
import React from 'react';
import { SidebarLayout } from '@/components/layout/sidebar';
import { TaskDetail } from '@/components/tasks/task-detail';
import { useParams } from 'react-router-dom';

const TaskDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  // In a real app, fetch task data based on ID from an API
  // For now, use mock data
  const task = {
    id: id || '1',
    title: 'Update website content',
    description: 'Update the company website with new product information and ensure all links are working correctly. Coordinate with the marketing team to get the latest product descriptions and images.',
    status: 'in-progress' as const,
    priority: 'high' as const,
    dueDate: '2023-06-15',
    progress: 60,
    assignee: {
      id: '101',
      name: 'Sarah Johnson',
    },
  };

  return (
    <SidebarLayout>
      <TaskDetail task={task} />
    </SidebarLayout>
  );
};

export default TaskDetailPage;
