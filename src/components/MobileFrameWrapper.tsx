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
    <div className={`min-h-screen transition-colors font-sans-body selection:bg-emerald-700 selection:text-white ${
      sunlightMode ? 'bg-white text-black' : 'bg-[#faf9f6] text-slate-900'
    }`}>
      <main className="w-full min-h-screen flex flex-col items-center justify-start">
        <div className="w-full flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
};

