
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

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain size={20} /> AI-Powered Insights
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
            >
              {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
              Generate Full Report
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="insights" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="insights">Automated Insights</TabsTrigger>
              <TabsTrigger value="ask">Ask AI</TabsTrigger>
            </TabsList>
            
            <TabsContent value="insights" className="space-y-4 mt-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <Tabs value={activeInsightTab} onValueChange={setActiveInsightTab}>
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="performance">
                      <div className="flex items-center gap-1">
                        <BarChart4 size={16} />
                        <span className="hidden sm:inline">Performance</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="bottlenecks">
                      <div className="flex items-center gap-1">
                        <TrendingUp size={16} />
                        <span className="hidden sm:inline">Bottlenecks</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="predictions">
                      <div className="flex items-center gap-1">
                        <Lightbulb size={16} />
                        <span className="hidden sm:inline">Predictions</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="performance" className="mt-4">
                    <div className="whitespace-pre-line text-sm">{generateInsights('performance')}</div>
                  </TabsContent>
                  
                  <TabsContent value="bottlenecks" className="mt-4">
                    <div className="whitespace-pre-line text-sm">{generateInsights('bottlenecks')}</div>
                  </TabsContent>
                  
                  <TabsContent value="predictions" className="mt-4">
                    <div className="whitespace-pre-line text-sm">{generateInsights('predictions')}</div>
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
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Analysis Results:</div>
                    <div className="whitespace-pre-line text-sm">{customResponse}</div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-xs text-muted-foreground">
            Insights are generated based on your organization's historical data and patterns
          </p>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4 mr-2" /> Export Insights
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
