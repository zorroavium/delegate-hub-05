
import React, { useEffect, useState } from 'react';
import { SidebarLayout } from '@/components/layout/sidebar';
import { TaskDetail } from '@/components/tasks/task-detail';
import { useParams } from 'react-router-dom';
import { useTaskStore } from '@/store/useTaskStore';

const TaskDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getTaskById } = useTaskStore();
  const [task, setTask] = useState<any>(null);
  
  useEffect(() => {
    if (id) {
      const foundTask = getTaskById(id);
      setTask(foundTask);
    }
  }, [id, getTaskById]);

  if (!task) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading task...</p>
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
