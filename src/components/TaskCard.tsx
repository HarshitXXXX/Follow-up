import React, { useState } from 'react';
import {
  Calendar,
  User,
  MapPin,
  Folder,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Check,
  Paperclip,
  Download,
  FileText,
  FileSpreadsheet,
  FileImage,
  FileArchive,
  File,
} from 'lucide-react';
import { Task, TaskStatus, EffectiveStatus, TaskAttachment } from '../types';
import { getEffectiveStatus, statusLabel, formatFileSize } from '../utils/helpers';

const getAttachmentIcon = (fileName: string, mimeType?: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (['pdf'].includes(ext) || mimeType?.includes('pdf')) {
    return <FileText className="w-3.5 h-3.5 text-[#D6604D]" />;
  }
  if (['doc', 'docx', 'odt', 'rtf', 'txt', 'md'].includes(ext) || mimeType?.includes('word') || mimeType?.startsWith('text/')) {
    return <FileText className="w-3.5 h-3.5 text-[#4C5FD5]" />;
  }
  if (['xls', 'xlsx', 'csv'].includes(ext) || mimeType?.includes('sheet') || mimeType?.includes('csv')) {
    return <FileSpreadsheet className="w-3.5 h-3.5 text-[#2F8F82]" />;
  }
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext) || mimeType?.startsWith('image/')) {
    return <FileImage className="w-3.5 h-3.5 text-[#E8A33D]" />;
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return <FileArchive className="w-3.5 h-3.5 text-[#7E69AB]" />;
  }
  return <File className="w-3.5 h-3.5 text-[#5B6472]" />;
};

