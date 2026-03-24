"use client"

import { useMemo, useState } from "react"
import type { AgentRecord } from "@/lib/academy/types"

export default function AgentTable({ agents }: { agents: AgentRecord[] }) {
  const [role, setRole] = useState("all")
  const [status, setStatus] = useState("all")
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    return (agents || []).filter((agent) => {
      const roleOk = role === "all" || agent.role === role
      const statusOk = status === "all" || agent.status === status
      const searchOk =
        !search ||
        (agent.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (agent.category || "").toLowerCase().includes(search.toLowerCase())

      return roleOk && statusOk && searchOk
    })
  }, [agents, role, status, search])

  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-900 p-4">
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          className="rounded bg-neutral-800 px-3 py-2 text-sm text-white"
          placeholder="Search name or category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="rounded bg-neutral-800 px-3 py-2 text-sm text-white" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="all">All roles</option>
          <option value="teacher">Teacher</option>
          <option value="principal">Principal</option>
          <option value="verify">Verify</option>
          <option value="chancellor">Chancellor</option>
          <option value="dean_ops">Dean Ops</option>
          <option value="schedule_marshal">Schedule Marshal</option>
          <option value="curriculum_balancer">Curriculum Balancer</option>
          <option value="school_audit">School Audit</option>
        </select>
        <select className="rounded bg-neutral-800 px-3 py-2 text-sm text-white" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All status</option>
          <option value="idle">Idle</option>
          <option value="researching">Researching</option>
          <option value="rotating">Rotating</option>
          <option value="governing">Governing</option>
          <option value="paused">Paused</option>
        </select>
      </div>

      <div className="overflow-auto max-h-[500px]">
        <table className="min-w-full text-sm text-white">
          <thead className="sticky top-0 bg-neutral-900">
            <tr className="text-left text-neutral-400">
              <th className="p-2">Agent</th>
              <th className="p-2">Role</th>
              <th className="p-2">Category</th>
              <th className="p-2">Status</th>
              <th className="p-2">Skill</th>
              <th className="p-2">Learning</th>
              <th className="p-2">Performance</th>
              <th className="p-2">Avg Task ms</th>
              <th className="p-2">Last Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((agent) => (
              <tr key={agent.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="p-2 font-medium">{agent.name}</td>
                <td className="p-2 text-neutral-400">{agent.role}</td>
                <td className="p-2 text-cyan-400">{agent.category}</td>
                <td className="p-2">
                   <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                     agent.status === 'idle' ? 'bg-neutral-800 text-neutral-400' :
                     agent.status === 'researching' ? 'bg-cyan-500/20 text-cyan-400' :
                     agent.status === 'governing' ? 'bg-emerald-500/20 text-emerald-400' :
                     'bg-violet-500/20 text-violet-400'
                   }`}>
                     {agent.status}
                   </span>
                </td>
                <td className="p-2">{agent.skillLevel?.toFixed(1) || '0.0'}</td>
                <td className="p-2">{agent.learningScore?.toFixed(2) || '0.00'}</td>
                <td className="p-2">{agent.performanceScore?.toFixed(2) || '0.00'}</td>
                <td className="p-2 text-neutral-400">{agent.avgTaskMs || 0}</td>
                <td className="p-2 text-[10px] text-neutral-500">{new Date(agent.lastActionAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
