/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, AlertTriangle, Briefcase, FileText, UserCheck, Calendar, CheckSquare, Plus, ArrowUpRight, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Case, Evidence, AuditLog } from '../types';

interface CommandDashboardProps {
  cases: Case[];
  evidence: Evidence[];
  logs: AuditLog[];
  onNavigate: (view: string, id?: string) => void;
}

export default function CommandDashboard({ cases, evidence, logs, onNavigate }: CommandDashboardProps) {
  const [todoList, setTodoList] = useState([
    { id: 1, text: 'Review forensic analysis report for Damon Vance case (CMS-2026-8801)', completed: false },
    { id: 2, text: 'Authorize disposal of expired drug paraphernalia (#EV-2022-9012)', completed: false },
    { id: 3, text: 'Audit logs verification for terminal T-104 root login event', completed: true },
    { id: 4, text: 'Sign off on Glock 17 custody transfer to District Courthouse', completed: false },
  ]);

  const [newTodoText, setNewTodoText] = useState('');

  const handleToggleTodo = (id: number) => {
    setTodoList(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    setTodoList(prev => [
      ...prev,
      { id: Date.now(), text: newTodoText, completed: false }
    ]);
    setNewTodoText('');
  };

  const activeCasesCount = cases.filter(c => c.status === 'Active' || c.status === 'Under Investigation').length;
  const inLabAnalysisCount = evidence.filter(e => e.status === 'In Lab Analysis').length;
  const pendingDisposalCount = evidence.filter(e => e.status === 'Pending Disposal').length;

  const caseStatusData = [
    { name: 'Active', value: cases.filter(c => c.status === 'Active').length, color: '#3b82f6' },
    { name: 'Under Investigation', value: cases.filter(c => c.status === 'Under Investigation').length, color: '#8b5cf6' },
    { name: 'Cold', value: cases.filter(c => c.status === 'Cold').length, color: '#f59e0b' },
    { name: 'Closed', value: cases.filter(c => c.status === 'Closed').length, color: '#64748b' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2 font-sans">
            <Shield className="h-6 w-6 text-blue-600" />
            Command & Precinct 12 Operations Center
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            INTELLIGENCE RADAR • SECURE PORTAL TERMINAL • ACTIVE SESSION SECURED
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3 text-xs font-mono">
          <div className="bg-white border border-slate-200 rounded px-3 py-1.5 flex items-center gap-2 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-600">PRECINCT 12 AUTHORITY: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Grid: 4 Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors shadow-sm">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-xs font-mono uppercase tracking-wider">Active Cases</span>
            <div className="p-1.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">{activeCasesCount}</span>
            <span className="text-xs text-emerald-600 font-mono flex items-center">
              +12.4% <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-mono">SIU & General Investigations</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors shadow-sm">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-xs font-mono uppercase tracking-wider">Total Evidence Items</span>
            <div className="p-1.5 rounded bg-amber-50 text-amber-600 border border-amber-100">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">{evidence.length}</span>
            <span className="text-xs text-emerald-600 font-mono flex items-center">
              +3.1% <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-mono">Secured chain of custody logs</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors shadow-sm">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-xs font-mono uppercase tracking-wider">Items in Lab Analysis</span>
            <div className="p-1.5 rounded bg-violet-50 text-violet-600 border border-violet-100">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">{inLabAnalysisCount}</span>
            <span className="text-xs text-amber-600 font-mono">Pending Reports</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-mono">Forensic & chemical tracking</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors shadow-sm">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-xs font-mono uppercase tracking-wider">Disposal Queue</span>
            <div className="p-1.5 rounded bg-red-50 text-red-600 border border-red-100">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">{pendingDisposalCount}</span>
            <span className="text-xs text-red-600 font-mono flex items-center">Retention Warning</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-mono">Contraband awaiting incineration</p>
        </div>
      </div>

      {/* Grid: Alerts & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Critical Alerts Dashboard Panel (7 cols) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 lg:col-span-7 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <h2 className="font-sans font-semibold text-slate-900 text-sm flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                Critical Incident Radar & Alerts
              </h2>
              <span className="text-xs font-mono text-slate-500">LIVE SECURITY CHANNEL</span>
            </div>

            <div className="space-y-3 mt-4">
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-mono font-bold text-red-800 flex justify-between items-center">
                    <span>SECURITY CRITICAL: RE-ENTRY</span>
                    <span>12m ago</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1">
                    System Root clearance overridden by Inspector Elena Rostova (Badge 1204) at Secure Terminal T-104. Reason logged: Authorized Role Upgrades.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-mono font-bold text-amber-800 flex justify-between items-center">
                    <span>AUDIT WARNING: CONTAMINANT FLOW</span>
                    <span>1d ago</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1">
                    Item <span className="font-mono text-amber-750 underline cursor-pointer" onClick={() => onNavigate('evidence')}>#EV-2026-4402</span> has spent over 90 consecutive days in "Lab Analysis" status. Review required by custodian.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-200 flex gap-3">
                <Shield className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-mono font-bold text-blue-800 flex justify-between items-center">
                    <span>CHAIN OF CUSTODY TIMELINE</span>
                    <span>3h ago</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1">
                    Evidence transfer of Glock 17 handgun initiated from Court Depot back to Main Locker Section 12-A. Action logged under case #CMS-2026-9023.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center text-xs font-mono text-slate-500">
            <span>Terminal Security Integrity Code: <span className="text-slate-800 font-bold">F6-A22-E9</span></span>
            <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => onNavigate('audit')}>View Audit Trail &rarr;</span>
          </div>
        </div>

        {/* Security Metrics & Operations Status (5 cols) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 lg:col-span-5 shadow-sm">
          <h2 className="font-sans font-semibold text-slate-900 text-sm pb-4 border-b border-slate-200 flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-600" />
            Precinct 12 System Integrity
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-500 mb-1.5">
                <span>Active Officers Dispatched</span>
                <span className="text-slate-800 font-bold">24 / 28</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85.7%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-500 mb-1.5">
                <span>Secure Terminals Online</span>
                <span className="text-slate-800 font-bold">12 / 12</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-500 mb-1.5">
                <span>Evidence Locker Vault Capacity</span>
                <span className="text-slate-800 font-bold">42%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-500 mb-1.5">
                <span>Operations Integrity Score</span>
                <span className="text-slate-800 font-bold">99.8%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '99.8%' }} />
              </div>
            </div>
          </div>

          {/* Case Status Overview Pie Chart */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-sans font-semibold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <Briefcase className="h-3.5 w-3.5 text-blue-600" />
                Case Status Overview
              </h3>
              <span className="text-[10px] font-mono text-slate-500">TOTAL: {cases.length} CASES</span>
            </div>
            <div className="h-[185px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={caseStatusData}
                    cx="50%"
                    cy="45%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {caseStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '0.5rem',
                      color: '#0f172a',
                      fontSize: '11px',
                      fontFamily: 'monospace'
                    }}
                    itemStyle={{ color: '#0f172a' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconSize={8}
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      color: '#475569',
                      paddingTop: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
            <p className="font-mono text-slate-500 flex justify-between">
              <span>SYSTEM KERNEL:</span>
              <span className="text-slate-800 font-semibold">CMS-OS_v4.1.2-Secure</span>
            </p>
            <p className="font-mono text-slate-500 flex justify-between">
              <span>ENCRYPTION STANDARDS:</span>
              <span className="text-slate-800 font-semibold">AES-256 GCM Secure Tunnel</span>
            </p>
            <p className="font-mono text-slate-500 flex justify-between">
              <span>LAST AUDIT ROTATION:</span>
              <span className="text-emerald-600 font-semibold font-mono">TODAY, 06:00 UTC</span>
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Recent Investigations & Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cases Registry Quick View (7 cols) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 lg:col-span-7 shadow-sm">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200">
            <h2 className="font-sans font-semibold text-slate-900 text-sm">Recent Active Investigations</h2>
            <span className="text-xs font-mono text-blue-600 cursor-pointer hover:underline" onClick={() => onNavigate('cases')}>Manage Cases &rarr;</span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-mono border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Case ID</th>
                  <th className="py-2.5 px-3">Title / Subject</th>
                  <th className="py-2.5 px-3">Squad Assigned</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cases.map((c) => (
                  <tr 
                    key={c.id} 
                    className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                    onClick={() => onNavigate('case_detail', c.id)}
                  >
                    <td className="py-3 px-3 font-mono text-slate-550 font-bold">{c.caseNumber}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900 hover:text-blue-600">{c.title}</td>
                    <td className="py-3 px-3 text-slate-500">{c.investigatingTeam}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        c.priority === 'High' ? 'bg-red-50 text-red-700 border border-red-200' :
                        c.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-emerald-700 font-mono flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Officer Interactive Action Checklist (5 cols) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 lg:col-span-5 flex flex-col justify-between shadow-sm">
          <div>
            <h2 className="font-sans font-semibold text-slate-900 text-sm pb-4 border-b border-slate-200 flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-blue-600" />
              Officer Duty Checklist & Queue
            </h2>

            <form onSubmit={handleAddTodo} className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Log a new action item or task..."
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 flex-1 font-sans"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg p-2 flex items-center justify-center transition-colors shrink-0"
              >
                <Plus className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-4 space-y-2 max-h-[180px] overflow-y-auto pr-1">
              {todoList.map((todo) => (
                <div 
                  key={todo.id} 
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-colors cursor-pointer ${
                    todo.completed 
                      ? 'bg-slate-50/50 border-slate-100 text-slate-400' 
                      : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                  }`}
                  onClick={() => handleToggleTodo(todo.id)}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => {}} // handled by parent div click
                    className="mt-0.5 rounded border-slate-300 bg-white text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span className={`text-xs leading-tight ${todo.completed ? 'line-through text-slate-400' : ''}`}>
                    {todo.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] font-mono text-slate-400 text-center">
            ACTIONS ARE LOGGED SECURELY & PERSISTED FOR AUDIT COMPLIANCE
          </div>
        </div>
      </div>
    </div>
  );
}
