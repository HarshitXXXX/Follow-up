import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  User,
  Users,
  Link as LinkIcon,
  Plus,
  Search,
  Check,
  Copy,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { Meeting, MeetingStatus, MeetingType } from '../types';
import { daysFromToday, formatDatePretty } from '../utils/helpers';

interface MeetingSectionProps {
  meetings: Meeting[];
  onOpenAddModal: () => void;
  onEditMeeting: (meeting: Meeting) => void;
  onDeleteMeeting: (id: string) => void;
  onUpdateMeetingStatus: (id: string, status: MeetingStatus) => void;
  onToggleActionItem: (meetingId: string, actionId: string) => void;
  onAddActionItem: (meetingId: string, text: string, assignee?: string) => void;
  onDeleteActionItem: (meetingId: string, actionId: string) => void;
}

const statusBadgeStyles: Record<MeetingStatus, string> = {
  scheduled: 'bg-[#E9EBFA] text-[#4C5FD5] border-[#4C5FD5]/30',
  'in-progress': 'bg-[#FCF1DF] text-[#9A6B1E] border-[#E8A33D]/40 animate-pulse',
  completed: 'bg-[#E4F2F0] text-[#2F8F82] border-[#2F8F82]/30',
  cancelled: 'bg-[#FBE7E3] text-[#D6604D] border-[#D6604D]/30',
};

const typeBadgeStyles: Record<MeetingType, { bg: string; text: string; icon: React.ReactNode }> = {
  online: {
    bg: 'bg-[#E9EBFA]',
    text: 'text-[#4C5FD5]',
    icon: <Video className="w-3 h-3" />,
  },
  'in-person': {
    bg: 'bg-[#EEF1F4]',
    text: 'text-[#1B2430]',
    icon: <MapPin className="w-3 h-3" />,
  },
  hybrid: {
    bg: 'bg-[#FCF1DF]',
    text: 'text-[#9A6B1E]',
    icon: <Users className="w-3 h-3" />,
  },
};

