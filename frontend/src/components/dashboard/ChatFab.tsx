// src/components/dashboard/ChatFab.tsx
import React, { useState, useEffect } from 'react';
import { Brain, X, Lightbulb, TrendingUp } from 'lucide-react';
import './ChatFab.css';  // <-- make sure this imports your loader CSS

interface ChatFabProps {
  selectedUser: string;
  hasData: boolean;
}

const ChatFab: React.FC<ChatFabProps> = ({ selectedUser, hasData }) => {
  const API_BASE = import.meta.env.PROD
    ? 'https://reco-ai-k1v7.vercel.app'
    : '/api';

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<1 | 2>(1);
  const [reasoning, setReasoning] = useState('Loading...');
  const [keyFactors, setKeyFactors] = useState<string[]>(['Loading...']);
  const [isLoading, setIsLoading] = useState(false);  // ← new

  useEffect(() => {
    if (!open || !hasData) return;

    (async () => {
      setIsLoading(true);  // ← start loader
      try {
        // 1) Fetch reasoning
        const reasoningResp = await fetch(
          `${API_BASE}/api/reasoning?userId=${encodeURIComponent(selectedUser)}`
        );
        if (!reasoningResp.ok) throw new Error(`Reasoning fetch failed: ${reasoningResp.status}`);
        const reasoningJson = await reasoningResp.json();
        setReasoning(reasoningJson.reasoning || 'No reasoning returned');

        // 2) Fetch key factors
        const keyFactorsResp = await fetch(
          `${API_BASE}/api/key-factors?userId=${encodeURIComponent(selectedUser)}`
        );
        if (!keyFactorsResp.ok) throw new Error(`Key factors fetch failed: ${keyFactorsResp.status}`);
        const keyFactorsJson = await keyFactorsResp.json();

        // 3) Parse into lines
        const factorsArray: string[] = (keyFactorsJson.keyFactors || '')
          .split('\n')
          .map(line => line.replace(/^[-\s]*/, '').trim())
          .filter(line => line.length > 0);

        setKeyFactors(factorsArray.length > 0 ? factorsArray : ['No key factors returned']);
      } catch (err) {
        console.error('[💥] Error fetching AI insights for', selectedUser, err);
        setReasoning('Error loading reasoning');
        setKeyFactors(['Error loading key factors']);
      } finally {
        setIsLoading(false);  // ← stop loader
      }
    })();
  }, [open, selectedUser, API_BASE, hasData]);

  return (
    <>
      {/* Floating Action Button */}
      <button
        aria-label={open ? 'Close insights' : 'Open insights'}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-primary text-white rounded-full shadow-lg flex items-center justify-center transition hover:scale-105"
        style={{ boxShadow: '0 4px 24px rgba(120,8,208,0.15)' }}
        onClick={() => {
          setActiveTab(1);
          setOpen(o => !o);
        }}
      >
        {open ? <X className="w-8 h-8" /> : <Brain className="w-8 h-8" />}
      </button>

      {/* Slide-in Panel */}
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
                AI Insights • {hasData ? selectedUser : 'No Data Yet'}
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

          {/* Loader overlay */}
          {isLoading && (
            <div className="flex justify-center items-center p-4">
              <div className="loader">
                <li className="ball"></li>
                <li className="ball"></li>
                <li className="ball"></li>
              </div>
            </div>
          )}

          <div className="p-4">
            {!hasData ? (
              <p className="text-center text-white/70">
                Upload and process a dataset first to see AI insights.
              </p>
            ) : (
              !isLoading && (  /* only show tabs when not loading */
                <>
                  {/* Tabs */}
                  <div className="flex w-full bg-slate-100 rounded-md overflow-hidden">
                    <button
                      onClick={() => setActiveTab(1)}
                      className={`w-1/2 flex items-center justify-center py-2 text-xs cursor-pointer select-none ${
                        activeTab === 1 ? 'bg-white text-slate-900' : 'text-slate-600'
                      }`}
                      role="tab"
                      aria-selected={activeTab === 1}
                    >
                      <Lightbulb
                        className={`w-3 h-3 mr-1.5 ${
                          activeTab === 1 ? 'text-slate-900' : 'text-slate-500'
                        }`}
                      />
                      <span>Reasoning</span>
                    </button>
                    <button
                      onClick={() => setActiveTab(2)}
                      className={`w-1/2 flex items-center justify-center py-2 text-xs cursor-pointer select-none ${
                        activeTab === 2 ? 'bg-white text-slate-900' : 'text-slate-600'
                      }`}
                      role="tab"
                      aria-selected={activeTab === 2}
                    >
                      <TrendingUp
                        className={`w-3 h-3 mr-1.5 ${
                          activeTab === 2 ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      />
                      <span>Key Factors</span>
                    </button>
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
                      {keyFactors.map((factor, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <TrendingUp
                            className="text-indigo-400 mt-1 flex-shrink-0"
                            size={16}
                          />
                          <p className="text-sm text-white/80">{factor}</p>
                        </div>
                      ))}
                    </section>
                  )}
                </>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatFab;
