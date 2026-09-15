import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Task,
  Birthday,
  Program,
  Meeting,
  FilterState,
  EffectiveStatus,
  TaskStatus,
  ActiveTab,
  ProgramStatus,
  MeetingStatus,
} from './types';
import {
  defaultTasks,
  defaultBirthdays,
  defaultPrograms,
  defaultMeetings,
  sampleTasks,
  sampleBirthdays,
  samplePrograms,
  sampleMeetings,
} from './data/defaultData';
import { uid, todayStr, getEffectiveStatus, isOverdue } from './utils/helpers';
import { Header } from './components/Header';
import { StatCards } from './components/StatCards';
import { FilterBar } from './components/FilterBar';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { BirthdaySection } from './components/BirthdaySection';
import { BirthdayModal } from './components/BirthdayModal';
import { StandaloneBirthdayAdd } from './components/StandaloneBirthdayAdd';
import { ShareLinkModal } from './components/ShareLinkModal';
import { SaveToast } from './components/SaveToast';
import { ProgramSection } from './components/ProgramSection';
import { ProgramModal } from './components/ProgramModal';
import { MeetingSection } from './components/MeetingSection';
import { MeetingModal } from './components/MeetingModal';
import { ClipboardList, PlusCircle } from 'lucide-react';

const TASKS_STORAGE_KEY = 'followup_tasks_v2';
const BDAYS_STORAGE_KEY = 'followup_birthdays_v2';
const PROGRAMS_STORAGE_KEY = 'followup_programs_v2';
const MEETINGS_STORAGE_KEY = 'followup_meetings_v2';
const DEMO_CLEARED_FLAG = 'followup_demo_cleared_v3';

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('tasks');

  // Check if standalone birthday mode is requested via URL or toggle
  const [isStandaloneMode, setIsStandaloneMode] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('mode') === 'addbirthday';
    } catch {
      return false;
    }
  });

  // Tasks state - initialize clean without demo data
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const wasCleared = localStorage.getItem(DEMO_CLEARED_FLAG);
      const saved = localStorage.getItem(TASKS_STORAGE_KEY);
      if (!wasCleared) {
        localStorage.setItem(DEMO_CLEARED_FLAG, 'true');
        if (saved) {
          const parsed: Task[] = JSON.parse(saved);
          const nonDemo = parsed.filter((t) => !t.id.startsWith('t_demo_'));
          localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(nonDemo));
          return nonDemo;
        }
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify([]));
        return [];
      }
      if (saved) {
        const parsed: Task[] = JSON.parse(saved);
        return parsed.filter((t) => !t.id.startsWith('t_demo_'));
      }
    } catch (e) {
      console.error('Failed to parse tasks from localStorage', e);
    }
    return defaultTasks;
  });

  // Birthdays state - initialize clean without demo data
  const [birthdays, setBirthdays] = useState<Birthday[]>(() => {
    try {
      const wasCleared = localStorage.getItem(DEMO_CLEARED_FLAG);
      const saved = localStorage.getItem(BDAYS_STORAGE_KEY);
      if (!wasCleared) {
        if (saved) {
          const parsed: Birthday[] = JSON.parse(saved);
          const nonDemo = parsed.filter((b) => !b.id.startsWith('b_demo_'));
          localStorage.setItem(BDAYS_STORAGE_KEY, JSON.stringify(nonDemo));
          return nonDemo;
        }
        localStorage.setItem(BDAYS_STORAGE_KEY, JSON.stringify([]));
        return [];
      }
      if (saved) {
        const parsed: Birthday[] = JSON.parse(saved);
        return parsed.filter((b) => !b.id.startsWith('b_demo_'));
      }
    } catch (e) {
      console.error('Failed to parse birthdays from localStorage', e);
    }
    return defaultBirthdays;
  });

  // Programs state - initialize clean
  const [programs, setPrograms] = useState<Program[]>(() => {
    try {
      const saved = localStorage.getItem(PROGRAMS_STORAGE_KEY);
      if (saved) {
        const parsed: Program[] = JSON.parse(saved);
        return parsed.filter((p) => !p.id.startsWith('p_demo_'));
      }
    } catch (e) {
      console.error('Failed to parse programs from localStorage', e);
    }
    return defaultPrograms;
  });

  // Meetings state - initialize clean
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    try {
      const saved = localStorage.getItem(MEETINGS_STORAGE_KEY);
      if (saved) {
        const parsed: Meeting[] = JSON.parse(saved);
        return parsed.filter((m) => !m.id.startsWith('m_demo_'));
      }
    } catch (e) {
      console.error('Failed to parse meetings from localStorage', e);
    }
    return defaultMeetings;
  });

  // Task Filter State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    assignee: '',
    village: '',
    project: '',
    status: 'all',
  });

  // Modal and Interactive States
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [programModalOpen, setProgramModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);

  const [bdayModalOpen, setBdayModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Saved successfully');

  // Save notification toast helper
  const triggerSaveToast = useCallback((msg = 'Saved successfully') => {
    setToastMessage(msg);
    setShowSaveToast(true);
    setTimeout(() => {
      setShowSaveToast(false);
    }, 1400);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Error saving tasks to localStorage', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(BDAYS_STORAGE_KEY, JSON.stringify(birthdays));
    } catch (e) {
      console.error('Error saving birthdays to localStorage', e);
    }
  }, [birthdays]);

  useEffect(() => {
    try {
      localStorage.setItem(PROGRAMS_STORAGE_KEY, JSON.stringify(programs));
    } catch (e) {
      console.error('Error saving programs to localStorage', e);
    }
  }, [programs]);

  useEffect(() => {
    try {
      localStorage.setItem(MEETINGS_STORAGE_KEY, JSON.stringify(meetings));
    } catch (e) {
      console.error('Error saving meetings to localStorage', e);
    }
  }, [meetings]);

  // Handle URL change detection for standalone mode
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setIsStandaloneMode(params.get('mode') === 'addbirthday');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Compute Task Status Counts
  const statusCounts = useMemo(() => {
    const counts = {
      all: tasks.length,
      pending: 0,
      progress: 0,
      done: 0,
      overdue: 0,
    };

    tasks.forEach((task) => {
      const effective = getEffectiveStatus(task);
      if (effective === 'overdue') {
        counts.overdue += 1;
      } else if (effective === 'done') {
        counts.done += 1;
      } else if (effective === 'progress') {
        counts.progress += 1;
      } else {
        counts.pending += 1;
      }
    });

    return counts;
  }, [tasks]);

  // Extract unique assignees, villages & projects for Task filters
  const uniqueAssignees = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.assignee?.trim()) set.add(t.assignee.trim());
    });
    return Array.from(set).sort();
  }, [tasks]);

  const uniqueVillages = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.village?.trim()) set.add(t.village.trim());
    });
    return Array.from(set).sort();
  }, [tasks]);

  const uniqueProjects = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.project?.trim()) set.add(t.project.trim());
    });
    return Array.from(set).sort();
  }, [tasks]);

  // Filter Tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (filters.status !== 'all') {
          const eff = getEffectiveStatus(task);
          if (eff !== filters.status) return false;
        }

        if (filters.assignee && task.assignee !== filters.assignee) {
          return false;
        }

        if (filters.village && task.village !== filters.village) {
          return false;
        }

        if (filters.project && task.project !== filters.project) {
          return false;
        }

        if (filters.search.trim()) {
          const q = filters.search.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchName = task.name?.toLowerCase().includes(q);
          const matchVillage = task.village?.toLowerCase().includes(q);
          const matchDesc = task.desc?.toLowerCase().includes(q);
          const matchRemark = task.remark?.toLowerCase().includes(q);
          const matchAssignee = task.assignee?.toLowerCase().includes(q);
          const matchProject = task.project?.toLowerCase().includes(q);
          const matchNotes = task.notes?.some((n) =>
            n.text.toLowerCase().includes(q)
          );

          if (
            !matchTitle &&
            !matchName &&
            !matchVillage &&
            !matchDesc &&
            !matchRemark &&
            !matchAssignee &&
            !matchProject &&
            !matchNotes
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // Overdue first, then by due date, then by creation
        const aOverdue = isOverdue(a.due, a.status);
        const bOverdue = isOverdue(b.due, b.status);
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;

        if (a.due && b.due) {
          return a.due.localeCompare(b.due);
        }
        if (a.due && !b.due) return -1;
        if (!a.due && b.due) return 1;

        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [tasks, filters]);

  // Task Operations
  const handleSaveTask = (
    taskData: Omit<Task, 'id' | 'notes' | 'createdAt'> & { id?: string }
  ) => {
    if (taskData.id) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskData.id
            ? {
                ...t,
                ...taskData,
              }
            : t
        )
      );
      triggerSaveToast('Task updated');
    } else {
      const newTask: Task = {
        ...taskData,
        id: uid('t_'),
        notes: [],
        createdAt: todayStr(),
      };
      setTasks((prev) => [newTask, ...prev]);
      triggerSaveToast('New task added');
    }
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (!taskToDelete) return;
    if (window.confirm(`Are you sure you want to delete task "${taskToDelete.title}"?`)) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      triggerSaveToast('Task deleted');
    }
  };

  const handleStatusChange = (id: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    triggerSaveToast('Status updated');
  };

  const handleAddNote = (taskId: string, text: string) => {
    const newNote = {
      id: uid(),
      text,
      date: todayStr(),
    };
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              notes: [...(t.notes || []), newNote],
            }
          : t
      )
    );
    triggerSaveToast('Follow-up note added');
  };

  const handleDeleteNote = (taskId: string, noteId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              notes: (t.notes || []).filter((n) => n.id !== noteId),
            }
          : t
      )
    );
    triggerSaveToast('Note deleted');
  };

  // Birthday Operations
  const handleSaveBirthday = (bdayData: Omit<Birthday, 'id'>) => {
    const newBday: Birthday = {
      ...bdayData,
      id: uid('b_'),
    };
    setBirthdays((prev) => [...prev, newBday]);
    triggerSaveToast('Birthday record saved');
  };

  const handleDeleteBirthday = (id: string) => {
    const bday = birthdays.find((b) => b.id === id);
    if (!bday) return;
    if (window.confirm(`Are you sure you want to delete ${bday.name}'s birthday?`)) {
      setBirthdays((prev) => prev.filter((b) => b.id !== id));
      triggerSaveToast('Birthday record deleted');
    }
  };

  // Program Operations
  const handleSaveProgram = (
    programData: Omit<Program, 'id' | 'createdAt'> & { id?: string }
  ) => {
    if (programData.id) {
      setPrograms((prev) =>
        prev.map((p) =>
          p.id === programData.id
            ? {
                ...p,
                ...programData,
              }
            : p
        )
      );
      triggerSaveToast('Program schedule updated');
    } else {
      const newProgram: Program = {
        ...programData,
        id: uid('p_'),
        createdAt: todayStr(),
      };
      setPrograms((prev) => [newProgram, ...prev]);
      triggerSaveToast('Program scheduled successfully');
    }
  };

  const handleDeleteProgram = (id: string) => {
    const p = programs.find((item) => item.id === id);
    if (!p) return;
    if (window.confirm(`Are you sure you want to delete "${p.title}"?`)) {
      setPrograms((prev) => prev.filter((item) => item.id !== id));
      triggerSaveToast('Program removed');
    }
  };

  const handleUpdateProgramStatus = (id: string, status: ProgramStatus) => {
    setPrograms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    triggerSaveToast(`Program status set to ${status}`);
  };

  const handleAddAgendaItem = (
    programId: string,
    time: string,
    topic: string,
    speaker?: string
  ) => {
    const newItem = {
      id: uid('ag_'),
      time,
      topic,
      speaker,
    };
    setPrograms((prev) =>
      prev.map((p) =>
        p.id === programId
          ? {
              ...p,
              agendaItems: [...(p.agendaItems || []), newItem],
            }
          : p
      )
    );
    triggerSaveToast('Agenda slot added');
  };

  // Meeting Operations
  const handleSaveMeeting = (
    meetingData: Omit<Meeting, 'id' | 'createdAt'> & { id?: string }
  ) => {
    if (meetingData.id) {
      setMeetings((prev) =>
        prev.map((m) =>
          m.id === meetingData.id
            ? {
                ...m,
                ...meetingData,
              }
            : m
        )
      );
      triggerSaveToast('Meeting details updated');
    } else {
      const newMeeting: Meeting = {
        ...meetingData,
        id: uid('m_'),
        createdAt: todayStr(),
      };
      setMeetings((prev) => [newMeeting, ...prev]);
      triggerSaveToast('Meeting scheduled successfully');
    }
  };

  const handleDeleteMeeting = (id: string) => {
    const m = meetings.find((item) => item.id === id);
    if (!m) return;
    if (window.confirm(`Are you sure you want to delete meeting "${m.title}"?`)) {
      setMeetings((prev) => prev.filter((item) => item.id !== id));
      triggerSaveToast('Meeting deleted');
    }
  };

  const handleUpdateMeetingStatus = (id: string, status: MeetingStatus) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
    triggerSaveToast(`Meeting marked as ${status}`);
  };

  const handleToggleActionItem = (meetingId: string, actionId: string) => {
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          actionItems: (m.actionItems || []).map((a) =>
            a.id === actionId ? { ...a, done: !a.done } : a
          ),
        };
      })
    );
    triggerSaveToast('Action item updated');
  };

  const handleAddActionItem = (
    meetingId: string,
    text: string,
    assignee?: string
  ) => {
    const newAction = {
      id: uid('act_'),
      text,
      assignee,
      done: false,
    };
    setMeetings((prev) =>
      prev.map((m) =>
        m.id === meetingId
          ? {
              ...m,
              actionItems: [...(m.actionItems || []), newAction],
            }
          : m
      )
    );
    triggerSaveToast('Action item added');
  };

  const handleDeleteActionItem = (meetingId: string, actionId: string) => {
    setMeetings((prev) =>
      prev.map((m) =>
        m.id === meetingId
          ? {
              ...m,
              actionItems: (m.actionItems || []).filter((a) => a.id !== actionId),
            }
          : m
      )
    );
    triggerSaveToast('Action item removed');
  };

  // Data Import / Export / Backup / Reset
  const handleExportData = () => {
    const data = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      tasks,
      birthdays,
      programs,
      meetings,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `operations-hub-backup-${todayStr()}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerSaveToast('Full backup exported');
  };

  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed.tasks)) {
          setTasks(parsed.tasks);
        }
        if (Array.isArray(parsed.birthdays)) {
          setBirthdays(parsed.birthdays);
        }
        if (Array.isArray(parsed.programs)) {
          setPrograms(parsed.programs);
        }
        if (Array.isArray(parsed.meetings)) {
          setMeetings(parsed.meetings);
        }
        triggerSaveToast('Backup restored successfully');
      } catch (e) {
        alert('Failed to read data file. Please select a valid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    setTasks([]);
    setBirthdays([]);
    setPrograms([]);
    setMeetings([]);
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify([]));
    localStorage.setItem(BDAYS_STORAGE_KEY, JSON.stringify([]));
    localStorage.setItem(PROGRAMS_STORAGE_KEY, JSON.stringify([]));
    localStorage.setItem(MEETINGS_STORAGE_KEY, JSON.stringify([]));
    localStorage.setItem(DEMO_CLEARED_FLAG, 'true');
    triggerSaveToast('All workspace data cleared');
  };

  const handleResetData = () => {
    setTasks(sampleTasks);
    setBirthdays(sampleBirthdays);
    setPrograms(samplePrograms);
    setMeetings(sampleMeetings);
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(sampleTasks));
    localStorage.setItem(BDAYS_STORAGE_KEY, JSON.stringify(sampleBirthdays));
    localStorage.setItem(PROGRAMS_STORAGE_KEY, JSON.stringify(samplePrograms));
    localStorage.setItem(MEETINGS_STORAGE_KEY, JSON.stringify(sampleMeetings));
    triggerSaveToast('Sample template data loaded');
  };

  // If in standalone public birthday submission view
  if (isStandaloneMode) {
    return (
      <>
        <StandaloneBirthdayAdd
          onSaveBirthday={handleSaveBirthday}
          onGoToDashboard={() => {
            const url = new URL(window.location.href);
            url.searchParams.delete('mode');
            window.history.pushState({}, '', url.toString());
            setIsStandaloneMode(false);
          }}
        />
        <SaveToast show={showSaveToast} message={toastMessage} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEF1F4] text-[#1B2430]">
      <main className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-7 pb-24">
        {/* Navigation Header */}
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          taskCount={tasks.length}
          programCount={programs.length}
          meetingCount={meetings.length}
          onOpenTaskModal={() => {
            setEditingTask(null);
            setTaskModalOpen(true);
          }}
          onOpenProgramModal={() => {
            setEditingProgram(null);
            setProgramModalOpen(true);
          }}
          onOpenMeetingModal={() => {
            setEditingMeeting(null);
            setMeetingModalOpen(true);
          }}
          onOpenBdayModal={() => setBdayModalOpen(true)}
          onOpenShareModal={() => setShareModalOpen(true)}
          onExportData={handleExportData}
          onImportData={handleImportData}
          onClearAllData={handleClearAllData}
          onResetData={handleResetData}
        />

        {/* TAB 1: Tasks & Follow-ups */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <StatCards
              counts={statusCounts}
              activeStatus={filters.status}
              onSelectStatus={(status) =>
                setFilters((prev) => ({ ...prev, status }))
              }
            />

            {/* Filter Bar */}
            <FilterBar
              filters={filters}
              onFilterChange={(updated) =>
                setFilters((prev) => ({ ...prev, ...updated }))
              }
              assignees={uniqueAssignees}
              villages={uniqueVillages}
              projects={uniqueProjects}
              statusCounts={statusCounts}
            />

            {/* Task Cards List */}
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="bg-white border border-[#DCE1E6] rounded-2xl p-12 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#EEF1F4] flex items-center justify-center mx-auto mb-3 text-[#93A0AC]">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <h3 className="font-fraunces text-lg font-semibold text-[#1B2430] mb-1">
                    No tasks found
                  </h3>
                  <p className="text-sm text-[#5B6472] max-w-md mx-auto mb-4">
                    {tasks.length === 0
                      ? 'Your task list is completely clear. Click the button below to add your first task.'
                      : 'No tasks match your selected filter criteria. Try adjusting your search query or reset status.'}
                  </p>
                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setTaskModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1B2430] hover:bg-[#4C5FD5] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create New Task</span>
                  </button>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isExpanded={expandedTaskId === task.id}
                    onToggleExpand={() =>
                      setExpandedTaskId((prev) =>
                        prev === task.id ? null : task.id
                      )
                    }
                    onEdit={() => {
                      setEditingTask(task);
                      setTaskModalOpen(true);
                    }}
                    onDelete={() => handleDeleteTask(task.id)}
                    onStatusChange={(newStatus) =>
                      handleStatusChange(task.id, newStatus)
                    }
                    onAddNote={(text) => handleAddNote(task.id, text)}
                    onDeleteNote={(noteId) => handleDeleteNote(task.id, noteId)}
                  />
                ))
              )}
            </div>

            {/* Birthday Section */}
            <BirthdaySection
              birthdays={birthdays}
              onOpenAddModal={() => setBdayModalOpen(true)}
              onDeleteBirthday={handleDeleteBirthday}
            />
          </div>
        )}

        {/* TAB 2: Program Scheduling */}
        {activeTab === 'programs' && (
          <ProgramSection
            programs={programs}
            onOpenAddModal={() => {
              setEditingProgram(null);
              setProgramModalOpen(true);
            }}
            onEditProgram={(program) => {
              setEditingProgram(program);
              setProgramModalOpen(true);
            }}
            onDeleteProgram={handleDeleteProgram}
            onUpdateProgramStatus={handleUpdateProgramStatus}
            onAddAgendaItem={handleAddAgendaItem}
          />
        )}

        {/* TAB 3: Meetings & MoM */}
        {activeTab === 'meetings' && (
          <MeetingSection
            meetings={meetings}
            onOpenAddModal={() => {
              setEditingMeeting(null);
              setMeetingModalOpen(true);
            }}
            onEditMeeting={(meeting) => {
              setEditingMeeting(meeting);
              setMeetingModalOpen(true);
            }}
            onDeleteMeeting={handleDeleteMeeting}
            onUpdateMeetingStatus={handleUpdateMeetingStatus}
            onToggleActionItem={handleToggleActionItem}
            onAddActionItem={handleAddActionItem}
            onDeleteActionItem={handleDeleteActionItem}
          />
        )}
      </main>

      {/* Task Modal (Add/Edit) */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialTask={editingTask}
      />

      {/* Program Modal (Add/Edit) */}
      <ProgramModal
        isOpen={programModalOpen}
        onClose={() => {
          setProgramModalOpen(false);
          setEditingProgram(null);
        }}
        onSave={handleSaveProgram}
        initialProgram={editingProgram}
      />

      {/* Meeting Modal (Add/Edit) */}
      <MeetingModal
        isOpen={meetingModalOpen}
        onClose={() => {
          setMeetingModalOpen(false);
          setEditingMeeting(null);
        }}
        onSave={handleSaveMeeting}
        initialMeeting={editingMeeting}
      />

      {/* Birthday Modal */}
      <BirthdayModal
        isOpen={bdayModalOpen}
        onClose={() => setBdayModalOpen(false)}
        onSave={handleSaveBirthday}
      />

      {/* Share Link Modal */}
      <ShareLinkModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onSwitchToStandalone={() => {
          const url = new URL(window.location.href);
          url.searchParams.set('mode', 'addbirthday');
          window.history.pushState({}, '', url.toString());
          setIsStandaloneMode(true);
        }}
      />

      {/* Floating Save Notification Toast */}
      <SaveToast show={showSaveToast} message={toastMessage} />
    </div>
  );
}