export const MeetingSection: React.FC<MeetingSectionProps> = ({
  meetings,
  onOpenAddModal,
  onEditMeeting,
  onDeleteMeeting,
  onUpdateMeetingStatus,
  onToggleActionItem,
  onAddActionItem,
  onDeleteActionItem,
}) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Inline action item inputs for expanded card
  const [inlineActionText, setInlineActionText] = useState('');
  const [inlineActionAssignee, setInlineActionAssignee] = useState('');

  // Status counts
  const counts = useMemo(() => {
    return {
      all: meetings.length,
      scheduled: meetings.filter((m) => m.status === 'scheduled').length,
      'in-progress': meetings.filter((m) => m.status === 'in-progress').length,
      completed: meetings.filter((m) => m.status === 'completed').length,
    };
  }, [meetings]);

  // Filtered meetings
  const filteredMeetings = useMemo(() => {
    return meetings
      .filter((m) => {
        if (selectedStatus !== 'all' && m.status !== selectedStatus) return false;
        if (selectedType !== 'all' && m.type !== selectedType) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = m.title.toLowerCase().includes(q);
          const matchChair = m.chairperson.toLowerCase().includes(q);
          const matchPlatform = m.platformOrVenue.toLowerCase().includes(q);
          const matchAttendees = m.attendees?.toLowerCase().includes(q);
          const matchAgenda = m.agenda?.toLowerCase().includes(q);
          const matchMom = m.minutesOfMeeting?.toLowerCase().includes(q);
          if (!matchTitle && !matchChair && !matchPlatform && !matchAttendees && !matchAgenda && !matchMom) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [meetings, selectedStatus, selectedType, search]);

  const handleCopyMeeting = (e: React.MouseEvent, m: Meeting) => {
    e.stopPropagation();
    const actionItemsText = m.actionItems?.length
      ? '\n✅ Action Items:\n' + m.actionItems.map((item) => ` • [${item.done ? 'DONE' : 'PENDING'}] ${item.text}${item.assignee ? ` (@${item.assignee})` : ''}`).join('\n')
      : '';

    const text = `📋 *MEETING: ${m.title}*
📅 Date: ${formatDatePretty(m.date)} (${m.date})
⏰ Time: ${m.time}${m.duration ? ` (${m.duration})` : ''}
📍 Location/Platform: ${m.platformOrVenue}${m.meetLink ? `\n🔗 Link: ${m.meetLink}` : ''}
👤 Host/Chairperson: ${m.chairperson}
👥 Attendees: ${m.attendees || 'Team'}
📊 Status: ${m.status.toUpperCase()}${m.agenda ? `\n📌 Agenda:\n${m.agenda}` : ''}${m.minutesOfMeeting ? `\n📝 Minutes of Meeting (MoM):\n${m.minutesOfMeeting}` : ''}${actionItemsText}`;

    navigator.clipboard.writeText(text);
    setCopiedId(m.id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const handleAddInlineAction = (meetingId: string) => {
    if (!inlineActionText.trim()) return;
    onAddActionItem(
      meetingId,
      inlineActionText.trim(),
      inlineActionAssignee.trim() || undefined
    );
    setInlineActionText('');
    setInlineActionAssignee('');
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setSelectedStatus('all')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === 'all'
              ? 'bg-[#1B2430] text-white border-[#1B2430] shadow-sm'
              : 'bg-white text-[#1B2430] border-[#DCE1E6] hover:border-[#4C5FD5]'
          }`}
        >
          <div className="text-xs font-semibold opacity-75">All Meetings</div>
          <div className="text-2xl font-bold font-fraunces mt-1">{counts.all}</div>
        </div>

        <div
          onClick={() => setSelectedStatus('scheduled')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === 'scheduled'
              ? 'bg-[#4C5FD5] text-white border-[#4C5FD5] shadow-sm'
              : 'bg-white text-[#1B2430] border-[#DCE1E6] hover:border-[#4C5FD5]'
          }`}
        >
          <div className="text-xs font-semibold text-[#4C5FD5] select-none">Scheduled</div>
          <div className="text-2xl font-bold font-fraunces mt-1">{counts.scheduled}</div>
        </div>

        <div
          onClick={() => setSelectedStatus('in-progress')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === 'in-progress'
              ? 'bg-[#E8A33D] text-white border-[#E8A33D] shadow-sm'
              : 'bg-white text-[#1B2430] border-[#DCE1E6] hover:border-[#E8A33D]'
          }`}
        >
          <div className="text-xs font-semibold text-[#E8A33D] select-none">In-Progress</div>
          <div className="text-2xl font-bold font-fraunces mt-1">{counts['in-progress']}</div>
        </div>

        <div
          onClick={() => setSelectedStatus('completed')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === 'completed'
              ? 'bg-[#2F8F82] text-white border-[#2F8F82] shadow-sm'
              : 'bg-white text-[#1B2430] border-[#DCE1E6] hover:border-[#2F8F82]'
          }`}
        >
          <div className="text-xs font-semibold text-[#2F8F82] select-none">Completed</div>
          <div className="text-2xl font-bold font-fraunces mt-1">{counts.completed}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-[#DCE1E6] rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#93A0AC]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search meetings by title, chairperson, platform, or agenda..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-[#EEF1F4]/40 border border-[#DCE1E6] rounded-xl text-xs sm:text-sm text-[#1B2430] placeholder-[#93A0AC] focus:outline-none focus:bg-white focus:border-[#4C5FD5]"
            />
          </div>

          {/* Type Filter */}
          <div className="w-full sm:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#EEF1F4]/40 border border-[#DCE1E6] rounded-xl text-xs sm:text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] cursor-pointer"
            >
              <option value="all">All Formats</option>
              <option value="online">Online (Virtual)</option>
              <option value="in-person">In-Person</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          {/* Schedule Meeting Button */}
          <button
            onClick={onOpenAddModal}
            className="bg-[#1B2430] hover:bg-[#4C5FD5] text-white px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Meeting</span>
          </button>
        </div>

        {/* Quick Format Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-[#93A0AC] font-medium mr-1">Format:</span>
          {(['all', 'online', 'in-person', 'hybrid'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-2.5 py-1 rounded-lg border transition-all capitalize cursor-pointer ${
                selectedType === t
                  ? 'bg-[#1B2430] text-white border-[#1B2430]'
                  : 'bg-white text-[#5B6472] border-[#DCE1E6] hover:bg-[#F3F5F7]'
              }`}
            >
              {t === 'all' ? 'All' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Meeting Cards List */}
      <div className="space-y-4">
        {filteredMeetings.length === 0 ? (
          <div className="bg-white border border-[#DCE1E6] rounded-2xl p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF1F4] flex items-center justify-center mx-auto mb-3 text-[#93A0AC]">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="font-fraunces text-lg font-semibold text-[#1B2430] mb-1">
              No meetings found
            </h3>
            <p className="text-sm text-[#5B6472] max-w-md mx-auto mb-4">
              {meetings.length === 0
                ? 'Your meeting calendar is clear. Click below to schedule a sync, review, or client briefing.'
                : 'No meetings match your current search criteria or format filter.'}
            </p>
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1B2430] hover:bg-[#4C5FD5] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule New Meeting</span>
            </button>
          </div>
        ) : (
          filteredMeetings.map((m) => {
            const daysOffset = daysFromToday(m.date);
            let dayNotice = '';
            if (m.status === 'completed') {
              dayNotice = 'Completed';
            } else if (daysOffset === 0) {
              dayNotice = 'Today! ⚡';
            } else if (daysOffset === 1) {
              dayNotice = 'Tomorrow';
            } else if (daysOffset > 1) {
              dayNotice = `In ${daysOffset} days`;
            } else if (daysOffset < 0) {
              dayNotice = `${Math.abs(daysOffset)} days ago`;
            }

            const completedActions = m.actionItems?.filter((i) => i.done).length || 0;
            const totalActions = m.actionItems?.length || 0;
            const isExpanded = expandedId === m.id;
            const typeConfig = typeBadgeStyles[m.type] || typeBadgeStyles.online;

            return (
              <div
                key={m.id}
                id={`meeting-card-${m.id}`}
                className="bg-white border border-[#DCE1E6] rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md hover:border-[#CBD5E1]"
              >
                {/* Main Card Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : m.id)}
                  className="p-4 sm:p-5 cursor-pointer select-none transition-colors hover:bg-[#FBFBFC]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        {/* Type badge */}
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-md inline-flex items-center gap-1 ${typeConfig.bg} ${typeConfig.text}`}
                        >
                          {typeConfig.icon}
                          <span className="capitalize">{m.type}</span>
                        </span>

                        {/* Status badge */}
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize ${
                            statusBadgeStyles[m.status]
                          }`}
                        >
                          {m.status}
                        </span>

                        {dayNotice && (
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-md font-mono-code ${
                              daysOffset === 0
                                ? 'bg-[#FCF1DF] text-[#9A6B1E]'
                                : daysOffset > 0
                                ? 'bg-[#E9EBFA] text-[#4C5FD5]'
                                : 'bg-[#EEF1F4] text-[#5B6472]'
                            }`}
                          >
                            {dayNotice}
                          </span>
                        )}

                        {totalActions > 0 && (
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                              completedActions === totalActions
                                ? 'bg-[#E4F2F0] text-[#2F8F82]'
                                : 'bg-[#EEF1F4] text-[#5B6472]'
                            }`}
                          >
                            ✓ {completedActions}/{totalActions} action items
                          </span>
                        )}
                      </div>

                      <h3 className="font-fraunces text-lg sm:text-xl font-semibold text-[#1B2430] leading-snug">
                        {m.title}
                      </h3>

                      {/* Meta chips */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-xs text-[#5B6472]">
                        <span className="inline-flex items-center gap-1 font-mono-code">
                          <Calendar className="w-3.5 h-3.5 text-[#4C5FD5]" />
                          <span>
                            {formatDatePretty(m.date)} ({m.date})
                          </span>
                        </span>

                        <span className="inline-flex items-center gap-1 font-mono-code">
                          <Clock className="w-3.5 h-3.5 text-[#4C5FD5]" />
                          <span>
                            {m.time}
                            {m.duration ? ` (${m.duration})` : ''}
                          </span>
                        </span>

                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#E8A33D]" />
                          <span>{m.platformOrVenue}</span>
                        </span>

                        <span className="inline-flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-[#2F8F82]" />
                          <span>Chair: {m.chairperson}</span>
                        </span>

                        {m.attendees && (
                          <span className="inline-flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-[#5B6472]" />
                            <span>{m.attendees}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions & Meet Link */}
                    <div className="flex items-center gap-1 sm:gap-2 self-end sm:self-center">
                      {m.meetLink && (
                        <a
                          href={m.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="bg-[#4C5FD5] hover:bg-[#3F51B5] text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                          title="Join Meeting Link"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join</span>
                          <ExternalLink className="w-3 h-3 opacity-75" />
                        </a>
                      )}

                      <button
                        onClick={(e) => handleCopyMeeting(e, m)}
                        className="p-1.5 text-[#93A0AC] hover:text-[#4C5FD5] hover:bg-[#E9EBFA] rounded-lg transition-colors cursor-pointer"
                        title="Copy Meeting Details & MoM"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-4 h-4 text-[#2F8F82]" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditMeeting(m);
                        }}
                        className="p-1.5 text-[#93A0AC] hover:text-[#1B2430] hover:bg-[#EEF1F4] rounded-lg transition-colors cursor-pointer"
                        title="Edit Meeting"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteMeeting(m.id);
                        }}
                        className="p-1.5 text-[#93A0AC] hover:text-[#D6604D] hover:bg-[#FBE7E3] rounded-lg transition-colors cursor-pointer"
                        title="Delete Meeting"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="text-[#93A0AC] pl-1">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Detail Panel */}
                {isExpanded && (
                  <div className="border-t border-[#DCE1E6] p-4 sm:p-5 bg-[#FAFBFC] space-y-4">
                    {/* Meeting Link Banner if provided */}
                    {m.meetLink && (
                      <div className="bg-[#E9EBFA]/60 border border-[#4C5FD5]/20 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <LinkIcon className="w-4 h-4 text-[#4C5FD5] shrink-0" />
                          <span className="font-mono-code text-[#4C5FD5] truncate font-medium">
                            {m.meetLink}
                          </span>
                        </div>
                        <a
                          href={m.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#4C5FD5] hover:underline font-semibold shrink-0 flex items-center gap-1"
                        >
                          Open URL <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {/* Agenda */}
                    {m.agenda && (
                      <div>
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-[#5B6472] block mb-1">
                          Agenda Topics
                        </span>
                        <div className="text-sm text-[#1B2430] bg-white p-3.5 rounded-xl border border-[#DCE1E6] whitespace-pre-line leading-relaxed">
                          {m.agenda}
                        </div>
                      </div>
                    )}

                    {/* Minutes of Meeting (MoM) */}
                    {m.minutesOfMeeting && (
                      <div className="bg-[#E9EBFA] border border-[#4C5FD5]/20 rounded-xl p-3.5">
                        <span className="block text-[11px] font-bold text-[#4C5FD5] uppercase tracking-wide mb-1">
                          Minutes of Meeting (MoM) & Key Decisions
                        </span>
                        <p className="text-sm text-[#1B2430] leading-relaxed whitespace-pre-line">
                          {m.minutesOfMeeting}
                        </p>
                      </div>
                    )}

                    {/* Quick Status Bar */}
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-[#5B6472] block mb-1.5">
                        Update Status
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(['scheduled', 'in-progress', 'completed', 'cancelled'] as MeetingStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={() => onUpdateMeetingStatus(m.id, st)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize cursor-pointer ${
                              m.status === st
                                ? 'bg-[#1B2430] text-white border-[#1B2430]'
                                : 'bg-white text-[#5B6472] border-[#DCE1E6] hover:bg-[#F3F5F7]'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Items Checklist */}
                    <div className="pt-2 border-t border-[#DCE1E6]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-[#1B2430]">
                          Action Items & Follow-ups ({m.actionItems?.length || 0})
                        </span>
                        {totalActions > 0 && (
                          <span className="text-xs font-mono-code text-[#5B6472]">
                            {completedActions}/{totalActions} Completed
                          </span>
                        )}
                      </div>

                      {m.actionItems && m.actionItems.length > 0 ? (
                        <div className="space-y-1.5 mb-3">
                          {m.actionItems.map((item) => (
                            <div
                              key={item.id}
                              className="group flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-[#DCE1E6] text-xs hover:border-[#CBD5E1] transition-all"
                            >
                              <div
                                onClick={() => onToggleActionItem(m.id, item.id)}
                                className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer select-none"
                              >
                                {item.done ? (
                                  <CheckSquare className="w-4 h-4 text-[#2F8F82] shrink-0" />
                                ) : (
                                  <Square className="w-4 h-4 text-[#93A0AC] group-hover:text-[#4C5FD5] shrink-0" />
                                )}
                                <span
                                  className={`truncate ${
                                    item.done
                                      ? 'line-through text-[#93A0AC]'
                                      : 'text-[#1B2430] font-medium'
                                  }`}
                                >
                                  {item.text}
                                </span>
                                {item.assignee && (
                                  <span className="text-[11px] font-semibold text-[#4C5FD5] bg-[#E9EBFA] px-1.5 py-0.5 rounded shrink-0">
                                    @{item.assignee}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => onDeleteActionItem(m.id, item.id)}
                                className="opacity-0 group-hover:opacity-100 text-[#93A0AC] hover:text-[#D6604D] p-1 transition-opacity cursor-pointer"
                                title="Delete Action Item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-[#93A0AC] italic py-1">
                          No action items assigned yet. Add one below to track post-meeting deliverables.
                        </div>
                      )}

                      {/* Quick Add Action Item */}
                      <div className="flex flex-col sm:flex-row gap-2 mt-2">
                        <input
                          type="text"
                          value={inlineActionText}
                          onChange={(e) => setInlineActionText(e.target.value)}
                          placeholder="Action item / deliverable..."
                          className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-[#DCE1E6] bg-white text-[#1B2430] focus:outline-none focus:border-[#4C5FD5]"
                        />
                        <input
                          type="text"
                          value={inlineActionAssignee}
                          onChange={(e) => setInlineActionAssignee(e.target.value)}
                          placeholder="Owner / Assignee (optional)"
                          className="w-full sm:w-48 px-2.5 py-1.5 text-xs rounded-lg border border-[#DCE1E6] bg-white text-[#1B2430] focus:outline-none focus:border-[#4C5FD5]"
                        />
                        <button
                          onClick={() => handleAddInlineAction(m.id)}
                          disabled={!inlineActionText.trim()}
                          className="bg-[#4C5FD5] disabled:bg-[#93A0AC]/50 text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer disabled:cursor-not-allowed transition-colors shrink-0"
                        >
                          Add Action
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
