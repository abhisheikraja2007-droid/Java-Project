/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Evidence, CustodyEvent } from '../types';
import { ShieldAlert, Trash2, ArrowUpRight, Flame, Signature, ShieldCheck, HelpCircle } from 'lucide-react';

interface EvidenceDisposalProps {
  evidence: Evidence[];
  onUpdateEvidence: (updated: Evidence) => void;
  onAddLog: (event: string, category: 'Security' | 'Access' | 'Data Change' | 'Evidence Flow' | 'System', details: string, payload?: string) => void;
}

export default function EvidenceDisposal({ evidence, onUpdateEvidence, onAddLog }: EvidenceDisposalProps) {
  const pendingDisposalItems = evidence.filter(e => e.status === 'Pending Disposal');
  const disposedItems = evidence.filter(e => e.status === 'Disposed');

  const [selectedItem, setSelectedItem] = useState<Evidence | null>(pendingDisposalItems[0] || null);
  
  // Authorization fields
  const [authorizedOfficer, setAuthorizedOfficer] = useState('');
  const [authorizedBadge, setAuthorizedBadge] = useState('');
  const [disposalMethod, setDisposalMethod] = useState('Incineration');
  const [supervisorWitness, setSupervisorWitness] = useState('');
  const [authSignature, setAuthSignature] = useState('');

  const handleSelectItem = (item: Evidence) => {
    setSelectedItem(item);
  };

  const handleAuthorizeDisposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !authorizedOfficer || !authorizedBadge || !authSignature) return;

    const newCustodyEvent: CustodyEvent = {
      id: `CC-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: `Legally Destroyed via ${disposalMethod}`,
      officer: `${authorizedOfficer} (Badge ${authorizedBadge})`,
      institution: 'Precinct 12 Contraband Disposal Section',
      signature: authSignature || 'Witness Signed (Key HMAC-SHA256)'
    };

    const updatedItem: Evidence = {
      ...selectedItem,
      status: 'Disposed',
      notes: `${selectedItem.notes || ''} - Legally destroyed via ${disposalMethod} on ${new Date().toISOString().substring(0, 10)} under command authorization. Witness: ${supervisorWitness || 'None'}.`,
      chainOfCustody: [...selectedItem.chainOfCustody, newCustodyEvent]
    };

    onUpdateEvidence(updatedItem);
    setSelectedItem(null); // Reset selection since it is now disposed

    // Add general audit log
    onAddLog(
      'Disposal Authorized',
      'Security',
      `Authorized and executed destruction of evidence ${selectedItem.trackingNumber} ("${selectedItem.title}") via ${disposalMethod}.`,
      JSON.stringify({
        item_id: selectedItem.id,
        tracking_number: selectedItem.trackingNumber,
        authorized_by: authorizedOfficer,
        badge_number: authorizedBadge,
        witness: supervisorWitness,
        method: disposalMethod
      }, null, 2)
    );

    // Reset forms
    setAuthorizedOfficer('');
    setAuthorizedBadge('');
    setSupervisorWitness('');
    setAuthSignature('');

    alert(`Disposal complete. Contraband ${selectedItem.trackingNumber} has been legally destroyed and logged.`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2 font-sans">
            <Trash2 className="h-6 w-6 text-red-600" />
            Contraband & Evidence Disposal Center
          </h1>
          <p className="text-xs text-slate-550 font-mono mt-1">
            RETENTION LIMIT POLICIES • SUPERVISED DESTRUCTION SESSIONS • STATE INCINERATION PROTOCOLS
          </p>
        </div>
      </div>

      {/* Grid: Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-mono text-slate-500 block uppercase">Pending Disposal Queue</span>
          <span className="text-2xl font-bold text-amber-600 tracking-tight block mt-1">{pendingDisposalItems.length} items</span>
          <span className="text-[10px] font-mono text-slate-400 mt-1 block">Awaiting Command authorization signature</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-mono text-slate-500 block uppercase">Disposal Methods Authorized</span>
          <span className="text-2xl font-bold text-slate-900 tracking-tight block mt-1">Incineration, Bio-Shred</span>
          <span className="text-[10px] font-mono text-slate-400 mt-1 block">Environmental safe controls active</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-mono text-slate-500 block uppercase">Destroyed in Current Term</span>
          <span className="text-2xl font-bold text-emerald-600 tracking-tight block mt-1">{disposedItems.length} items</span>
          <span className="text-[10px] font-mono text-slate-400 mt-1 block">Irreversible legal closure logged</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Disposal Queue (7 cols) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 lg:col-span-7 flex flex-col justify-between shadow-sm">
          <div>
            <h2 className="font-sans font-semibold text-slate-900 text-sm pb-4 border-b border-slate-200">
              Disposal Verification Queue
            </h2>

            {/* List */}
            <div className="mt-4 space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {pendingDisposalItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                      isSelected
                        ? 'bg-red-50 border-red-200 text-red-950 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                    onClick={() => handleSelectItem(item)}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-red-600">{item.trackingNumber}</span>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="font-sans font-bold text-sm text-slate-900">{item.title}</h3>
                      <p className="text-xs text-slate-500 font-sans leading-relaxed">
                        Locker: <span className="font-mono text-slate-700">{item.capacityCode}</span> • Case: <span className="font-mono text-blue-600">{item.caseId}</span>
                      </p>
                    </div>

                    <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1">
                      <span className="text-[10px] font-mono text-slate-400 block">RETENTION EXPIRED</span>
                      <span className="text-xs font-mono font-bold text-amber-600">{item.retentionDate}</span>
                    </div>
                  </div>
                );
              })}

              {pendingDisposalItems.length === 0 && (
                <p className="text-center text-xs text-slate-400 font-mono py-12">
                  NO CONTRABAND CURRENTLY IN DISPOSAL VERIFICATION QUEUE
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 text-[10px] font-mono text-slate-500 text-center">
            DESTRUCTIVE PROCEDURES MANDATORILY REQUIRE ON-SITE SUPERVISOR AND RECORDER WITNESSES
          </div>
        </div>

        {/* Disposal Authorization side panel (5 cols) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 lg:col-span-5 flex flex-col justify-between shadow-sm">
          {selectedItem ? (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-red-600 uppercase tracking-wider block">Disposal Panel</span>
                  <h2 className="text-base font-bold text-slate-900 font-sans mt-0.5">{selectedItem.title}</h2>
                  <p className="text-xs text-slate-500 font-mono">TRACKING #: {selectedItem.trackingNumber}</p>
                </div>
                <div className="p-1.5 rounded bg-red-50 text-red-600 border border-red-100">
                  <Flame className="h-4 w-4 animate-bounce" />
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleAuthorizeDisposal} className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Authorizing Command Officer</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Deputy Chief Arthur Vance"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
                    value={authorizedOfficer}
                    onChange={(e) => setAuthorizedOfficer(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Badge Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 0102"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 font-mono"
                      value={authorizedBadge}
                      onChange={(e) => setAuthorizedBadge(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Destruction Method</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500/50 font-sans"
                      value={disposalMethod}
                      onChange={(e) => setDisposalMethod(e.target.value)}
                    >
                      <option value="Incineration">Incineration (Contraband)</option>
                      <option value="Chemical Neutralization">Chemical Neutralization</option>
                      <option value="Biohazard Disposal">Biohazard Disposal</option>
                      <option value="Secure Destruction / Shredding">Secure Shredding</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">On-Site Supervisor Witness (Badge #)</label>
                  <input
                    type="text"
                    placeholder="e.g. Inspector Elena Rostova (Badge 1204)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
                    value={supervisorWitness}
                    onChange={(e) => setSupervisorWitness(e.target.value)}
                  />
                </div>

                {/* Simulated signature pad */}
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Command Authorization Signature</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center border-dashed relative">
                    <input
                      type="text"
                      required
                      placeholder="Type security signature (e.g. A. Vance)"
                      className="bg-transparent text-center border-b border-slate-200 text-slate-800 text-sm focus:outline-none w-2/3 italic placeholder-slate-400 font-mono"
                      value={authSignature}
                      onChange={(e) => setAuthSignature(e.target.value)}
                    />
                    <div className="flex justify-center items-center gap-1.5 text-[9px] font-mono text-slate-400 uppercase mt-2">
                      <Signature className="h-3 w-3 text-red-500" />
                      SIGNATURE VERIFIED HMAC COMPLIANT
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-500 text-white text-xs font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors font-sans uppercase tracking-wider"
                >
                  <Trash2 className="h-4 w-4" />
                  Execute Irreversible Disposal
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-20 font-mono text-xs text-slate-400">
              SELECT AN ITEM FROM DISPOSAL QUEUE TO TRIGGER AUTHORIZATION SECURITY SEQUENCE
            </div>
          )}

          <div className="mt-6 border-t border-slate-200 pt-4 flex items-start gap-2 text-[10px] font-mono text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-normal">
              Notice: Once command authorization completes, the item status changes irreversibly to "Disposed". Custody timelines will permanently archive this execution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
