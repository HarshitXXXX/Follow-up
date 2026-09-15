import React, { useState } from 'react';
import { Cake, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Birthday } from '../types';

interface StandaloneBirthdayAddProps {
  onSaveBirthday: (bday: Omit<Birthday, 'id'>) => void;
  onGoToDashboard: () => void;
}

export const StandaloneBirthdayAdd: React.FC<StandaloneBirthdayAddProps> = ({
  onSaveBirthday,
  onGoToDashboard,
}) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [dept, setDept] = useState('');
  const [position, setPosition] = useState('');
  const [village, setVillage] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) {
      setStatusMsg({
        type: 'error',
        text: 'Please provide both your name and birth date.',
      });
      return;
    }

    onSaveBirthday({
      name: name.trim(),
      date,
      dept: dept.trim() || undefined,
      position: position.trim() || undefined,
      village: village.trim() || undefined,
    });

    setStatusMsg({
      type: 'success',
      text: `🎉 Birthday for ${name.trim()} successfully saved!`,
    });

    setName('');
    setDate('');
    setDept('');
    setPosition('');
    setVillage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#EEF1F4] via-[#FCF1DF]/40 to-[#E9EBFA]">
      <div className="w-full max-w-md bg-white border border-[#DCE1E6] rounded-3xl p-6 sm:p-8 shadow-xl relative">
        <button
          onClick={onGoToDashboard}
          className="absolute top-5 left-5 text-xs text-[#5B6472] hover:text-[#1B2430] flex items-center gap-1 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>

        <div className="text-center mt-2 mb-6">
          <div className="w-14 h-14 mx-auto bg-[#FCF1DF] rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-xs">
            🎂
          </div>
          <h1 className="font-fraunces text-2xl font-bold text-[#1B2430]">
            Register Birthday
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6472] mt-1.5 leading-relaxed">
            Record your name and birthday — it will automatically show up on the team schedule for birthday wishes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {statusMsg && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                statusMsg.type === 'success'
                  ? 'bg-[#E4F2F0] text-[#2F8F82] border border-[#2F8F82]/30'
                  : 'bg-[#FBE7E3] text-[#D6604D] border border-[#D6604D]/30'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1B2430] mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (statusMsg) setStatusMsg(null);
              }}
              placeholder="e.g. David Miller"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] focus:ring-2 focus:ring-[#4C5FD5]/15 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1B2430] mb-1">
              Birth Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (statusMsg) setStatusMsg(null);
              }}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#5B6472] mb-1">
                Department
              </label>
              <input
                type="text"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                placeholder="e.g. Operations"
                className="w-full px-3 py-2 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all"
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
                placeholder="e.g. Lead"
                className="w-full px-3 py-2 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5B6472] mb-1">
              City / Location
            </label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="e.g. Seattle, WA"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE1E6] bg-[#EEF1F4]/40 text-sm text-[#1B2430] focus:outline-none focus:bg-white focus:border-[#4C5FD5] transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1B2430] hover:bg-[#4C5FD5] text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-md active:scale-98 cursor-pointer mt-2"
          >
            Save Birthday
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#DCE1E6] text-center">
          <button
            onClick={onGoToDashboard}
            className="text-xs font-semibold text-[#4C5FD5] hover:underline cursor-pointer"
          >
            ← Open Complete Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
