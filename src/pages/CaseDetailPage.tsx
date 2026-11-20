import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import CaseDetail from '../components/CaseDetail';
import { useCases } from '../hooks/useCases';
import { useSuspects } from '../hooks/useSuspects';
import { useEvidence } from '../hooks/useEvidence';
import { useAuthStore } from '../stores/authStore';

export function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: caseData, isLoading: caseLoading } = useCases({ page: 1, size: 100 });
  const { data: suspectsData, isLoading: suspectsLoading } = useSuspects({ page: 1, size: 100 });
  const { data: evidenceData, isLoading: evidenceLoading } = useEvidence({ page: 1, size: 100 });

  const selectedCase = caseData?.content?.find(c => c.id === id);
  const suspects = suspectsData?.content || [];
  const evidence = evidenceData?.content || [];

  const handleUpdateCase = (updated: any) => {
    // In real app: call update mutation
    console.log('Update case:', updated);
  };

  const handleUpdateEvidence = (updated: any) => {
    console.log('Update evidence:', updated);
  };

  const handleAddLog = (event: string, category: any, details: string, payload?: string) => {
    console.log('Add log:', { event, category, details, payload });
  };

  const handleNavigate = (view: string, viewId?: string) => {
    if (view === 'case_detail' && viewId) {
      navigate(`/cases/${viewId}`);
    } else {
      navigate(`/${view}`);
    }
  };

  if (caseLoading || suspectsLoading || evidenceLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading case...</div>;
  }

  if (!selectedCase) {
    return <div className="min-h-screen flex items-center justify-center">Case not found</div>;
  }

  return (
    <CaseDetail
      caseData={selectedCase}
      suspects={suspects}
      evidence={evidence}
      onUpdateCase={handleUpdateCase}
      onUpdateEvidence={handleUpdateEvidence}
      onAddLog={handleAddLog}
      onNavigate={handleNavigate}
    />
  );
}