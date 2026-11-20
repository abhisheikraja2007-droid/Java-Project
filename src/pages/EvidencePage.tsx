import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import EvidenceInventory from '../components/EvidenceInventory';
import { useEvidence } from '../hooks/useEvidence';
import { useAuthStore } from '../stores/authStore';

export function EvidencePage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: evidenceData, isLoading } = useEvidence({ page: 1, size: 100 });

  const handleUpdateEvidence = async (updated: any) => {
    // In real app: call mutation
    console.log('Update evidence:', updated);
  };

  const handleAddLog = (event: string, category: any, details: string, payload?: string) => {
    console.log('Add log:', { event, category, details, payload });
  };

  const handleNavigate = (view: string, id?: string) => {
    if (view === 'case_detail' && id) {
      window.location.href = `/cases/${id}`;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading evidence...</div>;
  }

  return (
    <EvidenceInventory
      evidence={evidenceData?.content ?? []}
      onUpdateEvidence={handleUpdateEvidence}
      onAddLog={handleAddLog}
      onNavigate={handleNavigate}
    />
  );
}