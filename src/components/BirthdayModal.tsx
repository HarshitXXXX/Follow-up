import React, { useState } from 'react';
import { X, Cake, AlertCircle } from 'lucide-react';
import { Birthday } from '../types';

interface BirthdayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (birthdayData: Omit<Birthday, 'id'>) => void;
}

export const BirthdayModal: React.FC<BirthdayModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [dept, setDept] = useState('');
  const [position, setPosition] = useState('');
  const [village, setVillage] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) {
      setError('Please provide both a name and a birth date.');
      return;
    }

    onSave({
      name: name.trim(),
      date,
      dept: dept.trim() || undefined,
      position: position.trim() || undefined,
      village: village.trim() || undefined,
    });

    setName('');
    setDate('');
    setDept('');
    setPosition('');
    setVillage('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B2430]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#DCE1E6] overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCE1E6] bg-[#FAFBFC]">
          <div className="flex items-center gap-2">
            <Cake className="w-5 h-5 text-[#E8A33D]" />
            <h2 className="font-fraunces text-xl font-semibold text-[#1B2430]">
              Add Birthday
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-[#FBE7E3] text-[#D6604D] text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-[#1B2430] mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Sarah Jenkins, David Miller..."
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] focus:ring-2 focus:ring-[#4C5FD5]/15 transition-all"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-[#1B2430] mb-1">
              Birth Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all"
            />
          </div>

          {/* Department & Position */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#5B6472] mb-1">
                Department
              </label>
              <input
                type="text"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                placeholder="e.g. Sales, Marketing"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5B6472] mb-1">
                Role / Title
              </label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. Director, Manager"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all"
              />
            </div>
          </div>

          {/* Village / City */}
          <div>
            <label className="block text-xs font-semibold text-[#5B6472] mb-1">
              City / Location
            </label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="e.g. New York, Chicago, London"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all"
            />
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
              Save Birthday
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
