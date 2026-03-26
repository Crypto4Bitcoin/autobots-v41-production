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
    <div className={`${worldTheme.panel} absolute right-6 bottom-24 z-30 w-[380px] p-4`.trim()}>
      <div className={`${worldTheme.sectionLabel} text-fuchsia-300/80`.trim()}>
        Recovery Chain
      </div>

      <div className="mt-4 max-h-[260px] space-y-3 overflow-y-auto pr-1">
        {recoverable.length === 0 ? (
          <div className={`${worldTheme.panel} text-sm text-white/50`.trim()}>
            No recovery decisions available.
          </div>
        ) : (
          recoverable.map((record) => (
            <div
              key={record.caseId}
              className={`${worldTheme.panel} rounded-xl border border-fuchsia-400/20 bg-fuchsia-500/10 p-3`.trim()}
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
