import React from 'react';
import { Check } from 'lucide-react';

interface SaveToastProps {
  show: boolean;
  message?: string;
}

export const SaveToast: React.FC<SaveToastProps> = ({
  show,
  message = 'saved',
}) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1B2430] text-white px-4 py-2 rounded-full text-xs font-mono-code flex items-center gap-1.5 shadow-lg pointer-events-none z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <Check className="w-3.5 h-3.5 text-[#2F8F82]" />
      <span>{message}</span>
    </div>
  );
};
