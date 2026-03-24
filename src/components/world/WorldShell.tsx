'use client';
import WorldCanvas from './WorldCanvas';
import WorldTopBar from './WorldTopBar';
import WorldLeftRail from './WorldLeftRail';
import WorldBottomDock from './WorldBottomDock';
import SelectionDrawer from './SelectionDrawer';
import { worldTheme } from '../../lib/world/theme';

export default function WorldShell() {
  return (
    <main className="relative h-full w-full overflow-hidden bg-black text-white font-sans">
      <div className="absolute inset-0 p-4">
        <WorldCanvas />
      </div>

      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="pointer-events-auto">
          <WorldTopBar />
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center p-6">
          <div className="pointer-events-auto transition-all duration-500 hover:translate-x-1">
            <WorldLeftRail />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center p-6">
          <div className="pointer-events-auto transition-all duration-500 hover:-translate-x-1">
            <SelectionDrawer />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6">
          <div className="pointer-events-auto">
            <WorldBottomDock />
          </div>
        </div>
      </div>
    </main>
  );
}
