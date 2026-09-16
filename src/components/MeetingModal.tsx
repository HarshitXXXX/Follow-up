import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Video, MapPin, User, Users, Link as LinkIcon, AlertCircle, Plus, Trash2, CheckSquare } from 'lucide-react';
import { Meeting, MeetingStatus, MeetingType, MeetingActionItem } from '../types';
import { uid, todayStr } from '../utils/helpers';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meeting: Omit<Meeting, 'id' | 'createdAt'> & { id?: string }) => void;
  initialMeeting: Meeting | null;
}

export const MeetingModal: React.FC<MeetingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialMeeting,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('11:00');
  const [duration, setDuration] = useState('45 mins');
  const [type, setType] = useState<MeetingType>('online');
  const [platformOrVenue, setPlatformOrVenue] = useState('Google Meet');
  const [meetLink, setMeetLink] = useState('');
  const [chairperson, setChairperson] = useState('');
  const [attendees, setAttendees] = useState('');
  const [status, setStatus] = useState<MeetingStatus>('scheduled');
  const [agenda, setAgenda] = useState('');
  const [minutesOfMeeting, setMinutesOfMeeting] = useState('');
  const [actionItems, setActionItems] = useState<MeetingActionItem[]>([]);
  const [newActionText, setNewActionText] = useState('');
  const [newActionAssignee, setNewActionAssignee] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialMeeting) {
      setTitle(initialMeeting.title);
      setDate(initialMeeting.date);
      setTime(initialMeeting.time);
      setDuration(initialMeeting.duration || '45 mins');
      setType(initialMeeting.type);
      setPlatformOrVenue(initialMeeting.platformOrVenue);
      setMeetLink(initialMeeting.meetLink || '');
      setChairperson(initialMeeting.chairperson);
      setAttendees(initialMeeting.attendees || '');
      setStatus(initialMeeting.status);
      setAgenda(initialMeeting.agenda || '');
      setMinutesOfMeeting(initialMeeting.minutesOfMeeting || '');
      setActionItems(initialMeeting.actionItems || []);
    } else {
      setTitle('');
      setDate(todayStr());
      setTime('');
      setDuration('');
      setType('online');
      setPlatformOrVenue('');
      setMeetLink('');
      setChairperson('');
      setAttendees('');
      setStatus('scheduled');
      setAgenda('');
      setMinutesOfMeeting('');
      setActionItems([]);
    }
    setError('');
  }, [initialMeeting, isOpen]);

  if (!isOpen) return null;

  const handleAddActionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionText.trim()) return;
    setActionItems([
      ...actionItems,
      {
        id: uid('act_'),
        text: newActionText.trim(),
        assignee: newActionAssignee.trim() || undefined,
        done: false,
      },
    ]);
    setNewActionText('');
    setNewActionAssignee('');
  };

  const handleRemoveActionItem = (id: string) => {
    setActionItems(actionItems.filter((i) => i.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a meeting title.');
      return;
    }
    if (!date) {
      setError('Please select a meeting date.');
      return;
    }
    if (!platformOrVenue.trim()) {
      setError('Please specify the platform or physical venue.');
      return;
    }

    onSave({
      id: initialMeeting?.id,
      title: title.trim(),
      date,
      time: time.trim() || '',
      duration: duration.trim() || undefined,
      type,
      platformOrVenue: platformOrVenue.trim(),
      meetLink: meetLink.trim() || undefined,
      chairperson: chairperson.trim() || '',
      attendees: attendees.trim() || '',
      status,
      agenda: agenda.trim() || undefined,
      minutesOfMeeting: minutesOfMeeting.trim() || undefined,
      actionItems,
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
            <Video className="w-5 h-5 text-[#4C5FD5]" />
            <h2 className="font-fraunces text-xl font-semibold text-[#1B2430]">
              {initialMeeting ? 'Edit Meeting Details' : 'Schedule New Meeting'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#93A0AC] hover:text-[#1B2430] hover:bg-[#EEF1F4] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="bg-[#FBE7E3] text-[#D6604D] text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Meeting Title */}
          <div>
            <label className="block text-xs font-semibold text-[#1B2430] mb-1">
              Meeting Title *
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

          {/* Date, Time, Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#1B2430] mb-1">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5B6472] mb-1">
                Time
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all"
                />
                <Clock className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#93A0AC]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5B6472] mb-1">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all"
              />
            </div>
          </div>

          {/* Meeting Format & Location/Platform */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#5B6472] mb-1">
                Format
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as MeetingType)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all cursor-pointer"
              >
                <option value="online">Online (Virtual)</option>
                <option value="in-person">In-Person</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1B2430] mb-1">
                Platform / Conference Room *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={platformOrVenue}
                  onChange={(e) => setPlatformOrVenue(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all"
                />
                <MapPin className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#93A0AC]" />
              </div>
            </div>
          </div>

          {/* Link URL (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-[#5B6472] mb-1">
              Meeting URL or Link <span className="text-[#93A0AC] font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={meetLink}
                onChange={(e) => setMeetLink(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all"
              />
              <LinkIcon className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#93A0AC]" />
            </div>
          </div>

          {/* Chairperson & Attendees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#5B6472] mb-1">
                Chairperson / Host
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={chairperson}
                  onChange={(e) => setChairperson(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all"
                />
                <User className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#93A0AC]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5B6472] mb-1">
                Attendees / Department
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all"
                />
                <Users className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#93A0AC]" />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-[#5B6472] mb-1">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {(['scheduled', 'in-progress', 'completed', 'cancelled'] as MeetingStatus[]).map((st) => (
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

          {/* Agenda */}
          <div>
            <label className="block text-xs font-semibold text-[#5B6472] mb-1">
              Agenda Points
            </label>
            <textarea
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] focus:ring-2 focus:ring-[#4C5FD5]/15 transition-all resize-y"
            />
          </div>

          {/* Minutes of Meeting (MoM) */}
          <div>
            <label className="block text-xs font-semibold text-[#4C5FD5] mb-1">
              Minutes of Meeting (MoM) / Key Takeaways
            </label>
            <textarea
              value={minutesOfMeeting}
              onChange={(e) => setMinutesOfMeeting(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl border border-[#4C5FD5]/30 bg-[#E9EBFA]/30 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] focus:ring-2 focus:ring-[#4C5FD5]/15 transition-all resize-y"
            />
          </div>

          {/* Action Items */}
          <div className="pt-2 border-t border-[#DCE1E6]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#1B2430]">
                Action Items ({actionItems.length})
              </span>
            </div>

            {actionItems.length > 0 && (
              <div className="space-y-1.5 mb-3 max-h-36 overflow-y-auto pr-1">
                {actionItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#F3F5F7] border border-[#DCE1E6] text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium text-[#1B2430] truncate">
                        • {item.text}
                      </span>
                      {item.assignee && (
                        <span className="text-[#4C5FD5] font-semibold text-[11px] truncate">
                          ({item.assignee})
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveActionItem(item.id)}
                      className="text-[#93A0AC] hover:text-[#D6604D] p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Action Item Sub-form */}
            <div className="flex flex-col sm:flex-row gap-2 bg-[#FAFBFC] p-2.5 rounded-xl border border-[#DCE1E6]">
              <input
                type="text"
                value={newActionText}
                onChange={(e) => setNewActionText(e.target.value)}
                className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-[#DCE1E6] bg-white text-[#1B2430] focus:outline-none focus:border-[#4C5FD5]"
              />
              <input
                type="text"
                value={newActionAssignee}
                onChange={(e) => setNewActionAssignee(e.target.value)}
                className="w-full sm:w-40 px-2.5 py-1.5 text-xs rounded-lg border border-[#DCE1E6] bg-white text-[#1B2430] focus:outline-none focus:border-[#4C5FD5]"
              />
              <button
                type="button"
                onClick={handleAddActionItem}
                disabled={!newActionText.trim()}
                className="bg-[#4C5FD5] disabled:bg-[#93A0AC]/50 text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer disabled:cursor-not-allowed transition-colors shrink-0"
              >
                Add
              </button>
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
              {initialMeeting ? 'Save Meeting Changes' : 'Schedule Meeting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
