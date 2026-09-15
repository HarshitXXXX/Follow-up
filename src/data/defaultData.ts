import { Task, Birthday, Program, Meeting } from '../types';
import { todayStr } from '../utils/helpers';

// Helper to get dynamic offset dates for default sample data
function getRelativeDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const defaultTasks: Task[] = [];
export const defaultBirthdays: Birthday[] = [];
export const defaultPrograms: Program[] = [];
export const defaultMeetings: Meeting[] = [];

export const sampleTasks: Task[] = [
  {
    id: 't_sample_1',
    name: 'Rajesh Patil',
    village: 'Shivajinagar',
    title: 'Water Pipeline & Borewell Connection Inspection',
    desc: 'Verify the municipal water pipeline connection and pump pressure test report for the eastern sector.',
    remark: 'Briefed local council member; inspection report submission scheduled for 4 PM.',
    assignee: 'Alex Morgan',
    project: 'Infrastructure',
    due: todayStr(),
    priority: 'high',
    status: 'progress',
    notes: [
      { id: 'n1', text: 'Site visited by field engineer. Pressure test normal.', date: getRelativeDate(-1) },
      { id: 'n2', text: 'Documented water flow meter readings.', date: todayStr() }
    ],
    createdAt: getRelativeDate(-2)
  },
  {
    id: 't_sample_2',
    name: 'Sunita Deshmukh',
    village: 'Rampur',
    title: 'Solar Street Lights Installation Review',
    desc: 'Inspect 12 newly installed solar LED light poles along the main village road and school junction.',
    remark: 'Contractor verified battery backup capacity; awaiting Gram Panchayat sign-off.',
    assignee: 'Sarah Jenkins',
    project: 'Rural Dev',
    due: getRelativeDate(-1), // overdue
    priority: 'high',
    status: 'pending',
    notes: [
      { id: 'n3', text: 'Tested light sensors at dusk. All 12 operative.', date: getRelativeDate(-2) }
    ],
    createdAt: getRelativeDate(-3)
  },
  {
    id: 't_sample_3',
    name: 'Mahesh Gaikwad',
    village: 'Khed',
    title: 'Health Camp & Vaccination Drive Logistics',
    desc: 'Coordinate medical team roster, vaccine cold storage boxes, and citizen token distribution center.',
    remark: 'Community hall booked for Saturday morning.',
    assignee: 'David Chen',
    project: 'Public Health',
    due: getRelativeDate(3),
    priority: 'medium',
    status: 'progress',
    notes: [],
    createdAt: getRelativeDate(-1)
  }
];

const now = new Date();
const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
const currentDay = String(now.getDate()).padStart(2, '0');

export const sampleBirthdays: Birthday[] = [
  {
    id: 'b_sample_1',
    name: 'Sarah Jenkins',
    date: `1996-${currentMonth}-${currentDay}`,
    dept: 'Operations',
    position: 'Operations Manager',
    village: 'New York'
  },
  {
    id: 'b_sample_2',
    name: 'David Chen',
    date: `1994-${currentMonth}-${String(Math.min(28, Number(currentDay) + 2)).padStart(2, '0')}`,
    dept: 'Engineering',
    position: 'Lead Mobile Engineer',
    village: 'San Francisco'
  }
];

export const samplePrograms: Program[] = [
  {
    id: 'p_sample_1',
    title: 'Annual Leadership & Strategy Summit 2026',
    category: 'Conference',
    date: getRelativeDate(5),
    startTime: '09:30 AM',
    endTime: '04:30 PM',
    venue: 'Grand Central Auditorium, Hall B',
    coordinator: 'Alex Morgan',
    targetAudience: 'Department Heads, Project Leads & Senior Staff',
    expectedAttendees: 65,
    status: 'upcoming',
    description: 'A comprehensive one-day strategic alignment summit focused on quarterly milestones, product roadmap, and operational excellence.',
    budget: '$3,500',
    agendaItems: [
      { id: 'a1', time: '09:30 AM', topic: 'Welcome Address & Year in Review', speaker: 'CEO & Founder' },
      { id: 'a2', time: '11:00 AM', topic: 'Breakout Session: Operational Workflows', speaker: 'Alex Morgan' },
      { id: 'a3', time: '02:00 PM', topic: 'Product Roadmap & Technology Upgrades', speaker: 'Sarah Jenkins' }
    ],
    createdAt: getRelativeDate(-5)
  },
  {
    id: 'p_sample_2',
    title: 'Client Onboarding Workshop & Training',
    category: 'Training',
    date: todayStr(),
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    venue: 'Virtual Room (Google Meet / Zoom)',
    coordinator: 'Elena Rostova',
    targetAudience: 'New Enterprise Clients & Customer Success Team',
    expectedAttendees: 24,
    status: 'ongoing',
    description: 'Hands-on interactive walkthrough of the platform dashboard, security settings, and reporting tools.',
    budget: '$450',
    agendaItems: [
      { id: 'a4', time: '02:00 PM', topic: 'Platform Architecture & Setup', speaker: 'Elena Rostova' },
      { id: 'a5', time: '02:45 PM', topic: 'Live Q&A & Workflow Sandbox', speaker: 'David Chen' }
    ],
    createdAt: getRelativeDate(-2)
  }
];

export const sampleMeetings: Meeting[] = [
  {
    id: 'm_sample_1',
    title: 'Sprint Planning & Release Review',
    date: todayStr(),
    time: '11:00 AM',
    duration: '45 mins',
    type: 'online',
    platformOrVenue: 'Google Meet',
    meetLink: 'https://meet.google.com/abc-defg-hij',
    chairperson: 'David Chen',
    attendees: 'Alex Morgan, Sarah Jenkins, David Chen, Elena Rostova',
    status: 'scheduled',
    agenda: 'Review backlog items for upcoming sprint v2.4, finalize QA test cases, and allocate developer assignments.',
    minutesOfMeeting: '',
    actionItems: [
      { id: 'act1', text: 'Finalize API schema docs for authentication', assignee: 'David Chen', done: false },
      { id: 'act2', text: 'Deploy hotfix to staging server', assignee: 'Sarah Jenkins', done: true }
    ],
    createdAt: getRelativeDate(-2)
  },
  {
    id: 'm_sample_2',
    title: 'Executive Quarterly Progress Briefing',
    date: getRelativeDate(2),
    time: '03:30 PM',
    duration: '1 hour',
    type: 'hybrid',
    platformOrVenue: 'Executive Boardroom & Zoom',
    meetLink: 'https://zoom.us/j/123456789',
    chairperson: 'Elena Rostova',
    attendees: 'Directors, Stakeholders & Project Coordinators',
    status: 'scheduled',
    agenda: 'Presentation of Q3 financial summary, team expansion plans, and client acquisition statistics.',
    minutesOfMeeting: '',
    actionItems: [
      { id: 'act3', text: 'Prepare slide deck with Q3 KPI graphs', assignee: 'Elena Rostova', done: false }
    ],
    createdAt: getRelativeDate(-4)
  }
];
