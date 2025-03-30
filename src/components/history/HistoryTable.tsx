
import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { AnalysisResult } from '@/components/analyzer/ResultsSection';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [analysisToDelete, setAnalysisToDelete] = useState<string | null>(null);
  
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
  
  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent row click event from firing
    setAnalysisToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (analysisToDelete) {
      onDeleteAnalysis(analysisToDelete);
      setAnalysisToDelete(null);
    }
    setDeleteDialogOpen(false);
  };
  
  return (
    <>
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
                    onClick={(e) => handleDeleteClick(e, analysis.id)}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border-4 border-black bg-white shadow-brutal">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-black text-base">
              Are you sure you want to delete this analysis? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="brutal-button-outline font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="brutal-button-destructive font-bold"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default HistoryTable;
