
import React, { useEffect, useState } from 'react';
import { SidebarLayout } from '@/components/layout/sidebar';
import { TaskDetail } from '@/components/tasks/task-detail';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskStore } from '@/store/useTaskStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

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
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </SidebarLayout>
    );
  }

  if (!task) {
    return (
      <SidebarLayout>
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/tasks')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Button>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-xl font-semibold mb-2">Task not found</p>
              <p className="text-muted-foreground text-center max-w-md">
                The task you're looking for doesn't exist or has been deleted.
              </p>
              <Button 
                onClick={() => navigate('/tasks')} 
                className="mt-6"
              >
                View All Tasks
              </Button>
            </CardContent>
          </Card>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/tasks')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tasks
        </Button>
        
        <TaskDetail task={task} />
      </div>
    </SidebarLayout>
  );
};

export default TaskDetailPage;
