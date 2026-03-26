'use client';
import { worldTheme } from '../../lib/world/theme';

import { useAuditStore } from '../../stores/auditStore';

export default function AuditPanel() {
  const records = useAuditStore((s) => s.records);
  const evidence = useAuditStore((s) => s.evidence);
  const timeline = useAuditStore((s) => s.timeline);

  return (
    <div className={`${worldTheme.panel} absolute right-6 top-24 z-30 w-[380px] p-4`.trim()}>
      <div className={`${worldTheme.sectionLabel} text-cyan-300/80`.trim()}>
        Audit Memory Archive
      </div>

      <div className="mt-4 max-h-[340px] space-y-3 overflow-y-auto pr-1">
        {records.length === 0 ? (
          <div className={`${worldTheme.panel} text-sm text-white/50`.trim()}>
            No audit records yet.
          </div>
        ) : (
          records.map((record) => {
            const caseEvidence = evidence.filter((item) => item.caseId === record.caseId);
            const caseTimeline = timeline.filter((item) => item.caseId === record.caseId);

            return (
              <div
                key={record.caseId}
                className={`${worldTheme.panel} rounded-xl border border-cyan-400/20 bg-cyan-500/10 p-3`.trim()}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Case {record.caseId}
                    </div>
                    <div className="mt-1 text-xs text-white/55">
                      Status: {record.status}
                    </div>
                  </div>

                  <div className="text-xs uppercase tracking-[0.18em] text-cyan-200/80">
                    {record.recoveryEligible ? 'recoverable' : 'sealed'}
                  </div>
                </div>

                {caseEvidence.length > 0 ? (
                  <div className="mt-3 space-y-1">
                    {caseEvidence.slice(0, 3).map((item) => (
                      <div key={item.id} className="text-xs text-white/65">
                        {item.label}: {item.value}
                      </div>
                    ))}
                  </div>
                ) : null}

                {caseTimeline.length > 0 ? (
                  <div className="mt-3 border-t border-white/10 pt-2">
                    {caseTimeline.slice(0, 3).map((item) => (
                      <div key={item.id} className="text-xs text-white/50">
                        {item.label}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
