export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'progress' | 'done';
export type EffectiveStatus = 'pending' | 'progress' | 'done' | 'overdue';

export type ActiveTab = 'tasks' | 'programs' | 'meetings';

export interface TaskNote {
  id: string;
  text: string;
  date: string; // YYYY-MM-DD
}

export interface Task {
  id: string;
  name?: string; // Person / Client Name
  village?: string; // Village / Location
  title: string; // Task / Work Title
  desc?: string; // Description
  remark?: string;
  assignee?: string; // Assign Person
  project?: string;
  due?: string; // Deadline Date (YYYY-MM-DD)
  priority: TaskPriority;
  status: TaskStatus;
  notes: TaskNote[];
  createdAt: string;
}

export interface Birthday {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  dept?: string;
  position?: string;
  village?: string;
  phone?: string;
}

export interface FilterState {
  search: string;
  assignee: string;
  village: string;
  project: string;
  status: 'all' | EffectiveStatus;
}

export type ProgramStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface ProgramAgendaItem {
  id: string;
  time: string;
  topic: string;
  speaker?: string;
}

export interface Program {
  id: string;
  title: string;
  category: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime?: string;
  venue: string;
  coordinator: string;
  targetAudience?: string;
  expectedAttendees?: number;
  status: ProgramStatus;
  description?: string;
  agendaItems: ProgramAgendaItem[];
  budget?: string;
  createdAt: string;
}

export type MeetingStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
export type MeetingType = 'online' | 'in-person' | 'hybrid';

export interface MeetingActionItem {
  id: string;
  text: string;
  assignee?: string;
  done: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  duration?: string;
  type: MeetingType;
  platformOrVenue: string;
  meetLink?: string;
  chairperson: string;
  attendees: string;
  status: MeetingStatus;
  agenda?: string;
  minutesOfMeeting?: string;
  actionItems: MeetingActionItem[];
  createdAt: string;
}
