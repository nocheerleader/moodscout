
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { AnalysisResult } from '@/components/analyzer/ResultsSection';

interface Analysis {
  id: string;
  created_at: string;
  input_text: string;
  analysis_result: AnalysisResult;
}

interface HistoryTableProps {
  analyses: Analysis[];
  onViewDetails: (analysis: Analysis) => void;
  onDeleteAnalysis: (id: string) => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ analyses, onViewDetails, onDeleteAnalysis }) => {
  
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
  
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent row click event from firing
    
    // Confirm before deleting
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      onDeleteAnalysis(id);
    }
  };
  
  return (
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
              <div className="flex space-x-2">
                <Button 
                  onClick={() => onViewDetails(analysis)}
                  className="brutal-button-secondary text-xs px-2 py-1"
                >
                  View Details
                </Button>
                <Button 
                  onClick={(e) => handleDelete(e, analysis.id)}
                  className="brutal-button-destructive text-xs px-2 py-1"
                  title="Delete analysis"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default HistoryTable;
