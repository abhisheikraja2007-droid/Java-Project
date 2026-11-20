/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Case, Suspect, Evidence, Incident, UserPersonnel, AuditLog } from './types';

export const initialSuspects: Suspect[] = [
  {
    id: 'SP-4091',
    name: "Damon 'Shadow' Vance",
    age: 34,
    gender: 'Male',
    status: 'Under Surveillance',
    riskLevel: 'High',
    mugshotUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
    aliasHistory: ['Shadow', 'D-Vance', 'Damon Cole'],
    physicalData: {
      height: "6'1\"",
      weight: '185 lbs',
      eyeColor: 'Hazel',
      hairColor: 'Dark Brown',
      scars: '3-inch linear scar on left forearm',
      fingerprintsId: 'FP-8801-D'
    },
    criminalRecord: [
      {
        id: 'CR-01',
        date: '2021-04-12',
        offense: 'Grand Larceny',
        disposition: 'Convicted - 2 Years Probation',
        caseNumber: 'CASE-2021-9921'
      },
      {
        id: 'CR-02',
        date: '2023-09-05',
        offense: 'Possession with Intent to Distribute',
        disposition: 'Dismissed - Insufficient Evidence',
        caseNumber: 'CASE-2023-4401'
      },
      {
        id: 'CR-03',
        date: '2025-11-18',
        offense: 'Conspiracy / Organized Theft Group',
        disposition: 'Pending Trial - Released on Bail',
        caseNumber: 'CASE-2025-1029'
      }
    ]
  },
  {
    id: 'SP-1102',
    name: 'Marcus Sterling',
    age: 42,
    gender: 'Male',
    status: 'In Custody',
    riskLevel: 'Medium',
    mugshotUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80',
    aliasHistory: ['Marky', 'Sterling Boy'],
    physicalData: {
      height: "5'10\"",
      weight: '160 lbs',
      eyeColor: 'Blue',
      hairColor: 'Grey',
      scars: 'None',
      fingerprintsId: 'FP-1102-S'
    },
    criminalRecord: [
      {
        id: 'CR-04',
        date: '2019-02-14',
        offense: 'Receiving Stolen Property',
        disposition: '1 Year Probation',
        caseNumber: 'CASE-2019-3012'
      }
    ]
  },
  {
    id: 'SP-9012',
    name: 'Victor Vance',
    age: 29,
    gender: 'Male',
    status: 'Warrant Issued',
    riskLevel: 'High',
    mugshotUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&q=80',
    aliasHistory: ['Vicky', 'Vic'],
    physicalData: {
      height: "6'3\"",
      weight: '210 lbs',
      eyeColor: 'Brown',
      hairColor: 'Black',
      scars: 'Tattoo of a spider on right neck',
      fingerprintsId: 'FP-9012-V'
    },
    criminalRecord: [
      {
        id: 'CR-05',
        date: '2024-06-21',
        offense: 'Armed Robbery',
        disposition: 'Warrant Active',
        caseNumber: 'CASE-2024-8902'
      }
    ]
  }
];

export const initialCases: Case[] = [
  {
    id: 'CMS-2026-8801',
    title: 'Narcotics Distribution Network',
    caseNumber: 'CMS-2026-8801',
    description: 'Investigation into a major narcotics distribution network Operating in Precinct 12 and neighboring sectors. High volume trafficking of high-purity contraband and associated money laundering activity.',
    status: 'Under Investigation',
    priority: 'High',
    investigatingTeam: 'Special Investigations Unit (SIU)',
    primarySuspectId: 'SP-4091',
    evidenceIds: ['EV-2026-4402', 'EV-2026-4403', 'EV-2026-4404'],
    dateCreated: '2026-03-10',
    timeline: [
      {
        id: 'TL-01',
        date: '2026-03-10',
        title: 'Case Initiated',
        description: 'Anonymous tip received outlining trafficking hubs. SIU took lead authority.',
        officer: 'Inspector Elena Rostova'
      },
      {
        id: 'TL-02',
        date: '2026-03-18',
        title: 'Surveillance Authorized',
        description: 'Physical surveillance authorized on prime locations linked to Damon Vance.',
        officer: 'Deputy Chief Arthur Vance'
      },
      {
        id: 'TL-03',
        date: '2026-04-02',
        title: 'Evidence Seizure',
        description: 'Vance intercepted in a vehicle search; 125g of Methamphetamine and a black cipher phone recovered.',
        officer: 'Officer James Miller'
      }
    ]
  },
  {
    id: 'CMS-2026-9023',
    title: 'Armed Commercial Robbery at 12th St Jewelry',
    caseNumber: 'CMS-2026-9023',
    description: 'Armed robbery of Gold Standard Jewelers. Two masked suspects entered, held staff at gunpoint, shattered cases, and fled on foot with over $150k in inventory. Glock 17 recovered nearby.',
    status: 'Active',
    priority: 'High',
    investigatingTeam: 'Precinct 12 Robbery Det.',
    primarySuspectId: 'SP-9012',
    evidenceIds: ['EV-2026-5501', 'EV-2026-5502'],
    dateCreated: '2026-05-14',
    timeline: [
      {
        id: 'TL-04',
        date: '2026-05-14',
        title: 'Armed Robbery Incident',
        description: 'Armed suspect robbed Gold Standard Jewelers; Glock 17 abandoned.',
        officer: 'Sergeant Marcus Brody'
      }
    ]
  }
];

