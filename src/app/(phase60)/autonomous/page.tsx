'use client';

import React, { useState } from 'react';
import { 
  Activity, 
  Shield, 
  Search, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  Filter, 
  Play, 
  Pause, 
  XCircle, 
  CheckCircle2, 
  Info, 
  TrendingUp,
  AlertCircle,
  Clock,
  Zap,
  ChevronRight
} from 'lucide-react';

// Mock Data for Dashboard
const MOCK_EVENTS = [
  {
    id: 'evt_1',
    type: 'market_volatility',
    source: 'market-api-bridge',
    timestamp: '2 mins ago',
    severity: 'High',
    priority: 'High',
    confidence: 0.92,
    cluster: 'Crypto Market Spike',
    status: 'PendingApproval',
    rationale: 'BTC volatility exceeded 5% threshold; potential impact on holdings detected.'
  },
  {
    id: 'evt_2',
    type: 'competitor_update',
    source: 'web-scraper-agent',
    timestamp: '15 mins ago',
    severity: 'Medium',
    priority: 'Medium',
    confidence: 0.78,
    cluster: 'Competitor B Feature Launch',
    status: 'Planned',
    rationale: 'New landing page detected for Competitor B; likely product expansion.'
  },
  {
    id: 'evt_3',
    type: 'workflow_anomaly',
    source: 'internal-monitor',
    timestamp: '1 hour ago',
    severity: 'Low',
    priority: 'Low',
    confidence: 0.95,
    cluster: 'API Latency Cluster',
    status: 'Executed',
    rationale: 'Observed 200ms increase in API response times; auto-scaled worker fleet.'
  }
];

