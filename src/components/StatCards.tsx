import React from 'react';
import { EffectiveStatus } from '../types';

interface StatCounts {
  total: number;
  pending: number;
  progress: number;
  done: number;
  overdue: number;
}

interface StatCardsProps {
  counts: StatCounts;
  activeStatus: 'all' | EffectiveStatus;
  onSelectStatus: (status: 'all' | EffectiveStatus) => void;
}

export const StatCards: React.FC<StatCardsProps> = ({
  counts,
  activeStatus,
  onSelectStatus,
}) => {
  const cards: Array<{
    key: 'all' | EffectiveStatus;
    count: number;
    title: string;
    sub: string;
    numColor: string;
    activeBorder: string;
    activeBg: string;
    isOverdue?: boolean;
  }> = [
    {
      key: 'all',
      count: counts.total,
      title: 'Total Tasks',
      sub: 'All registered',
      numColor: 'text-[#1B2430]',
      activeBorder: 'border-[#1B2430]',
      activeBg: 'bg-white',
    },
    {
      key: 'pending',
      count: counts.pending,
      title: 'Pending',
      sub: 'To be started',
      numColor: 'text-[#E8A33D]',
      activeBorder: 'border-[#E8A33D]',
      activeBg: 'bg-[#FCF1DF]/40',
    },
    {
      key: 'progress',
      count: counts.progress,
      title: 'In Progress',
      sub: 'Actively ongoing',
      numColor: 'text-[#4C5FD5]',
      activeBorder: 'border-[#4C5FD5]',
      activeBg: 'bg-[#E9EBFA]/40',
    },
    {
      key: 'done',
      count: counts.done,
      title: 'Done',
      sub: 'Completed',
      numColor: 'text-[#2F8F82]',
      activeBorder: 'border-[#2F8F82]',
      activeBg: 'bg-[#E4F2F0]/40',
    },
    {
      key: 'overdue',
      count: counts.overdue,
      title: 'Overdue',
      sub: 'Past due date',
      numColor: 'text-[#D6604D]',
      activeBorder: 'border-[#D6604D]',
      activeBg: 'bg-[#FBE7E3]/40',
      isOverdue: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-7">
      {cards.map((card) => {
        const isSelected = activeStatus === card.key;
        return (
          <button
            key={card.key}
            id={`stat-card-${card.key}`}
            onClick={() => onSelectStatus(isSelected ? 'all' : card.key)}
            className={`text-left relative overflow-hidden bg-white p-4 rounded-2xl border transition-all cursor-pointer ${
              isSelected
                ? `${card.activeBorder} ${card.activeBg} shadow-sm ring-2 ring-offset-1 ring-current/20 scale-[1.01]`
                : 'border-[#DCE1E6] hover:border-[#93A0AC] hover:shadow-xs'
            }`}
          >
            {card.isOverdue && card.count > 0 && (
              <span
                className="absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full bg-[#D6604D] animate-gentle-pulse"
                title="Overdue टास्क शिल्लक आहेत"
              />
            )}
            <div className={`font-mono-code text-2xl sm:text-3xl font-bold tracking-tight ${card.numColor}`}>
              {card.count}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[#1B2430] mt-1.5 flex items-center justify-between">
              <span>{card.title}</span>
            </div>
            <div className="text-[11.5px] text-[#5B6472] font-medium mt-0.5">
              {card.sub}
            </div>
          </button>
        );
      })}
    </div>
  );
};