export const initialEvidence: Evidence[] = [
  {
    id: 'EV-2026-4402',
    title: '125g High-Purity Methamphetamine',
    trackingNumber: 'EV-2026-4402',
    caseId: 'CMS-2026-8801',
    category: 'Narcotics',
    status: 'In Lab Analysis',
    location: 'Forensics lab - Section C',
    capacityCode: 'SEC-C-L4',
    retentionDate: '2031-04-02',
    notes: 'Contained in sealed heat-vacuum bag. Awaiting lab purity analysis results.',
    chainOfCustody: [
      {
        id: 'CC-01',
        date: '2026-04-02 14:15',
        action: 'Seized during arrest / vehicle search',
        officer: 'Officer James Miller',
        institution: 'Precinct 12 Patrol Unit'
      },
      {
        id: 'CC-02',
        date: '2026-04-02 16:30',
        action: 'Logged into CMS Locker Room',
        officer: 'Inspector Elena Rostova',
        institution: 'Precinct 12 Evidence Locker'
      },
      {
        id: 'CC-03',
        date: '2026-04-05 09:00',
        action: 'Transferred for chemical analysis',
        officer: 'Officer James Miller',
        institution: 'Forensics Chemical Lab'
      }
    ]
  },
  {
    id: 'EV-2026-4403',
    title: 'Black Cipher Burner Phone',
    trackingNumber: 'EV-2026-4403',
    caseId: 'CMS-2026-8801',
    category: 'Electronics',
    status: 'In Storage',
    location: 'Vault B, Shelf 4',
    capacityCode: 'VLT-B-S4',
    retentionDate: '2036-04-02',
    notes: 'Encrypted burner phone. Recovered from front-passenger seat. Keypad examined for prints.',
    chainOfCustody: [
      {
        id: 'CC-04',
        date: '2026-04-02 14:15',
        action: 'Seized during arrest / vehicle search',
        officer: 'Officer James Miller',
        institution: 'Precinct 12 Patrol Unit'
      },
      {
        id: 'CC-05',
        date: '2026-04-02 17:00',
        action: 'Logged into Vault B Storage',
        officer: 'Officer James Miller',
        institution: 'Precinct 12 Main Vault'
      }
    ]
  },
  {
    id: 'EV-2026-4404',
    title: 'Ledger & Keycard',
    trackingNumber: 'EV-2026-4404',
    caseId: 'CMS-2026-8801',
    category: 'Documents / Items',
    status: 'In Storage',
    location: 'Vault B, Shelf 4',
    capacityCode: 'VLT-B-S4',
    retentionDate: '2036-04-02',
    notes: 'Pocket-sized address ledger and electronic keycard for industrial self-storage.',
    chainOfCustody: [
      {
        id: 'CC-06',
        date: '2026-04-02 14:15',
        action: 'Seized during arrest / vehicle search',
        officer: 'Officer James Miller',
        institution: 'Precinct 12 Patrol Unit'
      }
    ]
  },
  {
    id: 'EV-2026-5501',
    title: 'Glock 17 Handgun (GLK-9901)',
    trackingNumber: 'EV-2026-5501',
    caseId: 'CMS-2026-9023',
    category: 'Weapons',
    status: 'In Storage',
    location: 'Armory Storage, Cabinet 2',
    capacityCode: 'ARM-CAB2',
    retentionDate: '2046-05-14',
    notes: '9mm semi-automatic. Serial GLK-9901. Chamber cleared. Seized from jewelry store alleyway.',
    chainOfCustody: [
      {
        id: 'CC-07',
        date: '2026-05-14 14:40',
        action: 'Recovered at crime scene',
        officer: 'Sergeant Marcus Brody',
        institution: 'Precinct 12 Patrol Unit'
      },
      {
        id: 'CC-08',
        date: '2026-05-14 18:00',
        action: 'Secured in Armory Storage',
        officer: 'Officer James Miller',
        institution: 'Precinct 12 Main Vault'
      }
    ]
  },
  {
    id: 'EV-2023-1102',
    title: 'Seized Counterfeit Currency ($24,000)',
    trackingNumber: 'EV-2023-1102',
    caseId: 'CMS-2026-8801',
    category: 'Financial Assets',
    status: 'Pending Disposal',
    location: 'Vault A, Safety Box 12',
    capacityCode: 'VLT-A-SB12',
    retentionDate: '2026-01-10',
    notes: 'Expired retention period. Authorized for incineration disposal by Command Staff.',
    chainOfCustody: [
      {
        id: 'CC-09',
        date: '2023-01-10 11:30',
        action: 'Seized in counterfeit raid',
        officer: 'Inspector Elena Rostova',
        institution: 'Financial Crimes Unit'
      }
    ]
  },
  {
    id: 'EV-2022-9012',
    title: 'Expired Drug Paraphernalia',
    trackingNumber: 'EV-2022-9012',
    caseId: 'CMS-2026-8801',
    category: 'Narcotics',
    status: 'Pending Disposal',
    location: 'Hazardous Waste Bin 3',
    capacityCode: 'HAZ-BIN3',
    retentionDate: '2025-06-15',
    notes: 'Retention period expired. Undergoing biohazard destruction protocol.',
    chainOfCustody: [
      {
        id: 'CC-10',
        date: '2022-06-15 08:30',
        action: 'Confiscated on street patrol',
        officer: 'Officer James Miller',
        institution: 'Precinct 12 Patrol'
      }
    ]
  }
];

