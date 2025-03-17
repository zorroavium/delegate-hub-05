
import React, { useEffect, useState } from 'react';
import { SidebarLayout } from '@/components/layout/sidebar';
import { TaskDetail } from '@/components/tasks/task-detail';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskStore } from '@/store/useTaskStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex flex-col space-y-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-fit flex items-center gap-1" 
            onClick={handleGoBack}
          >
            <ArrowLeft size={16} />
            Back to tasks
          </Button>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-40">
                <div className="animate-pulse flex flex-col items-center space-y-4">
                  <div className="h-6 w-32 bg-muted rounded"></div>
                  <div className="h-4 w-48 bg-muted rounded"></div>
                  <div className="h-10 w-24 bg-muted rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarLayout>
    );
  }

  if (!task) {
    return (
      <SidebarLayout>
        <div className="flex flex-col space-y-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-fit flex items-center gap-1" 
            onClick={handleGoBack}
          >
            <ArrowLeft size={16} />
            Back to tasks
          </Button>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center h-40 space-y-3">
                <p className="text-xl font-semibold mb-2">Task not found</p>
                <p className="text-muted-foreground text-center">The task you're looking for doesn't exist or has been deleted.</p>
                <Button onClick={() => navigate('/tasks')}>View all tasks</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="flex flex-col space-y-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-fit flex items-center gap-1" 
          onClick={handleGoBack}
        >
          <ArrowLeft size={16} />
          Back to tasks
        </Button>
        
        <TaskDetail task={task} />
      </div>
    </SidebarLayout>
  );
};

export default TaskDetailPage;
