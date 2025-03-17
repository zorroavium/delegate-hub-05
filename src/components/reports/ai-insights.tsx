
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Brain, Download, RefreshCw, FileDown, BarChart4, TrendingUp, Lightbulb } from 'lucide-react';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { useTaskStore } from '@/store/useTaskStore';

// Mock AI responses for various insights
const mockAIResponses = {
  performance: `Based on the current data, the team's performance shows several trends:

1. Task completion rate is at 68%, which is a 5% improvement over last month.
2. High priority tasks are being completed 1.2 days faster on average.
3. The Audit & Assurance department has the highest productivity score.
4. Three team members have consistently exceeded their targets: John Doe, Emma Watson, and Michael Chen.

Recommendation: Consider replicating the work processes of the Audit & Assurance team across other departments.`,

  bottlenecks: `Analysis reveals the following workflow bottlenecks:

1. Tasks in the "In Review" stage remain there for an average of 3.2 days, significantly longer than other stages.
2. Resource allocation for complex tasks appears insufficient, with 62% of delayed tasks falling in this category.
3. Communication delays between departments are adding an average of 1.5 days to cross-functional tasks.

Recommendation: Implement a daily quick review session for tasks in the "In Review" stage and allocate additional resources to complex tasks.`,

  predictions: `Based on current trends, the system predicts:

1. The current project trajectory suggests completion in approximately 28 days, which is 3 days behind schedule.
2. Resource utilization will peak next week, potentially causing delays if not addressed.
3. Client satisfaction scores are projected to increase by 8% if current quality improvements continue.

Recommendation: Consider reallocating resources next week to prevent bottlenecks during the predicted utilization peak.`
};