interface TaskCardProps {
  task: Task;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: TaskStatus) => void;
  onAddNote: (text: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onStatusChange,
  onAddNote,
  onDeleteNote,
}) => {
  const [noteInput, setNoteInput] = useState('');
  const [copied, setCopied] = useState(false);
  const effectiveStatus = getEffectiveStatus(task);

  const stripColors: Record<EffectiveStatus, string> = {
    pending: 'bg-[#E8A33D]',
    progress: 'bg-[#4C5FD5]',
    done: 'bg-[#2F8F82]',
    overdue: 'bg-[#D6604D]',
  };

  const badgeStyles: Record<EffectiveStatus, string> = {
    pending: 'bg-[#FCF1DF] text-[#9A6B1E] border border-[#E8A33D]/20',
    progress: 'bg-[#E9EBFA] text-[#4C5FD5] border border-[#4C5FD5]/20',
    done: 'bg-[#E4F2F0] text-[#2F8F82] border border-[#2F8F82]/20',
    overdue: 'bg-[#FBE7E3] text-[#D6604D] border border-[#D6604D]/20',
  };

  const priorityDots: Record<string, string> = {
    high: 'bg-[#D6604D]',
    medium: 'bg-[#E8A33D]',
    low: 'bg-[#93A0AC]',
  };

  const handleAddNoteSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!noteInput.trim()) return;
    onAddNote(noteInput.trim());
    setNoteInput('');
  };

  const handleCopySummary = (e: React.MouseEvent) => {
    e.stopPropagation();
    const lines = [
      `📌 *Task:* ${task.title}`,
      task.name ? `👤 *Name:* ${task.name}` : null,
      task.village ? `📍 *Village:* ${task.village}` : null,
      task.desc ? `📝 *Description:* ${task.desc}` : null,
      `👥 *Assign Person:* ${task.assignee || 'Unassigned'}`,
      `📅 *Deadline Date:* ${task.due || 'No deadline'}`,
      `⚡ *Priority:* ${task.priority.toUpperCase()}`,
      `📊 *Status:* ${effectiveStatus.toUpperCase()}`,
      task.remark ? `💬 *Remark:* ${task.remark}` : null,
      task.attachments && task.attachments.length > 0 ? `📎 *Attachments:* ${task.attachments.length} file(s)` : null,
    ].filter(Boolean);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const handleDownloadAttachment = (att: TaskAttachment) => {
    if (!att.dataUrl) return;
    const link = document.createElement('a');
    link.href = att.dataUrl;
    link.download = att.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      id={`task-card-${task.id}`}
      className="bg-white border border-[#DCE1E6] rounded-2xl flex overflow-hidden transition-all duration-200 hover:shadow-md hover:border-[#CBD5E1]"
    >
      {/* Status vertical color strip */}
      <div className={`w-1.5 shrink-0 ${stripColors[effectiveStatus]}`} />

      <div className="flex-1 min-w-0">
        {/* Main Card Header */}
        <div
          onClick={onToggleExpand}
          className="p-4 sm:p-5 cursor-pointer select-none transition-colors hover:bg-[#FBFBFC]"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(task.status === 'done' ? 'pending' : 'done');
                  }}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                    task.status === 'done'
                      ? 'bg-[#2F8F82] border-[#2F8F82] text-white'
                      : 'border-[#CBD5E1] hover:border-[#4C5FD5] text-transparent'
                  }`}
                  title={task.status === 'done' ? 'Mark Pending' : 'Mark Done'}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>

                <h3
                  className={`font-fraunces text-base sm:text-lg font-semibold leading-snug tracking-tight text-[#1B2430] ${
                    task.status === 'done' ? 'line-through text-[#93A0AC]' : ''
                  }`}
                >
                  {task.title}
                </h3>
              </div>

              {/* Meta Tags */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2.5 text-xs text-[#5B6472]">
                {task.name && (
                  <span className="inline-flex items-center gap-1 bg-[#EEF1F4] text-[#1B2430] px-2 py-0.5 rounded-md font-semibold">
                    <User className="w-3 h-3 text-[#4C5FD5]" />
                    <span>{task.name}</span>
                  </span>
                )}

                {task.village && (
                  <span className="inline-flex items-center gap-1 bg-[#E4F2F0] text-[#1F6E64] px-2 py-0.5 rounded-md font-medium">
                    <MapPin className="w-3 h-3 text-[#2F8F82]" />
                    <span>{task.village}</span>
                  </span>
                )}

                {task.assignee && (
                  <span className="inline-flex items-center gap-1 bg-[#F3F5F7] px-2 py-0.5 rounded-md font-medium">
                    <User className="w-3 h-3 text-[#5B6472]" />
                    <span>Assign: {task.assignee}</span>
                  </span>
                )}

                {task.project && (
                  <span className="inline-flex items-center gap-1 bg-[#F3F5F7] px-2 py-0.5 rounded-md font-medium">
                    <Folder className="w-3 h-3 text-[#5B6472]" />
                    <span>{task.project}</span>
                  </span>
                )}

                <span className="inline-flex items-center gap-1.5 font-medium capitalize">
                  <span
                    className={`w-2 h-2 rounded-full ${priorityDots[task.priority]}`}
                  />
                  <span>{task.priority} Priority</span>
                </span>

                {task.due && (
                  <span
                    className={`inline-flex items-center gap-1 font-mono-code ${
                      effectiveStatus === 'overdue'
                        ? 'text-[#D6604D] font-semibold bg-[#FBE7E3] px-2 py-0.5 rounded-md'
                        : ''
                    }`}
                  >
                    <Calendar className="w-3 h-3" />
                    <span>Deadline: {task.due}</span>
                    {effectiveStatus === 'overdue' && (
                      <span className="text-[10px] uppercase font-sans font-bold">
                        (Late!)
                      </span>
                    )}
                  </span>
                )}

                {task.notes && task.notes.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-[#4C5FD5]">
                    <MessageSquare className="w-3 h-3" />
                    <span>{task.notes.length} notes</span>
                  </span>
                )}

                {task.attachments && task.attachments.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-[#4C5FD5] bg-[#E9EBFA] px-2 py-0.5 rounded-md font-medium">
                    <Paperclip className="w-3 h-3" />
                    <span>{task.attachments.length} {task.attachments.length === 1 ? 'doc' : 'docs'}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Right Side: Status badge, Action buttons, Chevron */}
            <div className="flex items-center gap-1 sm:gap-2 self-end sm:self-center">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${badgeStyles[effectiveStatus]}`}
              >
                {statusLabel(effectiveStatus)}
              </span>

              <button
                onClick={handleCopySummary}
                className="p-1.5 text-[#93A0AC] hover:text-[#4C5FD5] hover:bg-[#E9EBFA] rounded-lg transition-colors cursor-pointer"
                title="Copy Task Summary"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-[#2F8F82]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-1.5 text-[#93A0AC] hover:text-[#1B2430] hover:bg-[#EEF1F4] rounded-lg transition-colors cursor-pointer"
                title="Edit Task"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1.5 text-[#93A0AC] hover:text-[#D6604D] hover:bg-[#FBE7E3] rounded-lg transition-colors cursor-pointer"
                title="Delete Task"
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

        {/* Expandable Detail Panel */}
        {isExpanded && (
          <div className="border-t border-[#DCE1E6] p-4 sm:p-5 bg-[#FAFBFC] space-y-4">
            {/* Primary Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-[#DCE1E6]">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#93A0AC] block">
                  Name
                </span>
                <span className="text-xs font-semibold text-[#1B2430]">
                  {task.name || '—'}
                </span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#93A0AC] block">
                  Village
                </span>
                <span className="text-xs font-semibold text-[#1B2430]">
                  {task.village || '—'}
                </span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#93A0AC] block">
                  Assign Person
                </span>
                <span className="text-xs font-semibold text-[#1B2430]">
                  {task.assignee || 'Unassigned'}
                </span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#93A0AC] block">
                  Deadline Date
                </span>
                <span className="text-xs font-semibold text-[#1B2430] font-mono-code">
                  {task.due || 'No deadline'}
                </span>
              </div>
            </div>

            {/* Description */}
            {task.desc && (
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#5B6472] block mb-1">
                  Description
                </span>
                <p className="text-sm text-[#1B2430] leading-relaxed whitespace-pre-line">
                  {task.desc}
                </p>
              </div>
            )}

            {/* Remark Box */}
            {task.remark && (
              <div className="bg-[#E9EBFA] border border-[#4C5FD5]/20 rounded-xl p-3.5">
                <span className="block text-[11px] font-bold text-[#4C5FD5] uppercase tracking-wide mb-1">
                  Remark (Latest Update / Current Status)
                </span>
                <p className="text-sm text-[#1B2430] leading-relaxed whitespace-pre-line">
                  {task.remark}
                </p>
              </div>
            )}

            {/* Quick Status Toggles */}
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#5B6472] block mb-1.5">
                Quick Status Change
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onStatusChange('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    task.status === 'pending'
                      ? 'bg-[#FCF1DF] text-[#9A6B1E] border-[#E8A33D] ring-2 ring-[#E8A33D]/20'
                      : 'bg-white text-[#5B6472] border-[#DCE1E6] hover:bg-[#F3F5F7]'
                  }`}
                >
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange('progress')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    task.status === 'progress'
                      ? 'bg-[#E9EBFA] text-[#4C5FD5] border-[#4C5FD5] ring-2 ring-[#4C5FD5]/20'
                      : 'bg-white text-[#5B6472] border-[#DCE1E6] hover:bg-[#F3F5F7]'
                  }`}
                >
                  In Progress
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange('done')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    task.status === 'done'
                      ? 'bg-[#E4F2F0] text-[#2F8F82] border-[#2F8F82] ring-2 ring-[#2F8F82]/20'
                      : 'bg-white text-[#5B6472] border-[#DCE1E6] hover:bg-[#F3F5F7]'
                  }`}
                >
                  Done
                </button>
              </div>
            </div>

            {/* Attached Documents & Files */}
            {task.attachments && task.attachments.length > 0 && (
              <div className="bg-white p-3.5 rounded-xl border border-[#DCE1E6]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#5B6472] flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-[#4C5FD5]" />
                    <span>Attached Documents & Files ({task.attachments.length})</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {task.attachments.map((att) => (
                    <div
                      key={att.id}
                      id={`task-card-attachment-${att.id}`}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#FAFBFC] border border-[#DCE1E6] hover:border-[#CBD5E1] transition-all"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-1 rounded bg-white border border-[#DCE1E6] shrink-0">
                          {getAttachmentIcon(att.name, att.type)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#1B2430] truncate max-w-[160px] sm:max-w-[200px]" title={att.name}>
                            {att.name}
                          </p>
                          <p className="text-[10px] text-[#93A0AC]">
                            {formatFileSize(att.size)}
                          </p>
                        </div>
                      </div>
                      {att.dataUrl && (
                        <button
                          id={`download-attachment-btn-${att.id}`}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadAttachment(att);
                          }}
                          className="p-1.5 text-[#5B6472] hover:text-[#4C5FD5] hover:bg-[#E9EBFA] rounded-md transition-colors cursor-pointer shrink-0 ml-1"
                          title="Download document"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Follow-up Notes Section */}
            <div className="pt-2 border-t border-[#DCE1E6]/80">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-[#1B2430]">
                  Follow-up History (Notes)
                </span>
                <span className="text-[11px] text-[#93A0AC] font-mono-code">
                  {task.notes?.length || 0} notes
                </span>
              </div>

              {/* Notes List */}
              <div className="space-y-2 mb-3 max-h-48 overflow-y-auto pr-1">
                {task.notes && task.notes.length > 0 ? (
                  task.notes.map((note) => (
                    <div
                      key={note.id}
                      className="group bg-white border border-[#DCE1E6] rounded-xl p-2.5 text-xs text-[#1B2430] relative flex items-start justify-between gap-2"
                    >
                      <div>
                        <span className="font-mono-code text-[10.5px] text-[#93A0AC] block mb-0.5">
                          {note.date}
                        </span>
                        <p className="leading-relaxed text-[#1B2430]">
                          {note.text}
                        </p>
                      </div>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 text-[#93A0AC] hover:text-[#D6604D] p-1 rounded transition-opacity cursor-pointer"
                        title="Delete Note"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-[#93A0AC] italic py-1">
                    No follow-up notes yet. Record progress or customer remarks below.
                  </div>
                )}
              </div>

              {/* Add Note Input Form */}
              <form onSubmit={handleAddNoteSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Add a follow-up note..."
                  className="flex-1 px-3 py-2 rounded-xl border border-[#DCE1E6] bg-white text-xs text-[#1B2430] placeholder-[#93A0AC] focus:outline-none focus:border-[#4C5FD5] focus:ring-1 focus:ring-[#4C5FD5]"
                />
                <button
                  type="submit"
                  disabled={!noteInput.trim()}
                  className="bg-[#4C5FD5] hover:bg-[#3F51B5] disabled:bg-[#93A0AC]/50 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  Add Note
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
