import React, { useState } from 'react';
import {
  Plus,
  Cake,
  Share2,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  CheckSquare,
  CalendarDays,
  Video,
  LogOut,
  Cloud,
  Shield,
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
  onOpenShareModal: () => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
  onClearAllData: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  activeTab,
  onTabChange,
  taskCount,
  programCount,
  meetingCount,
  firebaseConnected = true,
  onSyncToFirestore,
  isSyncingFirestore = false,
  onOpenRulesModal,
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

            <button
              id="btn-share-link"
              onClick={onOpenShareModal}
              title="Share Birthday Entry Link"
              className="bg-white hover:bg-[#E9EBFA] text-[#4C5FD5] border border-[#DCE1E6] px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all cursor-pointer"
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

        {/* Tools & Backup Dropdown */}
        <div className="relative">
          <button
            id="btn-data-tools"
            onClick={() => setShowToolsMenu(!showToolsMenu)}
            className="bg-white hover:bg-[#F3F5F7] text-[#5B6472] border border-[#DCE1E6] px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 font-medium"
            title="Data tools, backup options & Firestore"
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
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#DCE1E6] py-1.5 z-30 text-xs sm:text-sm">
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
                {onSyncToFirestore && (
                  <button
                    onClick={() => {
                      onSyncToFirestore();
                      setShowToolsMenu(false);
                    }}
                    disabled={isSyncingFirestore}
                    className="w-full px-3.5 py-2 text-left text-[#4C5FD5] hover:bg-[#E9EBFA] flex items-center gap-2 cursor-pointer font-medium disabled:opacity-50"
                  >
                    <Cloud className="w-4 h-4" />
                    <span>{isSyncingFirestore ? 'Syncing to Firestore...' : 'Push All to Firestore'}</span>
                  </button>
                )}
                {onOpenRulesModal && (
                  <button
                    onClick={() => {
                      onOpenRulesModal();
                      setShowToolsMenu(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-[#1B2430] hover:bg-[#F3F5F7] flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <Shield className="w-4 h-4 text-[#4C5FD5]" />
                    <span>Firestore Security Rules</span>
                  </button>
                )}
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

        {/* User Profile & Sign Out */}
        {currentUser && (
          <div className="flex items-center gap-2 pl-1 sm:pl-1.5 border-l border-[#DCE1E6]">
            <div
              className="flex items-center gap-2 bg-white border border-[#DCE1E6] px-2 sm:px-2.5 py-1.5 rounded-xl shadow-2xs"
              title={`${currentUser.name} (${currentUser.email}) - ${currentUser.role || 'Member'}`}
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover border border-[#DCE1E6]"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#E9EBFA] text-[#4C5FD5] flex items-center justify-center text-xs font-bold">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <div className="hidden xl:block text-left text-xs leading-tight">
                <div className="font-semibold text-[#1B2430] truncate max-w-[110px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-[#5B6472] capitalize flex items-center gap-1">
                  <span>{currentUser.provider === 'google' ? 'Google' : 'Email'}</span>
                  <span>•</span>
                  <span className="truncate max-w-[70px]">{currentUser.role || 'Member'}</span>
                </div>
              </div>
            </div>

            {onLogout && (
              <button
                id="btn-header-logout"
                onClick={onLogout}
                title="Sign out"
                className="bg-white hover:bg-[#FBE7E3] text-[#5B6472] hover:text-[#D6604D] border border-[#DCE1E6] hover:border-[#D6604D]/30 px-2 sm:px-2.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
