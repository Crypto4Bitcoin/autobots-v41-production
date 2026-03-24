'use client';
import WorldButton from './ui/WorldButton';
import { worldTheme } from '../../lib/world/theme';

import { useAuditStore } from '../../stores/auditStore';

export default function RecoveryPanel() {
  const records = useAuditStore((s) => s.records);
  const archiveCase = useAuditStore((s) => s.archiveCase);

  const recoverable = records.filter(
    (record) =>
      record.status === 'verified' ||
      record.status === 'restored' ||
      record.status === 'forfeited'
  );

  return (
    <div className="absolute right-6 bottom-24 z-30 w-[380px] rounded-[24px] border border-fuchsia-400/15 bg-black/60 p-4 backdrop-blur-md">
      <div className="text-[10px] uppercase tracking-[0.35em] text-fuchsia-300/80">
        Recovery Chain
      </div>

      <div className="mt-4 max-h-[260px] space-y-3 overflow-y-auto pr-1">
        {recoverable.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/50">
            No recovery decisions available.
          </div>
        ) : (
          recoverable.map((record) => (
            <div
              key={record.caseId}
              className="rounded-xl border border-fuchsia-400/20 bg-fuchsia-500/10 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-white">{record.caseId}</div>
                  <div className="mt-1 text-xs text-white/55">
                    Current state: {record.status}
                  </div>
                </div>
              </div>

              {record.status !== 'archived' ? (
                <WorldButton
                  onClick={() => archiveCase(record.caseId)}
                  className="mt-3 rounded-md border border-fuchsia-400/20 bg-fuchsia-500/10 px-2 py-1 text-xs text-fuchsia-200"
                >
                  Archive Case
                </WorldButton>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
