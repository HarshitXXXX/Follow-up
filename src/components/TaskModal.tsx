import React, { useState, useEffect } from 'react';
import { X, Calendar, User, MapPin, AlertCircle, CheckSquare, MessageSquare } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'notes'> & { id?: string }) => void;
  initialTask?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
}) => {
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [assignee, setAssignee] = useState('');
  const [due, setDue] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [remark, setRemark] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTask) {
      setName(initialTask.name || '');
      setVillage(initialTask.village || '');
      setTitle(initialTask.title || '');
      setDesc(initialTask.desc || '');
      setAssignee(initialTask.assignee || '');
      setDue(initialTask.due || '');
      setPriority(initialTask.priority || 'medium');
      setRemark(initialTask.remark || '');
      setStatus(initialTask.status || 'pending');
    } else {
      setName('');
      setVillage('');
      setTitle('');
      setDesc('');
      setAssignee('');
      setDue('');
      setPriority('medium');
      setRemark('');
      setStatus('pending');
    }
    setError('');
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter the task title / work description.');
      return;
    }

    onSave({
      id: initialTask?.id,
      name: name.trim() || undefined,
      village: village.trim() || undefined,
      title: title.trim(),
      desc: desc.trim() || undefined,
      assignee: assignee.trim() || undefined,
      due: due || undefined,
      priority,
      remark: remark.trim() || undefined,
      status,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B2430]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-[#DCE1E6] overflow-hidden z-10 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCE1E6] bg-[#FAFBFC]">
          <div>
            <h2 className="font-fraunces text-xl font-semibold text-[#1B2430]">
              {initialTask ? 'Edit Task' : 'Add New Task'}
            </h2>
            <p className="text-xs text-[#5B6472] mt-0.5">
              Record task details with citizen/person, village location, and assignees
            </p>
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

          {/* 1. Name & 2. Village */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#1B2430] mb-1">
                Name
              </label>
              <div className="relative">
                <input
                  id="task-input-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g. Ramesh Patil, Sunita..."
                  className="w-full pl-8.5 pr-3 py-2.5 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] focus:ring-2 focus:ring-[#4C5FD5]/15 transition-all"
                />
                <User className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#93A0AC]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1B2430] mb-1">
                Village
              </label>
              <div className="relative">
                <input
                  id="task-input-village"
                  type="text"
                  value={village}
                  onChange={(e) => {
                    setVillage(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g. Rampur, Shivajinagar, Khed..."
                  className="w-full pl-8.5 pr-3 py-2.5 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] focus:ring-2 focus:ring-[#4C5FD5]/15 transition-all"
                />
                <MapPin className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#93A0AC]" />
              </div>
            </div>
          </div>

          {/* 3. Task */}
          <div>
            <label className="block text-xs font-semibold text-[#1B2430] mb-1">
              Task *
            </label>
            <div className="relative">
              <input
                id="task-input-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Road repair survey, pipeline inspection, ration card verify..."
                autoFocus
                className="w-full pl-8.5 pr-3 py-2.5 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] focus:ring-2 focus:ring-[#4C5FD5]/15 transition-all"
              />
              <CheckSquare className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#93A0AC]" />
            </div>
          </div>

          {/* 4. Description */}
          <div>
            <label className="block text-xs font-semibold text-[#5B6472] mb-1">
              Description <span className="text-[#93A0AC] font-normal">(Optional context & scope)</span>
            </label>
            <textarea
              id="task-input-desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Brief details or bullet points about this assignment or request..."
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] focus:ring-2 focus:ring-[#4C5FD5]/15 transition-all resize-y"
            />
          </div>

          {/* 5. Assign Person & 6. Deadline Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#5B6472] mb-1">
                Assign Person
              </label>
              <div className="relative">
                <input
                  id="task-input-assignee"
                  type="text"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  placeholder="e.g. Alex Morgan, Ramesh Shinde..."
                  className="w-full pl-8.5 pr-3 py-2 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all"
                />
                <User className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#93A0AC]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5B6472] mb-1">
                Deadline Date
              </label>
              <div className="relative">
                <input
                  id="task-input-deadline"
                  type="date"
                  value={due}
                  onChange={(e) => setDue(e.target.value)}
                  className="w-full pl-8.5 pr-3 py-2 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all"
                />
                <Calendar className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#93A0AC] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* 7. Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#5B6472] mb-1">
                Priority
              </label>
              <select
                id="task-input-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all cursor-pointer"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            {/* Optional Status if editing, or Remark */}
            {initialTask ? (
              <div>
                <label className="block text-xs font-semibold text-[#5B6472] mb-1">
                  Status
                </label>
                <select
                  id="task-input-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-[#4C5FD5] mb-1">
                  Remark <span className="text-[#93A0AC] font-normal">(Optional status note)</span>
                </label>
                <div className="relative">
                  <input
                    id="task-input-remark"
                    type="text"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="e.g. Waiting for approval..."
                    className="w-full pl-8.5 pr-3 py-2 rounded-xl border border-[#4C5FD5]/30 bg-[#E9EBFA]/30 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all"
                  />
                  <MessageSquare className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#4C5FD5]" />
                </div>
              </div>
            )}
          </div>

          {/* Remark when editing */}
          {initialTask && (
            <div>
              <label className="block text-xs font-semibold text-[#4C5FD5] mb-1">
                Remark / Latest Status Update
              </label>
              <textarea
                id="task-input-remark-edit"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="e.g. Field visit done, awaiting final signoff..."
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl border border-[#4C5FD5]/30 bg-[#E9EBFA]/30 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] focus:ring-2 focus:ring-[#4C5FD5]/15 transition-all resize-y"
              />
            </div>
          )}

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
              {initialTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
