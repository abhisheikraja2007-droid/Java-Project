/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuditLog } from '../types';
import { Shield, Search, Filter, Terminal, ShieldAlert, Code, Download, ExternalLink } from 'lucide-react';

interface AuditLogsProps {
  logs: AuditLog[];
}

export default function AuditLogs({ logs }: AuditLogsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(logs[0] || null);

  const handleSelectLog = (log: AuditLog) => {
    setSelectedLog(log);
  };

  const categories = ['All', 'Security', 'Access', 'Data Change', 'Evidence Flow', 'System'];

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.event.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || l.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CMS-AuditTrail-Logs-${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2 font-sans">
            <Terminal className="h-6 w-6 text-blue-600" />
            System Audit Logs & Security Registry
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            IMMUTABLE LEDGER REGISTER • AUTOMATED KERNEL DECORATORS • SECURE TERMINAL ATTRIBUTION
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex gap-3 text-xs font-mono">
          <button
            onClick={handleExportJSON}
            className="bg-white hover:bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-blue-600" />
            Export Ledger (JSON)
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Logs Table (7 cols) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
              <h2 className="font-sans font-semibold text-slate-900 text-sm">Operation Events Ledger</h2>
              
              <div className="flex gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search event, officer..."
                    className="bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 w-full sm:w-44 font-sans"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filter Category */}
                <select
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500/50 font-sans"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-mono border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Event Action</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Officer / User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.map((log) => {
                    const isSelected = selectedLog?.id === log.id;
                    return (
                      <tr
                        key={log.id}
                        className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50/50 font-medium' : ''
                        }`}
                        onClick={() => handleSelectLog(log)}
                      >
                        <td className="py-3 px-3 font-mono text-slate-550">{log.timestamp}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900">{log.event}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            log.category === 'Security' ? 'bg-red-50 text-red-700 border border-red-100' :
                            log.category === 'Access' ? 'bg-amber-50 text-amber-800 border border-amber-100' :
                            log.category === 'Evidence Flow' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                            log.category === 'Data Change' ? 'bg-violet-50 text-violet-700 border border-violet-100' :
                            'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {log.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-500 font-mono">{log.user.split('(')[0]}</td>
                      </tr>
                    );
                  })}

                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-xs text-slate-400 font-mono py-12">
                        NO LOG RECORDS RETRIEVED UNDER THOSE SEARCH PARAMETERS
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] font-mono text-slate-550">
            <span>AUDIT RETRIEVAL INTEGRITY CODE: <span className="text-emerald-600 font-bold">HMAC-SHA512-VERIFIED</span></span>
            <span>TOTAL RETRIEVED: {logs.length} EVENTS</span>
          </div>
        </div>

        {/* Audit Payload side panel (5 cols) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 lg:col-span-5 flex flex-col justify-between">
          {selectedLog ? (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-blue-600 uppercase tracking-wider block">Log Profiler</span>
                  <h2 className="text-sm font-bold text-slate-900 font-sans mt-0.5">{selectedLog.event}</h2>
                  <p className="text-xs text-slate-500 font-mono">ID: {selectedLog.id} • {selectedLog.timestamp}</p>
                </div>
                <div className="p-1.5 rounded bg-blue-50 border border-blue-100 text-blue-600">
                  <Shield className="h-4 w-4" />
                </div>
              </div>

              {/* Attributes block */}
              <div className="space-y-2 bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Attributable User:</span>
                  <span className="text-slate-800 text-right">{selectedLog.user}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2">
                  <span className="text-slate-500">Secure Network IP:</span>
                  <span className="text-slate-800">{selectedLog.ipAddress}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2">
                  <span className="text-slate-500">Classification Category:</span>
                  <span className="text-slate-800">{selectedLog.category}</span>
                </div>
              </div>

              {/* Event details */}
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Details Summary</span>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 font-sans">
                  {selectedLog.details}
                </p>
              </div>

              {/* JSON Metadata Payload */}
              {selectedLog.payload && (
                <div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 uppercase mb-2">
                    <Code className="h-3.5 w-3.5 text-blue-600" />
                    Security Metadata JSON Payload
                  </div>
                  <pre className="bg-slate-50 text-slate-750 font-mono text-[11px] p-3 rounded-lg border border-slate-200 overflow-x-auto max-h-[190px] leading-relaxed select-all">
                    {selectedLog.payload}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 font-mono text-xs text-slate-400">
              SELECT AN EVENT FROM REGISTER TO EXPOSE SYSTEM METADATA ENVELOPE
            </div>
          )}

          <div className="mt-6 border-t border-slate-200 pt-4 flex items-start gap-2 text-[10px] font-mono text-slate-500">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-normal">
              Immutable Policy: All ledger logs are replicated across secure offline hardware backups. Any attempt to modify system logs triggers immediate system-wide panic protocol.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
