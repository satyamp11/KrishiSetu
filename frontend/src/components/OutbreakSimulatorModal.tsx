import React from 'react';
import { X, Play, Zap, ArrowRight } from 'lucide-react';
import type { Language } from '../types';

interface OutbreakSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunSimulation: () => void;
  language: Language;
}

export const OutbreakSimulatorModal: React.FC<OutbreakSimulatorModalProps> = ({
  isOpen,
  onClose,
  onRunSimulation
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-amber-500 rounded-2xl max-w-sm w-full p-5 text-slate-100 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/40">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white">Interactive Network Demo</h3>
            <p className="text-xs text-amber-400 font-semibold">Community Network Effect Simulator</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed bg-slate-800/60 p-3 rounded-lg border border-slate-700">
          This simulator demonstrates how Krishi Shield AI turns individual crop scans into a collective regional outbreak defense network.
        </p>

        {/* Step-by-Step Flow Preview */}
        <div className="space-y-2.5 mb-5 text-xs">
          <div className="flex items-start gap-2.5 bg-slate-800 p-2.5 rounded-lg">
            <span className="bg-emerald-500 text-slate-950 font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px]">1</span>
            <div>
              <p className="font-bold text-emerald-300">Farmer Ramesh scans crop photo</p>
              <p className="text-[11px] text-slate-400">AI identifies Tomato Early Blight (94% confidence).</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-slate-800 p-2.5 rounded-lg">
            <span className="bg-emerald-500 text-slate-950 font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px]">2</span>
            <div>
              <p className="font-bold text-emerald-300">Report saved with GPS location</p>
              <p className="text-[11px] text-slate-400">Case registered in village cluster dataset.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-slate-800 p-2.5 rounded-lg">
            <span className="bg-amber-500 text-slate-950 font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px]">3</span>
            <div>
              <p className="font-bold text-amber-300">Multiple reports trigger cluster</p>
              <p className="text-[11px] text-slate-400">3 nearby farmers report same disease within 3 km.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-slate-800 p-2.5 rounded-lg">
            <span className="bg-red-500 text-white font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px]">4</span>
            <div>
              <p className="font-bold text-red-300">Emergency Outbreak Alert dispatched!</p>
              <p className="text-[11px] text-slate-400">Nearby Farmer B (YOU) receives immediate high-risk warning.</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            onRunSimulation();
            onClose();
          }}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-98"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Execute Demo Flow Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
