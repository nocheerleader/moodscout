
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import HistoryHeader from '@/components/history/HistoryHeader';
import HistoryContent from '@/components/history/HistoryContent';
import type { AnalysisResult } from '@/components/analyzer/ResultsSection';

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
    if (user) {
      fetchAnalyses();
    }
  }, [user]);
  
  const fetchAnalyses = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log('Analyses fetched:', data); // Debug log
      
      // Transform the data to ensure analysis_result is properly typed
      const typedAnalyses: Analysis[] = (data || []).map(item => ({
        id: item.id,
        created_at: item.created_at,
        input_text: item.input_text,
        analysis_result: item.analysis_result as AnalysisResult
      }));
      
      setAnalyses(typedAnalyses);
    } catch (err) {
      console.error('Error fetching analyses:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analysis history');
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteAnalysis = async (id: string) => {
    if (!user) return;
    
    try {
      console.log(`Attempting to delete analysis with id: ${id}`); // Debug log
      
      // First delete from the database
      const { data, error } = await supabase
        .from('analyses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
        .select(); // Add .select() to return the deleted row(s)
      
      console.log('Delete response:', { data, error }); // Debug log
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Then update the UI state
      setAnalyses(prev => prev.filter(analysis => analysis.id !== id));
      
      toast({
        title: "Analysis Deleted",
        description: "The analysis has been removed from your history.",
      });
      
      // Refresh the list to ensure sync with the database
      fetchAnalyses();
    } catch (err) {
      console.error('Error deleting analysis:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to delete analysis',
        variant: "destructive",
      });
    }
  };
  
  const clearHistory = async () => {
    if (!user) return;
    
    try {
      console.log(`Attempting to clear history for user: ${user.id}`); // Debug log
      
      // First delete from the database
      const { data, error } = await supabase
        .from('analyses')
        .delete()
        .eq('user_id', user.id)
        .select(); // Add .select() to return the deleted rows
      
      console.log('Clear history response:', { data, error }); // Debug log
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Then update the UI state
      setAnalyses([]);
      
      toast({
        title: "History Cleared",
        description: "Your analysis history has been cleared.",
      });
      
      // Refresh the list to ensure sync with the database
      fetchAnalyses();
    } catch (err) {
      console.error('Error clearing history:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to clear history',
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
          onDeleteAnalysis={deleteAnalysis}
        />
      </main>
    </div>
  );
};

export default History;
