import React, { useState } from "react"
import type { AssignedTask, UpdateAssignedTaskPayload} from "../../types/assigned_task"
import type { Priority, Status } from "../../types/task"
import { extractErrorMessage } from "../../utils/ErrorHandler"

type Props = {
    isOpen: boolean
    task: AssignedTask | null
    onClose: () => void
    onUpdate: (payload: UpdateAssignedTaskPayload) => Promise<void>
}

type FormProps = {
    task: AssignedTask
    onClose: () => void
    onUpdate: (payload: UpdateAssignedTaskPayload) => Promise<void>
}

function formatForDateTimeLocal(dateString: string | null | undefined) {
    if (!dateString) return ""
    return dateString.slice(0,16)
}

// Inner form — receives task as guaranteed non-null.
// State is initialized directly from task props — no useEffect needed.
// key={task.id} on this component (set by the outer shell) causes React to
// fully remount it when a different task is opened, giving fresh state for free.
function EditAssignedTaskForm({ task, onClose, onUpdate }: FormProps) {
    const [title, setTitle] = useState(task.title)
    const [description, setDescription] = useState(task.description ?? "")
    const [priority, setPriority] = useState<Priority>(task.priority)
    const [status, setStatus] = useState<Status>(task.status)
    const [deadline, setDeadline] = useState(formatForDateTimeLocal(task.deadline))
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!title.trim()) { setError("Title is required."); return }

        setSubmitting(true)
        setError("")
        const updatePayload = {
            title: title.trim(),
            description: description.trim() === "" ? null : description.trim(),
            priority,
            status,
            deadline: deadline || null,
            is_completed: status === "completed",
        }
        try {
            await onUpdate(updatePayload)
            setSubmitting(false)
        } catch (err: unknown) {
            setError(extractErrorMessage(err, "Failed to update task."))
            setSubmitting(false)
        } 
    }

    const inputClass = "w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition bg-white"
    const selectClass = "w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition bg-white appearance-none"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm px-4">
            <div className="w-full max-w-2xl rounded-2xl bg-gradient-to-r from-indigo-50 via-sky-50 to-orange-50 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">

                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">Edit Assigned Task</h2>
                    <button
                        onClick={onClose}
                        className="rounded-xl p-2 text-slate-500 hover:bg-red-100 hover:text-red-600 transition"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={3}
                            className={inputClass}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Priority</label>
                            <div className="relative">
                                <select value={priority} onChange={e => setPriority(e.target.value as Priority)} className={selectClass}>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</span>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
                            <div className="relative">
                                <select value={status} onChange={e => setStatus(e.target.value as Status)} className={selectClass}>
                                    <option value="todo">Todo</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</span>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Deadline</label>
                            <input
                                type="datetime-local"
                                value={deadline}
                                onChange={e => setDeadline(e.target.value)}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-2xl px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-pink-400 via-red-400 to-red-500 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.96]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-2xl px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 via-sky-500 to-orange-400 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.96] disabled:opacity-60"
                        >
                            {submitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

// Outer shell — handles the isOpen guard and null check.
// Passes key={task.id} so React remounts EditAssignedTaskForm
// whenever a different task is selected, giving it fresh state automatically.
function EditAssignedTaskModal({ isOpen, task, onClose, onUpdate }: Props) {
    if (!isOpen || !task) return null

    return (
        <EditAssignedTaskForm
            key={task.id}
            task={task}
            onClose={onClose}
            onUpdate={onUpdate}
        />
    )
}

export default EditAssignedTaskModal