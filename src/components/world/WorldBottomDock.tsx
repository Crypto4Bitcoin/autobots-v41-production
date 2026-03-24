'use client';
import WorldButton from './ui/WorldButton';
import { worldTheme } from '../../lib/world/theme';

import { useAudioStore } from '../../stores/audioStore';
import { useWorldStore } from '../../stores/worldStore';

export default function WorldBottomDock() {
  const ambientEnabled = useAudioStore((s) => s.ambientEnabled);
  const toggleAmbient = useAudioStore((s) => s.toggleAmbient);
  const alertCount = useWorldStore((s) => s.alertCount);

  return (
    <div className={"mx-auto mb-4 flex w-[78%] items-center justify-between " + worldTheme.panel + " px-6 py-4"}>
      <div>
        <div className={worldTheme.sectionLabel}>
          Playback + Simulation Control
        </div>
        <div className="mt-1 text-sm text-white/75">
          Alerts pending: {alertCount}
        </div>
      </div>

      <WorldButton
        onClick={toggleAmbient}
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
      >
        {ambientEnabled ? 'Disable Ambient' : 'Enable Ambient'}
      </WorldButton>
    </div>
  );
}