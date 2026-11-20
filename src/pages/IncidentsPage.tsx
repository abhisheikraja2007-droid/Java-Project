import { useQuery } from '@tanstack/react-query';
import IncidentReporting from '../components/IncidentReporting';
import { useIncidents } from '../hooks/useIncidents';

export function IncidentsPage() {
  const { data: incidentsData, isLoading } = useIncidents({ page: 1, size: 100 });

  const handleAddIncident = (newIncident: any) => {
    console.log('Add incident:', newIncident);
  };

  const handleAddLog = (event: string, category: any, details: string, payload?: string) => {
    console.log('Add log:', { event, category, details, payload });
  };

  const handleAddCase = (newCase: any) => {
    console.log('Add case:', newCase);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading incidents...</div>;
  }

  return (
    <IncidentReporting
      onAddIncident={handleAddIncident}
      onAddLog={handleAddLog}
      onAddCase={handleAddCase}
    />
  );
}