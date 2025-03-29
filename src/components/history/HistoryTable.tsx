
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
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
}

const HistoryTable: React.FC<HistoryTableProps> = ({ analyses, onViewDetails }) => {
  
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
                onClick={() => onViewDetails(analysis)}
                className="brutal-button-secondary text-xs px-2 py-1"
              >
                View Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default HistoryTable;
