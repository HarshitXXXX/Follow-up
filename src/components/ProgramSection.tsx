import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  DollarSign,
  Plus,
  Search,
  Check,
  Copy,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Tag,
  CalendarDays,
  Sparkles,
} from 'lucide-react';
import { Program, ProgramStatus } from '../types';
import { daysFromToday, formatDatePretty, uid } from '../utils/helpers';

interface ProgramSectionProps {
  programs: Program[];
  onOpenAddModal: () => void;
  onEditProgram: (program: Program) => void;
  onDeleteProgram: (id: string) => void;
  onUpdateProgramStatus: (id: string, status: ProgramStatus) => void;
  onAddAgendaItem: (programId: string, time: string, topic: string, speaker?: string) => void;
}

const statusBadgeStyles: Record<ProgramStatus, string> = {
  upcoming: 'bg-[#E9EBFA] text-[#4C5FD5] border-[#4C5FD5]/30',
  ongoing: 'bg-[#FCF1DF] text-[#9A6B1E] border-[#E8A33D]/40 animate-pulse',
  completed: 'bg-[#E4F2F0] text-[#2F8F82] border-[#2F8F82]/30',
  cancelled: 'bg-[#FBE7E3] text-[#D6604D] border-[#D6604D]/30',
};

export const ProgramSection: React.FC<ProgramSectionProps> = ({
  programs,
  onOpenAddModal,
  onEditProgram,
  onDeleteProgram,
  onUpdateProgramStatus,
  onAddAgendaItem,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Inline agenda input states for expanded card
  const [inlineTime, setInlineTime] = useState('');
  const [inlineTopic, setInlineTopic] = useState('');
  const [inlineSpeaker, setInlineSpeaker] = useState('');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    programs.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [programs]);

  // Status counts
  const counts = useMemo(() => {
    return {
      all: programs.length,
      upcoming: programs.filter((p) => p.status === 'upcoming').length,
      ongoing: programs.filter((p) => p.status === 'ongoing').length,
      completed: programs.filter((p) => p.status === 'completed').length,
    };
  }, [programs]);

  // Filtered and sorted programs
  const filteredPrograms = useMemo(() => {
    return programs
      .filter((p) => {
        if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchVenue = p.venue.toLowerCase().includes(q);
          const matchCoord = p.coordinator.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          if (!matchTitle && !matchVenue && !matchCoord && !matchDesc && !matchCat) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [programs, selectedStatus, selectedCategory, search]);

  const handleCopyProgram = (e: React.MouseEvent, p: Program) => {
    e.stopPropagation();
    const agendaText = p.agendaItems?.length
      ? '\n🗓️ Agenda:\n' + p.agendaItems.map((item) => ` • ${item.time}: ${item.topic}${item.speaker ? ` (${item.speaker})` : ''}`).join('\n')
      : '';

    const text = `📢 *PROGRAM SCHEDULE: ${p.title}*
📁 Category: ${p.category}
📅 Date: ${formatDatePretty(p.date)} (${p.date})
⏰ Time: ${p.startTime}${p.endTime ? ` - ${p.endTime}` : ''}
📍 Venue: ${p.venue}
👤 Lead Coordinator: ${p.coordinator}
👥 Target Audience: ${p.targetAudience || 'General public / team'}
📊 Status: ${p.status.toUpperCase()}${p.description ? `\n📝 Overview: ${p.description}` : ''}${agendaText}`;

    navigator.clipboard.writeText(text);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const handleAddInlineAgenda = (programId: string) => {
    if (!inlineTopic.trim()) return;
    onAddAgendaItem(
      programId,
      inlineTime.trim() || 'TBD',
      inlineTopic.trim(),
      inlineSpeaker.trim() || undefined
    );
    setInlineTime('');
    setInlineTopic('');
    setInlineSpeaker('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stat Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setSelectedStatus('all')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === 'all'
              ? 'bg-[#1B2430] text-white border-[#1B2430] shadow-sm'
              : 'bg-white text-[#1B2430] border-[#DCE1E6] hover:border-[#4C5FD5]'
          }`}
        >
          <div className="text-xs font-semibold opacity-75">All Programs</div>
          <div className="text-2xl font-bold font-fraunces mt-1">{counts.all}</div>
        </div>

        <div
          onClick={() => setSelectedStatus('upcoming')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === 'upcoming'
              ? 'bg-[#4C5FD5] text-white border-[#4C5FD5] shadow-sm'
              : 'bg-white text-[#1B2430] border-[#DCE1E6] hover:border-[#4C5FD5]'
          }`}
        >
          <div className="text-xs font-semibold text-[#4C5FD5] select-none">Upcoming</div>
          <div className="text-2xl font-bold font-fraunces mt-1">{counts.upcoming}</div>
        </div>

        <div
          onClick={() => setSelectedStatus('ongoing')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === 'ongoing'
              ? 'bg-[#E8A33D] text-white border-[#E8A33D] shadow-sm'
              : 'bg-white text-[#1B2430] border-[#DCE1E6] hover:border-[#E8A33D]'
          }`}
        >
          <div className="text-xs font-semibold text-[#E8A33D] select-none">In Progress / Ongoing</div>
          <div className="text-2xl font-bold font-fraunces mt-1">{counts.ongoing}</div>
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
              placeholder="Search programs by title, coordinator, venue, or description..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-[#EEF1F4]/40 border border-[#DCE1E6] rounded-xl text-xs sm:text-sm text-[#1B2430] placeholder-[#93A0AC] focus:outline-none focus:bg-white focus:border-[#4C5FD5]"
            />
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="w-full sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#EEF1F4]/40 border border-[#DCE1E6] rounded-xl text-xs sm:text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Schedule Program Button */}
          <button
            onClick={onOpenAddModal}
            className="bg-[#1B2430] hover:bg-[#4C5FD5] text-white px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Program</span>
          </button>
        </div>

        {/* Category quick badges */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="text-[#93A0AC] font-medium mr-1 flex items-center gap-1">
              <Tag className="w-3 h-3" /> Quick Filter:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#1B2430] text-white border-[#1B2430]'
                  : 'bg-white text-[#5B6472] border-[#DCE1E6] hover:bg-[#F3F5F7]'
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  selectedCategory === 'c'
                    ? 'bg-[#4C5FD5] text-white border-[#4C5FD5]'
                    : 'bg-white text-[#5B6472] border-[#DCE1E6] hover:bg-[#F3F5F7]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Program List */}
      <div className="space-y-4">
        {filteredPrograms.length === 0 ? (
          <div className="bg-white border border-[#DCE1E6] rounded-2xl p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF1F4] flex items-center justify-center mx-auto mb-3 text-[#93A0AC]">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="font-fraunces text-lg font-semibold text-[#1B2430] mb-1">
              No programs scheduled
            </h3>
            <p className="text-sm text-[#5B6472] max-w-md mx-auto mb-4">
              {programs.length === 0
                ? 'Your program schedule is currently clear. Click below to add an event, conference, or workshop.'
                : 'No programs match your current search or category filter. Try clearing your filters.'}
            </p>
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1B2430] hover:bg-[#4C5FD5] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule New Program</span>
            </button>
          </div>
        ) : (
          filteredPrograms.map((p) => {
            const daysOffset = daysFromToday(p.date);
            let dayNotice = '';
            if (p.status === 'completed') {
              dayNotice = 'Completed';
            } else if (daysOffset === 0) {
              dayNotice = 'Happening Today! ⚡';
            } else if (daysOffset === 1) {
              dayNotice = 'Tomorrow';
            } else if (daysOffset > 1) {
              dayNotice = `In ${daysOffset} days`;
            } else if (daysOffset < 0) {
              dayNotice = `${Math.abs(daysOffset)} days ago`;
            }

            const isExpanded = expandedId === p.id;

            return (
              <div
                key={p.id}
                id={`program-card-${p.id}`}
                className="bg-white border border-[#DCE1E6] rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md hover:border-[#CBD5E1]"
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : p.id)}
                  className="p-4 sm:p-5 cursor-pointer select-none transition-colors hover:bg-[#FBFBFC]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#EEF1F4] text-[#1B2430]">
                          {p.category}
                        </span>

                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize ${
                            statusBadgeStyles[p.status]
                          }`}
                        >
                          {p.status}
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
                      </div>

                      <h3 className="font-fraunces text-lg sm:text-xl font-semibold text-[#1B2430] leading-snug">
                        {p.title}
                      </h3>

                      {/* Meta chips */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-xs text-[#5B6472]">
                        <span className="inline-flex items-center gap-1 font-mono-code">
                          <Calendar className="w-3.5 h-3.5 text-[#4C5FD5]" />
                          <span>
                            {formatDatePretty(p.date)} ({p.date})
                          </span>
                        </span>

                        <span className="inline-flex items-center gap-1 font-mono-code">
                          <Clock className="w-3.5 h-3.5 text-[#4C5FD5]" />
                          <span>
                            {p.startTime}
                            {p.endTime ? ` - ${p.endTime}` : ''}
                          </span>
                        </span>

                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#E8A33D]" />
                          <span>{p.venue}</span>
                        </span>

                        <span className="inline-flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-[#2F8F82]" />
                          <span>Lead: {p.coordinator}</span>
                        </span>

                        {p.expectedAttendees && (
                          <span className="inline-flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-[#5B6472]" />
                            <span>{p.expectedAttendees} Expected</span>
                          </span>
                        )}

                        {p.budget && (
                          <span className="inline-flex items-center gap-1 font-mono-code text-[#2F8F82] font-semibold">
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>{p.budget}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 sm:gap-2 self-end sm:self-center">
                      <button
                        onClick={(e) => handleCopyProgram(e, p)}
                        className="p-1.5 text-[#93A0AC] hover:text-[#4C5FD5] hover:bg-[#E9EBFA] rounded-lg transition-colors cursor-pointer"
                        title="Copy Program Details for WhatsApp / Email"
                      >
                        {copiedId === p.id ? (
                          <Check className="w-4 h-4 text-[#2F8F82]" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProgram(p);
                        }}
                        className="p-1.5 text-[#93A0AC] hover:text-[#1B2430] hover:bg-[#EEF1F4] rounded-lg transition-colors cursor-pointer"
                        title="Edit Program"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProgram(p.id);
                        }}
                        className="p-1.5 text-[#93A0AC] hover:text-[#D6604D] hover:bg-[#FBE7E3] rounded-lg transition-colors cursor-pointer"
                        title="Delete Program"
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

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-[#DCE1E6] p-4 sm:p-5 bg-[#FAFBFC] space-y-4">
                    {/* Description */}
                    {p.description && (
                      <div>
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-[#5B6472] block mb-1">
                          Description & Event Brief
                        </span>
                        <p className="text-sm text-[#1B2430] leading-relaxed whitespace-pre-line">
                          {p.description}
                        </p>
                      </div>
                    )}

                    {/* Quick Status Bar */}
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-[#5B6472] block mb-1.5">
                        Update Status
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(['upcoming', 'ongoing', 'completed', 'cancelled'] as ProgramStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={() => onUpdateProgramStatus(p.id, st)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize cursor-pointer ${
                              p.status === st
                                ? 'bg-[#1B2430] text-white border-[#1B2430]'
                                : 'bg-white text-[#5B6472] border-[#DCE1E6] hover:bg-[#F3F5F7]'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Agenda Timeline */}
                    <div className="pt-2 border-t border-[#DCE1E6]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-[#1B2430]">
                          Session Agenda Timeline ({p.agendaItems?.length || 0})
                        </span>
                      </div>

                      {p.agendaItems && p.agendaItems.length > 0 ? (
                        <div className="space-y-2 mb-3">
                          {p.agendaItems.map((item, idx) => (
                            <div
                              key={item.id || idx}
                              className="flex items-start gap-3 bg-white p-2.5 rounded-xl border border-[#DCE1E6] text-xs"
                            >
                              <span className="font-mono-code font-semibold text-[#4C5FD5] bg-[#E9EBFA] px-2 py-0.5 rounded shrink-0">
                                {item.time}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-[#1B2430]">
                                  {item.topic}
                                </div>
                                {item.speaker && (
                                  <div className="text-[#5B6472] text-[11px] mt-0.5">
                                    Speaker / Anchor: {item.speaker}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-[#93A0AC] italic py-1">
                          No agenda timeline slots added yet. Use the fields below to add schedule slots.
                        </div>
                      )}

                      {/* Quick Add Agenda Item */}
                      <div className="flex flex-col sm:flex-row gap-2 mt-2">
                        <input
                          type="text"
                          value={inlineTime}
                          onChange={(e) => setInlineTime(e.target.value)}
                          placeholder="Time (e.g. 11:15 AM)"
                          className="w-full sm:w-36 px-2.5 py-1.5 text-xs rounded-lg border border-[#DCE1E6] bg-white text-[#1B2430] focus:outline-none focus:border-[#4C5FD5]"
                        />
                        <input
                          type="text"
                          value={inlineTopic}
                          onChange={(e) => setInlineTopic(e.target.value)}
                          placeholder="Topic / Keynote / Break session..."
                          className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-[#DCE1E6] bg-white text-[#1B2430] focus:outline-none focus:border-[#4C5FD5]"
                        />
                        <input
                          type="text"
                          value={inlineSpeaker}
                          onChange={(e) => setInlineSpeaker(e.target.value)}
                          placeholder="Speaker name (optional)"
                          className="w-full sm:w-44 px-2.5 py-1.5 text-xs rounded-lg border border-[#DCE1E6] bg-white text-[#1B2430] focus:outline-none focus:border-[#4C5FD5]"
                        />
                        <button
                          onClick={() => handleAddInlineAgenda(p.id)}
                          disabled={!inlineTopic.trim()}
                          className="bg-[#4C5FD5] disabled:bg-[#93A0AC]/50 text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer disabled:cursor-not-allowed transition-colors"
                        >
                          Add Slot
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
