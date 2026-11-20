import { useQuery } from '@tanstack/react-query';
import AuditLogs from '../components/AuditLogs';
import { useAuditLogs } from '../hooks/useAuditLogs';

export function AuditPage() {
  const { data: auditData, isLoading } = useAuditLogs({ page: 1, size: 50 });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading audit logs...</div>;
  }

  return (
    <AuditLogs
      logs={auditData?.content ?? []}
    />
  );
}