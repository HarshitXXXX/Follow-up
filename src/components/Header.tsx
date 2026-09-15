import React, { useState } from 'react';
import {
  Plus,
  Cake,
  Share2,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  Sparkles,
  CheckSquare,
  CalendarDays,
  Video,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  taskCount: number;
  programCount: number;
  meetingCount: number;
  onOpenTaskModal: () => void;
  onOpenProgramModal: () => void;
  onOpenMeetingModal: () => void;
  onOpenBdayModal: () => void;
  onOpenShareModal: () => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
  onClearAllData: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  taskCount,
  programCount,
  meetingCount,
  onOpenTaskModal,
  onOpenProgramModal,
  onOpenMeetingModal,
  onOpenBdayModal,
  onOpenShareModal,
  onExportData,
  onImportData,
  onClearAllData,
  onResetData,
}) => {
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImportData(e.target.files[0]);
      e.target.value = '';
    }
  };

  return (
    <header className="mb-7 pb-4 border-b border-[#DCE1E6]/70">
      {/* Top row: Title and Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-fraunces text-3xl md:text-4xl font-semibold tracking-tight text-[#1B2430]">
              Operations & Follow-up Hub
            </h1>
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#E9EBFA] text-[#4C5FD5]">
              <Sparkles className="w-3 h-3 mr-1" /> Pro Workspace
            </span>
          </div>
          <p className="text-sm text-[#5B6472] mt-1">
            Centralized team tasks, program schedules, meetings, and birthday records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {activeTab === 'tasks' && (
            <>
              <button
                id="btn-add-task"
                onClick={onOpenTaskModal}
                className="bg-[#1B2430] hover:bg-[#4C5FD5] text-white px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-1.5 transition-all shadow-sm hover:shadow active:scale-98 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Task</span>
              </button>

              <button
                id="btn-add-birthday"
                onClick={onOpenBdayModal}
                className="bg-[#FFFFFF] hover:bg-[#FCF1DF] text-[#1B2430] border border-[#DCE1E6] hover:border-[#E8A33D] px-3.5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-1.5 transition-all shadow-2xs active:scale-98 cursor-pointer"
              >
                <Cake className="w-4 h-4 text-[#E8A33D]" />
                <span className="hidden sm:inline">Add Birthday</span>
              </button>

              <button
                id="btn-share-link"
                onClick={onOpenShareModal}
                title="Share Birthday Entry Link"
                className="bg-[#FFFFFF] hover:bg-[#E9EBFA] text-[#4C5FD5] border border-[#DCE1E6] px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share Link</span>
              </button>
            </>
          )}

          {activeTab === 'programs' && (
            <button
              id="btn-add-program"
              onClick={onOpenProgramModal}
              className="bg-[#1B2430] hover:bg-[#4C5FD5] text-white px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-1.5 transition-all shadow-sm hover:shadow active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Program</span>
            </button>
          )}

          {activeTab === 'meetings' && (
            <button
              id="btn-add-meeting"
              onClick={onOpenMeetingModal}
              className="bg-[#1B2430] hover:bg-[#4C5FD5] text-white px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-1.5 transition-all shadow-sm hover:shadow active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Meeting</span>
            </button>
          )}

          {/* Tools & Backup Dropdown */}
          <div className="relative">
            <button
              id="btn-data-tools"
              onClick={() => setShowToolsMenu(!showToolsMenu)}
              className="bg-[#FFFFFF] hover:bg-[#F3F5F7] text-[#5B6472] border border-[#DCE1E6] px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer flex items-center gap-1.5 font-medium"
              title="Data tools and backup options"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Backup & Tools</span>
            </button>

            {showToolsMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowToolsMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#DCE1E6] py-1.5 z-30 text-sm">
                  <button
                    onClick={() => {
                      onExportData();
                      setShowToolsMenu(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-[#1B2430] hover:bg-[#F3F5F7] flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#4C5FD5]" />
                    <span>Export Data (JSON)</span>
                  </button>
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowToolsMenu(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-[#1B2430] hover:bg-[#F3F5F7] flex items-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-[#2F8F82]" />
                    <span>Import Data (Restore)</span>
                  </button>
                  <div className="h-px bg-[#DCE1E6] my-1" />
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear all data? This will reset all tasks, programs, meetings, and birthdays.')) {
                        onClearAllData();
                      }
                      setShowToolsMenu(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-[#D6604D] hover:bg-[#FBE7E3] flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All Data</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Load sample demo data? This will populate tasks, programs, and meetings for testing.')) {
                        onResetData();
                      }
                      setShowToolsMenu(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-[#5B6472] hover:bg-[#F3F5F7] flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Load Sample Demo Data</span>
                  </button>
                </div>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".json"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none" aria-label="Main Navigation Tabs">
        <button
          id="tab-btn-tasks"
          onClick={() => onTabChange('tasks')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'tasks'
              ? 'bg-[#1B2430] text-white shadow-xs'
              : 'bg-white text-[#5B6472] hover:text-[#1B2430] hover:bg-[#F3F5F7] border border-[#DCE1E6]'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Tasks & Follow-ups</span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-mono-code font-bold ${
              activeTab === 'tasks' ? 'bg-white/20 text-white' : 'bg-[#EEF1F4] text-[#5B6472]'
            }`}
          >
            {taskCount}
          </span>
        </button>

        <button
          id="tab-btn-programs"
          onClick={() => onTabChange('programs')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'programs'
              ? 'bg-[#1B2430] text-white shadow-xs'
              : 'bg-white text-[#5B6472] hover:text-[#1B2430] hover:bg-[#F3F5F7] border border-[#DCE1E6]'
          }`}
        >
          <CalendarDays className="w-4 h-4 text-[#E8A33D]" />
          <span>Program Scheduling</span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-mono-code font-bold ${
              activeTab === 'programs' ? 'bg-white/20 text-white' : 'bg-[#EEF1F4] text-[#5B6472]'
            }`}
          >
            {programCount}
          </span>
        </button>

        <button
          id="tab-btn-meetings"
          onClick={() => onTabChange('meetings')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'meetings'
              ? 'bg-[#1B2430] text-white shadow-xs'
              : 'bg-white text-[#5B6472] hover:text-[#1B2430] hover:bg-[#F3F5F7] border border-[#DCE1E6]'
          }`}
        >
          <Video className="w-4 h-4 text-[#4C5FD5]" />
          <span>Meetings</span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-mono-code font-bold ${
              activeTab === 'meetings' ? 'bg-white/20 text-white' : 'bg-[#EEF1F4] text-[#5B6472]'
            }`}
          >
            {meetingCount}
          </span>
        </button>
      </nav>
    </header>
  );
};
