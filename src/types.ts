/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Case {
  id: string;
  title: string;
  caseNumber: string;
  description: string;
  status: 'Active' | 'Closed' | 'Cold' | 'Under Investigation';
  priority: 'High' | 'Medium' | 'Low';
  investigatingTeam: string;
  primarySuspectId: string;
  evidenceIds: string[];
  dateCreated: string;
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  officer: string;
}

export interface Suspect {
  id: string;
  name: string;
  age: number;
  gender: string;
  status: 'In Custody' | 'Under Surveillance' | 'Released on Bail' | 'Warrant Issued' | 'At Large';
  riskLevel: 'High' | 'Medium' | 'Low';
  mugshotUrl: string;
  aliasHistory: string[];
  physicalData: {
    height: string;
    weight: string;
    eyeColor: string;
    hairColor: string;
    scars: string;
    fingerprintsId: string;
  };
  criminalRecord: CriminalRecordItem[];
}

export interface CriminalRecordItem {
  id: string;
  date: string;
  offense: string;
  disposition: string;
  caseNumber: string;
}

export interface Evidence {
  id: string;
  title: string;
  trackingNumber: string;
  caseId: string;
  category: string;
  status: 'In Storage' | 'In Transit' | 'In Lab Analysis' | 'Pending Disposal' | 'Disposed';
  location: string;
  capacityCode: string;
  retentionDate: string;
  notes: string;
  checkedOutBy?: string;
  checkOutDate?: string;
  expectedReturnDate?: string;
  chainOfCustody: CustodyEvent[];
}

export interface CustodyEvent {
  id: string;
  date: string;
  action: string;
  officer: string;
  institution: string;
  signature?: string;
}

export interface Incident {
  id: string;
  incidentNumber: string;
  title: string;
  category: string;
  status: 'Reported' | 'Reviewing' | 'Dispatched' | 'Case Created';
  dateCreated: string;
  narrative: string;
  location: {
    address: string;
    coordinates: string;
    precinct: string;
  };
  reportingOfficer: {
    name: string;
    badge: string;
    signature: string;
  };
  involvedParties: {
    name: string;
    role: string; // 'Victim', 'Witness', 'Reporting Party'
    contact: string;
  }[];
  evidenceLog: {
    item: string;
    serialNumber: string;
    retrievedFrom: string;
  }[];
  complianceChecklist: {
    mirandaWarning: boolean;
    evidenceBagged: boolean;
    chainInitiated: boolean;
    supervisorNotified: boolean;
  };
}

export interface UserPersonnel {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  badgeNumber: string;
  securityScore: number;
  permissions: string[];
  lastActive: string;
  status: 'Active' | 'On Leave' | 'Suspended';
  passwordHash?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  event: string;
  category: 'Security' | 'Access' | 'Data Change' | 'Evidence Flow' | 'System';
  user: string;
  ipAddress: string;
  details: string;
  payload: string | undefined; // JSON metadata payload string
}
