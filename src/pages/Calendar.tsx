
import React, { useState } from 'react';
import { SidebarLayout } from '@/components/layout/sidebar';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Users 
} from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

// Mock data for calendar events
const eventsMock = [
  {
    id: '1',
    title: 'Website Content Update',
    date: '2023-06-15',
    time: '10:00 AM - 11:30 AM',
    type: 'task',
    assignees: [
      { id: '101', name: 'Sarah Johnson', avatar: 'SJ', color: 'bg-blue-500' },
    ],
  },
  {
    id: '2',
    title: 'Quarterly Report Meeting',
    date: '2023-06-16',
    time: '2:00 PM - 3:30 PM',
    type: 'meeting',
    assignees: [
      { id: '101', name: 'Sarah Johnson', avatar: 'SJ', color: 'bg-blue-500' },
      { id: '102', name: 'Mike Anderson', avatar: 'MA', color: 'bg-green-500' },
      { id: '103', name: 'Emily Chen', avatar: 'EC', color: 'bg-purple-500' },
    ],
  },
  {
    id: '3',
    title: 'Client Presentation Prep',
    date: '2023-06-14',
    time: '9:00 AM - 10:30 AM',
    type: 'task',
    assignees: [
      { id: '103', name: 'Emily Chen', avatar: 'EC', color: 'bg-purple-500' },
    ],
  },
  {
    id: '4',
    title: 'System Maintenance',
    date: '2023-06-18',
    time: '11:00 AM - 1:00 PM',
    type: 'task',
    assignees: [
      { id: '104', name: 'Alex Thompson', avatar: 'AT', color: 'bg-yellow-500' },
    ],
  },
  {
    id: '5',
    title: 'Marketing Strategy Meeting',
    date: '2023-06-19',
    time: '3:00 PM - 4:00 PM',
    type: 'meeting',
    assignees: [
      { id: '101', name: 'Sarah Johnson', avatar: 'SJ', color: 'bg-blue-500' },
      { id: '103', name: 'Emily Chen', avatar: 'EC', color: 'bg-purple-500' },
    ],
  },
  {
    id: '6',
    title: 'Social Media Campaign Launch',
    date: '2023-06-20',
    time: '10:00 AM - 11:00 AM',
    type: 'task',
    assignees: [
      { id: '103', name: 'Emily Chen', avatar: 'EC', color: 'bg-purple-500' },
    ],
  },
];

