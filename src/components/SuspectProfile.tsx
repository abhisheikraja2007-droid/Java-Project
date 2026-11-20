/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Suspect } from '../types';
import { User, ShieldAlert, Eye, Search, Plus, Calendar, BadgeAlert, Fingerprint } from 'lucide-react';

interface SuspectProfileProps {
  suspects: Suspect[];
  onUpdateSuspect: (updated: Suspect) => void;
  onAddLog: (event: string, category: 'Security' | 'Access' | 'Data Change' | 'Evidence Flow' | 'System', details: string, payload?: string) => void;
}

export default function SuspectProfile({ suspects, onUpdateSuspect, onAddLog }: SuspectProfileProps) {
  // Non-null assertion: suspects array always has at least one entry from mockData
  const [selectedSuspect, setSelectedSuspect] = useState<Suspect>(suspects[0]!);
  const [newAlias, setNewAlias] = useState('');

  // Form state for adding conviction
  const [newOffense, setNewOffense] = useState('');
  const [newDisposition, setNewDisposition] = useState('');
  const [newCaseNumber, setNewCaseNumber] = useState('');

  const handleSelectSuspect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const s = suspects.find(item => item.id === e.target.value);
    if (s) setSelectedSuspect(s);
  };

  const handleAddAlias = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlias.trim()) return;

    const updatedSuspect: Suspect = {
      ...selectedSuspect,
      aliasHistory: [...selectedSuspect.aliasHistory, newAlias.trim()]
    };

    onUpdateSuspect(updatedSuspect);
    setSelectedSuspect(updatedSuspect);

    onAddLog(
      'Suspect File Updated',
      'Data Change',
      `Added alias "${newAlias.trim()}" to suspect file of ${selectedSuspect.name} (ID: ${selectedSuspect.id}).`,
      JSON.stringify({ suspect_id: selectedSuspect.id, added_alias: newAlias.trim() }, null, 2)
    );

    setNewAlias('');
  };

  const handleAddConviction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffense.trim() || !newDisposition.trim() || !newCaseNumber.trim()) return;

    const recordItem = {
      id: `CR-${Date.now()}`,
      date: new Date().toISOString().substring(0, 10),
      offense: newOffense.trim(),
      disposition: newDisposition.trim(),
      caseNumber: newCaseNumber.trim()
    };

    const updatedSuspect: Suspect = {
      ...selectedSuspect,
      criminalRecord: [recordItem, ...selectedSuspect.criminalRecord]
    };

    onUpdateSuspect(updatedSuspect);
    setSelectedSuspect(updatedSuspect);

    onAddLog(
      'Suspect Conviction Logged',
      'Data Change',
      `Logged offense "${newOffense.trim()}" in criminal record of ${selectedSuspect.name}.`,
      JSON.stringify({ suspect_id: selectedSuspect.id, conviction: recordItem }, null, 2)
    );

    setNewOffense('');
    setNewDisposition('');
    setNewCaseNumber('');

    alert('Criminal record timeline updated successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2 font-sans">
            <User className="h-6 w-6 text-blue-600" />
            Classified Suspect Profile Intelligence
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            CONFIDENTIAL BRIEFING FILE • INTEGRATED BIOMETRIC SCANNER • AUTHORIZED SIU AGENTS ONLY
          </p>
        </div>

        {/* Suspect Selector */}
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 uppercase">Profile Select:</span>
          <select
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500/50 font-sans"
            value={selectedSuspect.id}
            onChange={handleSelectSuspect}
          >
            {suspects.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
       
        {/* Profile Card & Bio Stats (5 cols) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 lg:col-span-5 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-4 border-b border-slate-200">
            <img 
              src={selectedSuspect.mugshotUrl} 
              alt={selectedSuspect.name} 
              className="w-28 h-28 object-cover rounded-lg border border-slate-200 shrink-0 shadow-md referrerPolicy='no-referrer'"
            />
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[10px] font-mono text-blue-600 uppercase tracking-wider block">ID: {selectedSuspect.id}</span>
              <h2 className="text-lg font-bold text-slate-900 font-sans">{selectedSuspect.name}</h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                  selectedSuspect.status === 'Under Surveillance' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                  selectedSuspect.status === 'In Custody' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                  'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {selectedSuspect.status}
                </span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                  selectedSuspect.riskLevel === 'High' ? 'bg-red-50 text-red-800 border border-red-200 animate-pulse' : 'bg-blue-50 text-blue-800'
                }`}>
                  RISK: {selectedSuspect.riskLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Physical & Biometric Data Grid */}
          <div>
            <h3 className="text-xs font-mono text-slate-550 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Fingerprint className="h-4 w-4 text-slate-500" />
              Biometric & Physical Characteristics
            </h3>
           
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] font-mono text-slate-450 block">HEIGHT / WEIGHT</span>
                <span className="text-slate-800 font-sans">{selectedSuspect.physicalData.height} / {selectedSuspect.physicalData.weight}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-450 block">EYE / HAIR COLOR</span>
                <span className="text-slate-800 font-sans">{selectedSuspect.physicalData.eyeColor} / {selectedSuspect.physicalData.hairColor}</span>
              </div>
              <div className="col-span-2 border-t border-slate-200 pt-2">
                <span className="text-[10px] font-mono text-slate-450 block">FINGERPRINT ID TEMPLATE</span>
                <span className="text-blue-600 font-mono font-semibold">{selectedSuspect.physicalData.fingerprintsId}</span>
              </div>
              <div className="col-span-2 border-t border-slate-200 pt-2">
                <span className="text-[10px] font-mono text-slate-450 block">IDENTIFYING SCARS OR MARKINGS</span>
                <p className="text-slate-700 italic font-sans">{selectedSuspect.physicalData.scars}</p>
              </div>
            </div>
          </div>

          {/* Alias History Board */}
          <div>
            <h3 className="text-xs font-mono text-slate-550 uppercase tracking-wider mb-3">Known Aliases</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <div className="flex flex-wrap gap-2">
                {selectedSuspect.aliasHistory.map(alias => (
                  <span key={alias} className="text-xs font-mono bg-white border border-slate-250 text-slate-700 px-2 py-1 rounded shadow-sm">
                    "{alias}"
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddAlias} className="flex gap-2 mt-3 pt-3 border-t border-slate-200">
                <input
                  type="text"
                  placeholder="Record new alias..."
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 flex-1 font-sans"
                  value={newAlias}
                  onChange={(e) => setNewAlias(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors font-sans cursor-pointer"
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Criminal Record Timeline & Conviction logger (7 cols) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 lg:col-span-7 space-y-6 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-xs font-mono text-slate-550 uppercase tracking-wider pb-3 border-b border-slate-200">
              National Criminal Record Registry
            </h3>

            {/* Crime Timeline list */}
            <div className="space-y-4 border-l border-slate-200 pl-4 ml-2 mt-4 max-h-[260px] overflow-y-auto pr-1">
              {selectedSuspect.criminalRecord.map(record => (
                <div key={record.id} className="relative">
                  {/* Timeline point */}
                  <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-slate-200 border border-slate-300" />
                 
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div>
                      <span className="text-[10px] font-mono text-slate-450 block">{record.date}</span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">{record.offense}</h4>
                      <p className="text-[11px] text-slate-600 font-sans mt-0.5">
                        Disposition: <span className="text-slate-550 italic">{record.disposition}</span>
                      </p>
                    </div>
                    <span className="text-[10px] font-mono bg-white text-blue-600 border border-slate-200 px-2 py-0.5 rounded sm:self-start shadow-sm">
                      {record.caseNumber}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form to log convictions */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">Add Offense Incident to File</h4>
           
            <form onSubmit={handleAddConviction} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4">
                <input
                  type="text"
                  required
                  placeholder="Offense (e.g. Armed Larceny)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
                  value={newOffense}
                  onChange={(e) => setNewOffense(e.target.value)}
                />
              </div>
              <div className="sm:col-span-5">
                <input
                  type="text"
                  required
                  placeholder="Disposition (e.g. Guilty, 3 Years)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
                  value={newDisposition}
                  onChange={(e) => setNewDisposition(e.target.value)}
                />
              </div>
              <div className="sm:col-span-3 flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Case #"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 font-mono"
                  value={newCaseNumber}
                  onChange={(e) => setNewCaseNumber(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-3.5 py-2 text-xs font-semibold flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}