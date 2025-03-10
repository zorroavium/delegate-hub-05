
import React from 'react';
import { SidebarLayout } from '@/components/layout/sidebar';

const SettingsPage = () => {
  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>
        <div className="grid gap-6">
          <div className="p-6 bg-card text-card-foreground shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-4">System Preferences</h2>
            <p className="text-muted-foreground">
              Application settings and configuration will be available here soon. This page is currently under development.
            </p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default SettingsPage;
