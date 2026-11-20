/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserPersonnel } from '../types';
import { ShieldAlert, Search, ShieldCheck, BadgeInfo, Save, UserX, UserPlus, RefreshCw, Filter } from 'lucide-react';

interface UserPermissionsProps {
  personnel: UserPersonnel[];
  onUpdatePersonnel: (updated: UserPersonnel) => void;
  onAddLog: (event: string, category: 'Security' | 'Access' | 'Data Change' | 'Evidence Flow' | 'System', details: string, payload?: string) => void;
}

const ALL_PERMISSIONS = [
  { value: 'VIEW_ALL', label: 'View All Records' },
  { value: 'EDIT_CASE', label: 'Modify Case Profiles' },
  { value: 'AUTHORIZE_EVIDENCE', label: 'Authorize Evidence Entry' },
  { value: 'MODIFY_AUDIT', label: 'Override Audit Trails' },
  { value: 'MANAGE_USERS', label: 'Manage Personnel Permissions' },
  { value: 'APPROVE_DISPOSAL', label: 'Approve Contraband Disposal' },
  { value: 'CREATE_INCIDENT', label: 'Author Incident Reports' },
  { value: 'VIEW_INTELLIGENCE', label: 'Access Classified Intelligence' }
];

export default function UserPermissions({ personnel, onUpdatePersonnel, onAddLog }: UserPermissionsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserPersonnel | null>(personnel[0] || null);
  const [filterDept, setFilterDept] = useState('All');

  // Edit fields for the sidebar panel
  const [editRole, setEditRole] = useState(selectedUser?.role || '');
  const [editDept, setEditDept] = useState(selectedUser?.department || '');
  const [editScore, setEditScore] = useState(selectedUser?.securityScore || 90);
  const [editPermissions, setEditPermissions] = useState<string[]>(selectedUser?.permissions || []);
  const [editStatus, setEditStatus] = useState<'Active' | 'On Leave' | 'Suspended'>(selectedUser?.status || 'Active');

  // Update edit form when selected user changes
  const handleSelectUser = (user: UserPersonnel) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setEditDept(user.department);
    setEditScore(user.securityScore);
    setEditPermissions(user.permissions);
    setEditStatus(user.status);
  };

  const togglePermission = (perm: string) => {
    if (editPermissions.includes(perm)) {
      setEditPermissions(prev => prev.filter(p => p !== perm));
    } else {
      setEditPermissions(prev => [...prev, perm]);
    }
  };

  const handleSaveUserChanges = () => {
    if (!selectedUser) return;
    
    const updatedUser: UserPersonnel = {
      ...selectedUser,
      role: editRole,
      department: editDept,
      securityScore: editScore,
      permissions: editPermissions,
      status: editStatus,
      lastActive: 'Just Now'
    };

    onUpdatePersonnel(updatedUser);
    
    // Add audit log for security modifications
    onAddLog(
      'Permissions Modified',
      'Security',
      `Modified security permissions, role, and clearance score for ${selectedUser.name} (Badge ${selectedUser.badgeNumber}).`,
      JSON.stringify({
        badge: selectedUser.badgeNumber,
        new_role: editRole,
        new_permissions: editPermissions,
        security_score: editScore,
        status: editStatus
      }, null, 2)
    );

    alert(`Security privileges updated for ${selectedUser.name} successfully.`);
  };

  const departments = ['All', ...new Set(personnel.map(p => p.department))];

  const filteredPersonnel = personnel.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.badgeNumber.includes(searchTerm) || 
                          p.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'All' || p.department === filterDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2 font-sans">
            <ShieldAlert className="h-6 w-6 text-amber-500" />
            Personnel Clearance & Security Management
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            MANDATORY COMPLIANCE PORTAL • GRANULAR ROLE CONFIGURATION • CRYPTO SIGNATURES ACTIVE
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Personnel Directory (7 cols) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 lg:col-span-7 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
              <h2 className="font-sans font-semibold text-slate-900 text-sm">Personnel Directory</h2>
              
              <div className="flex gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, badge..."
                    className="bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 w-full sm:w-44 font-sans"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filter */}
                <div className="relative">
                  <select
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500/50 font-sans"
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Personnel Grid List */}
            <div className="mt-4 space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {filteredPersonnel.map((p) => {
                const isSelected = selectedUser?.id === p.id;
                return (
                  <div
                    key={p.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-400 text-slate-900 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                    onClick={() => handleSelectUser(p)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        p.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        p.status === 'Suspended' ? 'bg-red-50 text-red-800 border border-red-200' :
                        'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`font-sans font-bold text-sm ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>{p.name}</h3>
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-650 px-1.5 py-0.5 rounded">
                            BADGE {p.badgeNumber}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 font-sans">
                          {p.role} • <span className="font-mono text-[11px] text-slate-400">{p.department}</span>
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.permissions.slice(0, 3).map(perm => (
                            <span key={perm} className="text-[9px] font-mono bg-slate-50 border border-slate-200 text-slate-500 px-1.5 py-0.2 rounded">
                              {perm}
                            </span>
                          ))}
                          {p.permissions.length > 3 && (
                            <span className="text-[9px] font-mono bg-slate-50 border border-slate-200 text-blue-600 px-1.5 py-0.2 rounded font-bold">
                              +{p.permissions.length - 3} MORE
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2 border-t sm:border-t-0 border-slate-150 pt-2 sm:pt-0">
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Clearance Integrity</span>
                        <span className={`text-sm font-bold font-mono ${
                          p.securityScore >= 95 ? 'text-emerald-700' :
                          p.securityScore >= 90 ? 'text-blue-650' : 'text-amber-700'
                        }`}>
                          {p.securityScore}%
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        p.status === 'Active' ? 'bg-emerald-50 text-emerald-850 border border-emerald-200' :
                        p.status === 'Suspended' ? 'bg-red-50 text-red-850 border border-red-200' :
                        'bg-amber-50 text-amber-850 border border-amber-200'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredPersonnel.length === 0 && (
                <p className="text-center text-xs text-slate-400 font-mono py-12">NO PERSONNEL MATCHING SEARCH KEY</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 text-[10px] font-mono text-slate-400 text-center">
            ALL OPERATIONS MONITORED SECURELY VIA MULTI-FACTOR HARDWARE KEYS
          </div>
        </div>

        {/* Permissions Configuration Sidebar (5 cols) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 lg:col-span-5 flex flex-col justify-between shadow-sm">
          {selectedUser ? (
            <div className="space-y-5">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] font-mono text-blue-600 uppercase tracking-wider block font-bold">Configuration Console</span>
                <h2 className="text-base font-bold text-slate-900 font-sans mt-0.5">{selectedUser.name}</h2>
                <p className="text-xs text-slate-500 font-mono">BADGE REGISTRY: #{selectedUser.badgeNumber}</p>
              </div>

              {/* Status & Clearance Score inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Service Status</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-950 focus:outline-none focus:border-blue-500/50"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                  >
                    <option value="Active">Active Duty</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Clearance Rating (%)</label>
                  <input
                    type="number"
                    max="100"
                    min="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-950 focus:outline-none focus:border-blue-500/50 font-mono"
                    value={editScore}
                    onChange={(e) => setEditScore(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Role & Dept input */}
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Functional Duty Title</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-950 focus:outline-none focus:border-blue-500/50"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Squad / Division Assignment</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-950 focus:outline-none focus:border-blue-500/50 font-mono"
                    value={editDept}
                    onChange={(e) => setEditDept(e.target.value)}
                  />
                </div>
              </div>

              {/* Privileges Checklist */}
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-2">Granular Cryptographic Privileges</label>
                <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-[190px] overflow-y-auto">
                  {ALL_PERMISSIONS.map((perm) => {
                    const isChecked = editPermissions.includes(perm.value);
                    return (
                      <div
                        key={perm.value}
                        className="flex items-center gap-2.5 py-1 hover:bg-slate-100 px-1.5 rounded cursor-pointer"
                        onClick={() => togglePermission(perm.value)}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // parent handled click
                          className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0 cursor-pointer h-3.5 w-3.5"
                        />
                        <span className="text-[11px] text-slate-700 font-sans leading-none">{perm.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveUserChanges}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 flex-1 transition-colors cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  Commit Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 font-mono text-xs text-slate-400">
              SELECT PERSONNEL FROM THE REGISTER TO VIEW SECURITY KEYS
            </div>
          )}

          <div className="mt-6 border-t border-slate-200 pt-4 flex items-start gap-2 text-[10px] font-mono text-slate-400">
            <BadgeInfo className="h-4 w-4 text-amber-500/70 shrink-0 mt-0.5" />
            <p className="leading-normal">
              Warning: Changing security clearance scores directly impacts the automated logic gates of Evidence Storage Room 12-A and lab safes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
