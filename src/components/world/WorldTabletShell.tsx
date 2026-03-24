'use client';
import React from 'react';
import WorldCanvas from './WorldCanvas';
import WorldTopBar from './WorldTopBar';
import SelectionDrawer from './SelectionDrawer';
import WorldBottomDock from './WorldBottomDock';
import WorldLeftRail from './WorldLeftRail';
import { worldTheme } from '../../lib/world/theme';

export default function WorldTabletShell() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 opacity-80 scale-95 origin-center">
         <WorldCanvas />
      </div>
      
      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="pointer-events-auto">
          <WorldTopBar />
        </div>
        
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center p-8">
           <div className={`pointer-events-auto h-[65%] w-72 overflow-hidden ${worldTheme.panel} shadow-2xl`}>
              <WorldLeftRail />
           </div>
        </div>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center p-8">
           <div className={`pointer-events-auto h-[65%] w-80 overflow-hidden ${worldTheme.panelStrong} shadow-2xl`}>
              <SelectionDrawer />
           </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-8">
          <div className="pointer-events-auto max-w-2xl mx-auto">
             <WorldBottomDock />
          </div>
        </div>
      </div>
    </main>
  );
}
