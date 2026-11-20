import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SuspectProfile from '../components/SuspectProfile';
import { useSuspects } from '../hooks/useSuspects';
import { useAuthStore } from '../stores/authStore';

export function SuspectsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: suspectsData, isLoading } = useSuspects({ page: 1, size: 100 });

  const handleUpdateSuspect = async (updated: any) => {
    console.log('Update suspect:', updated);
  };

  const handleAddLog = (event: string, category: any, details: string, payload?: string) => {
    console.log('Add log:', { event, category, details, payload });
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading suspects...</div>;
  }

  return (
    <SuspectProfile
      suspects={suspectsData?.content ?? []}
      onUpdateSuspect={handleUpdateSuspect}
      onAddLog={handleAddLog}
    />
  );
}