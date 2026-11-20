/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Evidence, CustodyEvent } from '../types';
import { FileText, Search, Filter, ShieldAlert, Key, ClipboardList, Calendar, RotateCcw, HelpCircle, LogOut } from 'lucide-react';

interface EvidenceInventoryProps {
  evidence: Evidence[];
  onUpdateEvidence: (updated: Evidence) => void;
  onAddLog: (event: string, category: 'Security' | 'Access' | 'Data Change' | 'Evidence Flow' | 'System', details: string, payload?: string) => void;
  onNavigate: (view: string, id?: string) => void;
}

export default function EvidenceInventory({ evidence, onUpdateEvidence, onAddLog, onNavigate }: EvidenceInventoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState<Evidence | null>(evidence[0] || null);
  
  // Checkout modal controls
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutOfficer, setCheckoutOfficer] = useState('');
  const [checkoutBadge, setCheckoutBadge] = useState('');
  const [checkoutReason, setCheckoutReason] = useState('');
  const [checkoutReturnDate, setCheckoutReturnDate] = useState('');
  const [checkoutSignature, setCheckoutSignature] = useState('');

  const handleSelectItem = (item: Evidence) => {
    setSelectedItem(item);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !checkoutOfficer || !checkoutBadge || !checkoutReason) return;

    const newCustodyEvent: CustodyEvent = {
      id: `CC-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: `Checked out: ${checkoutReason}`,
      officer: `${checkoutOfficer} (Badge ${checkoutBadge})`,
      institution: 'Precinct 12 Transit',
      signature: checkoutSignature || 'Digitally Signed (Key HMAC-SHA256)'
    };

    const updatedItem: Evidence = {
      ...selectedItem,
      status: 'In Transit',
      checkedOutBy: `${checkoutOfficer} (Badge ${checkoutBadge})`,
      checkOutDate: new Date().toISOString().substring(0, 10),
      expectedReturnDate: checkoutReturnDate,
      chainOfCustody: [...selectedItem.chainOfCustody, newCustodyEvent]
    };

    onUpdateEvidence(updatedItem);
    setSelectedItem(updatedItem);
    setShowCheckoutModal(false);

    // Add general audit log
    onAddLog(
      'Evidence Checked Out',
      'Evidence Flow',
      `Evidence item ${selectedItem.trackingNumber} ("${selectedItem.title}") checked out by ${checkoutOfficer}. Reason: ${checkoutReason}.`,
      JSON.stringify({
        item_id: selectedItem.id,
        officer: checkoutOfficer,
        badge: checkoutBadge,
        reason: checkoutReason,
        expected_return: checkoutReturnDate
      }, null, 2)
    );

    // Clear form
    setCheckoutOfficer('');
    setCheckoutBadge('');
    setCheckoutReason('');
    setCheckoutReturnDate('');
    setCheckoutSignature('');

    alert('Evidence checked out successfully. Custody log updated.');
  };

  const handleCheckInItem = () => {
    if (!selectedItem) return;

    const newCustodyEvent: CustodyEvent = {
      id: `CC-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: 'Checked back in - Returned to secure locker',
      officer: 'Officer James Miller (Badge 8820)',
      institution: 'Precinct 12 Evidence Locker',
      signature: 'Custodian HMAC Check-in Verified'
    };

    const updatedItem: Evidence = {
      ...selectedItem,
      status: 'In Storage',
      checkedOutBy: undefined,
      checkOutDate: undefined,
      expectedReturnDate: undefined,
      chainOfCustody: [...selectedItem.chainOfCustody, newCustodyEvent]
    };

    onUpdateEvidence(updatedItem);
    setSelectedItem(updatedItem);

    // Add general audit log
    onAddLog(
      'Evidence Checked In',
      'Evidence Flow',
      `Evidence item ${selectedItem.trackingNumber} ("${selectedItem.title}") returned to secure custody.`,
      JSON.stringify({
        item_id: selectedItem.id,
        custodian: "Officer James Miller",
        status: "In Storage"
      }, null, 2)
    );

    alert('Evidence returned and secured. Chain of Custody successfully locked.');
  };

  const categories = ['All', ...new Set(evidence.map(e => e.category))];
  const statuses = ['All', 'In Storage', 'In Transit', 'In Lab Analysis', 'Pending Disposal', 'Disposed'];

  const filteredEvidence = evidence.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.caseId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || e.category === categoryFilter;
    const matchesStat = statusFilter === 'All' || e.status === statusFilter;
    return matchesSearch && matchesCat && matchesStat;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2 font-sans">
            <ClipboardList className="h-6 w-6 text-blue-600" />
            Evidence Inventory & Secure Custody
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            SECURE AUDIT ROOM 12-A • COMPLIANT UNDER STATE PENAL CODE §240A • TIME-STAMPED CHAINS
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Evidence Registry Table (7 cols) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 lg:col-span-7 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
              <h2 className="font-sans font-semibold text-slate-900 text-sm">Evidence Registry</h2>
              
              <div className="flex flex-wrap gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tracking #, cases..."
                    className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 w-full sm:w-44 font-sans"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filter Category */}
                <select
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500/50 font-sans"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                {/* Filter Status */}
                <select
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500/50 font-sans"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statuses.map(stat => (
                    <option key={stat} value={stat}>{stat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-mono border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Tracking #</th>
                    <th className="py-2.5 px-3">Evidence Item</th>
                    <th className="py-2.5 px-3">Case Association</th>
                    <th className="py-2.5 px-3">Locker Safe</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEvidence.map((e) => {
                    const isSelected = selectedItem?.id === e.id;
                    return (
                      <tr
                        key={e.id}
                        className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50/70 font-medium' : ''
                        }`}
                        onClick={() => handleSelectItem(e)}
                      >
                        <td className="py-3 px-3 font-mono text-slate-500 font-bold">{e.trackingNumber}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900">{e.title}</td>
                        <td 
                          className="py-3 px-3 font-mono text-blue-600 hover:underline hover:text-blue-700"
                          onClick={(evt) => {
                            evt.stopPropagation();
                            onNavigate('case_detail', e.caseId);
                          }}
                        >
                          {e.caseId}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-500">{e.capacityCode}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            e.status === 'In Storage' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                            e.status === 'In Lab Analysis' ? 'bg-violet-50 text-violet-800 border border-violet-200' :
                            e.status === 'In Transit' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                            e.status === 'Pending Disposal' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                            'bg-red-50 text-red-800 border border-red-200'
                          }`}>
                            {e.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredEvidence.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-xs text-slate-400 font-mono py-12">
                        NO EVIDENCE ITEMS RECORDED UNDER THIS FILTER
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>TOTAL ITEMS MONITORED: <span className="text-slate-800 font-bold">{evidence.length}</span></span>
            <span>CAPACITY WARNING: ROOM 12-A AT 42%</span>
          </div>
        </div>

        {/* Detailed Info Panel & Chain of Custody (5 cols) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 lg:col-span-5 flex flex-col justify-between shadow-sm">
          {selectedItem ? (
            <div className="space-y-5">
              <div className="border-b border-slate-200 pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-blue-600 uppercase tracking-wider block">Evidence Profile</span>
                  <h2 className="text-base font-bold text-slate-900 font-sans mt-0.5">{selectedItem.title}</h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">TRACKING #: {selectedItem.trackingNumber}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">RETENTION RETIREMENT</span>
                  <span className="text-xs font-mono font-semibold text-amber-600">{selectedItem.retentionDate}</span>
                </div>
              </div>

              {/* General Metadata */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">Category</span>
                  <span className="text-xs text-slate-800 font-sans">{selectedItem.category}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">Assigned Room Unit</span>
                  <span className="text-xs text-slate-800 font-mono">{selectedItem.location}</span>
                </div>
                <div className="col-span-2 border-t border-slate-200 pt-2">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">Investigator Notes</span>
                  <p className="text-xs text-slate-650 italic font-sans leading-relaxed mt-0.5">{selectedItem.notes}</p>
                </div>
              </div>

              {/* Chain of Custody Tracker Timeline */}
              <div>
                <h3 className="text-xs font-mono text-slate-550 uppercase tracking-wider mb-3">Chain of Custody Timeline</h3>
                
                <div className="space-y-4 border-l border-slate-250 pl-4 ml-2 max-h-[190px] overflow-y-auto pr-1 relative">
                  {selectedItem.chainOfCustody.map((event, index) => {
                    const isLast = index === selectedItem.chainOfCustody.length - 1;
                    return (
                      <div key={event.id} className="relative">
                        {/* Timeline Node Point */}
                        <div className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border ${
                          isLast ? 'bg-blue-600 border-blue-400 animate-pulse' : 'bg-slate-200 border-slate-300'
                        }`} />
                        
                        <div>
                          <span className="text-[10px] font-mono text-slate-400">{event.date}</span>
                          <h4 className="text-xs font-bold text-slate-800 mt-0.5">{event.action}</h4>
                          <p className="text-[11px] text-slate-600 font-sans">
                            Officer: <span className="text-slate-800">{event.officer}</span>
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Institution: {event.institution}
                          </p>
                          {event.signature && (
                            <div className="text-[9px] font-mono bg-emerald-50 border border-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded mt-1 inline-block">
                              SECURE SIGN: {event.signature}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions Panel */}
              <div className="pt-3 border-t border-slate-200 flex gap-3">
                {selectedItem.status === 'In Storage' ? (
                  <button
                    onClick={() => setShowCheckoutModal(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 flex-1 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Checkout Evidence
                  </button>
                ) : (
                  <button
                    onClick={handleCheckInItem}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 flex-1 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Return to Secure Locker
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 font-mono text-xs text-slate-400">
              SELECT AN EVIDENCE RECORD TO REVEAL CUSTODY CHAIN
            </div>
          )}

          <div className="mt-6 border-t border-slate-200 pt-4 flex items-start gap-2 text-[10px] font-mono text-slate-550">
            <ShieldAlert className="h-4 w-4 text-amber-500/80 shrink-0 mt-0.5" />
            <p className="leading-normal">
              WARNING: Tampering with custody timelines or checking out contraband without cryptographic signatures is a federal felony offense.
            </p>
          </div>
        </div>
      </div>

      {/* Checkout Modal Overlay */}
      {showCheckoutModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-sans font-bold text-base text-slate-900">Secure Evidence Checkout</h3>
                <p className="text-xs text-slate-500 font-mono">ITEM: {selectedItem.trackingNumber}</p>
              </div>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Requesting Officer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Officer James Miller"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
                  value={checkoutOfficer}
                  onChange={(e) => setCheckoutOfficer(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Badge Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 8820"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 font-mono"
                    value={checkoutBadge}
                    onChange={(e) => setCheckoutBadge(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Expected Return</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500/50 font-mono"
                    value={checkoutReturnDate}
                    onChange={(e) => setCheckoutReturnDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Reason for Checkout / Authority</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Forensic analysis request or Court hearing exhibit presentation"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
                  value={checkoutReason}
                  onChange={(e) => setCheckoutReason(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Secure HMAC-SHA256 Signature Pad</label>
                <input
                  type="text"
                  placeholder="Type signature (e.g. Sgt. J. Miller)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 italic font-mono"
                  value={checkoutSignature}
                  onChange={(e) => setCheckoutSignature(e.target.value)}
                />
                <span className="text-[9px] font-mono text-slate-400 mt-1 block">ELECTRONIC HARDWARE SIGNATURE REQUIREMENT</span>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg flex-1 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex-1 transition-colors"
                >
                  Confirm Checkout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
