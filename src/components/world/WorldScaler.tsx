'use client';
import React, { useEffect, useState } from 'react';

interface WorldScalerProps {
  mobile: React.ReactNode;
  tablet: React.ReactNode;
  desktop: React.ReactNode;
}

export default function WorldScaler({ mobile, tablet, desktop }: WorldScalerProps) {
  const [mode, setMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setMode('mobile');
      } else if (w < 1200) {
        setMode('tablet');
      } else {
        setMode('desktop');
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (mode === 'mobile') return <>{mobile}</>;
  if (mode === 'tablet') return <>{tablet}</>;

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <div 
        className="relative mx-auto h-full w-full"
        style={{
          width: '100vw',
          height: '100vh',
          transformOrigin: 'top center',
        }}
      >
        {desktop}
      </div>
    </div>
  );
}