// Event Card Component
const EventCard = ({ event }: { event: any }) => {
  const eventTypeColors = {
    task: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500',
    meeting: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500',
    deadline: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500',
  };
  
  const eventColor = eventTypeColors[event.type as keyof typeof eventTypeColors] || eventTypeColors.task;
  
  return (
    <Card className="mb-2 hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className={eventColor}>
                {event.type === 'task' ? 'Task' : event.type === 'meeting' ? 'Meeting' : 'Deadline'}
              </Badge>
              <span className="text-xs text-muted-foreground">{event.time}</span>
            </div>
            <h4 className="font-medium text-sm">{event.title}</h4>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1">
          {event.assignees.slice(0, 3).map((assignee: any) => (
            <Avatar key={assignee.id} className={`h-6 w-6 ${assignee.color}`}>
              <span className="text-[10px] text-white">{assignee.avatar}</span>
            </Avatar>
          ))}
          {event.assignees.length > 3 && (
            <Avatar className="h-6 w-6 bg-gray-300">
              <span className="text-[10px] text-white">+{event.assignees.length - 3}</span>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Day Cell Component
const DayCell = ({ date, events }: { date: Date; events: any[] }) => {
  const dayEvents = events.filter(event => isSameDay(parseISO(event.date), date));
  
  return (
    <div className="min-h-[120px] border-t p-1">
      <div className="text-sm font-medium mb-1">{format(date, 'd')}</div>
      <div className="space-y-1">
        {dayEvents.map(event => (
          <div key={event.id} className="text-xs p-1 rounded bg-blue-50 dark:bg-blue-900/20 truncate">
            {event.title}
          </div>
        ))}
        {dayEvents.length > 2 && (
          <div className="text-xs text-muted-foreground text-center">+{dayEvents.length - 2} more</div>
        )}
      </div>
    </div>
  );
};

const CalendarPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState('month');
  
  // Calculate week interval
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Filter events for the current week
  const currentWeekEvents = eventsMock.filter(event => {
    const eventDate = parseISO(event.date);
    return eventDate >= weekStart && eventDate <= weekEnd;
  });
  
  // Group events by day for week view
  const eventsByDay = weekDays.map(day => {
    return {
      date: day,
      events: eventsMock.filter(event => isSameDay(parseISO(event.date), day))
    };
  });
  
  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select value={view} onValueChange={setView}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Plus size={16} className="mr-1" />
              Add Event
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <Button variant="outline" size="icon" onClick={() => setDate(addDays(date, -30))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold">{format(date, 'MMMM yyyy')}</h2>
                <Button variant="outline" size="icon" onClick={() => setDate(addDays(date, 30))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" onClick={() => setDate(new Date())}>
                  Today
                </Button>
              </div>
              
              <Tabs value={view} onValueChange={setView} className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="month" className="flex items-center gap-1">
                    <CalendarIcon size={14} />
                    Month
                  </TabsTrigger>
                  <TabsTrigger value="week" className="flex items-center gap-1">
                    <CalendarIcon size={14} />
                    Week
                  </TabsTrigger>
                  <TabsTrigger value="day" className="flex items-center gap-1">
                    <Clock size={14} />
                    Day
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <Tabs value={view} onValueChange={setView}>
              <TabsContent value="month">
                <div className="rounded-md border">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    className="p-3 pointer-events-auto"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="week">
                <div className="rounded-md border">
                  <div className="grid grid-cols-7 text-center p-2 bg-muted/20">
                    {weekDays.map((day) => (
                      <div key={day.toString()} className="text-sm font-medium">
                        {format(day, 'EEE')}
                        <div className="text-xs text-muted-foreground">{format(day, 'MMM d')}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 p-2">
                    {eventsByDay.map((day) => (
                      <div key={day.date.toString()} className="border rounded-md p-2 min-h-[200px]">
                        <div className="text-center mb-2">
                          <div className={`inline-flex items-center justify-center h-6 w-6 rounded-full 
                            ${isSameDay(day.date, new Date()) ? 'bg-primary text-primary-foreground' : ''}`}>
                            {format(day.date, 'd')}
                          </div>
                        </div>
                        <div className="space-y-1">
                          {day.events.map((event) => (
                            <div 
                              key={event.id} 
                              className="text-xs p-1 rounded bg-blue-50 dark:bg-blue-900/20 truncate cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30"
                            >
                              <div className="flex items-center gap-1">
                                <div className={`h-2 w-2 rounded-full ${event.type === 'task' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                                <span>{event.title}</span>
                              </div>
                              <div className="text-[10px] text-muted-foreground mt-0.5">{event.time}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="day">
                <div className="rounded-md border p-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-medium">{format(date, 'EEEE, MMMM d, yyyy')}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-muted-foreground" />
                      <h4 className="font-medium">Scheduled Events</h4>
                    </div>
                    
                    {eventsMock
                      .filter(event => isSameDay(parseISO(event.date), date))
                      .map(event => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    
                    {!eventsMock.some(event => isSameDay(parseISO(event.date), date)) && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No events scheduled for today</p>
                        <Button variant="outline" className="mt-2">
                          <Plus size={16} className="mr-1" />
                          Add Event
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-4">Upcoming Events</h3>
                <div className="space-y-2">
                  {eventsMock
                    .filter(event => new Date(event.date) >= new Date())
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(0, 5)
                    .map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Users size={16} className="text-muted-foreground" />
                  <h3 className="text-lg font-medium">Team Availability</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 bg-blue-500">
                        <span className="text-xs text-white">SJ</span>
                      </Avatar>
                      <span className="text-sm font-medium">Sarah Johnson</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
                      Available
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 bg-green-500">
                        <span className="text-xs text-white">MA</span>
                      </Avatar>
                      <span className="text-sm font-medium">Mike Anderson</span>
                    </div>
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500">
                      In Meeting
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 bg-purple-500">
                        <span className="text-xs text-white">EC</span>
                      </Avatar>
                      <span className="text-sm font-medium">Emily Chen</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                      Away
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 bg-yellow-500">
                        <span className="text-xs text-white">AT</span>
                      </Avatar>
                      <span className="text-sm font-medium">Alex Thompson</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
                      Available
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default CalendarPage;
