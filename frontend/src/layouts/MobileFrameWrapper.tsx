import React from 'react';

interface MobileFrameWrapperProps {
  children: React.ReactNode;
  sunlightMode: boolean;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({
  children,
  sunlightMode
}) => {
  return (
    <div className={`min-h-screen w-full max-w-[100vw] overflow-x-hidden transition-colors font-sans-body selection:bg-emerald-700 selection:text-white ${
      sunlightMode ? 'bg-white text-black' : 'bg-[#faf9f6] text-slate-900'
    }`}>
      <main className="w-full max-w-[100vw] min-h-screen flex flex-col items-center justify-start overflow-x-hidden">
        <div className="w-full min-w-0 flex-1 flex flex-col overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
};

