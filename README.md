# Follow Up System

A modern, responsive operations management and field follow-up platform built with React, TypeScript, and Tailwind CSS. The dashboard consolidates team tasks, community/village field assignments, program scheduling, meeting management with Minutes of Meeting (MoM), and team celebrations into a unified, high-efficiency workspace.

---

## 🌟 Key Features

### 1. Task & Field Follow-up Management
- **Structured Task Creation**: Capture essential operational details:
  - **Name**: Beneficiary, citizen, or client contact name
  - **Village**: Village, ward, or locality
  - **Task**: Main objective or deliverable title
  - **Description**: Scope, context, and operational notes
  - **Assign Person**: Responsible team member or officer
  - **Deadline Date**: Target completion date with automatic overdue status detection
  - **Priority**: High, Medium, or Low priority badges
- **Status Lifecycle**: Track work across **Pending**, **In Progress**, **Done**, and **Overdue** states with one-click toggles.
- **Activity & Follow-up Notes**: Append time-stamped follow-up notes directly to any task.
- **Multi-Filter & Search**: Instant full-text search across titles, names, villages, and assignees, with dedicated dropdown filters for **Village**, **Assignee**, and **Status**.
- **Quick WhatsApp / Slack Copy**: One-click formatted summary copy for messaging channels.

### 2. Program & Event Scheduling
- **Event Coordination**: Schedule community workshops, outreach drives, training sessions, seminars, and reviews.
- **Rich Event Metadata**: Track date, time slots, physical venue or hall, lead coordinator, target audience, expected attendee counts, and budget.
- **Agenda Breakdown**: Add detailed schedule items with session times, topics, and speakers.
- **Dynamic Countdown Badges**: Clear indicators for events happening *Today!*, *Tomorrow*, or countdowns in days.

### 3. Meetings & Minutes of Meeting (MoM)
- **Meeting Management**: Coordinate online, in-person, or hybrid syncs with chairperson, attendees, and meeting URLs (Google Meet, Zoom, Teams).
- **Minutes of Meeting (MoM)**: Dedicated record section for logging key decisions, discussions, and agreements.
- **Interactive Action Items**: Assign deliverables to team members with checkboxes to track completion directly from meeting cards.
- **Meeting Summary Export**: Formatted agenda and action-item clipboard export.

### 4. Birthday & Milestone Tracking
- **Upcoming Celebrations**: Chronological list of upcoming team birthdays with age calculation and countdowns.
- **Standalone Submission Form**: Shareable link mode (`?mode=addbirthday`) allowing team members to submit their details directly.

### 5. Data Persistence & Backup Tools
- **Instant Local Persistence**: Automatic synchronization to browser `localStorage` ensuring zero data loss during sessions.
- **JSON Backup & Restore**: Export all tasks, birthdays, programs, and meetings to a single JSON backup file and restore anytime.
- **Sample Data Loader**: One-click template loader to preview the dashboard with realistic sample data.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Build Tool**: [Vite 6](https://vite.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/)

---

## 📁 Project Structure

```text
├── index.html                  # HTML entry point with metadata
├── metadata.json               # Applet configuration and capabilities
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite bundler configuration
└── src/
    ├── main.tsx                # Application mount point
    ├── App.tsx                 # Main application dashboard and state management
    ├── index.css               # Global styling and Tailwind imports
    ├── types.ts                # Shared TypeScript models and interfaces
    ├── components/             # Reusable UI components
    │   ├── BirthdayModal.tsx        # Birthday entry modal
    │   ├── BirthdaySection.tsx      # Birthday cards & upcoming celebrations
    │   ├── FilterBar.tsx            # Search, status chips, village/assignee filters
    │   ├── Header.tsx               # Navigation header and active tab controls
    │   ├── MeetingModal.tsx         # Meeting creation/editing dialog
    │   ├── MeetingSection.tsx       # Meeting cards, MoM, and action items
    │   ├── ProgramModal.tsx         # Program schedule creation/editing dialog
    │   ├── ProgramSection.tsx       # Program cards and session agenda
    │   ├── SaveToast.tsx            # Transient notification toast
    │   ├── ShareLinkModal.tsx       # Shareable links and backup import/export
    │   ├── StandaloneBirthdayAdd.tsx# Standalone birthday submission view
    │   ├── StatCards.tsx            # Quick overview status metrics
    │   ├── TaskCard.tsx             # Interactive task card with notes & actions
    │   └── TaskModal.tsx            # Task creation & editing form
    ├── data/
    │   └── defaultData.ts      # Default schemas and sample template dataset
    └── utils/
        └── helpers.ts          # Date utilities, overdue checks, and ID generators
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or 20.x recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

1. Clone or download the repository:
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Run the development server on `http://localhost:3000`:
```bash
npm run dev
```

### Production Build

Create an optimized production build in the `dist` directory:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

### Code Quality

Run the TypeScript compiler to verify types and syntax:
```bash
npm run lint
```

---

## 🔒 Configuration

- Environment variable templates are documented in `.env.example`.
- Server-side configurations bind to host `0.0.0.0` and port `3000` by default.

---

## 📄 License

This project is licensed under the MIT License.
