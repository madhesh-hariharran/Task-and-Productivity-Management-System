import type { AssignedTask } from "../../types/assigned_task";
import type { Status } from "../../types/task"

type Props = {
    task: AssignedTask
    // viewAs tells the card which label to show and which actions to allow
    viewAs: "manager" | "worker"
    onStatusChange: (task: AssignedTask, status: Status) => void
    onEdit: (task: AssignedTask) => void
    onDelete: (taskId: number) => void
}

function formatDate(dateString: string | null) {
    if (!dateString) return "No deadline"
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return "Invalid date"
    return date.toLocaleString()
}

function getPriorityClasses(priority: AssignedTask["priority"]) {
    switch (priority) {
        case "high": return "bg-rose-50 text-rose-700 border-rose-200"
        case "medium": return "bg-orange-50 text-orange-700 border-orange-200"
        case "low": return "bg-emerald-50 text-emerald-700 border-emerald-200"
        default: return "bg-slate-50 text-slate-700 border-slate-200"
    }
}

function getStatusClasses(status: AssignedTask["status"]) {
    switch (status) {
        case "completed": return "bg-emerald-50 text-emerald-700 border-emerald-200"
        case "in_progress": return "bg-sky-50 text-sky-700 border-sky-200"
        case "todo": return "bg-slate-100 text-slate-700 border-slate-200"
        default: return "bg-slate-50 text-slate-700 border-slate-200"
    }
}

function AssignedTaskCard({ task, viewAs, onStatusChange, onEdit, onDelete }: Props) {
    return (
        <div className="
            rounded-2xl
            border border-indigo-100
            bg-gradient-to-r from-indigo-50 via-sky-50 to-orange-50
            p-5
            shadow-[0_6px_18px_rgba(0,0,0,0.08)]
            transition-all duration-300
            ease-[cubic-bezier(0.34,1.56,0.64,1)]
            hover:-translate-y-1 hover:shadow-lg
        ">
            {/* Title + meta label */}
            <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-slate-900">
                        {task.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                        {viewAs === "worker"
                            ? `Assigned by ${task.assigner_username}`
                            : `Assigned to ${task.assignee_username}`}
                    </p>
                </div>
            </div>

            {/* Description */}
            <p className="mb-4 text-sm text-slate-600">
                {task.description?.trim() ? task.description : "No description added."}
            </p>

            {/* Priority + Status badges */}
            <div className="mb-4 flex flex-wrap gap-2">
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getPriorityClasses(task.priority)}`}>
                    {task.priority}
                </span>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(task.status)}`}>
                    {task.status.replace("_", " ")}
                </span>
            </div>

            {/* Dates */}
            <div className="mb-5 space-y-1 text-sm text-slate-600">
                <p>
                    <span className="font-medium text-slate-700">Deadline: </span>
                    {formatDate(task.deadline)}
                </p>
                {task.completed_at && (
                    <p>
                        <span className="font-medium text-slate-700">Completed: </span>
                        {formatDate(task.completed_at)}
                    </p>
                )}
            </div>

            {/* Action buttons — same pattern as TaskCard */}
            <div className="flex flex-wrap gap-2">
                {task.status !== "todo" && (
                    <button
                        onClick={() => onStatusChange(task, "todo")}
                        className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-medium text-slate-700 backdrop-blur transition-all duration-200 hover:bg-white"
                    >
                        Mark Todo
                    </button>
                )}
                {task.status !== "in_progress" && (
                    <button
                        onClick={() => onStatusChange(task, "in_progress")}
                        className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 transition-all duration-200 hover:bg-sky-100"
                    >
                        In Progress
                    </button>
                )}
                {task.status !== "completed" && (
                    <button
                        onClick={() => onStatusChange(task, "completed")}
                        className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition-all duration-200 hover:bg-emerald-100"
                    >
                        Complete
                    </button>
                )}

                <button
                    onClick={() => onEdit(task)}
                    className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition-all duration-200 hover:bg-indigo-100"
                >
                    Edit
                </button>

                {/* Only managers see delete */}
                {viewAs === "manager" && (
                    <button
                        onClick={() => onDelete(task.id)}
                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition-all duration-200 hover:bg-rose-100"
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    )
}

export default AssignedTaskCard