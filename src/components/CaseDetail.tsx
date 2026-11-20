/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Case, Suspect, Evidence, TimelineEvent } from '../types';
import { Briefcase, Key, Link2, Shield, Calendar, AlertTriangle, User, UserCheck, Plus, ExternalLink, Printer, Fingerprint, Download, FileText } from 'lucide-react';

interface CaseDetailProps {
  caseData: Case;
  suspects: Suspect[];
  evidence: Evidence[];
  onUpdateCase: (updated: Case) => void;
  onUpdateEvidence: (updated: Evidence) => void;
  onAddLog: (event: string, category: 'Security' | 'Access' | 'Data Change' | 'Evidence Flow' | 'System', details: string, payload?: string) => void;
  onNavigate: (view: string, id?: string) => void;
}

export default function CaseDetail({ caseData, suspects, evidence, onUpdateCase, onUpdateEvidence, onAddLog, onNavigate }: CaseDetailProps) {
  const suspect = suspects.find(s => s.id === caseData.primarySuspectId);
  const caseEvidence = evidence.filter(e => e.caseId === caseData.id);
  const unlinkedEvidence = evidence.filter(e => e.caseId !== caseData.id);

  // Link Evidence Modal state
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedEvidenceIdToLink, setSelectedEvidenceIdToLink] = useState('');
  const [linkReason, setLinkReason] = useState('');
  const [linkOfficer, setLinkOfficer] = useState('Inspector Elena Rostova');

  // Print Dossier Modal state
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Download Case Report as a structured text file (Browser-native file-save approach)
  const handleDownloadTxtReport = () => {
    const divider = '='.repeat(80);
    const subDivider = '-'.repeat(80);
    let content = `${divider}\n`;
    content += `METROPOLITAN POLICE DEPARTMENT - SPECIAL INVESTIGATIONS UNIT (SIU)\n`;
    content += `CLASSIFIED CRIMINAL DOSSIER REPORT - CONFIDENTIAL ACCESS LOGGED\n`;
    content += `${divider}\n\n`;
    content += `CASE NUMBER: ${caseData.caseNumber}\n`;
    content += `TITLE:       ${caseData.title}\n`;
    content += `STATUS:      ${caseData.status}\n`;
    content += `PRIORITY:    ${caseData.priority}\n`;
    content += `TEAM:        ${caseData.investigatingTeam}\n`;
    content += `OPENED DATE: ${caseData.dateCreated}\n\n`;
    content += `${subDivider}\n`;
    content += `I. OPERATIONAL NARRATIVE BRIEFING\n`;
    content += `${subDivider}\n`;
    content += `${caseData.description}\n\n`;
    
    content += `${subDivider}\n`;
    content += `II. TARGET SUSPECT INTELLIGENCE\n`;
    content += `${subDivider}\n`;
    if (suspect) {
      content += `Legal Name:    ${suspect.name}\n`;
      content += `Age / Gender:  ${suspect.age} / ${suspect.gender}\n`;
      content += `Threat Level:  ${suspect.riskLevel} Risk\n`;
      content += `Custody:       ${suspect.status}\n`;
      if (suspect.aliasHistory && suspect.aliasHistory.length > 0) {
        content += `Known Aliases: ${suspect.aliasHistory.join(', ')}\n`;
      }
      if (suspect.physicalData) {
        content += `Height:        ${suspect.physicalData.height || 'N/A'}\n`;
        content += `Weight:        ${suspect.physicalData.weight || 'N/A'}\n`;
        content += `Eyes/Hair:     ${suspect.physicalData.eyeColor || 'N/A'} / ${suspect.physicalData.hairColor || 'N/A'}\n`;
        content += `Identifiers:   ${suspect.physicalData.scars || 'None Registered'}\n`;
        content += `FingerprintID: ${suspect.physicalData.fingerprintsId || 'N/A'}\n`;
      }
      
      if (suspect.criminalRecord && suspect.criminalRecord.length > 0) {
        content += `\nPRIOR CRIMINAL RECORD HISTORY:\n`;
        suspect.criminalRecord.forEach(rec => {
          content += `  - [${rec.date}] Offense: ${rec.offense} | Verdict: ${rec.disposition} | Case Ref: ${rec.caseNumber}\n`;
        });
      }
    } else {
      content += `No active primary suspect identified.\n`;
    }
    content += `\n`;

    content += `${subDivider}\n`;
    content += `III. SECURED EVIDENCE INVENTORY REGISTER\n`;
    content += `${subDivider}\n`;
    if (caseEvidence.length > 0) {
      caseEvidence.forEach(item => {
        content += `Tracking #:   ${item.trackingNumber}\n`;
        content += `Description:  ${item.title} (Category: ${item.category})\n`;
        content += `Location:     ${item.location} (Code: ${item.capacityCode})\n`;
        content += `Status:       ${item.status}\n`;
        if (item.chainOfCustody && item.chainOfCustody.length > 0) {
          content += `Chain of Custody Timeline:\n`;
          item.chainOfCustody.forEach(cust => {
            content += `  - ${cust.date}: ${cust.action} by ${cust.officer} (Location: ${cust.institution})\n`;
          });
        }
        content += `\n`;
      });
    } else {
      content += `No evidence items associated with this case file.\n\n`;
    }

    content += `${subDivider}\n`;
    content += `IV. CHRONOLOGICAL INVESTIGATIVE DIARY\n`;
    content += `${subDivider}\n`;
    caseData.timeline.forEach(event => {
      content += `[${event.date}] ${event.title}\n`;
      content += `  Officer in Charge: ${event.officer}\n`;
      content += `  Description:       ${event.description}\n\n`;
    });

    content += `${divider}\n`;
    content += `END OF DOSSIER - AUDIT RECORD EXECUTED ON SERVER AT 10.122.45.104\n`;
    content += `LEAD INSPECTOR SIGNATURE: ELENA ROSTOVA (BADGE #1204)\n`;
    content += `${divider}\n`;

    // Create browser-native download link/file-save
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Case_Dossier_${caseData.caseNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onAddLog(
      'Case Dossier File Exported',
      'Data Change',
      `User downloaded Case Dossier text-file export for Case ${caseData.caseNumber}.`,
      JSON.stringify({ case_id: caseData.id, action: 'file_download' }, null, 2)
    );
  };

  // Timeline Event Form state
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventOfficer, setNewEventOfficer] = useState('Inspector Elena Rostova');

  const handleAddTimelineEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDesc.trim()) return;

    const timelineEvent: TimelineEvent = {
      id: `TL-${Date.now()}`,
      date: new Date().toISOString().substring(0, 10),
      title: newEventTitle.trim(),
      description: newEventDesc.trim(),
      officer: newEventOfficer.trim()
    };

    const updatedCase: Case = {
      ...caseData,
      timeline: [...caseData.timeline, timelineEvent]
    };

    onUpdateCase(updatedCase);
    
    onAddLog(
      'Case Timeline Updated',
      'Data Change',
      `Added investigative event "${newEventTitle.trim()}" to Case ${caseData.caseNumber}.`,
      JSON.stringify({ case_id: caseData.id, event: timelineEvent }, null, 2)
    );

    setNewEventTitle('');
    setNewEventDesc('');

    alert('Investigative timeline event logged.');
  };

  const handleLinkEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvidenceIdToLink || !linkReason) return;

    const itemToLink = evidence.find(e => e.id === selectedEvidenceIdToLink);
    if (!itemToLink) return;

    // 1. Update the Evidence's case association
    const updatedEvidence: Evidence = {
      ...itemToLink,
      caseId: caseData.id,
      notes: `${itemToLink.notes || ''} - Linked to case ${caseData.caseNumber} because: ${linkReason}`
    };
    onUpdateEvidence(updatedEvidence);

    // 2. Update Case's evidenceIds
    const updatedCase: Case = {
      ...caseData,
      evidenceIds: [...caseData.evidenceIds, itemToLink.id],
      timeline: [
        ...caseData.timeline,
        {
          id: `TL-${Date.now()}`,
          date: new Date().toISOString().substring(0, 10),
          title: 'Evidence Linked',
          description: `Evidence Item ${itemToLink.trackingNumber} ("${itemToLink.title}") linked to investigation file. Reason: ${linkReason}`,
          officer: linkOfficer
        }
      ]
    };
    onUpdateCase(updatedCase);

    setShowLinkModal(false);

    onAddLog(
      'Evidence Linked to Case',
      'Evidence Flow',
      `Linked Evidence Item ${itemToLink.trackingNumber} to Case ${caseData.caseNumber}. Reason: ${linkReason}`,
      JSON.stringify({ case_id: caseData.id, evidence_id: itemToLink.id, officer: linkOfficer, reason: linkReason }, null, 2)
    );

    alert(`Evidence ${itemToLink.trackingNumber} has been securely linked to case ${caseData.caseNumber}.`);
    
    // Clear forms
    setSelectedEvidenceIdToLink('');
    setLinkReason('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-mono text-blue-600 uppercase tracking-wider block">Investigation Profile Registry</span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2 font-sans mt-0.5">
            <Briefcase className="h-6 w-6 text-blue-600" />
            Case File: {caseData.title}
          </h1>
          <p className="text-xs text-slate-550 font-mono mt-1">
            CASE NUMBER: {caseData.caseNumber} • AUTHORITY: SPECIAL INVESTIGATIONS UNIT • LOCKER LINKS ENFORCED
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-wrap gap-2.5">
          <button
            onClick={() => {
              setShowPrintModal(true);
              onAddLog(
                'Case Dossier Prepared for Print',
                'Access',
                `User initiated printer-friendly preview for Case ${caseData.caseNumber}.`,
                JSON.stringify({ case_id: caseData.id, action: 'print_preview' }, null, 2)
              );
            }}
            className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
            title="Preview printer-friendly classified dossier layout"
          >
            <Printer className="h-4 w-4 text-slate-550" /> Print Preview
          </button>
          <button
            onClick={() => {
              setShowPrintModal(true);
              onAddLog(
                'Case Dossier Export to PDF Triggered',
                'Access',
                `User initiated browser-native PDF export/print flow for Case ${caseData.caseNumber}.`,
                JSON.stringify({ case_id: caseData.id, action: 'print_pdf_direct' }, null, 2)
              );
              // Trigger browser-native print immediately after modal shows
              setTimeout(() => {
                window.print();
              }, 300);
            }}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Export directly to PDF using native browser print utility"
          >
            <FileText className="h-4 w-4 text-emerald-700" /> Export to PDF
          </button>
          <button
            onClick={handleDownloadTxtReport}
            className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
            title="Save report to disk as formatted text dossier"
          >
            <Download className="h-4 w-4 text-slate-550" /> Save File (.txt)
          </button>
          <button
            onClick={() => setShowLinkModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Link2 className="h-4 w-4" /> Link Evidence
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Case Dossier details & Timeline (7 cols) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 lg:col-span-7 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 block uppercase">Department Authority</span>
                <span className="text-sm font-semibold text-slate-800 font-sans">{caseData.investigatingTeam}</span>
              </div>
              <div className="flex gap-2">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                  caseData.status === 'Under Investigation' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                  'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  {caseData.status}
                </span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                  caseData.priority === 'High' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-100'
                }`}>
                  {caseData.priority} Priority
                </span>
              </div>
            </div>

            {/* Description Narrative */}
            <div className="mt-4">
              <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Investigation Objective Brief</span>
              <p className="text-xs text-slate-700 font-sans leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {caseData.description}
              </p>
            </div>

            {/* Investigative Timeline Log */}
            <div className="mt-6 space-y-4">
              <h3 className="text-xs font-mono text-slate-500 uppercase tracking-wider">Investigative Diary Timeline</h3>
              
              <div className="space-y-4 border-l border-slate-200 pl-4 ml-2 max-h-[200px] overflow-y-auto pr-1">
                {caseData.timeline.map((event) => (
                  <div key={event.id} className="relative">
                    <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-slate-200 border border-slate-300" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-550">{event.date}</span>
                        <span className="text-[10px] font-mono text-blue-600 font-bold">BY: {event.officer.split('(')[0]}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">{event.title}</h4>
                      <p className="text-xs text-slate-600 font-sans mt-0.5">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form to log investigation diary entry */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2.5">Log investigative Diary Entry</h4>
            <form onSubmit={handleAddTimelineEvent} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4">
                <input
                  type="text"
                  required
                  placeholder="Event title (e.g. Wiretap Initiated)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 placeholder-slate-450 focus:outline-none"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                />
              </div>
              <div className="sm:col-span-6">
                <input
                  type="text"
                  required
                  placeholder="Operational description summary of action..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 placeholder-slate-450 focus:outline-none"
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Suspect profile summary & Linked Evidence table (5 cols) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Suspect card */}
            {suspect ? (
              <div>
                <h3 className="text-xs font-mono text-slate-550 uppercase tracking-wider mb-2.5">Primary Suspect Target</h3>
                <div 
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-4 hover:border-blue-500/30 cursor-pointer transition-all"
                  onClick={() => onNavigate('suspect')}
                >
                  <img 
                    src={suspect.mugshotUrl} 
                    alt={suspect.name} 
                    className="w-16 h-16 object-cover rounded-lg border border-slate-200 shrink-0 shadow referrerPolicy='no-referrer'"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-red-600 font-bold uppercase tracking-wide block">RISK LEVEL: {suspect.riskLevel}</span>
                    <h4 className="text-sm font-bold text-slate-900 font-sans flex items-center gap-1.5 hover:text-blue-650">
                      {suspect.name}
                      <ExternalLink className="h-3 w-3 text-slate-400" />
                    </h4>
                    <p className="text-xs text-slate-500 font-sans">
                      Status: <span className="text-slate-700 font-medium">{suspect.status}</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-mono">No prime suspect logged for this case file.</p>
            )}

            {/* Linked evidence items list table */}
            <div>
              <h3 className="text-xs font-mono text-slate-555 uppercase tracking-wider mb-2.5">Secured Linked Evidence</h3>
              <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Tracking</th>
                      <th className="py-2 px-3">Seized Description</th>
                      <th className="py-2 px-3">Custody</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700 font-sans">
                    {caseEvidence.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-100/50 cursor-pointer" onClick={() => onNavigate('evidence')}>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 font-bold">{e.trackingNumber}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 hover:text-blue-600">{e.title}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold ${
                            e.status === 'In Storage' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' :
                            e.status === 'In Lab Analysis' ? 'bg-violet-50 text-violet-800 border border-violet-100' :
                            'bg-blue-50 text-blue-800 border border-blue-100'
                          }`}>
                            {e.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {caseEvidence.length === 0 && (
                      <tr>
                        <td colSpan={3} className="text-center text-xs text-slate-400 font-mono py-6">
                          NO EVIDENCE ATTACHED TO CASE
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-4 flex items-start gap-2 text-[10px] font-mono text-slate-500">
            <Shield className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-normal">
              Warning: Case files are audited automatically. Any evidence changes require matching warrants and authorized commanding signatures to pass digital gates.
            </p>
          </div>
        </div>
      </div>

      {/* Link Evidence Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-sans font-bold text-base text-slate-900">Secure Evidence Linkage</h3>
                <p className="text-xs text-slate-550 font-mono">CASE ID: {caseData.caseNumber}</p>
              </div>
              <button 
                onClick={() => setShowLinkModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleLinkEvidenceSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Select Seized Contraband / Property</label>
                <select
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500/50 font-sans"
                  value={selectedEvidenceIdToLink}
                  onChange={(e) => setSelectedEvidenceIdToLink(e.target.value)}
                >
                  <option value="">-- Choose unlinked evidence item --</option>
                  {unlinkedEvidence.map(e => (
                    <option key={e.id} value={e.id}>{e.trackingNumber} - {e.title} ({e.status})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Reason for Linkage / Case Connection</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide precise investigation rationale for linking this physical property to this criminal network case. (e.g. Recovered from prime suspect Damon Vance's glove compartment during arrest)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 font-sans leading-relaxed"
                  value={linkReason}
                  onChange={(e) => setLinkReason(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Authorizing Officer signature</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 italic font-mono focus:outline-none focus:border-blue-500/50"
                  value={linkOfficer}
                  onChange={(e) => setLinkOfficer(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg flex-1 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex-1 transition-colors"
                >
                  Confirm Linkage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Dossier Modal / Layout */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-sm p-4 md:p-8 overflow-y-auto no-print-backdrop">
          {/* Style injection for printing */}
          <style>{`
            @media print {
              /* Hide ALL other elements in the body */
              body > * {
                display: none !important;
              }
              /* Show ONLY our printable wrapper and make it root-level */
              #printable-dossier-wrapper {
                display: block !important;
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
                color: black !important;
              }
              /* Standardize print properties */
              .no-print {
                display: none !important;
              }
              .print-break-avoid {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              /* Ensure black and white colors are preserved during print */
              .print-text-dark {
                color: #000000 !important;
              }
              .print-text-gray {
                color: #4b5563 !important;
              }
              .print-border-dark {
                border-color: #000000 !important;
              }
              .print-bg-light {
                background-color: #f3f4f6 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          `}</style>

          {/* Sticky Toolbar for Screen View */}
          <div className="w-full max-w-4xl mx-auto flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 shadow-xl no-print shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/10 text-blue-400 rounded-lg border border-blue-500/20">
                <Printer className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-sm text-white">Classified Case Dossier Printer Utility</h3>
                <p className="text-xs text-slate-400 font-mono">CASE ID: {caseData.caseNumber} • Ready for black & white physical print / PDF generation</p>
              </div>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  onAddLog(
                    'Case Dossier Printing Cancelled',
                    'Access',
                    `User closed printable dossier view for Case ${caseData.caseNumber}.`
                  );
                  setShowPrintModal(false);
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer border border-slate-700"
              >
                Cancel / Return
              </button>
              <button
                onClick={() => {
                  onAddLog(
                    'Case Dossier Sent to Printer',
                    'Access',
                    `User triggered system print command for Case ${caseData.caseNumber}.`,
                    JSON.stringify({ case_id: caseData.id, action: 'execute_print' }, null, 2)
                  );
                  window.print();
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg"
              >
                <Printer className="h-4 w-4" /> Trigger System Print
              </button>
            </div>
          </div>

          {/* Printable Document (The "Sheet" preview on-screen, absolute target of @media print) */}
          <div 
            id="printable-dossier-wrapper" 
            className="w-full max-w-4xl mx-auto bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-2xl p-6 md:p-10 space-y-8 select-text print:p-0 print:border-none print:shadow-none"
          >
            {/* 1. OFFICIAL POLICE DEPARTMENT HEADER */}
            <div className="border-b-4 border-slate-900 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-900 text-white rounded-xl shrink-0 print:bg-black print:text-white">
                  <Shield className="h-10 w-10" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-950 uppercase font-sans">
                    METROPOLITAN POLICE DEPARTMENT
                  </h1>
                  <h2 className="text-sm font-semibold tracking-wide text-slate-600 uppercase font-mono">
                    SPECIAL INVESTIGATIONS UNIT (SIU) • PRECINCT 12
                  </h2>
                  <p className="text-[10px] font-mono text-slate-500">
                    540 LAW ENFORCEMENT BLVD, ROOM 12-A • CONFIDENTIAL RECORD SEARCH
                  </p>
                </div>
              </div>
              <div className="text-right border-l-2 border-red-500 pl-4 md:border-l-2 print:border-red-500 shrink-0">
                <span className="text-[10px] font-mono font-bold text-red-600 tracking-wider block uppercase">CLASSIFIED DOSSIER</span>
                <span className="text-xs font-mono font-bold text-slate-800 tracking-tight block">CASE NUM: {caseData.caseNumber}</span>
                <span className="text-[9px] font-mono text-slate-500 block">GENERATED: {new Date().toLocaleString()}</span>
              </div>
            </div>

            {/* 2. CASE CLASSIFICATION METADATA */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 print:bg-gray-100 print:border-black">
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Investigation Status</span>
                <span className="text-xs font-bold text-slate-900 uppercase font-sans">{caseData.status}</span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Case Security Priority</span>
                <span className="text-xs font-bold text-slate-900 uppercase font-sans">{caseData.priority} Priority</span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Investigating Squad</span>
                <span className="text-xs font-bold text-slate-900 uppercase font-sans">{caseData.investigatingTeam}</span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Dossier Date Opened</span>
                <span className="text-xs font-bold text-slate-900 uppercase font-mono">{caseData.dateCreated}</span>
              </div>
            </div>

            {/* 3. CASE TITLE & OBJECTIVE SUMMARY */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-1 font-bold">
                I. Case Title & Operational Narrative Briefing
              </h3>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-950 font-sans">{caseData.title}</h4>
                <p className="text-xs text-slate-700 font-sans leading-relaxed text-justify whitespace-pre-wrap">
                  {caseData.description}
                </p>
              </div>
            </div>

            {/* 4. SUSPECT INTELLIGENCE PROFILE */}
            <div className="space-y-4 print-break-avoid">
              <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-1 font-bold">
                II. Target Suspect Intelligence Dossier
              </h3>
              {suspect ? (
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <img 
                      src={suspect.mugshotUrl} 
                      alt={suspect.name} 
                      className="w-28 h-28 object-cover rounded-lg border-2 border-slate-900 shadow-md grayscale print:w-24 print:h-24 print:border-black referrerPolicy='no-referrer'"
                    />
                    <span className="text-[9px] font-mono font-bold text-red-600 border border-red-200 px-2 py-0.5 rounded bg-red-50 uppercase tracking-wider">
                      {suspect.riskLevel} Threat
                    </span>
                  </div>
                  <div className="flex-1 w-full space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2.5">
                      <div className="col-span-2">
                        <span className="text-[9px] font-mono text-slate-500 uppercase block">Subject Legal Name</span>
                        <span className="text-sm font-bold text-slate-950 font-sans">{suspect.name}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase block">Age / Gender</span>
                        <span className="text-xs font-semibold text-slate-900">{suspect.age} / {suspect.gender}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase block">Custody Status</span>
                        <span className="text-xs font-semibold text-slate-900">{suspect.status}</span>
                      </div>
                    </div>

                    {/* Alias List */}
                    {suspect.aliasHistory && suspect.aliasHistory.length > 0 && (
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase block">Monikers & Known Aliases</span>
                        <span className="text-xs text-slate-700 italic font-medium">{suspect.aliasHistory.join(', ')}</span>
                      </div>
                    )}

                    {/* Physical Descriptions */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 p-3 print:bg-white print:border-black">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold border-b border-slate-200 pb-1 mb-2">Subject Identifiers</span>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-[9px] font-mono text-slate-500 block">Height / Weight</span>
                          <span className="font-semibold">{suspect.physicalData?.height || 'N/A'} / {suspect.physicalData?.weight || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-slate-500 block">Eyes / Hair Color</span>
                          <span className="font-semibold">{suspect.physicalData?.eyeColor || 'N/A'} / {suspect.physicalData?.hairColor || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-slate-500 block">Distinguishing Marks</span>
                          <span className="font-semibold truncate block" title={suspect.physicalData?.scars}>{suspect.physicalData?.scars || 'None Record'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-slate-500 block flex items-center gap-1">
                            <Fingerprint className="h-3 w-3 text-slate-700 print:text-black" /> Fingerprints ID
                          </span>
                          <span className="font-mono font-bold text-slate-800 text-[10px]">{suspect.physicalData?.fingerprintsId || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-mono italic">No formal primary suspect is registered to this case file.</p>
              )}
            </div>

            {/* 5. ARRESTS AND CRIMINAL RECORD HISTORY */}
            {suspect && suspect.criminalRecord && suspect.criminalRecord.length > 0 && (
              <div className="space-y-3 print-break-avoid">
                <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider block font-bold">
                  Arrest History & Prior Criminal Records
                </h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 print:bg-white print:border-black">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-200 text-slate-700 font-mono text-[9px] uppercase border-b border-slate-300 print:bg-gray-100 print:text-black print:border-black">
                      <tr>
                        <th className="py-1.5 px-3">Date</th>
                        <th className="py-1.5 px-3">Offense / Charge</th>
                        <th className="py-1.5 px-3">Disposition / Verdict</th>
                        <th className="py-1.5 px-3">Case ID Reference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800 font-sans print:divide-black">
                      {suspect.criminalRecord.map((record) => (
                        <tr key={record.id} className="hover:bg-slate-100/50">
                          <td className="py-2 px-3 font-mono text-[10px] text-slate-600">{record.date}</td>
                          <td className="py-2 px-3 font-bold text-slate-900">{record.offense}</td>
                          <td className="py-2 px-3 text-slate-700">{record.disposition}</td>
                          <td className="py-2 px-3 font-mono text-[10px] text-slate-600">{record.caseNumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. SECURED EVIDENCE INVENTORY LOG */}
            <div className="space-y-3 print-break-avoid">
              <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-1 font-bold">
                III. Secure Evidence Locker & Contraband Registry
              </h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 print:bg-white print:border-black">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-200 text-slate-700 font-mono text-[9px] uppercase border-b border-slate-300 print:bg-gray-100 print:text-black print:border-black">
                    <tr>
                      <th className="py-2 px-3">Tracking Num</th>
                      <th className="py-2 px-3">Item Description & Category</th>
                      <th className="py-2 px-3">Current Location</th>
                      <th className="py-2 px-3">Security Code</th>
                      <th className="py-2 px-3">Operational Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800 font-sans print:divide-black">
                    {caseEvidence.map((item) => (
                      <React.Fragment key={item.id}>
                        <tr className="hover:bg-slate-100/50 bg-white print:bg-white">
                          <td className="py-2.5 px-3 font-mono text-[10px] text-slate-900 font-bold">{item.trackingNumber}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-950">
                            {item.title}
                            <span className="text-[9px] font-mono text-slate-500 block font-normal">Category: {item.category}</span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 font-medium">{item.location}</td>
                          <td className="py-2.5 px-3 font-mono text-[10px] text-slate-600">{item.capacityCode}</td>
                          <td className="py-2.5 px-3">
                            <span className="text-[10px] font-mono font-bold text-slate-900 uppercase">
                              {item.status}
                            </span>
                          </td>
                        </tr>
                        {/* Render brief chain of custody details inside table for print */}
                        {item.chainOfCustody && item.chainOfCustody.length > 0 && (
                          <tr className="bg-slate-100/30 print:bg-white">
                            <td colSpan={5} className="py-1 px-3 bg-slate-50/50 print:bg-white">
                              <div className="text-[9px] font-mono text-slate-600 border-l-2 border-slate-400 pl-3 py-1 space-y-0.5 print:border-black print:text-black">
                                <span className="font-bold uppercase tracking-wider block text-slate-500">Chain of Custody Timeline:</span>
                                {item.chainOfCustody.map((custody, index) => (
                                  <div key={custody.id || index} className="flex flex-wrap gap-x-2">
                                    <span className="font-semibold text-slate-700">{custody.date}:</span>
                                    <span>{custody.action}</span>
                                    <span className="text-slate-500">({custody.officer} @ {custody.institution})</span>
                                    {custody.signature && <span className="italic font-bold text-slate-600">[Sig: {custody.signature}]</span>}
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}

                    {caseEvidence.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center text-xs text-slate-500 font-mono py-8 bg-white">
                          NO RECOVERED PROPERTY OR CONTRABAND ATTACHED TO THIS INVESTIGATION
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 7. CHRONOLOGICAL INVESTIGATIVE DIARY (TIMELINE) */}
            <div className="space-y-4 print-break-avoid">
              <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-1 font-bold">
                IV. Chronological Investigative Diary & Log Entries
              </h3>
              
              <div className="space-y-4 border-l-2 border-slate-300 pl-4 ml-2 print:border-black">
                {caseData.timeline.map((event) => (
                  <div key={event.id} className="relative">
                    <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-slate-900 border border-white print:border-black print:bg-black" />
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 print:text-black">
                        <span className="font-bold">{event.date}</span>
                        <span>•</span>
                        <span className="font-bold text-blue-700 print:text-black">OFFICER IN CHARGE: {event.officer}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">{event.title}</h4>
                      <p className="text-xs text-slate-700 font-sans mt-0.5 leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. FORMAL COMPLIANCE STANDARDS & AUDIT SIGN-OFF */}
            <div className="border-t-2 border-slate-300 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 print-break-avoid print:border-black print:pt-4">
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">V. Departmental Mandates & Audit Compliance Check</span>
                <div className="space-y-2 text-xs text-slate-700 font-sans">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border border-slate-400 flex items-center justify-center font-bold text-[10px] text-emerald-600 bg-slate-50 shrink-0 print:border-black">✓</div>
                    <span>All logged items matched with verified chain of custody warrants.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border border-slate-400 flex items-center justify-center font-bold text-[10px] text-emerald-600 bg-slate-50 shrink-0 print:border-black">✓</div>
                    <span>No unredacted third-party juvenile informant names are displayed.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border border-slate-400 flex items-center justify-center font-bold text-[10px] text-emerald-600 bg-slate-50 shrink-0 print:border-black">✓</div>
                    <span>Active warrant details and evidence lock parameters verified.</span>
                  </div>
                </div>
              </div>

              {/* Signatures and stamps panel */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col justify-end border-b border-slate-400 pb-2 print:border-black">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Inspector In Charge</span>
                  <span className="text-xs italic font-mono font-bold text-slate-700 mt-2 block">Elena Rostova</span>
                  <span className="text-[9px] font-mono text-slate-400 block border-t border-dotted border-slate-300 pt-1 print:border-black">Badge #1204 • Lead Authority</span>
                </div>
                <div className="flex flex-col justify-end border-b border-slate-400 pb-2 print:border-black">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Commanding Captain / Stamp</span>
                  <span className="text-xs italic text-slate-300 font-serif font-bold mt-4 block">____________________</span>
                  <span className="text-[9px] font-mono text-slate-400 block border-t border-dotted border-slate-300 pt-1 print:border-black">SIU Commander Sign-Off</span>
                </div>
              </div>
            </div>

            {/* Official footer */}
            <div className="text-center pt-4 border-t border-slate-200 text-[9px] font-mono text-slate-400 flex justify-between items-center print:border-black">
              <span>PRECINCT 12 SECURITY AUDIT ENFORCED</span>
              <span>CLASSIFIED INTERNAL USE ONLY</span>
              <span>PAGE 1 OF 1</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
