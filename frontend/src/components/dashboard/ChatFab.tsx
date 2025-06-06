// frontend/src/components/dashboard/ChatFab.tsx
import React, { useState, useEffect } from 'react';
import { Brain, X, Lightbulb, TrendingUp } from 'lucide-react';

const ChatFab: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<1 | 2>(1);
  const [reasoning, setReasoning] = useState<string>('Loading...');
  // Initialize as an array of strings
  const [keyFactors, setKeyFactors] = useState<string[]>(['Loading...']);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // ─── When the panel opens, pick a random user (EC001–EC005) and fetch from API ─────────────
  useEffect(() => {
    if (!open) return;

    (async () => {
      // 1) Randomize user between EC001–EC005
      const randNum = Math.floor(Math.random() * 5) + 1; // 1–5
      const userId = `User #EC00${randNum}`;
      setSelectedUser(userId);

      try {
        const encodedUser = encodeURIComponent(userId);

        // 2) Fetch reasoning
        const reasoningResp = await fetch(
          `http://localhost:3000/api/reasoning?userId=${encodedUser}`
        );
        const reasoningJson = await reasoningResp.json();
        setReasoning(reasoningJson.reasoning || 'No reasoning returned');

        // 3) Fetch key factors
        const keyFactorsResp = await fetch(
          `http://localhost:3000/api/key-factors?userId=${encodedUser}`
        );
        const keyFactorsJson = await keyFactorsResp.json();

        // Split on newlines and strip any leading hyphens/spaces
        const factorsArray: string[] = (keyFactorsJson.keyFactors || '')
          .split('\n')
          .map((line: string) => line.replace(/^[-\s]*/, '').trim())
          .filter((line: string) => line.length > 0);

        setKeyFactors(
          factorsArray.length > 0 ? factorsArray : ['No key factors returned']
        );
      } catch (err) {
        console.error('[💥] Error fetching AI insights:', err);
        setReasoning('Error loading reasoning');
        setKeyFactors(['Error loading key factors']);
      }
    })();
  }, [open]);

  return (
    <>
      {/* ── Floating Action Button ── */}
      <button
        aria-label={open ? 'Close insights' : 'Open insights'}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-primary text-white rounded-full
                   shadow-lg flex items-center justify-center transition hover:scale-105"
        style={{ boxShadow: '0 4px 24px rgba(120,8,208,0.15)' }}
        onClick={() => {
          setActiveTab(1);
          setOpen(!open);
        }}
      >
        {open ? <X className="w-8 h-8" /> : <Brain className="w-8 h-8" />}
      </button>

      {/* ── Slide-in Panel ── */}
      {open && (
        <div
          className="fixed bottom-28 right-6 z-50 w-[480px] max-w-[90vw] max-h-[300px]
                     bg-[#1c1c1e] text-white rounded-2xl shadow-2xl border border-white/10
                     animate-in fade-in slide-in-from-bottom duration-300 overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              <span className="font-semibold text-base">
                AI Insights • {selectedUser || 'Loading...'}
              </span>
            </div>
            <button
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="p-1 hover:text-accent focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="p-4">
            <div className="flex w-full bg-slate-100 rounded-md overflow-hidden">
              {/* Reasoning Tab */}
              <div className="w-1/2">
                <button
                  onClick={() => setActiveTab(1)}
                  className={`w-full flex items-center justify-center py-2 text-xs cursor-pointer select-none ${
                    activeTab === 1 ? 'bg-white text-slate-900' : 'text-slate-600'
                  }`}
                  role="tab"
                  aria-selected={activeTab === 1}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className={`w-3 h-3 mr-1.5 ${
                      activeTab === 1 ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                    <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
                    <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
                  </svg>
                  <span>Reasoning</span>
                </button>
              </div>

              {/* Key Factors Tab */}
              <div className="w-1/2">
                <button
                  onClick={() => setActiveTab(2)}
                  className={`w-full flex items-center justify-center py-2 text-xs cursor-pointer select-none ${
                    activeTab === 2 ? 'bg-white text-slate-900' : 'text-slate-600'
                  }`}
                  role="tab"
                  aria-selected={activeTab === 2}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className={`w-3 h-3 mr-1.5 ${
                      activeTab === 2 ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Key Factors</span>
                </button>
              </div>
            </div>

            {/* Pane 1: Reasoning */}
            {activeTab === 1 && (
              <section className="pane space-y-3 mt-3">
                <p className="text-sm leading-relaxed text-white/90">{reasoning}</p>
              </section>
            )}

            {/* Pane 2: Key Factors */}
            {activeTab === 2 && (
              <section className="pane space-y-3 mt-3">
                {keyFactors.map((factor: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5
                               hover:bg-white/10 transition-colors"
                  >
                    <TrendingUp className="text-indigo-400 mt-1 flex-shrink-0" size={16} />
                    <p className="text-sm text-white/80">{factor}</p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatFab;
