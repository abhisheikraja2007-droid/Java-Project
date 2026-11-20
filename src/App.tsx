/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  Briefcase, 
  UserCheck, 
  ClipboardList, 
  Trash2, 
  FileText, 
  Terminal, 
  Users, 
  Lock, 
  Clock, 
  Activity, 
  Globe, 
  Unlock,
  AlertOctagon,
  Search,
  SlidersHorizontal,
  StickyNote
} from 'lucide-react';

// Data models & mocks
import { Case, Suspect, Evidence, Incident, UserPersonnel, AuditLog } from './types';
import { 
  initialCases, 
  initialSuspects, 
  initialEvidence, 
  initialIncidents, 
  initialPersonnel, 
  initialAuditLogs 
} from './mockData';

// Component views
import CommandDashboard from './components/CommandDashboard';
import UserPermissions from './components/UserPermissions';
import EvidenceInventory from './components/EvidenceInventory';
import SuspectProfile from './components/SuspectProfile';
import EvidenceDisposal from './components/EvidenceDisposal';
import AuditLogs from './components/AuditLogs';
import IncidentReporting from './components/IncidentReporting';
import CaseDetail from './components/CaseDetail';

// Custom Hooks
import { useLocalStorage } from './hooks/useLocalStorage';

export default function App() {
  // Global memory state
  const [cases, setCases] = useState<Case[]>(initialCases);
  const [suspects, setSuspects] = useState<Suspect[]>(initialSuspects);
  const [evidence, setEvidence] = useState<Evidence[]>(initialEvidence);
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [personnel, setPersonnel] = useState<UserPersonnel[]>(initialPersonnel);
  const [logs, setLogs] = useState<AuditLog[]>(initialAuditLogs);

  // Nav views state: 'dashboard' | 'cases' | 'suspects' | 'evidence' | 'disposal' | 'incidents' | 'audit' | 'permissions' | 'case_detail'
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');

  // Ticking time display
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString() + ' | ' + now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Secure terminal locked state
  const [isLocked, setIsLocked] = useLocalStorage<boolean>('terminal_locked', false);
  const [lockPassword, setLockPassword] = useState('');

  // Search & Filter state for cases
  const [caseSearch, setCaseSearch] = useState('');
  const [caseFilterStatus, setCaseFilterStatus] = useState<string>('All');
  const [caseFilterPriority, setCaseFilterPriority] = useState<string>('All');
  const [caseSortBy, setCaseSortBy] = useState<string>('newest');

  // Floating Quick Notes State
  const [quickNotes, setQuickNotes] = useState<string>(() => {
    return localStorage.getItem('inspector_quick_notes') || '';
  });
  const [showQuickNotes, setShowQuickNotes] = useState(true);
  const [notePosition, setNotePosition] = useState({ x: window.innerWidth - 340, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - notePosition.x,
        y: e.clientY - notePosition.y
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = Math.max(20, Math.min(window.innerWidth - 320, e.clientX - dragOffset.x));
      const newY = Math.max(20, Math.min(window.innerHeight - 300, e.clientY - dragOffset.y));
      setNotePosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Shared state state updaters
  const handleUpdateCase = (updated: Case) => {
    setCases(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleUpdateEvidence = (updated: Evidence) => {
    setEvidence(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  const handleUpdateSuspect = (updated: Suspect) => {
    setSuspects(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const handleUpdatePersonnel = (updated: UserPersonnel) => {
    setPersonnel(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleAddIncident = (newIncident: Incident) => {
    setIncidents(prev => [newIncident, ...prev]);
  };

  const handleAddCase = (newCase: Case) => {
    setCases(prev => [newCase, ...prev]);
  };

  const handleAddLog = (
    event: string, 
    category: 'Security' | 'Access' | 'Data Change' | 'Evidence Flow' | 'System', 
    details: string, 
    payload?: string
  ) => {
    const newLog: AuditLog = {
      id: `LOG-${Math.floor(4000 + Math.random() * 5000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      event,
      category,
      user: 'Inspector Elena Rostova (Badge 1204)',
      ipAddress: '10.122.45.104',
      details,
      payload
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleNavigate = (view: string, id?: string) => {
    if (view === 'case_detail' && id) {
      setSelectedCaseId(id);
    }
    setCurrentView(view);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockPassword === '1204') {
      setIsLocked(false);
      setLockPassword('');
      handleAddLog('Terminal Unlocked', 'Security', 'Operator Elena Rostova successfully unlocked terminal T-104.');
    } else {
      alert('INVALID SECURITY LOCK PIN. AUTHENTICATION ATTEMPT LOGGED.');
      handleAddLog('Failed Unlock Attempt', 'Security', 'Unauthorized attempt to unlock terminal T-104 with incorrect credential PIN.');
    }
  };

  const handleLock = () => {
    setIsLocked(true);
    handleAddLog('Terminal Secured', 'Security', 'Operator Elena Rostova locked terminal T-104 session.');
  };

  // Render content based on current selected navigation
  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <CommandDashboard 
            cases={cases} 
            evidence={evidence} 
            logs={logs} 
            onNavigate={handleNavigate} 
          />
        );
      case 'cases':
        const filteredCases = cases.filter(c => {
          const matchesSearch = c.title.toLowerCase().includes(caseSearch.toLowerCase()) || 
            c.caseNumber.toLowerCase().includes(caseSearch.toLowerCase()) || 
            c.description.toLowerCase().includes(caseSearch.toLowerCase()) ||
            c.investigatingTeam.toLowerCase().includes(caseSearch.toLowerCase());
          
          const matchesStatus = caseFilterStatus === 'All' || c.status === caseFilterStatus;
          const matchesPriority = caseFilterPriority === 'All' || c.priority === caseFilterPriority;

          return matchesSearch && matchesStatus && matchesPriority;
        }).sort((a, b) => {
          if (caseSortBy === 'priority') {
            const priorityWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };
            const weightA = priorityWeight[a.priority as 'High' | 'Medium' | 'Low'] || 0;
            const weightB = priorityWeight[b.priority as 'High' | 'Medium' | 'Low'] || 0;
            return weightB - weightA;
          }
          if (caseSortBy === 'caseNumber') {
            return a.caseNumber.localeCompare(b.caseNumber);
          }
          return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
        });

        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                  Active Investigation Files
                </h1>
                <p className="text-xs text-slate-500 font-mono mt-1">SIU CASE FILES • MULTI-AGENCY COORDINATION • COURT-READY DOSSIERS</p>
              </div>
              <div className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                ACTIVE FILES: <span className="text-slate-900 font-bold">{filteredCases.length} / {cases.length}</span>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-100 p-4 rounded-xl border border-slate-200">
              <div className="md:col-span-4 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search case files by title, ID, or brief..."
                  className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-450 focus:outline-none focus:border-blue-500/50"
                  value={caseSearch}
                  onChange={(e) => setCaseSearch(e.target.value)}
                />
              </div>

              <div className="md:col-span-3 flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase whitespace-nowrap">Status:</span>
                <select
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-850 focus:outline-none focus:border-blue-500/50"
                  value={caseFilterStatus}
                  onChange={(e) => setCaseFilterStatus(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Under Investigation">Under Investigation</option>
                  <option value="Cold">Cold</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="md:col-span-3 flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase whitespace-nowrap">Priority:</span>
                <select
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-850 focus:outline-none focus:border-blue-500/50"
                  value={caseFilterPriority}
                  onChange={(e) => setCaseFilterPriority(e.target.value)}
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="md:col-span-2 flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase whitespace-nowrap">Sort:</span>
                <select
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-850 focus:outline-none focus:border-blue-500/50 font-sans"
                  value={caseSortBy}
                  onChange={(e) => setCaseSortBy(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="priority">Priority</option>
                  <option value="caseNumber">Case ID</option>
                </select>
              </div>
            </div>
            
            {filteredCases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCases.map(c => (
                  <div 
                    key={c.id} 
                    className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-500/50 cursor-pointer transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow-blue-500/5"
                    onClick={() => handleNavigate('case_detail', c.id)}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono font-bold text-blue-600">{c.caseNumber}</span>
                        <div className="flex gap-1.5 items-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            c.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            c.status === 'Cold' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                            c.status === 'Closed' ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}>
                            {c.status}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            c.priority === 'High' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {c.priority} Priority
                          </span>
                        </div>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 font-sans hover:text-blue-600">{c.title}</h3>
                      <p className="text-xs text-slate-600 font-sans line-clamp-3 leading-relaxed">
                        {c.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] font-mono text-slate-550">
                      <span>Squad: <span className="text-slate-800 font-sans">{c.investigatingTeam}</span></span>
                      <span className="text-blue-600 flex items-center gap-1 font-semibold">Open Profile &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-10 text-center space-y-2.5">
                <AlertOctagon className="h-8 w-8 text-slate-400 mx-auto" />
                <h3 className="font-sans font-semibold text-slate-700 text-sm">No Matching Dossiers Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Adjust your cryptographic search terms, priority levels, or operational status filters to retrieve matching intelligence reports.
                </p>
                <button
                  onClick={() => {
                    setCaseSearch('');
                    setCaseFilterStatus('All');
                    setCaseFilterPriority('All');
                    setCaseSortBy('newest');
                  }}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-mono underline cursor-pointer"
                >
                  Reset Active Filters
                </button>
              </div>
            )}
          </div>
        );
      case 'case_detail':
        const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];
        if (!activeCase) return <div>Loading...</div>;
        return (
          <CaseDetail 
            caseData={activeCase} 
            suspects={suspects} 
            evidence={evidence} 
            onUpdateCase={handleUpdateCase} 
            onUpdateEvidence={handleUpdateEvidence} 
            onAddLog={handleAddLog} 
            onNavigate={handleNavigate} 
          />
        );
      case 'suspects':
        return (
          <SuspectProfile 
            suspects={suspects} 
            onUpdateSuspect={handleUpdateSuspect} 
            onAddLog={handleAddLog} 
          />
        );
      case 'evidence':
        return (
          <EvidenceInventory 
            evidence={evidence} 
            onUpdateEvidence={handleUpdateEvidence} 
            onAddLog={handleAddLog} 
            onNavigate={handleNavigate} 
          />
        );
      case 'disposal':
        return (
          <EvidenceDisposal 
            evidence={evidence} 
            onUpdateEvidence={handleUpdateEvidence} 
            onAddLog={handleAddLog} 
          />
        );
      case 'incidents':
        return (
          <IncidentReporting 
            onAddIncident={handleAddIncident} 
            onAddLog={handleAddLog} 
            onAddCase={handleAddCase} 
          />
        );
      case 'audit':
        return <AuditLogs logs={logs} />;
      case 'permissions':
        return (
          <UserPermissions 
            personnel={personnel} 
            onUpdatePersonnel={handleUpdatePersonnel} 
            onAddLog={handleAddLog} 
          />
        );
      default:
        return <CommandDashboard cases={cases} evidence={evidence} logs={logs} onNavigate={handleNavigate} />;
    }
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600 animate-pulse" />
          
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-red-50 text-red-600 rounded-full mb-2 border border-red-100">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 font-sans">Secure Terminal Secured</h1>
            <p className="text-xs text-slate-500 font-mono">T-104 • DISTRICT PRECINCT 12 AUTHORITY</p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1.5 text-left">Enter Credentials PIN</label>
              <input
                type="password"
                required
                placeholder="••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center text-slate-900 tracking-widest focus:outline-none focus:border-red-500/50"
                value={lockPassword}
                onChange={(e) => setLockPassword(e.target.value)}
              />
              <span className="text-[9px] font-mono text-slate-500 block mt-1.5 text-left leading-normal flex items-start gap-1">
                <AlertOctagon className="h-3 w-3 text-red-500 shrink-0 mt-0.5" />
                Audit code: Operator operator pin is "1204" (Elena Rostova Badge number). Enter to restore session safely.
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-850 text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-sans"
            >
              <Unlock className="h-4 w-4 text-emerald-500" /> Unlock Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Banner Status Bar */}
      <header className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap justify-between items-center gap-4 text-xs font-mono select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-900 tracking-tight">PRECINCT 12 OPERATIONS</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-500 border-l border-slate-200 pl-4">
            <Globe className="h-3.5 w-3.5 text-blue-600/80" />
            <span>IP: <span className="text-slate-655">10.122.45.104</span></span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-slate-500 border-l border-slate-200 pl-4">
            <Activity className="h-3.5 w-3.5 text-emerald-600" />
            <span>ENCRYPT LINK: <span className="text-emerald-600">AES-256</span></span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowQuickNotes(prev => !prev)}
            className={`border px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors text-[11px] cursor-pointer ${
              showQuickNotes 
                ? 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100/50' 
                : 'bg-white border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-500/30'
            }`}
            title="Toggle Quick Notes notepad widget"
          >
            <StickyNote className="h-3.5 w-3.5" /> Notes
          </button>
          <div className="flex items-center gap-1.5 text-slate-600 font-bold">
            <Clock className="h-4 w-4 text-blue-600" />
            <span>{timeStr || '06:00:00 UTC'}</span>
          </div>
          <button 
            onClick={handleLock}
            className="bg-white border border-slate-200 hover:border-red-500/40 text-slate-500 hover:text-red-600 px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors text-[11px] cursor-pointer"
          >
            <Lock className="h-3 w-3" /> Secure Console
          </button>
        </div>
      </header>

      {/* Main Structural Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Nav */}
        <nav className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between select-none">
          <div className="p-4 space-y-6">
            
            {/* Branding Unit */}
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
              <div className="p-1.5 rounded bg-blue-50 border border-blue-200 text-blue-600">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">PRECINCT CMS</span>
                <span className="text-sm font-bold text-slate-900 tracking-tight font-sans">Command Portal v4.1</span>
              </div>
            </div>

            {/* Navigation Lists */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block px-3 mb-2 font-bold">Main Operations</span>
              
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'dashboard' 
                    ? 'bg-blue-50 text-blue-600 font-bold border-l-2 border-blue-600 pl-2.5' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Command Dashboard
              </button>

              <button
                onClick={() => setCurrentView('cases')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'cases' || currentView === 'case_detail'
                    ? 'bg-blue-50 text-blue-600 font-bold border-l-2 border-blue-600 pl-2.5' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Briefcase className="h-4 w-4" />
                Investigative Cases
              </button>

              <button
                onClick={() => setCurrentView('suspects')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'suspects' 
                    ? 'bg-blue-50 text-blue-600 font-bold border-l-2 border-blue-600 pl-2.5' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <UserCheck className="h-4 w-4" />
                Suspect Intelligence
              </button>

              <button
                onClick={() => setCurrentView('evidence')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'evidence' 
                    ? 'bg-blue-50 text-blue-600 font-bold border-l-2 border-blue-600 pl-2.5' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ClipboardList className="h-4 w-4" />
                Evidence Locker Timelines
              </button>

              <button
                onClick={() => setCurrentView('disposal')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'disposal' 
                    ? 'bg-blue-50 text-blue-600 font-bold border-l-2 border-blue-600 pl-2.5' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Trash2 className="h-4 w-4" />
                Contraband Disposal
              </button>

              <button
                onClick={() => setCurrentView('incidents')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'incidents' 
                    ? 'bg-blue-50 text-blue-600 font-bold border-l-2 border-blue-600 pl-2.5' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FileText className="h-4 w-4" />
                Incident Reporting
              </button>
            </div>

            {/* Admin Security Links */}
            <div className="space-y-1.5 pt-4 border-t border-slate-200">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block px-3 mb-2 font-bold">Admin Security</span>
              
              <button
                onClick={() => setCurrentView('permissions')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'permissions' 
                    ? 'bg-blue-50 text-blue-600 font-bold border-l-2 border-blue-600 pl-2.5' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Users className="h-4 w-4" />
                Personnel Clearance
              </button>

              <button
                onClick={() => setCurrentView('audit')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'audit' 
                    ? 'bg-blue-50 text-blue-600 font-bold border-l-2 border-blue-600 pl-2.5' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Terminal className="h-4 w-4" />
                System Audit Trail
              </button>
            </div>
          </div>

          {/* User badge login signature footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center font-bold font-sans text-white text-sm">
                ER
              </div>
              <div>
                <h4 className="font-sans font-bold text-slate-800 leading-tight">Inspector E. Rostova</h4>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">BADGE #1204 • Lead Authority</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Dynamic Canvas Container */}
        <main className="flex-1 bg-slate-50 p-4 md:p-6 lg:p-8 overflow-y-auto">
          
          {/* Mobile responsive navigation bar if screen is small */}
          <div className="lg:hidden flex flex-wrap gap-2 pb-4 mb-4 border-b border-slate-200 overflow-x-auto select-none">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold ${
                currentView === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              DASHBOARD
            </button>
            <button
              onClick={() => setCurrentView('cases')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold ${
                currentView === 'cases' || currentView === 'case_detail' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              CASES
            </button>
            <button
              onClick={() => setCurrentView('suspects')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold ${
                currentView === 'suspects' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              SUSPECTS
            </button>
            <button
              onClick={() => setCurrentView('evidence')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold ${
                currentView === 'evidence' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              EVIDENCE
            </button>
            <button
              onClick={() => setCurrentView('disposal')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold ${
                currentView === 'disposal' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              DISPOSAL
            </button>
            <button
              onClick={() => setCurrentView('incidents')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold ${
                currentView === 'incidents' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              INCIDENTS
            </button>
            <button
              onClick={() => setCurrentView('permissions')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold ${
                currentView === 'permissions' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              PERSONNEL
            </button>
            <button
              onClick={() => setCurrentView('audit')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold ${
                currentView === 'audit' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              AUDIT
            </button>
          </div>

          {/* Active component */}
          {renderActiveView()}
        </main>
      </div>

      {/* Floating Quick Notes Notepad Widget */}
      {showQuickNotes && (
        <div 
          className="fixed z-[9999] w-72 bg-white border-2 border-yellow-300 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col font-sans select-none"
          style={{ left: `${notePosition.x}px`, top: `${notePosition.y}px` }}
          onMouseDown={handleMouseDown}
        >
          {/* Header (Drag Handle) */}
          <div className="drag-handle flex items-center justify-between px-3.5 py-2.5 bg-yellow-50 border-b border-yellow-100 cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-1.5">
              <StickyNote className="h-4 w-4 text-yellow-600 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-yellow-800 tracking-wider">SIU QUICK REMINDERS</span>
            </div>
            <button 
              onClick={() => setShowQuickNotes(false)}
              className="text-yellow-600 hover:text-yellow-800 text-xs font-mono font-bold cursor-pointer"
            >
              [X]
            </button>
          </div>

          {/* Text Area Content */}
          <div className="p-3 bg-yellow-50/30">
            <textarea
              className="w-full bg-white border border-yellow-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-yellow-400 font-sans leading-relaxed resize-none h-[150px]"
              placeholder="Jot down active leads, suspect aliases, tracking codes, or scene reminders here... (Will persist during session)"
              value={quickNotes}
              onChange={(e) => {
                setQuickNotes(e.target.value);
                localStorage.setItem('inspector_quick_notes', e.target.value);
              }}
            />
          </div>

          {/* Footer Status */}
          <div className="px-3.5 py-1.5 bg-yellow-50/50 border-t border-yellow-100 flex justify-between items-center text-[8px] font-mono text-yellow-700">
            <span>MEM_BUFFER: AUTO_SAVED</span>
            <span className="text-emerald-600 font-bold">● SECURE</span>
          </div>
        </div>
      )}
    </div>
  );
}
