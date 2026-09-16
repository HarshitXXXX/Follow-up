import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { Program, ProgramStatus, ProgramAgendaItem } from '../types';
import { uid, todayStr } from '../utils/helpers';

interface ProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (program: Omit<Program, 'id' | 'createdAt'> & { id?: string }) => void;
  initialProgram: Program | null;
}

const CATEGORIES = [
  'Conference',
  'Workshop',
  'Training',
  'Seminar',
  'Community Outreach',
  'Cultural Event',
  'Annual Meet',
  'Webinar',
  'General',
];

export const ProgramModal: React.FC<ProgramModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProgram,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Workshop');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:30');
  const [endTime, setEndTime] = useState('17:00');
  const [venue, setVenue] = useState('');
  const [coordinator, setCoordinator] = useState('');
  const [status, setStatus] = useState<ProgramStatus>('upcoming');
  const [description, setDescription] = useState('');
  const [agendaItems, setAgendaItems] = useState<ProgramAgendaItem[]>([]);
  const [newAgendaTime, setNewAgendaTime] = useState('');
  const [newAgendaTopic, setNewAgendaTopic] = useState('');
  const [newAgendaSpeaker, setNewAgendaSpeaker] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialProgram) {
      setTitle(initialProgram.title);
      setCategory(initialProgram.category || 'Workshop');
      setDate(initialProgram.date);
      setStartTime(initialProgram.startTime || '');
      setEndTime(initialProgram.endTime || '');
      setVenue(initialProgram.venue);
      setCoordinator(initialProgram.coordinator);
      setStatus(initialProgram.status);
      setDescription(initialProgram.description || '');
      setAgendaItems(initialProgram.agendaItems || []);
    } else {
      setTitle('');
      setCategory('Workshop');
      setDate(todayStr());
      setStartTime('');
      setEndTime('');
      setVenue('');
      setCoordinator('');
      setStatus('upcoming');
      setDescription('');
      setAgendaItems([]);
    }
    setError('');
  }, [initialProgram, isOpen]);

  if (!isOpen) return null;

  const handleAddAgendaItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgendaTopic.trim()) return;
    setAgendaItems([
      ...agendaItems,
      {
        id: uid('ag_'),
        time: newAgendaTime.trim() || 'TBD',
        topic: newAgendaTopic.trim(),
        speaker: newAgendaSpeaker.trim() || undefined,
      },
    ]);
    setNewAgendaTime('');
    setNewAgendaTopic('');
    setNewAgendaSpeaker('');
  };

  const handleRemoveAgendaItem = (id: string) => {
    setAgendaItems(agendaItems.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a program title.');
      return;
    }
    if (!date) {
      setError('Please provide a date for the program.');
      return;
    }
    if (!venue.trim()) {
      setError('Please specify the venue or location.');
      return;
    }

    onSave({
      id: initialProgram?.id,
      title: title.trim(),
      category: category.trim() || 'General',
      date,
      startTime: startTime.trim() || '10:00',
      endTime: endTime.trim() || undefined,
      venue: venue.trim(),
      coordinator: coordinator.trim() || 'Unassigned',
      status,
      description: description.trim() || undefined,
      agendaItems,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B2430]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-[#DCE1E6] overflow-hidden z-10 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCE1E6] bg-[#FAFBFC]">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#4C5FD5]" />
            <h2 className="font-fraunces text-xl font-semibold text-[#1B2430]">
              {initialProgram ? 'Edit Program Schedule' : 'Schedule New Program'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#93A0AC] hover:text-[#1B2430] hover:bg-[#EEF1F4] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="bg-[#FBE7E3] text-[#D6604D] text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Program Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1B2430] mb-1">
                Program Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] focus:ring-2 focus:ring-[#4C5FD5]/15 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5B6472] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date, Start Time, End Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#1B2430] mb-1">
                Event Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5B6472] mb-1">
                Start Time
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all"
                />
                <Clock className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#93A0AC]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5B6472] mb-1">
                End Time (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all"
                />
                <Clock className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#93A0AC]" />
              </div>
            </div>
          </div>

          {/* Venue & Coordinator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#1B2430] mb-1">
                Venue / Hall / Location *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all"
                />
                <MapPin className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#93A0AC]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5B6472] mb-1">
                Event Lead / Coordinator
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={coordinator}
                  onChange={(e) => setCoordinator(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all"
                />
                <User className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#93A0AC]" />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-[#5B6472] mb-1">
              Program Status
            </label>
            <div className="flex flex-wrap gap-2">
              {(['upcoming', 'ongoing', 'completed', 'cancelled'] as ProgramStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all capitalize cursor-pointer ${
                    status === st
                      ? 'bg-[#1B2430] text-white border-[#1B2430]'
                      : 'bg-white text-[#5B6472] border-[#DCE1E6] hover:bg-[#F3F5F7]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#5B6472] mb-1">
              Description & Objectives
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] focus:ring-2 focus:ring-[#4C5FD5]/15 transition-all resize-y"
            />
          </div>

          {/* Agenda Timeline Items */}
          <div className="pt-2 border-t border-[#DCE1E6]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#1B2430]">
                Program Schedule & Agenda Breakdown ({agendaItems.length})
              </span>
            </div>

            {agendaItems.length > 0 && (
              <div className="space-y-2 mb-3 max-h-40 overflow-y-auto pr-1">
                {agendaItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#F3F5F7] border border-[#DCE1E6] text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono-code font-semibold text-[#4C5FD5] bg-white px-2 py-0.5 rounded border border-[#DCE1E6]">
                        {item.time}
                      </span>
                      <span className="font-medium text-[#1B2430] truncate">
                        {item.topic}
                      </span>
                      {item.speaker && (
                        <span className="text-[#5B6472] text-[11px] truncate">
                          ({item.speaker})
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAgendaItem(item.id)}
                      className="text-[#93A0AC] hover:text-[#D6604D] p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Agenda Item inline sub-form */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-[#FAFBFC] p-3 rounded-xl border border-[#DCE1E6]">
              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={newAgendaTime}
                  onChange={(e) => setNewAgendaTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#DCE1E6] bg-white text-[#1B2430] focus:outline-none focus:border-[#4C5FD5]"
                />
              </div>
              <div className="sm:col-span-5">
                <input
                  type="text"
                  value={newAgendaTopic}
                  onChange={(e) => setNewAgendaTopic(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#DCE1E6] bg-white text-[#1B2430] focus:outline-none focus:border-[#4C5FD5]"
                />
              </div>
              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={newAgendaSpeaker}
                  onChange={(e) => setNewAgendaSpeaker(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#DCE1E6] bg-white text-[#1B2430] focus:outline-none focus:border-[#4C5FD5]"
                />
              </div>
              <div className="sm:col-span-1 flex items-center">
                <button
                  type="button"
                  onClick={handleAddAgendaItem}
                  disabled={!newAgendaTopic.trim()}
                  className="w-full h-full min-h-[30px] bg-[#4C5FD5] disabled:bg-[#93A0AC]/50 text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
                  title="Add Agenda Item"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#DCE1E6]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#5B6472] hover:text-[#1B2430] hover:bg-[#EEF1F4] rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#1B2430] hover:bg-[#4C5FD5] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-98 cursor-pointer"
            >
              {initialProgram ? 'Save Program Changes' : 'Schedule Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
