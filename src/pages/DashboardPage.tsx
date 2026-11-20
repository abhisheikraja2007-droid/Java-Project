import { useQuery } from '@tanstack/react-query';
import CommandDashboard from '../components/CommandDashboard';
import { useCases } from '../hooks/useCases';
import { useEvidence } from '../hooks/useEvidence';
import { useAuditLogs } from '../hooks/useAuditLogs';

export function DashboardPage() {
  const { data: casesData } = useCases({ page: 1, size: 10 });
  const { data: evidenceData } = useEvidence({ page: 1, size: 10 });
  const { data: auditData } = useAuditLogs({ page: 1, size: 10 });

  return (
    <CommandDashboard
      cases={casesData?.content ?? []}
      evidence={evidenceData?.content ?? []}
      logs={auditData?.content ?? []}
      onNavigate={(view: string, id?: string) => {
        // Navigation handled by router in real app; this maintains backward compat
        console.log('Navigate:', view, id);
      }}
    />
  );
}