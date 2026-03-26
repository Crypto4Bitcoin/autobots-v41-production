'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { MetricCardData } from '@/lib/types';
import { VerifierBadge } from '@/components/VerifierBadge';

export function MetricCard({ metric }: { metric: MetricCardData }) {
  const deltaClass = metric.direction === 'up' ? 'metricDeltaUp' : metric.direction === 'down' ? 'metricDeltaDown' : '';

  return (
    <section className="card">
      <div className="sectionHeader">
        <div>
          <div className="muted">{metric.title}</div>
          <div className="metricValue">{metric.value}</div>
          <div className={deltaClass}>{metric.delta}</div>
        </div>
        <VerifierBadge verifier={metric.verifier} />
      </div>
      <div style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer>
          <AreaChart data={metric.series}>
            <XAxis dataKey="year" tick={{ fill: '#96a8c4', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#96a8c4', fontSize: 12 }} axisLine={false} tickLine={false} width={34} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#74b4ff" fill="#74b4ff22" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="tinyMeta">Every metric card includes a yearly graph by default.</div>
    </section>
  );
}
