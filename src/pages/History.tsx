
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import HistoryItem from '@/components/history/HistoryItem';
import type { AnalysisResult } from '@/components/analyzer/ResultsSection';
import type { Json } from '@/integrations/supabase/types';

interface Analysis {
  id: string;
  created_at: string;
  input_text: string;
  analysis_result: AnalysisResult;
}

const History = () => {
  const { user, signOut } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  
  useEffect(() => {
    fetchAnalyses();
  }, [user]);
  
  const fetchAnalyses = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Transform the data to ensure analysis_result is properly typed
      const typedAnalyses: Analysis[] = (data || []).map(item => ({
        id: item.id,
        created_at: item.created_at,
        input_text: item.input_text,
        user_id: item.user_id,
        analysis_result: item.analysis_result as AnalysisResult
      }));
      
      setAnalyses(typedAnalyses);
    } catch (err: any) {
      console.error('Error fetching analyses:', err);
      setError(err.message || 'Failed to load analysis history');
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearHistory = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('analyses')
        .delete()
        .match({ user_id: user.id });
      
      if (error) {
        throw new Error(error.message);
      }
      
      setAnalyses([]);
      setSelectedAnalysis(null);
      toast({
        title: "History Cleared",
        description: "Your analysis history has been cleared.",
      });
    } catch (err: any) {
      console.error('Error clearing history:', err);
      toast({
        title: "Error",
        description: err.message || 'Failed to clear history',
        variant: "destructive",
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const truncateText = (text: string, maxLength: number = 40) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="border-b-4 border-black bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">MoodScout</Link>
            
            <div className="flex items-center gap-4">
              <Link to="/analyzer" className="brutal-button-outline text-base px-4 py-2">
                Analyzer
              </Link>
              <Button 
                onClick={signOut}
                className="brutal-button-primary text-base px-4 py-2"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Analysis History</h1>
        
        <div className="relative">
          <div className="absolute -top-3 -left-3 w-full h-full bg-[#FCBF49]/20 rounded-lg border-4 border-black"></div>
          <div className="relative z-10 bg-white p-6 rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Recent Analyses</h2>
              {analyses.length > 0 && (
                <Button 
                  className="brutal-button-outline text-base px-4 py-2"
                  onClick={clearHistory}
                >
                  Clear History
                </Button>
              )}
            </div>
            
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border-2 border-gray-200 rounded-md">
                    <Skeleton className="h-6 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            ) : analyses.length > 0 ? (
              <>
                {selectedAnalysis ? (
                  <div>
                    <Button 
                      onClick={() => setSelectedAnalysis(null)}
                      className="brutal-button-outline text-base px-4 py-2 mb-4"
                    >
                      Back to List
                    </Button>
                    <HistoryItem analysis={selectedAnalysis} />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Text Sample</TableHead>
                        <TableHead>Sentiment</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analyses.map((analysis) => (
                        <TableRow key={analysis.id}>
                          <TableCell>{formatDate(analysis.created_at)}</TableCell>
                          <TableCell>{truncateText(analysis.input_text)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              analysis.analysis_result.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                              analysis.analysis_result.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {analysis.analysis_result.sentiment}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button 
                              onClick={() => setSelectedAnalysis(analysis)}
                              className="brutal-button-secondary text-xs px-2 py-1"
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-bold mb-2">No analyses yet</h3>
                <p className="text-gray-500 mb-4">Your analysis history will appear here</p>
                <Link to="/analyzer" className="brutal-button-secondary text-base px-4 py-2">
                  Start Analyzing
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default History;
