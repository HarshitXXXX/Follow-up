import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Calendar,
  User,
  MapPin,
  AlertCircle,
  CheckSquare,
  MessageSquare,
  Paperclip,
  UploadCloud,
  FileText,
  FileSpreadsheet,
  FileImage,
  FileArchive,
  File,
  Trash2,
  Download,
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus, TaskAttachment } from '../types';
import { uid, formatFileSize } from '../utils/helpers';

const getAttachmentIcon = (fileName: string, mimeType?: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (['pdf'].includes(ext) || mimeType?.includes('pdf')) {
    return <FileText className="w-4 h-4 text-[#D6604D]" />;
  }
  if (['doc', 'docx', 'odt', 'rtf', 'txt', 'md'].includes(ext) || mimeType?.includes('word') || mimeType?.startsWith('text/')) {
    return <FileText className="w-4 h-4 text-[#4C5FD5]" />;
  }
  if (['xls', 'xlsx', 'csv'].includes(ext) || mimeType?.includes('sheet') || mimeType?.includes('csv')) {
    return <FileSpreadsheet className="w-4 h-4 text-[#2F8F82]" />;
  }
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext) || mimeType?.startsWith('image/')) {
    return <FileImage className="w-4 h-4 text-[#E8A33D]" />;
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return <FileArchive className="w-4 h-4 text-[#7E69AB]" />;
  }
  return <File className="w-4 h-4 text-[#5B6472]" />;
};

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
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setAttachments(initialTask.attachments || []);
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
      setAttachments([]);
    }
    setError('');
    setUploadError('');
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const processFiles = (files: FileList | File[]) => {
    setUploadError('');
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    fileArray.forEach((file) => {
      // 10MB limit per file
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`"${file.name}" exceeds the 10MB limit. Please upload a smaller file.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newAttachment: TaskAttachment = {
          id: uid('att_'),
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          dataUrl,
          uploadedAt: new Date().toISOString(),
        };
        setAttachments((prev) => [...prev, newAttachment]);
      };
      reader.onerror = () => {
        setUploadError(`Failed to read "${file.name}". Please try again.`);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveAttachment = (attId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attId));
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
      attachments: attachments.length > 0 ? attachments : undefined,
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
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl border border-[#4C5FD5]/30 bg-[#E9EBFA]/30 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] focus:ring-2 focus:ring-[#4C5FD5]/15 transition-all resize-y"
              />
            </div>
          )}

          {/* Document & File Upload Section */}
          <div className="pt-2 border-t border-[#DCE1E6]">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#1B2430] flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-[#4C5FD5]" />
                <span>Upload Documents & Files</span>
                <span className="text-[#93A0AC] font-normal text-[11px]">(Optional)</span>
              </label>
              {attachments.length > 0 && (
                <span className="text-[11px] font-semibold text-[#4C5FD5] bg-[#E9EBFA] px-2 py-0.5 rounded-full">
                  {attachments.length} {attachments.length === 1 ? 'file' : 'files'}
                </span>
              )}
            </div>

            {/* Drag & Drop Zone + Click to Select */}
            <div
              id="task-file-upload-dropzone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-[#4C5FD5] bg-[#E9EBFA]/70 scale-[1.01]'
                  : 'border-[#DCE1E6] bg-[#FAFBFC] hover:bg-[#F3F5F7] hover:border-[#4C5FD5]/60'
              }`}
            >
              <input
                id="task-file-input"
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                <div className="w-9 h-9 rounded-full bg-[#E9EBFA] text-[#4C5FD5] flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1B2430]">
                    Click to browse or drag & drop files here
                  </p>
                  <p className="text-[11px] text-[#5B6472] mt-0.5">
                    Upload any document (PDF, Word, Excel, Images, CSV, Text, Scans up to 10MB)
                  </p>
                </div>
              </div>
            </div>

            {uploadError && (
              <p className="text-[11px] text-[#D6604D] mt-1.5 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{uploadError}</span>
              </p>
            )}

            {/* List of Attached Files */}
            {attachments.length > 0 && (
              <div className="mt-3 space-y-2 max-h-40 overflow-y-auto pr-1">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    id={`task-attachment-item-${att.id}`}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-[#DCE1E6] text-xs shadow-2xs hover:border-[#CBD5E1] transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 rounded-lg bg-[#F3F5F7] shrink-0">
                        {getAttachmentIcon(att.name, att.type)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#1B2430] truncate max-w-[220px] sm:max-w-xs" title={att.name}>
                          {att.name}
                        </p>
                        <p className="text-[10px] text-[#93A0AC]">
                          {formatFileSize(att.size)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {att.dataUrl && (
                        <button
                          id={`task-download-attachment-${att.id}`}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadAttachment(att);
                          }}
                          className="p-1.5 text-[#5B6472] hover:text-[#4C5FD5] hover:bg-[#E9EBFA] rounded-lg transition-colors cursor-pointer"
                          title="Download / View document"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        id={`task-remove-attachment-${att.id}`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveAttachment(att.id);
                        }}
                        className="p-1.5 text-[#93A0AC] hover:text-[#D6604D] hover:bg-[#FBE7E3] rounded-lg transition-colors cursor-pointer"
                        title="Remove document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              {initialTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
