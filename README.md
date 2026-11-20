# Precinct 12 CMS — Criminal Management System

[![Java](https://img.shields.io/badge/Java-17%2B-orange.svg?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-blue.svg?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/UI-Tailwind%20CSS-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A modern, full-stack Criminal Management System (CMS) designed for law enforcement precincts to manage incident reports, investigate suspect profiles, maintain evidence chain-of-custody, and enforce audit-compliant role-based access.

---

## 🚔 Key System Modules

1. **Incident Intake & Case Management**
   - Streamlined first-response reporting with incident classifications, severity levels, and geographical tagging.
   - Dynamic assignment of cases to investigating officers with status workflow tracking.

2. **Suspect & Person-of-Interest Profiling**
   - Detailed bio-metric records, alias tracking, prior offenses history, and physical descriptors.
   - Cross-referencing engine identifying patterns across active cases and past arrest records.

3. **Evidence Inventory & Chain of Custody**
   - Barcode/ID tracked evidence repository cataloging physical, forensic, and digital items.
   - Cryptographic timestamping and personnel transfer verification to ensure court admissibility.

4. **Security & Audit Logging**
   - Role-Based Access Control (Officer, Detective, Evidence Clerk, Precinct Commander).
   - Tamper-evident activity stream tracking every read, update, and case note addition.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend API** | Java 17+, Spring Boot, Spring Security, Spring Data JPA |
| **Frontend Web** | React 18, TypeScript, Tailwind CSS, Vite |
| **State & Data** | RESTful JSON APIs, Vite HMR |
| **Build Tools** | Maven (`pom.xml`), npm / Vite |

---

## 📂 Directory Layout

```
Java Project/
├── cms-backend/           # Spring Boot REST API microservice
│   ├── pom.xml            # Maven configuration
│   └── src/               # Controllers, service layers, and entities
├── src/                   # React + TypeScript frontend
│   ├── components/        # Sidebar, Header, Modals, and Dashboard Views
│   └── types.ts           # Domain models and strict TypeScript definitions
├── package.json           # Frontend dependencies
├── vite.config.ts         # Vite build settings
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

### 1. Launching Backend Service
```bash
cd cms-backend
./mvnw clean spring-boot:run
```

### 2. Launching Frontend Client
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📝 License
This project is licensed under the MIT License.
