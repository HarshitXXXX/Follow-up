import React, { useState } from 'react';
import { Cake, Trash2, Plus, Sparkles, MessageCircle, Share2, Check } from 'lucide-react';
import { Birthday } from '../types';
import { daysUntilNextBirthday, formatBdayDisplay } from '../utils/helpers';

interface BirthdaySectionProps {
  birthdays: Birthday[];
  onOpenAddModal: () => void;
  onDeleteBirthday: (id: string) => void;
}

export const BirthdaySection: React.FC<BirthdaySectionProps> = ({
  birthdays,
  onOpenAddModal,
  onDeleteBirthday,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sort birthdays by days until next occurrence
  const sortedBirthdays = [...birthdays].sort((a, b) => {
    return daysUntilNextBirthday(a.date) - daysUntilNextBirthday(b.date);
  });

  const handleShareWish = (bday: Birthday) => {
    const days = daysUntilNextBirthday(bday.date);
    const text = `🎉🎂 *Happy Birthday!* 🎂🎉\n\nDear ${bday.name} ${bday.position ? `(${bday.position})` : ''},\nWishing you a fantastic birthday filled with joy and continued success! 💐✨`;
    
    // Check if on mobile or can use WhatsApp URL
    const encoded = encodeURIComponent(text);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    
    // Copy to clipboard as fallback and provide option
    navigator.clipboard.writeText(text);
    setCopiedId(bday.id);
    setTimeout(() => setCopiedId(null), 2000);

    // If user clicks WhatsApp, open in new window
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="mt-9 pt-6 border-t border-[#DCE1E6]/80">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎂</span>
          <h2 className="font-fraunces text-xl font-semibold text-[#1B2430]">
            Upcoming Birthdays
          </h2>
          <span className="text-xs font-mono-code bg-[#E9EBFA] text-[#4C5FD5] px-2 py-0.5 rounded-full font-semibold">
            {birthdays.length}
          </span>
        </div>

        <button
          id="btn-section-add-bday"
          onClick={onOpenAddModal}
          className="bg-white hover:bg-[#FCF1DF] text-[#1B2430] border border-[#DCE1E6] hover:border-[#E8A33D] px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#E8A33D]" />
          <span>+ Add Birthday</span>
        </button>
      </div>

      {sortedBirthdays.length === 0 ? (
        <div className="bg-white border border-[#DCE1E6] rounded-2xl p-6 text-center text-sm text-[#5B6472]">
          No birthdays logged yet.{' '}
          <button
            onClick={onOpenAddModal}
            className="text-[#4C5FD5] font-semibold ml-1 underline cursor-pointer"
          >
            Add the first birthday
          </button>
        </div>
      ) : (
        <div className="flex gap-3.5 overflow-x-auto pb-3 pt-1 scrollbar-thin">
          {sortedBirthdays.map((b) => {
            const days = daysUntilNextBirthday(b.date);
            const isToday = days === 0;
            const isTomorrow = days === 1;

            let countdownLabel = `In ${days} days`;
            if (isToday) countdownLabel = 'Birthday Today! 🎉';
            else if (isTomorrow) countdownLabel = 'Tomorrow';

            const metaParts: string[] = [];
            if (b.position) metaParts.push(`💼 ${b.position}`);
            if (b.dept) metaParts.push(`🏢 ${b.dept}`);
            if (b.village) metaParts.push(`📍 ${b.village}`);

            return (
              <div
                key={b.id}
                id={`birthday-card-${b.id}`}
                className={`group shrink-0 w-52 sm:w-56 rounded-2xl border p-4 relative overflow-hidden transition-all duration-200 ${
                  isToday
                    ? 'bg-gradient-to-br from-[#FCF1DF] via-white to-[#FCF1DF]/70 border-[#E8A33D] shadow-md ring-2 ring-[#E8A33D]/25'
                    : 'bg-white border-[#DCE1E6] hover:border-[#93A0AC] hover:shadow-xs'
                }`}
              >
                {/* Festive corner sticker */}
                {isToday && (
                  <span className="absolute top-2.5 right-2.5 text-base select-none animate-bounce">
                    🎉
                  </span>
                )}

                {/* Delete button */}
                <button
                  onClick={() => onDeleteBirthday(b.id)}
                  className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 text-[#93A0AC] hover:text-[#D6604D] p-1 rounded-md transition-opacity cursor-pointer z-10 bg-white/80"
                  title="Delete Birthday"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="pr-6">
                  <h3 className="font-fraunces font-semibold text-base text-[#1B2430] leading-snug truncate">
                    {b.name}
                  </h3>
                  <div className="font-mono-code text-xs text-[#5B6472] mt-0.5">
                    🎂 {formatBdayDisplay(b.date)}
                  </div>
                </div>

                {metaParts.length > 0 && (
                  <div className="text-[11.5px] text-[#5B6472] mt-2 space-y-0.5 leading-snug">
                    {metaParts.map((part, idx) => (
                      <div key={idx} className="truncate">
                        {part}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span
                    className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      isToday
                        ? 'bg-[#E8A33D] text-white shadow-2xs'
                        : isTomorrow
                        ? 'bg-[#E9EBFA] text-[#4C5FD5]'
                        : 'bg-[#EEF1F4] text-[#5B6472]'
                    }`}
                  >
                    {countdownLabel}
                  </span>

                  <button
                    onClick={() => handleShareWish(b)}
                    className="p-1 text-[#4C5FD5] hover:bg-[#E9EBFA] rounded-md transition-colors cursor-pointer"
                    title="Send Birthday Wish via WhatsApp / Copy Text"
                  >
                    {copiedId === b.id ? (
                      <Check className="w-3.5 h-3.5 text-[#2F8F82]" />
                    ) : (
                      <MessageCircle className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
