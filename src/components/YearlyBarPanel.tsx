'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { MetricCardData } from '@/lib/types';

export function YearlyBarPanel({ metric }: { metric: MetricCardData }) {
  return (
    <section className="card">
      <div className="sectionHeader">
        <div>
          <div className="cardTitle">{metric.title} yearly breakdown</div>
          <div className="muted">Visual context for rates, percentages, and score movement.</div>
        </div>
      </div>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={metric.series}>
            <CartesianGrid stroke="#1f3554" strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fill: '#96a8c4', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#96a8c4', fontSize: 12 }} axisLine={false} tickLine={false} width={34} />
            <Tooltip />
            <Bar dataKey="value" fill="#74b4ff" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