export const initialIncidents: Incident[] = [
  {
    id: 'INC-2026-9023',
    incidentNumber: 'INC-2026-9023',
    title: 'Armed Commercial Robbery',
    category: 'Violent Crime / Armed Robbery',
    status: 'Case Created',
    dateCreated: '2026-05-14',
    narrative: 'At approximately 14:32 hours, Precinct 12 dispatch received a silent panic alarm from "Gold Standard Jewelers". First responding officers arrived at 14:36 hours and secured the perimeter. Store manager reported two masked suspects entered, drew firearms, forced employees onto the floor, and shattered three front glass display cases. Suspects fled on foot north-east into the alley. One black Glock 17 handgun with partially defaced serial number (GLK-9901) was recovered in the immediate flight path.',
    location: {
      address: '1244 Grand Avenue, Precinct 12 Sector B',
      coordinates: '40.7128° N, 74.0060° W',
      precinct: 'Precinct 12'
    },
    reportingOfficer: {
      name: 'Sergeant Marcus Brody',
      badge: '4512',
      signature: 'Sgt. M. Brody'
    },
    involvedParties: [
      {
        name: 'Marcus Sterling',
        role: 'Reporting Party',
        contact: '+1 (555) 124-9022'
      },
      {
        name: 'Sarah Jenkins',
        role: 'Witness',
        contact: '+1 (555) 781-0199'
      }
    ],
    evidenceLog: [
      {
        item: 'Glock 17 Handgun (GLK-9901)',
        serialNumber: 'GLK-9901',
        retrievedFrom: 'Jewelry store exit alley'
      },
      {
        item: 'Shattered Glass Fragments',
        serialNumber: 'SG-9023-A',
        retrievedFrom: 'Display Counter #3 Floor'
      }
    ],
    complianceChecklist: {
      mirandaWarning: true,
      evidenceBagged: true,
      chainInitiated: true,
      supervisorNotified: true
    }
  }
];

