
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import HistoryHeader from '@/components/history/HistoryHeader';
import HistoryContent from '@/components/history/HistoryContent';
import type { AnalysisResult } from '@/components/analyzer/ResultsSection';
import type { Json } from '@/integrations/supabase/types';

interface Analysis {
  id: string;
  created_at: string;
  input_text: string;
  analysis_result: AnalysisResult;
}

const History = () => {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
  
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <HistoryHeader title="MoodScout" />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Analysis History</h1>
        
        <HistoryContent 
          analyses={analyses}
          isLoading={isLoading}
          error={error}
          onClearHistory={clearHistory}
        />
      </main>
    </div>
  );
};

export default History;
