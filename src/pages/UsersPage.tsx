import { useQuery } from '@tanstack/react-query';
import UserPermissions from '../components/UserPermissions';
import { useUsers } from '../hooks/useUsers';

export function UsersPage() {
  const { data: usersData, isLoading } = useUsers({ page: 1, size: 50 });

  const handleUpdatePersonnel = (updated: any) => {
    console.log('Update user:', updated);
  };

  const handleAddLog = (event: string, category: any, details: string, payload?: string) => {
    console.log('Add log:', { event, category, details, payload });
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading personnel...</div>;
  }

  return (
    <UserPermissions
      personnel={usersData?.content ?? []}
      onUpdatePersonnel={handleUpdatePersonnel}
      onAddLog={handleAddLog}
    />
  );
}