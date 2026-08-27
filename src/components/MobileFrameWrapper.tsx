import React, { useState } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameWrapperProps {
  children: React.ReactNode;
  sunlightMode: boolean;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({
  children,
  sunlightMode
}) => {
  const [isFrameMode, setIsFrameMode] = useState<boolean>(false);

  return (
    <div className={`min-h-screen transition-colors font-sans-body selection:bg-emerald-700 selection:text-white ${
      sunlightMode ? 'bg-white text-black' : 'bg-[#faf9f6] text-slate-900'
    }`}>
      
      {/* Top Prototype Floating Bar (Optional Frame Switcher) */}
      <header className="w-full bg-[#1b4332] text-white px-4 py-2 flex items-center justify-between z-50 text-xs font-semibold shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold tracking-tight text-white">KrishiShield AI</span>
          <span className="text-emerald-200 text-[11px] hidden sm:inline">• GreenBasket Style Premium UI</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFrameMode(!isFrameMode)}
            className="flex items-center gap-1.5 bg-[#2d6a4f] hover:bg-[#40916c] text-white px-3 py-1 rounded-full text-[11px] font-medium transition-all shadow-sm"
          >
            {isFrameMode ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>Full Web Responsive View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Frame Preview</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Viewport Container */}
      <main className="w-full min-h-[calc(100vh-40px)] flex flex-col items-center justify-start">
        {isFrameMode ? (
          /* Mobile Device Frame Mockup */
          <div className="my-6 relative w-full max-w-md h-[88vh] max-h-[860px] bg-slate-950 rounded-[44px] shadow-[0_20px_60px_rgba(27,67,50,0.3)] border-[10px] border-slate-900 overflow-hidden flex flex-col">
            
            {/* Top Phone Notch & Status Bar */}
            <div className={`px-6 pt-2 pb-1 flex items-center justify-between text-[11px] font-bold z-50 select-none ${
              sunlightMode ? 'bg-black text-yellow-300' : 'bg-emerald-950 text-emerald-200'
            }`}>
              <span>09:41</span>
              <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800">
                <div className="w-2.5 h-2.5 rounded-full bg-black border border-slate-700" />
              </div>
              <div className="flex items-center gap-1.5">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>

            {/* Mobile App Screen Content */}
            <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-[#faf9f6]">
              {children}
            </div>

            {/* Bottom iOS/Android Home Indicator Bar */}
            <div className={`py-1 flex justify-center z-50 ${
              sunlightMode ? 'bg-black' : 'bg-slate-950'
            }`}>
              <div className="w-32 h-1 bg-slate-700 rounded-full" />
            </div>

          </div>
        ) : (
          /* Full Responsive Web Layout */
          <div className="w-full flex-1 flex flex-col">
            {children}
          </div>
        )}
      </main>

    </div>
  );
};