export default function AutonomousDashboard() {
  const [selectedEvent, setSelectedEvent] = useState<unknown>(null);
  const [isGlobalPaused, setIsGlobalPaused] = useState(false);
  const [activeTab, setActiveTab] = useState('live'); // 'live' or 'history'
  const [filterSeverity, setFilterSeverity] = useState('All Severities');

  const filteredEvents = MOCK_EVENTS.filter(e => {
    if (activeTab === 'live' && e.status === 'Executed') return false;
    if (activeTab === 'history' && e.status !== 'Executed') return false;
    if (filterSeverity !== 'All Severities' && e.severity !== filterSeverity) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Autonomous Operator Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Observing signals, evaluating events, and executing governed plans.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-[#111] p-1 rounded-xl flex gap-1 border border-white/5">
            <button 
                onClick={() => setActiveTab('live')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'live' ? 'bg-yellow-500 text-black' : 'text-gray-500 hover:text-white'}`}
            >
                Live Operations
            </button>
            <button 
                onClick={() => setActiveTab('history')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-yellow-500 text-black' : 'text-gray-500 hover:text-white'}`}
            >
                Audit History
            </button>
          </div>
          <button 
            onClick={() => setIsGlobalPaused(!isGlobalPaused)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
              isGlobalPaused ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/50 hover:bg-yellow-500/20'
            }`}
          >
            {isGlobalPaused ? <Play size={20} /> : <Pause size={20} />}
            {isGlobalPaused ? 'Resume Global Autonomy' : 'Emergency Global Pause'}
          </button>
        </div>
      </div>

      {/* Stats / Budget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <BudgetCard title="Decisions" current={12} total={20} icon={<Zap size={20} />} />
        <BudgetCard title="Action Plans" current={4} total={10} icon={<TrendingUp size={20} />} />
        <BudgetCard title="External Actions" current={2} total={5} icon={<Shield size={20} />} />
        <div className="bg-[#111] border border-white/5 p-6 rounded-2xl flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm">Autonomy Mode</p>
                <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-bold text-lg text-white">Full-Draft + Approval</span>
                </div>
            </div>
            <Activity className="text-gray-600" size={32} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Activity className="text-yellow-500" size={24} />
              {activeTab === 'live' ? 'Detected Event Clusters' : 'Execution Audit History'}
            </h2>
            <div className="flex gap-4 border-l border-white/5 pl-4">
                <select 
                    value={filterSeverity} 
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="bg-[#111] text-xs font-bold border border-white/5 rounded-lg px-3 py-1.5 focus:outline-none focus:border-yellow-500 text-gray-400"
                >
                    <option>All Severities</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                </select>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors"><Search size={20}/></button>
                </div>
            </div>
          </div>

          {filteredEvents.length === 0 && (
            <div className="bg-[#111] border border-dashed border-white/10 rounded-2xl p-20 flex flex-col items-center text-gray-600">
                <Shield size={48} className="mb-4 opacity-20"/>
                <p>No {activeTab} events found with the current filters.</p>
            </div>
          )}

          {filteredEvents.map(event => (
            <div 
              key={event.id}
              className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-all cursor-pointer group"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4 items-center">
                    <div className={`p-3 rounded-xl ${
                        event.severity === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                        {event.type === 'market_volatility' ? <TrendingUp size={24}/> : <Info size={24}/>}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold group-hover:text-yellow-500 transition-colors">{event.cluster}</h3>
                        <p className="text-sm text-gray-500">{event.source} • {event.timestamp}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        event.status === 'PendingApproval' ? 'bg-orange-500/20 text-orange-400' : 
                        event.status === 'Executed' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                        {event.status}
                    </span>
                    <div className="flex gap-1">
                        <span className="text-[10px] text-gray-500 border border-white/10 px-2 py-0.5 rounded leading-none flex items-center gap-1">
                            <AlertCircle size={10} className="text-red-500"/> S:{event.severity}
                        </span>
                        <span className="text-[10px] text-gray-500 border border-white/10 px-2 py-0.5 rounded leading-none flex items-center gap-1">
                            <Zap size={10} className="text-yellow-500"/> P:{event.priority}
                        </span>
                    </div>
                </div>
              </div>

              <p className="text-gray-400 text-sm line-clamp-2 mb-4">{event.rationale}</p>
              
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <span className="text-xs text-gray-600 font-mono">ID: {event.id}</span>
                <div className="text-sm font-semibold text-yellow-500 flex items-center gap-1 hover:underline">
                    Explain Decision <ChevronRight size={16}/>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Sidebar / Active Plans */}
        <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Shield className="text-yellow-500" size={24} />
              Active Safety Gate
            </h2>
            
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 overflow-hidden relative">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 opacity-10 pointer-events-none grayscale brightness-150 rounded-full border border-yellow-500 flex items-center justify-center">
                    <Activity size={64}/>
                </div>
                <h3 className="font-bold text-gray-300 mb-4 flex items-center gap-2">
                    <Clock size={18}/> Expiration Monitor
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Volatile Events (30m TTL)</span>
                        <span className="text-green-500">1 Active</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Strategic Intel (24h TTL)</span>
                        <span className="text-white">4 Active</span>
                    </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/5">
                    <h3 className="font-bold text-gray-300 mb-4">Hourly Budget Usage</h3>
                    <div className="space-y-6">
                        <BudgetProgress label="Decision Queue" val={60} />
                        <BudgetProgress label="Execution Planner" val={40} />
                        <BudgetProgress label="External Actions" val={20} />
                    </div>
                </div>
            </div>

            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6">
                <h3 className="font-bold text-yellow-500 mb-2 flex items-center gap-2">
                    <TrendingUp size={18}/> Outcome Learning
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                    The system is refining confidence weights based on your last 14 approvals. Confidence on &quot;Competitior Intel&quot; increased by 5.2%.
                </p>
            </div>
        </div>
      </div>

      {/* Explain Why Drawer (Simple Overlay) */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
            <div className="w-full max-w-2xl bg-[#0d0d0d] h-full shadow-2xl p-10 overflow-y-auto border-l border-white/10 slide-in">
                <div className="flex justify-between items-center mb-10">
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Explain Decision : {selectedEvent.id}</span>
                    <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-white"><XCircle size={32}/></button>
                </div>

                <div className="space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{selectedEvent.cluster}</h2>
                        <div className="flex gap-3">
                            <span className="px-3 py-1 bg-white/5 rounded text-xs font-mono text-gray-400">RULE: system_volatility_rule_v2</span>
                            <span className="px-3 py-1 bg-white/5 rounded text-xs font-mono text-gray-400">CONFIDENCE: {(selectedEvent.confidence * 100).toFixed(0)}%</span>
                        </div>
                    </div>

                    <div className="bg-[#151515] p-6 rounded-2xl border border-white/5">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Proposed Logic Chain</h4>
                        <div className="space-y-4">
                            <ChainStep icon={<Zap className="text-blue-500" size={16}/>} label="Signal Source" val={selectedEvent.source} />
                            <ChainStep icon={<Activity className="text-green-500" size={16}/>} label="Signal Correlation" val="3 related signals detected by Market-X-Bridge" />
                            <ChainStep icon={<AlertCircle className="text-red-500" size={16}/>} label="Severity Assessment" val={selectedEvent.severity} />
                            <ChainStep icon={<Shield className="text-yellow-500" size={16}/>} label="Policy Check" val="AutoBots-Core-Policy / DraftMode enforced" />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-yellow-500 uppercase tracking-widest mb-6 border-b border-yellow-500/20 pb-2">Proposed Execution Plan</h4>
                        <div className="space-y-4">
                            <PlanStep num="1" type="Analysis" desc="Run deep research worker on volatility impact." />
                            <PlanStep num="2" type="Drafting" desc="Generate briefing for 'Investment Insights'." />
                            <PlanStep num="3" type="Approval" desc="Request approval for Slack notification." status="Pending" />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-10">
                        {selectedEvent.status !== 'Executed' && (
                            <>
                                <button className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                                    <CheckCircle2 size={20}/> Approve & Execute
                                </button>
                                <button className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                                    <XCircle size={20}/> Reject Plan
                                </button>
                            </>
                        )}
                        {selectedEvent.status === 'Executed' && (
                            <button className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                                <Activity size={20}/> View Execution Log
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}

      <style jsx>{`
        .slide-in {
            animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

function BudgetCard({ title, current, total, icon }: unknown) {
    const percent = (current / total) * 100;
    return (
        <div className="bg-[#111] border border-white/5 p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 text-sm font-medium">{title}</span>
                <div className="text-yellow-500/50">{icon}</div>
            </div>
            <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{current}</span>
                <span className="text-gray-600 pb-1">/ {total}</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full mt-4 flex overflow-hidden">
                <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
}

function BudgetProgress({ label, val }: unknown) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs">
                <span className="text-gray-400">{label}</span>
                <span className="text-gray-600">{val}% Used</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${val > 80 ? 'bg-red-500' : 'bg-yellow-500/40'}`} style={{ width: `${val}%` }}></div>
            </div>
        </div>
    )
}

function ChainStep({ icon, label, val }: unknown) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">{icon}</div>
            <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{label}</p>
                <p className="text-xs text-white font-medium">{val}</p>
            </div>
        </div>
    )
}

function PlanStep({ num, type, desc, status }: unknown) {
    return (
        <div className="flex gap-4 group">
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:border-yellow-500 group-hover:text-yellow-500 transition-colors">
                {num}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-white">{type}</span>
                    {status && <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">{status}</span>}
                </div>
                <p className="text-xs text-gray-500">{desc}</p>
            </div>
        </div>
    )
}
