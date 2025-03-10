
import React from 'react';
import { SidebarLayout } from '@/components/layout/sidebar';

const TasksPage = () => {
  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        </div>
        <div className="grid gap-6">
          <div className="p-6 bg-card text-card-foreground shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-4">All Tasks</h2>
            <p className="text-muted-foreground">
              Your task management interface will be available here soon. This page is currently under development.
            </p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default TasksPage;
