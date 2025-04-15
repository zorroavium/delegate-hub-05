
import React, { useState } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { SidebarLayout } from '@/components/layout/sidebar';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { UserRoleManagement } from '@/components/admin/user-role-management';

export default function Admin() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <SidebarLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage users, permissions, and system settings
            </p>
          </div>
          
          <div className="grid gap-6">
            <UserRoleManagement />
          </div>
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
}
