
import React from 'react';
import { SidebarLayout } from '@/components/layout/sidebar';
import { KanbanBoard } from '@/components/dashboard/kanban-board';
import { StatsCard } from '@/components/dashboard/stats-card';
import { CheckCircle2, AlertCircle, Users, Clock } from 'lucide-react';

const Index = () => {
  return (
    <SidebarLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Track your tasks and team's progress</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-status-completed"></div>
              <span className="text-sm">On Track</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-status-pending"></div>
              <span className="text-sm">At Risk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-status-delayed"></div>
              <span className="text-sm">Delayed</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Tasks Completed"
            value="28"
            description="This week"
            icon={<CheckCircle2 size={22} />}
            change={12}
            changeText="vs last week"
          />
          <StatsCard
            title="Tasks Pending"
            value="17"
            description="Requiring attention"
            icon={<AlertCircle size={22} />}
            change={-5}
            changeText="vs last week"
          />
          <StatsCard
            title="Active Team Members"
            value="24"
            description="Out of 30 total"
            icon={<Users size={22} />}
            change={8}
            changeText="new this month"
          />
          <StatsCard
            title="Avg. Completion Time"
            value="3.2 days"
            description="For high priority tasks"
            icon={<Clock size={22} />}
            change={-14}
            changeText="faster than last month"
          />
        </div>

        {/* Kanban Board */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Task Overview</h2>
          <KanbanBoard />
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Index;
