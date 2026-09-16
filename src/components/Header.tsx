import React, { useState } from 'react';
import {
  Plus,
  Cake,
  CheckSquare,
  CalendarDays,
  Video,
  LogOut,
  User,
} from 'lucide-react';
import { ActiveTab, AuthUser } from '../types';

interface HeaderProps {
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  taskCount: number;
  programCount: number;
  meetingCount: number;
  firebaseConnected?: boolean;
  onSyncToFirestore?: () => void;
  isSyncingFirestore?: boolean;
  onOpenRulesModal?: () => void;
  onOpenTaskModal: () => void;
  onOpenProgramModal: () => void;
  onOpenMeetingModal: () => void;
  onOpenBdayModal: () => void;
  onOpenShareModal?: () => void;
  onExportData?: () => void;
  onImportData?: (file: File) => void;
  onClearAllData?: () => void;
  onResetData?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  activeTab,
  onTabChange,
  taskCount,
  programCount,
  meetingCount,
  onOpenTaskModal,
  onOpenProgramModal,
  onOpenMeetingModal,
  onOpenBdayModal,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="mb-6 pb-4 border-b border-[#DCE1E6]/80 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 sm:gap-4">
      {/* Navigation Tabs */}
      <nav
        className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none"
        aria-label="Main Navigation Tabs"
      >
        <button
          id="tab-btn-tasks"
          onClick={() => onTabChange('tasks')}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'tasks'
              ? 'bg-[#1B2430] text-white shadow-xs'
              : 'bg-white text-[#5B6472] hover:text-[#1B2430] hover:bg-[#F3F5F7] border border-[#DCE1E6]'
          }`}
        >
          <CheckSquare className={`w-4 h-4 ${activeTab === 'tasks' ? 'text-[#2F8F82]' : 'text-[#5B6472]'}`} />
          <span>Tasks & Follow-ups</span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
              activeTab === 'tasks' ? 'bg-white/20 text-white' : 'bg-[#EEF1F4] text-[#5B6472]'
            }`}
          >
            {taskCount}
          </span>
        </button>

        <button
          id="tab-btn-programs"
          onClick={() => onTabChange('programs')}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'programs'
              ? 'bg-[#1B2430] text-white shadow-xs'
              : 'bg-white text-[#5B6472] hover:text-[#1B2430] hover:bg-[#F3F5F7] border border-[#DCE1E6]'
          }`}
        >
          <CalendarDays className={`w-4 h-4 ${activeTab === 'programs' ? 'text-[#E8A33D]' : 'text-[#5B6472]'}`} />
          <span>Program Scheduling</span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
              activeTab === 'programs' ? 'bg-white/20 text-white' : 'bg-[#EEF1F4] text-[#5B6472]'
            }`}
          >
            {programCount}
          </span>
        </button>

        <button
          id="tab-btn-meetings"
          onClick={() => onTabChange('meetings')}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'meetings'
              ? 'bg-[#1B2430] text-white shadow-xs'
              : 'bg-white text-[#5B6472] hover:text-[#1B2430] hover:bg-[#F3F5F7] border border-[#DCE1E6]'
          }`}
        >
          <Video className={`w-4 h-4 ${activeTab === 'meetings' ? 'text-[#4C5FD5]' : 'text-[#5B6472]'}`} />
          <span>Meetings</span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
              activeTab === 'meetings' ? 'bg-white/20 text-white' : 'bg-[#EEF1F4] text-[#5B6472]'
            }`}
          >
            {meetingCount}
          </span>
        </button>
      </nav>

      {/* Action Controls & User Section */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {activeTab === 'tasks' && (
          <>
            <button
              id="btn-add-task"
              onClick={onOpenTaskModal}
              className="bg-[#1B2430] hover:bg-[#4C5FD5] text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs hover:shadow-sm active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>

            <button
              id="btn-add-birthday"
              onClick={onOpenBdayModal}
              className="bg-white hover:bg-[#FCF1DF] text-[#1B2430] border border-[#DCE1E6] hover:border-[#E8A33D] px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-2xs active:scale-98 cursor-pointer"
            >
              <Cake className="w-4 h-4 text-[#E8A33D]" />
              <span className="hidden sm:inline">Add Birthday</span>
            </button>
          </>
        )}

        {activeTab === 'programs' && (
          <button
            id="btn-add-program"
            onClick={onOpenProgramModal}
            className="bg-[#1B2430] hover:bg-[#4C5FD5] text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs hover:shadow-sm active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Program</span>
          </button>
        )}

        {activeTab === 'meetings' && (
          <button
            id="btn-add-meeting"
            onClick={onOpenMeetingModal}
            className="bg-[#1B2430] hover:bg-[#4C5FD5] text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs hover:shadow-sm active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Meeting</span>
          </button>
        )}

        {/* Compact Circular Profile Button (matching user icon) */}
        {currentUser && (
          <div className="relative pl-1 sm:pl-2 border-l border-[#DCE1E6]">
            <button
              id="btn-header-profile-avatar"
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs hover:ring-2 hover:ring-[#1A73E8]/30 overflow-hidden active:scale-95"
              title={`${currentUser.name} (${currentUser.email})`}
            >
              <User className="w-5 h-5 text-white" />
            </button>

            {/* Compact Profile & Sign Out Dropdown */}
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#DCE1E6] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-3 p-2 border-b border-[#DCE1E6]/80 pb-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#1A73E8] text-white flex items-center justify-center shrink-0 overflow-hidden font-semibold">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#1B2430] truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-[#5B6472] truncate">
                        {currentUser.email}
                      </p>
                      {currentUser.role && (
                        <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-semibold text-[#4C5FD5] bg-[#E9EBFA] px-1.5 py-0.5 rounded-md">
                          {currentUser.role}
                        </span>
                      )}
                    </div>
                  </div>

                  {onLogout && (
                    <button
                      id="btn-header-profile-logout"
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold text-[#D6604D] hover:bg-[#FBE7E3] rounded-xl transition-all cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
