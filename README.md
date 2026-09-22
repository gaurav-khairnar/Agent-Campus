# AgentCampus

<div align="center">

**Autonomous Multi-Tenant Academic Operations & Human-in-the-Loop AI Platform**

[![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.117+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%20%2B%20pgvector-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Overview](#-overview) • [Features](#-key-features) • [Architecture](#-system-architecture) • [Database Models](#-database-models) • [API Guide](#-api-endpoints) • [Quick Start](#-quick-start)

</div>

---

## 🎓 Overview

**AgentCampus** is an enterprise-grade, multi-tenant academic management platform that combines autonomous AI workflows with strict **Human-in-the-Loop approval queues**. 

Built for modern educational institutions, AgentCampus enables seamless management of multi-department course rosters, student attendance, class timetables, and automated grading—ensuring all AI-generated actions (grade adjustments, attendance warnings, official notices) require human verification before being committed to official records.

Repository: **[https://github.com/gaurav-khairnar/Agent-Campus.git](https://github.com/gaurav-khairnar/Agent-Campus.git)**

---

## ✨ Key Features

### 1. 🏢 Multi-Tenant Institutional Architecture
- Database-enforced multi-tenancy (`institution_id`) across all entities.
- Support for multiple campuses, departments, courses, faculty, and student rosters within a single deployment.
- Role-Based Access Control (RBAC) supporting **Admin**, **Coordinator**, **Faculty**, and **Student** permissions.

### 2. 🛡️ Human-in-the-Loop AI Approval Engine
- **Autonomous Task Generation**: AI agents evaluate student performance, attendance patterns, and draft official announcements.
- **Verification Queue**: Tasks are held in an `ai_workflow_tasks` pending state until an authorized faculty member or coordinator explicitly reviews, approves, or rejects them.
- **Audit Logging**: Complete traceability of who approved each AI recommendation with timestamping and optional review feedback.

### 3. 📤 Bulk Academic Data Importer Pipeline
- Asynchronous background worker pipeline processing structured JSON/CSV data.
- Instantly seeds institutions, departments, course catalogs, timetables, and student rosters in batch mode.
- REST API endpoint (`POST /api/v1/import/academic-json`) integrated with background queue processors.

### 4. 🧠 Vector RAG & Personal AI Study Companion
- Integrated document retrieval powered by **pgvector** and **Azure OpenAI embeddings**.
- Proactive AI tutor capable of generating adaptive quizzes, active-recall flashcards, interactive mind maps, and customized study plans based on weak-spot detection (< 70% mastery).

---

## 🏗️ System Architecture

AgentCampus is structured as a high-performance modular monolith with background queue workers:

```
AgentCampus/
├── src/
│   ├── edu-api/            # FastAPI Public REST API Services
│   ├── edu-worker/         # Async Background Queue Worker (Bulk Import, AI Jobs)
│   ├── edu-web/            # Modern React 19 Frontend (Vite + TanStack Router + Tailwind)
│   └── shared/
│       ├── ai/             # RAG & Agent Orchestration Logic
│       ├── core/           # Domain Services (AcademicService, AIWorkflowService)
│       ├── db/             # SQLAlchemy Models & Alembic Database Migrations
│       └── queue/          # Storage Queue Client & Data Models
├── alembic.ini             # Database migration configuration
├── docker-compose.yaml     # Container stack (API, Worker, Postgres 16, Azurite)
└── pyproject.toml          # UV workspace definition
```

---

## 🗄️ Database Models

The PostgreSQL 16 database enforces foreign key constraints and multi-tenant scoping:

| Entity | Description | Core Attributes |
| :--- | :--- | :--- |
| **`Institution`** | Top-level tenant container | `id`, `name`, `code`, `domain`, `created_at` |
| **`Department`** | Department within an institution | `id`, `institution_id`, `name`, `code` |
| **`Course`** | Academic course unit | `id`, `institution_id`, `department_id`, `code`, `name`, `credits` |
| **`Enrollment`** | Student course registration | `id`, `institution_id`, `user_id`, `course_id`, `role`, `status` |
| **`Timetable`** | Class schedules & room allocations | `id`, `course_id`, `day_of_week`, `start_time`, `end_time`, `room` |
| **`Attendance`** | Daily attendance records | `id`, `institution_id`, `user_id`, `course_id`, `date`, `status` |
| **`Assignment`** | Course assessments | `id`, `course_id`, `title`, `max_marks`, `due_date` |
| **`Submission`** | Student assignment submissions | `id`, `assignment_id`, `user_id`, `grade`, `feedback` |
| **`Notice`** | Campus announcements | `id`, `institution_id`, `title`, `content`, `target_role` |
| **`AIWorkflowTask`**| **Human Approval Queue** | `id`, `institution_id`, `workflow_type`, `payload`, `status`, `approved_by` |

---

## 📡 API Endpoints

### Academic Operations (`/api/v1/academic`)
- `GET /api/v1/academic/overview` — Retrieve institution summary metrics and active courses.
- `GET /api/v1/academic/departments` — List departments for the current institution.
- `GET /api/v1/academic/courses` — List course catalog with faculty & room allocations.
- `GET /api/v1/academic/notices` — List campus announcements.

### AI Approval Queue (`/api/v1/ai-approval`)
- `GET /api/v1/ai-approval/queue` — Fetch pending AI workflow approval tasks.
- `POST /api/v1/ai-approval/tasks` — Create a new pending AI recommendation task.
- `POST /api/v1/ai-approval/tasks/{id}/approve` — Approve and execute recommendation.
- `POST /api/v1/ai-approval/tasks/{id}/reject` — Reject recommendation.

### Data Import Pipeline (`/api/v1/import`)
- `POST /api/v1/import/academic-json` — Submit JSON payload for asynchronous background ingestion.

---

## 💻 Frontend Applications

The web application is built with **React 19**, **TypeScript**, **Vite**, **TanStack Router**, and **TailwindCSS**:

1. **Dashboard Home (`/dashboard`)**: Gradient multi-tenant header banner, active institution status (`MIT CS Dept`), human approval queue counters, and quick navigation cards.
2. **Academic Console (`/dashboard/academic`)**: Multi-tab interface featuring:
   - **Overview Tab**: Active course metrics, attendance statistics, and notice board.
   - **Courses & Timetables Tab**: Searchable list of courses, schedules, room assignments, and instructors.
   - **Roster & Attendance Tab**: Student roster with attendance %, grade recommendations, and warning badges.
   - **Bulk Data Importer Tab**: Interactive JSON payload editor to trigger backend worker bulk import jobs.
3. **AI Approval Queue (`/dashboard/ai-approval`)**: Real-time queue displaying pending AI tasks, filter chips, and one-click Approve/Reject action triggers.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Docker & Docker Compose**
- **Node.js 18+** & **pnpm**
- **Python 3.12+** & **uv**

### 2. Start the Backend Stack via Docker
```bash
# Clone the repository
git clone https://github.com/gaurav-khairnar/Agent-Campus.git
cd Agent-Campus

# Start API, Worker, Postgres 16 (pgvector), and Azurite containers
docker-compose up --build api worker db azurite
```

### 3. Run Database Migrations
In a separate terminal, apply all Alembic schema migrations:
```bash
export DATABASE_URL="postgresql+psycopg2://postgres:postgres@localhost:5432/postgres"
alembic upgrade head
```

### 4. Start the Frontend Web Application
```bash
cd src/edu-web
pnpm install
pnpm dev
```

Visit the applications in your browser:
- 🌐 **Web Frontend**: `http://localhost:3000`
- ⚙️ **FastAPI OpenAPI Reference**: `http://localhost:8000`
- 🩺 **API Health Check**: `http://localhost:8000/health`

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

Made with ❤️ for students, educators, and academic institutions worldwide.

[⬆ Back to Top](#agentcampus)

</div>
