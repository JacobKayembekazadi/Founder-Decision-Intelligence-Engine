
import React, { useState, useRef, useEffect } from 'react';
import { getDecisionIntelligence } from './services/geminiService';
import { DecisionIntelligenceResponse } from './types';
import { DecisionChart } from './components/DecisionChart';

const INITIAL_SUGGESTIONS = [
  "Evaluate timing for 'AETHER' capsule drop vs upcoming cultural event X.",
  "Determine allocation for top 4% collectors for next season.",
  "Assess risk of broadening distribution for entry-level SKU 'NOVA'.",
  "Analyze signal decay for current flagship silhouette 'ZENITH'."
];

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<DecisionIntelligenceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleConsult = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await getDecisionIntelligence(query);
      setResponse(data);
    } catch (err) {
      console.error(err);
      setError('An error occurred during decision analysis. Re-establish terminal connection.');
      if (err instanceof Error && err.message.includes("Requested entity was not found.")) {
         // This would trigger re-auth in a real scenario with window.aistudio
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (response && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response]);

  return (
    <div className="min-h-screen flex flex-col max-w-6xl mx-auto px-4 py-8 md:py-16 selection:bg-white selection:text-black">
      {/* Header */}
      <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Founder Engine</h1>
          <p className="text-[10px] mono uppercase tracking-[0.3em] text-zinc-500">Decision Intelligence // Scarcity Logic // High Culture</p>
        </div>
        <div className="flex items-center gap-4 text-[10px] mono uppercase text-zinc-600">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
            Terminal Active
          </div>
          <div className="hidden md:block">Session: 0X-B4912</div>
        </div>
      </header>

      {/* Terminal Input */}
      <section className="mb-12">
        <form onSubmit={handleConsult} className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe the decision context..."
            className="w-full bg-zinc-950 border border-zinc-800 p-6 pt-12 text-lg md:text-2xl font-light focus:outline-none focus:border-zinc-500 transition-colors min-h-[160px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleConsult();
              }
            }}
          />
          <div className="absolute top-4 left-6 text-[10px] mono uppercase text-zinc-600">INPUT_PROMPT_SCENARIO</div>
          <button
            type="submit"
            disabled={isLoading}
            className={`absolute bottom-6 right-6 px-6 py-2 bg-white text-black text-[11px] mono font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? 'Processing...' : 'Consult Engine'}
          </button>
        </form>
        
        {!response && !isLoading && (
          <div className="mt-6">
            <h4 className="text-[10px] mono uppercase text-zinc-600 mb-3 tracking-widest">Protocol Samples</h4>
            <div className="flex flex-wrap gap-2">
              {INITIAL_SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(s)}
                  className="text-[11px] bg-zinc-900 text-zinc-400 border border-zinc-800 px-3 py-1.5 hover:text-white hover:border-zinc-600 transition-colors text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Response Display */}
      {error && (
        <div className="bg-red-950/20 border border-red-900/50 p-6 mb-12 flex items-center gap-4">
          <div className="text-red-500 text-2xl">!</div>
          <p className="text-sm mono text-red-200 uppercase tracking-tight">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
          <div className="w-12 h-1 bg-white mb-4"></div>
          <p className="text-[10px] mono uppercase tracking-[0.2em] text-zinc-400 italic">Executing 4% Principal Filter... Analyzing Signal Decay...</p>
        </div>
      )}

      {response && (
        <div ref={scrollRef} className="animate-in fade-in duration-700">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Context & Charts */}
            <div className="lg:col-span-8 space-y-12">
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[11px] mono uppercase text-zinc-500">01. Decision Context</span>
                  <div className="h-[1px] bg-zinc-800 flex-grow"></div>
                </div>
                <p className="text-xl md:text-2xl font-light text-zinc-100 leading-tight">
                  {response.context}
                </p>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[11px] mono uppercase text-zinc-500">02. Visual Evidence</span>
                  <div className="h-[1px] bg-zinc-800 flex-grow"></div>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {response.charts.map((chart, idx) => (
                    <DecisionChart key={idx} config={chart} />
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Guidance & Risk */}
            <div className="lg:col-span-4 space-y-12">
              <section className="sticky top-12">
                <div className="border border-zinc-800 p-8 bg-zinc-950 mb-6">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="w-2 h-2 bg-white"></span>
                    <h3 className="text-[11px] mono uppercase tracking-widest font-bold">Recommended Guidance</h3>
                  </div>
                  <p className="text-lg font-medium leading-snug text-white mb-6">
                    {response.guidance}
                  </p>
                  <div className="text-[9px] mono uppercase text-zinc-600 mt-12 border-t border-zinc-900 pt-4 italic">
                    Output filtered for decision supremacy. Surface data removed.
                  </div>
                </div>

                <div className="border border-red-900/30 p-8 bg-zinc-950">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="w-2 h-2 bg-red-600"></span>
                    <h3 className="text-[11px] mono uppercase tracking-widest font-bold text-red-500">Strategic Risk Warning</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-300">
                    {response.risk}
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto pt-24 pb-8 flex flex-col md:flex-row justify-between border-t border-zinc-900 items-center gap-4">
        <div className="text-[10px] mono text-zinc-700 uppercase tracking-widest">
          &copy; 2025 Intelligence Engine | Encrypted Link Established
        </div>
        <div className="flex gap-8 text-[10px] mono text-zinc-700 uppercase tracking-widest">
          <span>Version 3.1.2-ALPHA</span>
          <span>Terms of Secrecy</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
