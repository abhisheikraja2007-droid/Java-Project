/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Incident } from '../types';
import { FileText, Plus, ShieldCheck, MapPin, Signature, CheckSquare, ClipboardCheck, Trash2 } from 'lucide-react';

interface IncidentReportingProps {
  onAddIncident: (incident: Incident) => void;
  onAddLog: (event: string, category: 'Security' | 'Access' | 'Data Change' | 'Evidence Flow' | 'System', details: string, payload?: string) => void;
  onAddCase: (newCase: any) => void;
}

export default function IncidentReporting({ onAddIncident, onAddLog, onAddCase }: IncidentReportingProps) {
  // New Incident State Form
  const [incidentNum, setIncidentNum] = useState(`INC-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Violent Crime / Armed Robbery');
  const [narrative, setNarrative] = useState('');
  
  // Location
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState('40.7128° N, 74.0060° W');
  const [precinct, setPrecinct] = useState('Precinct 12');

  const SECTORS = [
    { id: 'A', name: 'Sector A (North Heights)', level: 'High', color: 'bg-orange-50 text-orange-950 border-orange-200 hover:bg-orange-100 hover:border-orange-300', density: '24 Incidents', coords: '40.7512° N, 73.9841° W', precinct: 'Precinct 18' },
    { id: 'B', name: 'Sector B (Downtown Hub)', level: 'Critical', color: 'bg-red-50 text-red-950 border-red-200 hover:bg-red-100/80 hover:border-red-300', density: '42 Incidents', coords: '40.7128° N, 74.0060° W', precinct: 'Precinct 12' },
    { id: 'C', name: 'Sector C (Waterfront Marina)', level: 'Low', color: 'bg-emerald-50 text-emerald-950 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300', density: '5 Incidents', coords: '40.7011° N, 74.0154° W', precinct: 'Precinct 1' },
    { id: 'D', name: 'Sector D (Industrial Yards)', level: 'Medium', color: 'bg-amber-50 text-amber-950 border-amber-200 hover:bg-amber-100 hover:border-amber-300', density: '18 Incidents', coords: '40.7394° N, 73.9511° W', precinct: 'Precinct 10' },
    { id: 'E', name: 'Sector E (Central Plaza)', level: 'High', color: 'bg-orange-50 text-orange-950 border-orange-200 hover:bg-orange-100 hover:border-orange-300', density: '31 Incidents', coords: '40.7580° N, 73.9855° W', precinct: 'Precinct 12' },
    { id: 'F', name: 'Sector F (Suburban Green)', level: 'Low', color: 'bg-emerald-50 text-emerald-950 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300', density: '3 Incidents', coords: '40.7829° N, 73.9654° W', precinct: 'Precinct 22' },
    { id: 'G', name: 'Sector G (Westside Slums)', level: 'Critical', color: 'bg-red-50 text-red-950 border-red-200 hover:bg-red-100/80 hover:border-red-300', density: '38 Incidents', coords: '40.7644° N, 73.9912° W', precinct: 'Precinct 14' },
    { id: 'H', name: 'Sector H (Corporate Financial)', level: 'Low', color: 'bg-emerald-50 text-emerald-950 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300', density: '6 Incidents', coords: '40.7075° N, 74.0090° W', precinct: 'Precinct 5' },
    { id: 'I', name: 'Sector I (East River Port)', level: 'Medium', color: 'bg-amber-50 text-amber-950 border-amber-200 hover:bg-amber-100 hover:border-amber-300', density: '15 Incidents', coords: '40.7420° N, 73.9712° W', precinct: 'Precinct 17' },
  ];

  const handleSectorClick = (sec: any) => {
    setAddress(sec.name);
    setCoordinates(sec.coords);
    setPrecinct(sec.precinct);
  };

  // Officer
  const [officerName, setOfficerName] = useState('Sergeant Marcus Brody');
  const [officerBadge, setOfficerBadge] = useState('4512');
  const [officerSignature, setOfficerSignature] = useState('Sgt. M. Brody');

  // Involved Parties
  const [involvedParties, setInvolvedParties] = useState<{ name: string; role: string; contact: string }[]>([]);
  const [partyName, setPartyName] = useState('');
  const [partyRole, setPartyRole] = useState('Reporting Party');
  const [partyContact, setPartyContact] = useState('');

  // Evidence Logged from Scene
  const [evidenceLog, setEvidenceLog] = useState<{ item: string; serialNumber: string; retrievedFrom: string }[]>([]);
  const [evidenceItemName, setEvidenceItemName] = useState('');
  const [evidenceSerial, setEvidenceSerial] = useState('');
  const [evidenceFrom, setEvidenceFrom] = useState('');

  // Compliance Check
  const [miranda, setMiranda] = useState(false);
  const [bagged, setBagged] = useState(false);
  const [chainInitiated, setChainInitiated] = useState(false);
  const [notified, setNotified] = useState(false);

  const handleAddParty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partyName.trim()) return;
    setInvolvedParties(prev => [...prev, { name: partyName.trim(), role: partyRole, contact: partyContact.trim() }]);
    setPartyName('');
    setPartyContact('');
  };

  const handleRemoveParty = (index: number) => {
    setInvolvedParties(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddEvidenceItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceItemName.trim()) return;
    setEvidenceLog(prev => [...prev, { item: evidenceItemName.trim(), serialNumber: evidenceSerial.trim(), retrievedFrom: evidenceFrom.trim() }]);
    setEvidenceItemName('');
    setEvidenceSerial('');
    setEvidenceFrom('');
  };

  const handleRemoveEvidence = (index: number) => {
    setEvidenceLog(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !narrative.trim() || !address.trim()) {
      alert('Please complete the Title, Narrative, and Address fields.');
      return;
    }

    const newIncident: Incident = {
      id: incidentNum,
      incidentNumber: incidentNum,
      title: title.trim(),
      category,
      status: 'Case Created',
      dateCreated: new Date().toISOString().substring(0, 10),
      narrative: narrative.trim(),
      location: { address: address.trim(), coordinates, precinct },
      reportingOfficer: { name: officerName, badge: officerBadge, signature: officerSignature },
      involvedParties,
      evidenceLog,
      complianceChecklist: {
        mirandaWarning: miranda,
        evidenceBagged: bagged,
        chainInitiated,
        supervisorNotified: notified
      }
    };

    onAddIncident(newIncident);

    // Create an automatic corresponding active investigation case based on this report!
    const autoCase = {
      id: `CMS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim(),
      caseNumber: `CMS-2026-${Math.floor(8000 + Math.random() * 1000)}`,
      description: `Active investigation generated from incident report ${incidentNum}. Narrative: ${narrative.substring(0, 180)}...`,
      status: 'Active',
      priority: 'High',
      investigatingTeam: 'Precinct 12 Robbery Det.',
      primarySuspectId: 'SP-9012', // Vic Vance/Victor Vance as default suspect
      evidenceIds: [],
      dateCreated: new Date().toISOString().substring(0, 10),
      timeline: [
        {
          id: `TL-${Date.now()}`,
          date: new Date().toISOString().substring(0, 10),
          title: 'Investigation Initiated from Incident Report',
          description: `Automatic case generation triggered by ${officerName} filing report ${incidentNum}.`,
          officer: officerName
        }
      ]
    };

    onAddCase(autoCase);

    // Log the security/audit action
    onAddLog(
      'Incident Transferred to Case',
      'Data Change',
      `Filed Incident Report ${incidentNum} ("${title.trim()}") and promoted it to active Investigation Case ${autoCase.caseNumber}.`,
      JSON.stringify({ incident: newIncident, generated_case: autoCase }, null, 2)
    );

    alert(`Incident Report ${incidentNum} submitted. Corresponding Case ${autoCase.caseNumber} has been successfully initialized.`);
    
    // Reset forms
    setIncidentNum(`INC-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setTitle('');
    setNarrative('');
    setAddress('');
    setInvolvedParties([]);
    setEvidenceLog([]);
    setMiranda(false);
    setBagged(false);
    setChainInitiated(false);
    setNotified(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2 font-sans">
            <FileText className="h-6 w-6 text-blue-600" />
            Incident Reporting & Case Promotion Intake
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            OFFICIAL CRIME INTAKE FORM • COMPLIANT WITH STATE LEGAL STANDARDS • INSTANT INVESTIGATION CONVERSION
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmitIncident} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Incident Form (7 cols) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 lg:col-span-7 space-y-5 shadow-sm">
          <div className="border-b border-slate-200 pb-3 flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg">
            <span className="text-xs font-mono text-slate-500">REPORT NO: <span className="text-slate-800 font-bold">{incidentNum}</span></span>
            <span className="text-xs font-mono text-emerald-650 font-bold uppercase">READY FOR INTAKE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8">
              <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Incident Offense Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Armed Commercial Robbery at 12th St Jewelry"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="sm:col-span-4">
              <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Offense Category</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500/50 font-sans"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Violent Crime / Armed Robbery">Violent Crime / Armed Robbery</option>
                <option value="Grand Larceny / Burglary">Grand Larceny / Burglary</option>
                <option value="Narcotics Trafficking / Possession">Narcotics Trafficking / Possession</option>
                <option value="White Collar Financial Fraud">White Collar Financial Fraud</option>
                <option value="Homicide / Assault with Weapon">Homicide / Assault with Weapon</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {/* Tactical Sector Intel Grid */}
            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-mono text-slate-800 uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
                  Tactical Map Sector Intel (High-Frequency Hotspots)
                </label>
                <span className="text-[9px] font-mono text-slate-400 italic">Select a sector block to lock location coordinates</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {SECTORS.map(sec => {
                  const isSelected = address === sec.name;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => handleSectorClick(sec)}
                      className={`relative p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between h-[64px] ${sec.color} ${
                        isSelected 
                          ? 'ring-2 ring-blue-500 border-blue-400 bg-blue-50 text-blue-900 shadow-sm' 
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs font-mono font-bold text-slate-500">{sec.id}</span>
                        <span className={`text-[8px] font-mono px-1 rounded uppercase ${
                          sec.level === 'Critical' ? 'bg-red-100 text-red-800 font-bold' :
                          sec.level === 'High' ? 'bg-orange-100 text-orange-800' :
                          sec.level === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>{sec.level}</span>
                      </div>
                      <div className="mt-1">
                        <span className="text-[9px] font-sans block truncate font-semibold text-slate-800">{sec.name.split(' (')[1]?.replace(')', '')}</span>
                        <span className="text-[8px] font-mono text-slate-400 block truncate">{sec.density}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-12">
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Incident Location Address</label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1244 Grand Avenue, Precinct 12 Sector B"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 font-sans"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="md:col-span-6">
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">GPS Coordinates</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 40.7128° N, 74.0060° W"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500/50"
                  value={coordinates}
                  onChange={(e) => setCoordinates(e.target.value)}
                />
              </div>

              <div className="md:col-span-6">
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Precinct Division</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Precinct 12"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-850 font-sans focus:outline-none focus:border-blue-500/50"
                  value={precinct}
                  onChange={(e) => setPrecinct(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Incident Detail & Officer Narrative</label>
              <textarea
                required
                rows={5}
                placeholder="Write a clear, cohesive narrative report of what transpired at the scene. Be specific regarding timeline, evidence seized, suspect directions of flight, and statements made."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-850 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 leading-relaxed font-sans"
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
              />
            </div>
          </div>

          {/* Involved Parties list section */}
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-xs font-mono text-slate-650 uppercase tracking-wider mb-2">Witnesses, Victims, & Involved Parties</h3>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              {/* Add party inline form */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 font-sans"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-3">
                  <select
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500/50 font-sans"
                    value={partyRole}
                    onChange={(e) => setPartyRole(e.target.value)}
                  >
                    <option value="Reporting Party">Reporting Party</option>
                    <option value="Victim">Victim</option>
                    <option value="Witness">Witness</option>
                    <option value="Suspect / Associate">Suspect / Associate</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    placeholder="Contact info"
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 font-sans"
                    value={partyContact}
                    onChange={(e) => setPartyContact(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddParty}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1.5 rounded text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>
              </div>

              {/* Parties list */}
              {involvedParties.length > 0 ? (
                <div className="divide-y divide-slate-200 pt-2 max-h-[140px] overflow-y-auto">
                  {involvedParties.map((party, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 text-xs">
                      <div className="font-sans text-slate-700">
                        <span className="font-bold text-slate-900">{party.name}</span> • <span className="italic text-slate-500">{party.role}</span>
                        <span className="text-slate-400 block text-[10px] font-mono">Contact: {party.contact || 'No phone recorded'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveParty(idx)}
                        className="text-red-500 hover:text-red-400 p-1.5 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] font-mono text-slate-400 text-center py-2">NO PERSONS CURRENTLY ATTACHED TO THIS OFFENSE LOG</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Evidence seized from crime scene & Checklist (5 cols) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 lg:col-span-5 space-y-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-6">
            {/* Seized Scene Evidence block */}
            <div>
              <h3 className="text-xs font-mono text-slate-550 uppercase tracking-wider mb-2">Evidence Seized at Crime Scene</h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      placeholder="Item title (e.g. Glock 17)"
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-900 placeholder-slate-450 focus:outline-none"
                      value={evidenceItemName}
                      onChange={(e) => setEvidenceItemName(e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="Serial #"
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-900 placeholder-slate-450 font-mono focus:outline-none"
                      value={evidenceSerial}
                      onChange={(e) => setEvidenceSerial(e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-4 flex gap-1">
                    <input
                      type="text"
                      placeholder="Retrieved from"
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-900 placeholder-slate-450 focus:outline-none"
                      value={evidenceFrom}
                      onChange={(e) => setEvidenceFrom(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleAddEvidenceItem}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded p-1.5 text-xs flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Evidence Items Logged */}
                {evidenceLog.length > 0 ? (
                  <div className="divide-y divide-slate-200 pt-2 max-h-[140px] overflow-y-auto">
                    {evidenceLog.map((ev, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 text-xs">
                        <div className="font-sans text-slate-700">
                          <span className="font-bold text-slate-900">{ev.item}</span>
                          <p className="text-[10px] font-mono text-slate-400">
                            Serial: {ev.serialNumber || 'N/A'} • Location: {ev.retrievedFrom}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveEvidence(idx)}
                          className="text-red-500 hover:text-red-400 p-1.5 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] font-mono text-slate-450 text-center py-2">NO PROPERTY SEIZED IN CURRENT OFFENSE RECORD</p>
                )}
              </div>
            </div>

            {/* Compliance checklist */}
            <div>
              <h3 className="text-xs font-mono text-slate-550 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <ClipboardCheck className="h-4 w-4 text-slate-550" />
                Miranda & Legal Compliance Checklist
              </h3>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                <div 
                  className="flex items-center gap-2.5 cursor-pointer hover:bg-slate-100/50 p-1 rounded"
                  onClick={() => setMiranda(prev => !prev)}
                >
                  <input
                    type="checkbox"
                    checked={miranda}
                    onChange={() => {}} // parent click
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-700 font-sans leading-tight">
                    Miranda Warning Read to Suspects (if detained)
                  </span>
                </div>

                <div 
                  className="flex items-center gap-2.5 cursor-pointer hover:bg-slate-100/50 p-1 rounded"
                  onClick={() => setBagged(prev => !prev)}
                >
                  <input
                    type="checkbox"
                    checked={bagged}
                    onChange={() => {}} // parent click
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-700 font-sans leading-tight">
                    Evidence Sealed & Bagged in Secure Tamper-Proof Bags
                  </span>
                </div>

                <div 
                  className="flex items-center gap-2.5 cursor-pointer hover:bg-slate-100/50 p-1 rounded"
                  onClick={() => setChainInitiated(prev => !prev)}
                >
                  <input
                    type="checkbox"
                    checked={chainInitiated}
                    onChange={() => {}} // parent click
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-700 font-sans leading-tight">
                    Chain of Custody Document Initiated immediately
                  </span>
                </div>

                <div 
                  className="flex items-center gap-2.5 cursor-pointer hover:bg-slate-100/50 p-1 rounded"
                  onClick={() => setNotified(prev => !prev)}
                >
                  <input
                    type="checkbox"
                    checked={notified}
                    onChange={() => {}} // parent click
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-700 font-sans leading-tight">
                    Duty Desk Supervisor and Lead Investigator Notified
                  </span>
                </div>
              </div>
            </div>

            {/* Signature Block */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Reporting Officer Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white border border-slate-200 rounded p-2 text-xs text-slate-900"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Badge #</label>
                  <input
                    type="text"
                    required
                    className="w-24 bg-white border border-slate-200 rounded p-2 text-xs text-slate-900 font-mono"
                    value={officerBadge}
                    onChange={(e) => setOfficerBadge(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Cryptographic Signature</label>
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded px-2.5 py-1.5">
                  <Signature className="h-4 w-4 text-blue-600 shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sgt. M. Brody"
                    className="bg-transparent text-xs text-slate-800 focus:outline-none italic w-full font-mono"
                    value={officerSignature}
                    onChange={(e) => setOfficerSignature(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-sans font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors uppercase tracking-wider text-xs shadow-sm"
          >
            <ShieldCheck className="h-4 w-4" />
            Commit & Promote Incident to Case File
          </button>
        </div>
      </form>
    </div>
  );
}
