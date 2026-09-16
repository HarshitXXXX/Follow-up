import React, { useState } from 'react';
import { Shield, Copy, Check, ExternalLink, X, Database, CheckCircle2 } from 'lucide-react';

interface FirestoreRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FIRESTORE_RULES_CODE = `rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isValidId(id) {
      return id is string && id.size() > 0 && id.size() <= 128;
    }

    // Connection Health Check & Diagnostics
    match /_connection_test/{docId} {
      allow read, write: if true;
    }

    // Workspace Sync Settings & Metadata
    match /_settings/{docId} {
      allow read, write: if true;
    }

    // Tasks Collection
    match /tasks/{taskId} {
      allow read, write: if isValidId(taskId);
    }

    // Programs Collection
    match /programs/{programId} {
      allow read, write: if isValidId(programId);
    }

    // Meetings Collection
    match /meetings/{meetingId} {
      allow read, write: if isValidId(meetingId);
    }

    // Birthdays Collection (Allows public standalone submission)
    match /birthdays/{birthdayId} {
      allow read, write: if isValidId(birthdayId);
    }

    // Global Safety Net: Deny access to any unlisted collection or path
    match /{document=**} {
      allow read, write: if false;
    }
  }
}`;

export const FirestoreRulesModal: React.FC<FirestoreRulesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(FIRESTORE_RULES_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const firebaseRulesUrl =
    'https://console.firebase.google.com/project/followup-55110/firestore/rules';

  return (
    <div
      id="firestore-rules-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="firestore-rules-modal-card"
        className="bg-white rounded-2xl shadow-2xl border border-[#DCE1E6] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#DCE1E6] flex items-center justify-between bg-[#F8F9FA]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E9EBFA] text-[#4C5FD5] flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1B2430]">Firestore Security Rules</h2>
              <p className="text-xs text-[#5B6472]">Project: followup-55110 (Custom Rules)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#5B6472] hover:text-[#1B2430] hover:bg-[#E9EBFA] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="bg-[#E4F2F0] border border-[#2F8F82]/30 rounded-xl p-3.5 text-xs text-[#206057] space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-[#1B2430]">
              <CheckCircle2 className="w-4 h-4 text-[#2F8F82]" />
              <span>How to replace the default rules in Firebase Console:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 ml-1 text-[#2B3545]">
              <li>Click <strong>Copy Rules</strong> below.</li>
              <li>Open your <a href={firebaseRulesUrl} target="_blank" rel="noreferrer" className="underline font-semibold text-[#4C5FD5] hover:text-[#3B4CA8] inline-flex items-center gap-0.5">Firebase Rules Editor <ExternalLink className="w-3 h-3 inline" /></a>.</li>
              <li>Select all default code in the editor, paste this ruleset, and click <strong>Publish</strong>.</li>
            </ol>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between bg-[#1E2530] text-gray-300 text-xs px-4 py-2 rounded-t-xl font-mono">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#E8A33D]" />
                firestore.rules
              </span>
              <button
                id="btn-copy-firestore-rules"
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#2D3748] hover:bg-[#3D495C] text-white transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Rules</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-[#0F141C] text-emerald-300 font-mono text-xs p-4 rounded-b-xl overflow-x-auto max-h-72 border border-[#2D3748] border-t-0 leading-relaxed selection:bg-[#4C5FD5] selection:text-white">
              {FIRESTORE_RULES_CODE}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#DCE1E6] bg-[#F8F9FA] flex flex-wrap items-center justify-between gap-3">
          <a
            href={firebaseRulesUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#4C5FD5] hover:bg-[#3B4CA8] rounded-xl shadow-xs transition-colors"
          >
            <span>Open Firebase Rules Editor</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#5B6472] hover:text-[#1B2430] hover:bg-[#E9EBFA] rounded-xl transition-colors cursor-pointer ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