interface AIInsightsProps {
  className?: string;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ className }) => {
  const { toast } = useToast();
  const { employees } = useEmployeeStore();
  const { tasks } = useTaskStore();
  const [isLoading, setIsLoading] = useState(false);
  const [customQuery, setCustomQuery] = useState('');
  const [customResponse, setCustomResponse] = useState('');
  const [activeInsightTab, setActiveInsightTab] = useState('performance');

  // Calculate some metrics from actual data for more dynamic insights
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;

  // Function to generate insights based on actual data
  const generateInsights = (type: string): string => {
    let baseInsight = mockAIResponses[type as keyof typeof mockAIResponses] || '';
    
    // Replace placeholder values with actual data
    baseInsight = baseInsight.replace('68%', `${completionRate}%`);
    
    return baseInsight;
  };

  // Handle custom query submission
  const handleCustomQuery = async () => {
    if (!customQuery.trim()) {
      toast({
        title: "Query required",
        description: "Please enter a question to analyze the data",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to AI service
    setTimeout(() => {
      // Generate a contextual response based on the query
      let response = '';
      
      if (customQuery.toLowerCase().includes('performance')) {
        response = generateInsights('performance');
      } else if (customQuery.toLowerCase().includes('bottleneck') || customQuery.toLowerCase().includes('delay')) {
        response = generateInsights('bottlenecks');
      } else if (customQuery.toLowerCase().includes('predict') || customQuery.toLowerCase().includes('forecast')) {
        response = generateInsights('predictions');
      } else {
        response = `Based on the available data:\n\n1. There are ${totalTasks} total tasks, with ${completedTasks} completed (${completionRate}% completion rate).\n2. The organization has ${activeEmployees} active employees.\n3. The data shows that further analysis could provide more specific insights related to your query.`;
      }
      
      setCustomResponse(response);
      setIsLoading(false);
      
      toast({
        title: "Analysis complete",
        description: "AI has analyzed your data and generated insights"
      });
    }, 2000);
  };

  // Handle full report generation
  const handleGenerateFullReport = () => {
    setIsLoading(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Report generated",
        description: "Full AI analysis report is ready for download"
      });
    }, 3000);
  };

  // Function to get background gradient based on tab
  const getTabGradient = (tab: string) => {
    switch (tab) {
      case 'performance':
        return 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/30';
      case 'bottlenecks':
        return 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/30';
      case 'predictions':
        return 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/30';
      default:
        return 'bg-muted/50';
    }
  };

  // Function to get insight text color based on tab
  const getTextColorClass = (tab: string) => {
    switch (tab) {
      case 'performance':
        return 'text-blue-700 dark:text-blue-300';
      case 'bottlenecks':
        return 'text-amber-700 dark:text-amber-300';
      case 'predictions':
        return 'text-purple-700 dark:text-purple-300';
      default:
        return '';
    }
  };

  // Function to get highlight span color
  const getHighlightColor = (tab: string) => {
    switch (tab) {
      case 'performance':
        return 'bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
      case 'bottlenecks':
        return 'bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200';
      case 'predictions':
        return 'bg-purple-200 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200';
      default:
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Function to format insight text with highlights
  const formatInsightText = (text: string, tab: string) => {
    // Convert the text to React elements with highlights
    const parts = text.split(/(\d+%|\d+\.\d+|\d+ days)/g);
    
    return (
      <>
        {parts.map((part, index) => {
          // Check if this part matches our pattern for highlighting
          if (/^\d+%$|^\d+\.\d+$|^\d+ days$/.test(part)) {
            return (
              <span key={index} className={`px-1.5 py-0.5 rounded font-medium ${getHighlightColor(tab)}`}>
                {part}
              </span>
            );
          }
          return part;
        })}
      </>
    );
  };

  return (
    <div className={className}>
      <Card className="overflow-hidden border-t-4 border-t-primary shadow-md">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain size={20} className="text-primary" /> AI-Powered Insights
              </CardTitle>
              <CardDescription>
                Intelligent analysis of your organization's data to uncover trends and opportunities
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleGenerateFullReport}
              disabled={isLoading}
              className="bg-white/50 hover:bg-white/80 dark:bg-gray-900/50 dark:hover:bg-gray-900/80"
            >
              {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
              Generate Full Report
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-5">
          <Tabs defaultValue="insights" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/80">
              <TabsTrigger value="insights" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Automated Insights</TabsTrigger>
              <TabsTrigger value="ask" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Ask AI</TabsTrigger>
            </TabsList>
            
            <TabsContent value="insights" className="space-y-4 mt-4">
              <div className={`rounded-lg p-4 ${getTabGradient(activeInsightTab)}`}>
                <Tabs value={activeInsightTab} onValueChange={setActiveInsightTab}>
                  <TabsList className="grid grid-cols-3 bg-white/60 dark:bg-gray-800/60">
                    <TabsTrigger value="performance" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      <div className="flex items-center gap-1">
                        <BarChart4 size={16} />
                        <span className="hidden sm:inline">Performance</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="bottlenecks" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                      <div className="flex items-center gap-1">
                        <TrendingUp size={16} />
                        <span className="hidden sm:inline">Bottlenecks</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="predictions" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                      <div className="flex items-center gap-1">
                        <Lightbulb size={16} />
                        <span className="hidden sm:inline">Predictions</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="performance" className="mt-4">
                    <div className={`whitespace-pre-line text-sm ${getTextColorClass('performance')}`}>
                      {formatInsightText(generateInsights('performance'), 'performance')}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="bottlenecks" className="mt-4">
                    <div className={`whitespace-pre-line text-sm ${getTextColorClass('bottlenecks')}`}>
                      {formatInsightText(generateInsights('bottlenecks'), 'bottlenecks')}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="predictions" className="mt-4">
                    <div className={`whitespace-pre-line text-sm ${getTextColorClass('predictions')}`}>
                      {formatInsightText(generateInsights('predictions'), 'predictions')}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>
            
            <TabsContent value="ask" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Ask a question about your data..."
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    className="border-primary/30 focus-visible:ring-primary"
                  />
                  <Button 
                    onClick={handleCustomQuery} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : 'Analyze'}
                  </Button>
                </div>
                
                {customResponse && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-4 shadow-inner">
                    <div className="text-sm font-medium mb-2 flex items-center">
                      <Brain size={16} className="mr-2 text-primary" />
                      Analysis Results:
                    </div>
                    <div className="whitespace-pre-line text-sm">
                      {formatInsightText(customResponse, 'performance')}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between bg-muted/30 px-5 py-3">
          <p className="text-xs text-muted-foreground">
            Insights are generated based on your organization's historical data and patterns
          </p>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
            <Download className="h-4 w-4 mr-2" /> Export Insights
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