export const initialPersonnel: UserPersonnel[] = [
  {
    id: 'US-01',
    name: 'Inspector Elena Rostova',
    email: 'e.rostova@precinct12.gov',
    department: 'Special Investigations Unit (SIU)',
    role: 'Lead Investigator',
    badgeNumber: '1204',
    securityScore: 98,
    status: 'Active',
    lastActive: 'Just Now',
    permissions: ['VIEW_ALL', 'EDIT_CASE', 'AUTHORIZE_EVIDENCE', 'MODIFY_AUDIT', 'MANAGE_USERS']
  },
  {
    id: 'US-02',
    name: 'Officer James Miller',
    email: 'j.miller@precinct12.gov',
    department: 'Evidence Management Section',
    role: 'Evidence Custodian',
    badgeNumber: '8820',
    securityScore: 92,
    status: 'Active',
    lastActive: '5m ago',
    permissions: ['VIEW_ALL', 'EDIT_EVIDENCE', 'AUTHORIZE_DISPOSAL']
  },
  {
    id: 'US-03',
    name: 'Deputy Chief Arthur Vance',
    email: 'a.vance@precinct12.gov',
    department: 'Command Staff',
    role: 'Command Staff',
    badgeNumber: '0102',
    securityScore: 99,
    status: 'Active',
    lastActive: '2h ago',
    permissions: ['VIEW_ALL', 'APPROVE_DISPOSAL', 'MANAGE_USERS', 'VIEW_REPORTS']
  },
  {
    id: 'US-04',
    name: 'Sergeant Marcus Brody',
    email: 'm.brody@precinct12.gov',
    department: 'Patrol Operations',
    role: 'Patrol Supervisor',
    badgeNumber: '4512',
    securityScore: 87,
    status: 'Active',
    lastActive: '1d ago',
    permissions: ['VIEW_ALL', 'CREATE_INCIDENT', 'EDIT_INCIDENT']
  },
  {
    id: 'US-05',
    name: 'Analyst Sarah Connor',
    email: 's.connor@precinct12.gov',
    department: 'Intelligence & Analysis Division',
    role: 'Intelligence Analyst',
    badgeNumber: '2044',
    securityScore: 94,
    status: 'Active',
    lastActive: '3h ago',
    permissions: ['VIEW_ALL', 'VIEW_INTELLIGENCE']
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'LOG-3091',
    timestamp: '2026-07-16 13:24:11',
    event: 'Evidence Relocated',
    category: 'Evidence Flow',
    user: 'Officer James Miller (Badge 8820)',
    ipAddress: '10.122.45.201',
    details: 'Moved Item EV-2026-4402 (Methamphetamine) from Vault B to Chem Lab for forensic analysis.',
    payload: JSON.stringify({ item_id: "EV-2026-4402", destination: "Forensics Lab", section: "Chemical", transit_protocol: "HAZMAT-10" }, null, 2)
  },
  {
    id: 'LOG-3092',
    timestamp: '2026-07-16 11:15:02',
    event: 'Disposal Authorization Signed',
    category: 'Security',
    user: 'Deputy Chief Arthur Vance (Badge 0102)',
    ipAddress: '10.122.45.10',
    details: 'Approved destruction protocol for EV-2023-1102 (Counterfeit Currency). Secure signature saved.',
    payload: JSON.stringify({ authorized_by: "Deputy Chief Arthur Vance", badge: "0102", disposition_code: "BURN-CONTRABAND" }, null, 2)
  },
  {
    id: 'LOG-3093',
    timestamp: '2026-07-16 09:42:00',
    event: 'Permissions Overridden',
    category: 'Access',
    user: 'Inspector Elena Rostova (Badge 1204)',
    ipAddress: '10.122.45.104',
    details: 'Role updated for Personnel US-05 (Sarah Connor) to Intelligence Analyst.',
    payload: JSON.stringify({ target_user: "Sarah Connor", modified_fields: { role: "Intelligence Analyst", permission_set: "INTEL_LEVEL_2" } }, null, 2)
  },
  {
    id: 'LOG-3094',
    timestamp: '2026-07-16 08:30:15',
    event: 'Incident Transferred to Case',
    category: 'Data Change',
    user: 'Inspector Elena Rostova (Badge 1204)',
    ipAddress: '10.122.45.104',
    details: 'Incident INC-2026-9023 promoted to active Case CMS-2026-9023. Linkages generated.',
    payload: JSON.stringify({ incident_id: "INC-2026-9023", case_id: "CMS-2026-9023", status: "Active" }, null, 2)
  },
  {
    id: 'LOG-3095',
    timestamp: '2026-07-15 17:11:00',
    event: 'Secure Query Initiated',
    category: 'System',
    user: 'Analyst Sarah Connor (Badge 2044)',
    ipAddress: '10.122.45.112',
    details: 'Searched for aliases linked to suspect Damon Vance. 3 matches fetched.',
    payload: JSON.stringify({ query_term: "Damon Vance", search_fields: ["aliases", "associates"], records_returned: 3 }, null, 2)
  }
];
