import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, QrCode } from 'lucide-react';

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToStandalone: () => void;
}

export const ShareLinkModal: React.FC<ShareLinkModalProps> = ({
  isOpen,
  onClose,
  onSwitchToStandalone,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.origin + window.location.pathname;
  const shareUrl = `${currentUrl}?mode=addbirthday`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B2430]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#DCE1E6] overflow-hidden z-10 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#DCE1E6]">
          <h2 className="font-fraunces text-lg font-semibold text-[#1B2430]">
            Share Birthday Entry Link
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-[#93A0AC] hover:text-[#1B2430] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <p className="text-xs sm:text-sm text-[#5B6472] leading-relaxed">
            Send this link to teammates or clients via email, Slack, or WhatsApp. Anyone with this link can submit their name and birth date directly to your team board.
          </p>

          <div className="bg-[#EEF1F4]/70 p-2.5 rounded-xl border border-[#DCE1E6] flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="bg-transparent text-xs font-mono-code text-[#1B2430] w-full focus:outline-none select-all"
            />
            <button
              onClick={handleCopy}
              className="bg-[#1B2430] hover:bg-[#4C5FD5] text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 shrink-0 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                onSwitchToStandalone();
                onClose();
              }}
              className="text-xs font-semibold text-[#4C5FD5] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview public form</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-[#5B6472] hover:bg-[#EEF1F4] rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
