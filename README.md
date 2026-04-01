# 🛡️ ResolveIT | Grievance Portal

![Project Banner](https://img.shields.io/badge/Status-COMPLETED-green?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-React%20|%20Java%20|%20MySQL-blue?style=for-the-badge)
![User](https://img.shields.io/badge/Author-Saiteja%20Aerupula-orange?style=for-the-badge)

A powerful, full-stack **Grievance Management System** designed for educational institutions and corporate offices. This platform streamlines user complaints, automates admin assignments, and provides an audited escalation workflow for senior authorities.

---

## 🎯 Key Capabilities & Milestones

| Milestone | Status | Description |
| :--- | :---: | :--- |
| **M1: Full-Stack Core** | ✅ | React frontend integrated with Spring Boot REST API and MySQL. |
| **M2: UI/UX Excellence** | ✅ | Professional, desktop-friendly blue theme with smooth transitions. |
| **M3: Profile & Tracking** | ✅ | Dynamic user dashboards showing status updates in real-time. |
| **M4: Escalation Engine** | ✅ | Formal forwarding workflow to Warden/Dean/Principal with notifications. |
| **M5: Analytics & Export** | ✅ | Visual bar charts for trends and functional CSV report generation. |

---

## 🧠 Architectural Overview

```mermaid
graph TD
    A[User Portal] -->|HTTP POST| B[Spring Boot API]
    C[Admin Panel] -->|HTTP GET| B
    B -->|JPA/Hibernate| D[(MySQL Database)]
    E[Senior Admin] -->|Escalation| B
```

---

## 🚀 Stunning Features

### 👤 For Users
- **Secure Authentication:** Persistent login sessions (even after refresh!).
- **Rich Submissions:** Categorized grievances (Public/Anonymous) with media attachments.
- **My Complaints:** Track your issue status from "NEW" to "RESOLVED" on a live timeline.

### 🛡️ For Admins
- **Management Panel:** Centralized dashboard to view all institutional grievances.
- **Staff Assignment:** Delegate issues to Technical, Maintenance, or Admin teams.
- **Escalation Logic:** Forward unresolved issues to Higher Authorities with one click.
- **Data Export:** Download audited reports in **CSV format** for institutional records.

---

## 🛠️ Project Structure

```text
📁 ResolveIT_FullStack/
  ├── 📂 backend/       # Spring Boot Application (Java)
  │   ├── 👤 Auth         # Registration & Security
  │   ├── 📝 Complaints   # Core Grievance Logic
  │   └── ⚙️ Config       # Database & CORS (Cross-Origin)
  ├── 📂 frontend/      # React.js Application (Vite/Node)
  │   ├── 🎨 Components   # Reusable UI Elements
  │   ├── 📁 Assets       # Hero Images & Branding
  │   └── 🌐 API          # Database Connection logic
  └── 📄 README.md      # Documentation
```

---

## ⚙️ How to Launch Locally

### 1️⃣ Database Setup
- Create a MySQL database named `complaint_db`.
- Run your SQL script or use Hibernate (auto-create).

### 2️⃣ Backend (IntelliJ)
- Open the `backend/` folder in **IntelliJ IDEA**.
- Update `application.properties` with your MySQL password.
- Run `ComplaintPortalApplication.java`.

### 3️⃣ Frontend (VS Code)
- Open the `frontend/` folder in **VS Code**.
- Run `npm install` and then `npm run dev`.
- Visit `http://localhost:5173`.

---

## 👨‍💻 Developed By
**Saiteja Aerupula**  
*Full Stack Developer | Grievance Management Specialist*

---
© 2026 ResolveIT Team. All Rights Reserved.
