
import React, { useState, useEffect, useCallback } from 'react';
import { SidebarLayout } from '@/components/layout/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Users,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  format, 
  addDays, 
  subDays,
  addMonths,
  subMonths,
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  parseISO, 
  isToday,
  startOfMonth,
  endOfMonth,
  eachWeekOfInterval,
  isSameMonth
} from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useEmployeeStore } from "@/store/useEmployeeStore";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'task' | 'meeting' | 'deadline';
  assignees: Array<{
    id: string;
    name: string;
    avatar: string;
    color: string;
  }>;
  description?: string;
  googleCalendarId?: string;
  synced?: boolean;
}

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.date({
    required_error: "Date is required",
  }),
  time: z.string().min(1, "Time is required"),
  type: z.enum(["task", "meeting", "deadline"]),
  assigneeIds: z.array(z.string()).min(1, "At least one assignee is required"),
  syncToGoogleCalendar: z.boolean().optional().default(false),
});

type EventFormValues = z.infer<typeof eventSchema>;

// Event card component
const EventCard = ({ event, onSync }: { event: CalendarEvent, onSync?: (event: CalendarEvent) => void }) => {
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
              {event.synced && (
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
                  <CheckCircle2 size={12} className="mr-1" />
                  Synced
                </Badge>
              )}
            </div>
            <h4 className="font-medium text-sm">{event.title}</h4>
            {event.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{event.description}</p>
            )}
          </div>
          {onSync && !event.synced && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              onClick={() => onSync(event)}
              title="Sync to Google Calendar"
            >
              <ArrowUpRight size={14} />
            </Button>
          )}
        </div>
        <div className="mt-2 flex items-center gap-1">
          {event.assignees.slice(0, 3).map((assignee) => (
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

// Event for month view
const MonthViewEvent = ({ event }: { event: CalendarEvent }) => {
  const eventTypeColors = {
    task: 'bg-blue-500',
    meeting: 'bg-purple-500',
    deadline: 'bg-red-500',
  };
  
  const eventColor = eventTypeColors[event.type as keyof typeof eventTypeColors] || eventTypeColors.task;
  
  return (
    <div className={`text-xs px-1 py-0.5 rounded-sm truncate text-white ${eventColor} mb-1`}>
      {event.title}
    </div>
  );
};

// Day cell for month view
const DayCell = ({ 
  date, 
  events, 
  isCurrentMonth, 
  onDayClick,
  onAddEvent
}: { 
  date: Date; 
  events: CalendarEvent[]; 
  isCurrentMonth: boolean;
  onDayClick: (date: Date) => void;
  onAddEvent: (date: Date) => void;
}) => {
  const dayEvents = events.filter(event => isSameDay(parseISO(event.date), date));
  
  return (
    <div 
      className={cn(
        "min-h-[100px] border p-1 relative",
        isCurrentMonth ? "bg-background" : "bg-muted/20",
        isToday(date) ? "border-primary" : "border-border",
        "hover:bg-muted/20 cursor-pointer transition-colors"
      )}
      onClick={() => onDayClick(date)}
      onDoubleClick={() => onAddEvent(date)}
    >
      <div className={cn(
        "text-sm font-medium mb-1 text-center",
        !isCurrentMonth && "text-muted-foreground",
        isToday(date) && "bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center mx-auto"
      )}>
        {format(date, 'd')}
      </div>
      <div className="space-y-1 max-h-[80px] overflow-hidden">
        {dayEvents.slice(0, 3).map(event => (
          <MonthViewEvent key={event.id} event={event} />
        ))}
        {dayEvents.length > 3 && (
          <div className="text-xs text-muted-foreground text-center">+{dayEvents.length - 3} more</div>
        )}
      </div>
      
      {isCurrentMonth && (
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-5 w-5 absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onAddEvent(date);
          }}
        >
          <Plus size={12} />
        </Button>
      )}
    </div>
  );
};

// Month view grid
const MonthViewGrid = ({ 
  currentDate, 
  events, 
  onDayClick, 
  onAddEvent 
}: { 
  currentDate: Date; 
  events: CalendarEvent[]; 
  onDayClick: (date: Date) => void;
  onAddEvent: (date: Date) => void;
}) => {
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  
  // Get all weeks that include days of this month
  const calendarWeeks = eachWeekOfInterval(
    { 
      start: startOfWeek(firstDayOfMonth), 
      end: endOfWeek(lastDayOfMonth) 
    }
  );
  
  return (
    <div className="grid grid-cols-7 gap-px">
      {/* Day headers */}
      {eachDayOfInterval({ start: startOfWeek(new Date()), end: endOfWeek(new Date()) }).map((day) => (
        <div key={format(day, 'EEE')} className="text-center p-1 font-medium text-sm">
          {format(day, 'EEE')}
        </div>
      ))}
      
      {/* Calendar grid */}
      {calendarWeeks.map(week => 
        eachDayOfInterval({ start: week, end: addDays(week, 6) }).map(day => (
          <DayCell 
            key={day.toISOString()} 
            date={day} 
            events={events}
            isCurrentMonth={isSameMonth(day, currentDate)}
            onDayClick={onDayClick}
            onAddEvent={onAddEvent}
          />
        ))
      )}
    </div>
  );
};

// Initial events data
const initialEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Website Content Update',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '10:00 AM - 11:30 AM',
    type: 'task',
    assignees: [
      { id: '101', name: 'Sarah Johnson', avatar: 'SJ', color: 'bg-blue-500' },
    ],
    synced: true,
  },
  {
    id: '2',
    title: 'Quarterly Report Meeting',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
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

// Month title display component
const DisplayMonth = ({ month }: { month: Date }) => (
  <div className="text-center mb-4">
    <h3 className="text-lg font-medium">{format(month, 'MMMM yyyy')}</h3>
  </div>
);

// Google Calendar connection status component
const GoogleCalendarStatus = ({ 
  isConnected, 
  onConnect 
}: { 
  isConnected: boolean; 
  onConnect: () => void 
}) => (
  <Card className="mb-4">
    <CardContent className="p-4 flex items-center justify-between">
      <div className="flex items-center">
        <CalendarIcon className="mr-2 h-5 w-5 text-muted-foreground" />
        <div>
          <h3 className="text-sm font-medium">Google Calendar</h3>
          <p className="text-xs text-muted-foreground">
            {isConnected ? 'Connected and syncing' : 'Not connected'}
          </p>
        </div>
      </div>
      {isConnected ? (
        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
          <CheckCircle2 size={12} className="mr-1" />
          Connected
        </Badge>
      ) : (
        <Button size="sm" onClick={onConnect}>Connect</Button>
      )}
    </CardContent>
  </Card>
);

// Main Calendar page component
const CalendarPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState('month');
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isGCalConnected, setIsGCalConnected] = useState(false);
  const [connectingGCal, setConnectingGCal] = useState(false);
  const { toast } = useToast();
  const { employees } = useEmployeeStore();
  
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Get events for specific day
  const getDayEvents = useCallback(() => {
    return events.filter(event => isSameDay(parseISO(event.date), date));
  }, [events, date]);
  
  // Get events for current week
  const currentWeekEvents = events.filter(event => {
    const eventDate = parseISO(event.date);
    return eventDate >= weekStart && eventDate <= weekEnd;
  });
  
  // Get upcoming events
  const upcomingEvents = events
    .filter(event => {
      const eventDate = parseISO(event.date);
      return eventDate >= new Date();
    })
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 5);
  
  // Organize events by day for week view
  const eventsByDay = weekDays.map(day => {
    return {
      date: day,
      events: events.filter(event => isSameDay(parseISO(event.date), day))
    };
  });
  
  // Set up form for adding events
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      time: "",
      type: "meeting",
      assigneeIds: [],
      syncToGoogleCalendar: false,
    },
  });
  
  // Handle date click in calendar
  const handleDateClick = (selectedDate: Date) => {
    setDate(selectedDate);
    setView('day');
  };
  
  // Handle adding event for a specific date
  const handleAddEventWithDate = (selectedDate: Date) => {
    form.setValue('date', selectedDate);
    setIsAddEventOpen(true);
  };
  
  // Handle double click on calendar day
  const handleDayDoubleClick = (day: Date) => {
    handleAddEventWithDate(day);
  };
  
  // Handle form submission
  const onSubmit = (data: EventFormValues) => {
    const assignees = data.assigneeIds.map(id => {
      const employee = employees.find(e => e.id === id);
      return {
        id: employee?.id || id,
        name: employee?.name || 'Unknown',
        avatar: employee?.avatar || employee?.name.split(' ').map(n => n[0]).join('') || 'UN',
        color: employee?.color || 'bg-gray-500',
      };
    });
    
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      date: format(data.date, 'yyyy-MM-dd'),
      time: data.time,
      type: data.type,
      assignees,
      synced: data.syncToGoogleCalendar && isGCalConnected,
    };
    
    setEvents(prev => [...prev, newEvent]);
    
    setIsAddEventOpen(false);
    toast({
      title: "Event Added",
      description: `"${data.title}" has been scheduled for ${format(data.date, 'MMM dd, yyyy')}`
    });
    
    if (data.syncToGoogleCalendar && isGCalConnected) {
      toast({
        title: "Google Calendar Sync",
        description: `"${data.title}" has been synced to Google Calendar`,
      });
    }
    
    form.reset();
  };
  
  // Team availability data
  const teamAvailability = employees.map(emp => ({
    id: emp.id,
    name: emp.name,
    avatar: emp.avatar || emp.name.split(' ').map(n => n[0]).join(''),
    color: emp.color || 'bg-gray-500',
    status: Math.random() > 0.3 ? 'active' : (Math.random() > 0.5 ? 'inactive' : 'away')
  })).slice(0, 4);
  
  // Handle Google Calendar connection
  const handleGoogleCalendarConnect = () => {
    setConnectingGCal(true);
    
    toast({
      title: "Google Calendar Integration",
      description: "Connecting to Google Calendar...",
    });
    
    // Simulate connection process
    setTimeout(() => {
      setIsGCalConnected(true);
      setConnectingGCal(false);
      
      toast({
        title: "Connected Successfully",
        description: "Your events have been synced with Google Calendar.",
      });
    }, 2000);
  };
  
  // Handle month navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    setDate(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
  };
  
  // Handle sync single event to Google Calendar
  const syncEventToGCal = (event: CalendarEvent) => {
    if (!isGCalConnected) {
      toast({
        title: "Google Calendar Not Connected",
        description: "Please connect to Google Calendar first.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Syncing Event",
      description: `Syncing "${event.title}" to Google Calendar...`,
    });
    
    // Simulate syncing process
    setTimeout(() => {
      setEvents(prev => 
        prev.map(e => 
          e.id === event.id 
            ? { ...e, synced: true, googleCalendarId: `gcal-${Date.now()}` } 
            : e
        )
      );
      
      toast({
        title: "Event Synced",
        description: `"${event.title}" has been synced to Google Calendar.`,
      });
    }, 1500);
  };
  
  // Navigation to today
  const goToToday = () => {
    setDate(new Date());
  };
  
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
            <Button 
              variant="outline" 
              onClick={handleGoogleCalendarConnect} 
              className="gap-1"
              disabled={isGCalConnected || connectingGCal}
            >
              <CalendarIcon size={16} />
              <span className="hidden md:inline">
                {connectingGCal ? 'Connecting...' : isGCalConnected ? 'Synced' : 'Sync'}
              </span>
              {isGCalConnected ? <CheckCircle2 size={14} className="text-green-500" /> : <ArrowUpRight size={14} />}
            </Button>
            <Button onClick={() => setIsAddEventOpen(true)}>
              <Plus size={16} className="mr-1" />
              Add Event
            </Button>
          </div>
        </div>
        
        {/* Google Calendar status (only show if not connected) */}
        {!isGCalConnected && (
          <GoogleCalendarStatus 
            isConnected={isGCalConnected} 
            onConnect={handleGoogleCalendarConnect} 
          />
        )}
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => view === 'month' ? navigateMonth('prev') : setDate(subDays(date, 7))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold">{format(date, 'MMMM yyyy')}</h2>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => view === 'month' ? navigateMonth('next') : setDate(addDays(date, 7))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" onClick={goToToday}>
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
              <TabsContent value="month" className="mt-0">
                <div className="rounded-md border">
                  <MonthViewGrid 
                    currentDate={date} 
                    events={events} 
                    onDayClick={handleDateClick}
                    onAddEvent={handleAddEventWithDate}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="week">
                <div className="rounded-md border">
                  <div className="grid grid-cols-7 text-center p-2 bg-muted/20">
                    {weekDays.map((day) => (
                      <div key={day.toString()} className="text-sm font-medium">
                        {format(day, 'EEE')}
                        <div className={cn(
                          "text-xs mx-auto w-6 h-6 flex items-center justify-center rounded-full", 
                          isToday(day) ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                        )}>
                          {format(day, 'd')}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 p-2">
                    {eventsByDay.map((day) => (
                      <div 
                        key={day.date.toString()} 
                        className={cn(
                          "border rounded-md p-2 min-h-[200px] cursor-pointer",
                          isToday(day.date) && "border-primary"
                        )}
                        onDoubleClick={() => handleAddEventWithDate(day.date)}
                      >
                        <div className="space-y-1">
                          {day.events.map((event) => (
                            <div 
                              key={event.id} 
                              className="text-xs p-1 rounded bg-blue-50 dark:bg-blue-900/20 truncate cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30"
                            >
                              <div className="flex items-center gap-1">
                                <div className={`h-2 w-2 rounded-full ${event.type === 'task' ? 'bg-blue-500' : event.type === 'meeting' ? 'bg-purple-500' : 'bg-red-500'}`}></div>
                                <span>{event.title}</span>
                                {event.synced && <CheckCircle2 size={10} className="text-green-500 ml-auto" />}
                              </div>
                              <div className="text-[10px] text-muted-foreground mt-0.5">{event.time}</div>
                            </div>
                          ))}
                          
                          {day.events.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full min-h-[120px] text-muted-foreground">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs"
                                onClick={() => handleAddEventWithDate(day.date)}
                              >
                                <Plus size={12} className="mr-1" />
                                Add
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="day">
                <div className="rounded-md border p-4">
                  <DisplayMonth month={date} />
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-muted-foreground" />
                      <h4 className="font-medium">{format(date, 'EEEE, MMMM d, yyyy')}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleAddEventWithDate(date)}
                        className="ml-auto"
                      >
                        <Plus size={14} className="mr-1" />
                        Add
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {getDayEvents().map(event => (
                        <EventCard 
                          key={event.id} 
                          event={event} 
                          onSync={!event.synced && isGCalConnected ? syncEventToGCal : undefined} 
                        />
                      ))}
                      
                      {getDayEvents().length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No events scheduled for this day</p>
                          <Button 
                            variant="outline" 
                            className="mt-2" 
                            onClick={() => handleAddEventWithDate(date)}
                          >
                            <Plus size={16} className="mr-1" />
                            Add Event
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map(event => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        onSync={!event.synced && isGCalConnected ? syncEventToGCal : undefined}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No upcoming events</p>
                      <Button 
                        variant="outline" 
                        className="mt-2" 
                        onClick={() => setIsAddEventOpen(true)}
                      >
                        <Plus size={16} className="mr-1" />
                        Add Event
                      </Button>
                    </div>
                  )}
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
                  {teamAvailability.map((employee) => (
                    <div key={employee.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Avatar className={`h-8 w-8 ${employee.color}`}>
                          <div className="flex items-center justify-center w-full h-full text-white">
                            {employee.avatar}
                          </div>
                        </Avatar>
                        <span className="text-sm font-medium">{employee.name}</span>
                      </div>
                      <Badge className={
                        employee.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : employee.status === 'inactive'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }>
                        {employee.status === 'active' ? 'Available' : 
                         employee.status === 'inactive' ? 'Unavailable' : 'Away'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Event title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal h-10"
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>Time</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</SelectItem>
                          <SelectItem value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</SelectItem>
                          <SelectItem value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</SelectItem>
                          <SelectItem value="12:00 PM - 1:00 PM">12:00 PM - 1:00 PM</SelectItem>
                          <SelectItem value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</SelectItem>
                          <SelectItem value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</SelectItem>
                          <SelectItem value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</SelectItem>
                          <SelectItem value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="task">Task</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="assigneeIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignees</FormLabel>
                    <Select
                      value={field.value.length > 0 ? field.value[0] : undefined}
                      onValueChange={(value) => field.onChange([value])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add a description..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {isGCalConnected && (
                <FormField
                  control={form.control}
                  name="syncToGoogleCalendar"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Sync to Google Calendar
                      </FormLabel>
                    </FormItem>
                  )}
                />
              )}
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddEventOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Event</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </SidebarLayout>
  );
};

export default CalendarPage;
