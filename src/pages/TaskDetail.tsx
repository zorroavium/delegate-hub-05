
import React, { useEffect, useState } from 'react';
import { SidebarLayout } from '@/components/layout/sidebar';
import { TaskDetail } from '@/components/tasks/task-detail';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskStore } from '@/store/useTaskStore';

const TaskDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getTaskById } = useTaskStore();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (id) {
      const foundTask = getTaskById(id);
      setTask(foundTask);
      setLoading(false);
      
      // If task not found, redirect to tasks page
      if (!foundTask) {
        setTimeout(() => {
          navigate('/tasks', { replace: true });
        }, 500);
      }
    }
  }, [id, getTaskById, navigate]);

  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading task...</p>
        </div>
      </SidebarLayout>
    );
  }

  if (!task) {
    return (
      <SidebarLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-xl font-semibold mb-2">Task not found</p>
          <p className="text-muted-foreground">The task you're looking for doesn't exist or has been deleted.</p>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <TaskDetail task={task} />
    </SidebarLayout>
  );
};

export default TaskDetailPage;
