import { useState } from "react"
import type { GroupedAssignedTasks, AssignedTask } from "../../types/assigned_task"
import type { Status } from "../../types/task"
import type { GroupBy } from "../../types/assigned_task"
import AssignedTaskCard from "./AssignedTaskCard"

type Props = {
    grouped: GroupedAssignedTasks
    viewAs: "manager" | "worker"
    groupBy?: GroupBy
    onStatusChange: (task: AssignedTask, status: Status) => void
    onEdit: (task: AssignedTask) => void
    onDelete: (taskId: number) => void
}

// Returns a colour class for the section avatar based on the group key
function getSectionColour(key: string, groupBy?: GroupBy): string {
    if (groupBy === "priority") {
        if (key === "high") return "from-rose-400 to-red-500"
        if (key === "medium") return "from-orange-400 to-amber-500"
        if (key === "low") return "from-emerald-400 to-teal-500"
    }
    if (groupBy === "status") {
        if (key === "completed") return "from-emerald-400 to-teal-500"
        if (key === "in progress") return "from-sky-400 to-blue-500"
        if (key === "todo") return "from-slate-400 to-slate-500"
    }
    return "from-indigo-400 to-sky-400"  // default for manager/worker grouping
}

// Returns a readable label for the section header
function getSectionLabel(key: string, groupBy?: GroupBy): string {
    if (groupBy === "priority") return `${key.charAt(0).toUpperCase() + key.slice(1)} Priority`
    if (groupBy === "status") return key.charAt(0).toUpperCase() + key.slice(1)
    return key  // person — already a readable username
}

// Returns the avatar content — icon for priority/status, initial for manager
function getSectionAvatar(key: string, groupBy?: GroupBy): string {
    if (groupBy === "priority") {
        if (key === "high") return "↑"
        if (key === "medium") return "–"
        if (key === "low") return "↓"
    }
    if (groupBy === "status") {
        if (key === "completed") return "✓"
        if (key === "in progress") return "▶"
        return "○"
    }
    return key[0].toUpperCase()
}

function GroupedTaskView({ grouped, viewAs, groupBy, onStatusChange, onEdit, onDelete }: Props) {
    // Track which sections are collapsed. Default: all expanded.
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

    function toggleSection(key: string) {
        setCollapsed(prev => ({...prev, [key]: !prev[key]}))
    }

    const keys = Object.keys(grouped)

    if (keys.length === 0) {
        return (
            <p className="text-center text-slate-400 py-16 text-sm">
                {viewAs === "manager"
                    ? "You haven't assigned any tasks yet."
                    : "No tasks assigned to you yet."}
            </p>
        )
    }

    return (
        <div className="space-y-6">
            {keys.map(key => {
                const tasks = grouped[key]
                const isCollapsed = collapsed[key] ?? false
                const completedCount = tasks.filter(t => t.is_completed).length

                return (
                    <div
                        key={key}
                        className="rounded-2xl border border-indigo-100 bg-white/60 backdrop-blur shadow-[0_4px_14px_rgba(0,0,0,0.06)] overflow-hidden"
                    >
                        <button
                            onClick={() => toggleSection(key)}
                            className="w-full flex items-center justify-between px-5 py-4 hover:bg-indigo-50/60 transition-colors duration-200"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${getSectionColour(key, groupBy)} flex items-center justify-center text-white text-sm font-bold`}>
                                    {getSectionAvatar(key, groupBy)}
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-slate-800">
                                        {getSectionLabel(key, groupBy)}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {completedCount}/{tasks.length} completed
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-24 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-emerald-400 transition-all duration-500"
                                        style={{ width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%` }}
                                    />
                                </div>
                                <span className="text-slate-400 text-xs">
                                    {isCollapsed ? "▶" : "▼"}
                                </span>
                            </div>
                        </button>

                        {!isCollapsed && (
                            <div className="px-5 pb-5 grid grid-cols-1 gap-4 md:grid-cols-2 animate-[fadeUp_0.3s_ease-in-out]">
                                {tasks.map(task => (
                                    <AssignedTaskCard
                                        key={task.id}
                                        task={task}
                                        viewAs={viewAs}
                                        onStatusChange={onStatusChange}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default GroupedTaskView