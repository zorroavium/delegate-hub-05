import React, { useState, useEffect } from 'react';
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
  ArrowUpRight
} from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO, isToday } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
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
});

type EventFormValues = z.infer<typeof eventSchema>;

const EventCard = ({ event }: { event: CalendarEvent }) => {
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
            {event.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{event.description}</p>
            )}
          </div>
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

const DisplayMonth = ({ month }: { month: Date }) => (
  <div className="text-center mb-4">
    <h3 className="text-lg font-medium">{format(month, 'MMMM yyyy')}</h3>
  </div>
);

const CalendarPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState('month');
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const { toast } = useToast();
  const { employees } = useEmployeeStore();
  
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const getDayEvents = () => {
    return events.filter(event => isSameDay(parseISO(event.date), date));
  };
  
  const currentWeekEvents = events.filter(event => {
    const eventDate = parseISO(event.date);
    return eventDate >= weekStart && eventDate <= weekEnd;
  });
  
  const upcomingEvents = events
    .filter(event => {
      const eventDate = parseISO(event.date);
      return eventDate >= new Date();
    })
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 5);
  
  const eventsByDay = weekDays.map(day => {
    return {
      date: day,
      events: events.filter(event => isSameDay(parseISO(event.date), day))
    };
  });
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      time: "",
      type: "meeting",
      assigneeIds: [],
    },
  });
  
  const handleDateClick = (selectedDate: Date) => {
    setDate(selectedDate);
    setView('day');
  };
  
  const handleAddEventWithDate = (selectedDate: Date) => {
    form.setValue('date', selectedDate);
    setIsAddEventOpen(true);
  };
  
  const handleDayDoubleClick = (day: Date) => {
    handleAddEventWithDate(day);
  };
  
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
    };
    
    setEvents(prev => [...prev, newEvent]);
    
    setIsAddEventOpen(false);
    toast({
      title: "Event Added",
      description: `"${data.title}" has been scheduled for ${format(data.date, 'MMM dd, yyyy')}`
    });
    
    form.reset();
  };
  
  const teamAvailability = employees.map(emp => ({
    id: emp.id,
    name: emp.name,
    avatar: emp.avatar || emp.name.split(' ').map(n => n[0]).join(''),
    color: emp.color || 'bg-gray-500',
    status: Math.random() > 0.3 ? 'active' : (Math.random() > 0.5 ? 'inactive' : 'away')
  })).slice(0, 4);
  
  const handleGoogleCalendarConnect = () => {
    toast({
      title: "Google Calendar Integration",
      description: "Connecting to Google Calendar...",
    });
    
    setTimeout(() => {
      toast({
        title: "Connected Successfully",
        description: "Your events have been synced with Google Calendar.",
      });
    }, 2000);
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
            <Button variant="outline" onClick={handleGoogleCalendarConnect} className="gap-1">
              <CalendarIcon size={16} />
              <span className="hidden md:inline">Sync</span>
              <ArrowUpRight size={14} />
            </Button>
            <Button onClick={() => setIsAddEventOpen(true)}>
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
                    onDayClick={(day) => handleDateClick(day)}
                    onDayDoubleClick={handleDayDoubleClick}
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
                      <div 
                        key={day.date.toString()} 
                        className="border rounded-md p-2 min-h-[200px] cursor-pointer"
                        onDoubleClick={() => handleAddEventWithDate(day.date)}
                      >
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
                                <div className={`h-2 w-2 rounded-full ${event.type === 'task' ? 'bg-blue-500' : event.type === 'meeting' ? 'bg-purple-500' : 'bg-red-500'}`}></div>
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
                  <DisplayMonth month={date} />
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-muted-foreground" />
                      <h4 className="font-medium">Scheduled Events</h4>
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
                    
                    {getDayEvents().map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                    
                    {getDayEvents().length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No events scheduled for today</p>
                        <Button variant="outline" className="mt-2" onClick={() => handleAddEventWithDate(date)}>
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
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No upcoming events</p>
                      <Button variant="outline" className="mt-2" onClick={() => setIsAddEventOpen(true)}>
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
                  </FormItem>
                )}
              />
              
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
