import React, { useState } from "react"
import type { CreateAssignedTaskPayload, AssignableUser } from "../../types/assigned_task"
import type { Priority } from "../../types/task"
import { extractErrorMessage } from "../../utils/ErrorHandler"

type Props = {
    isOpen: boolean
    assignableUsers: AssignableUser[]
    onClose: () => void
    onAssign: (payload: CreateAssignedTaskPayload) => Promise<void>
}

function AssignTaskModal({ isOpen, assignableUsers, onClose, onAssign}: Props) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState<Priority>("medium")
    const [deadline, setDeadline] = useState("")
    const [assigneeId, setAssigneeId] = useState<number | "">("")
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    if (!isOpen) return null

    function resetForm() {
        setTitle("")
        setDescription("")
        setPriority("medium")
        setDeadline("")
        setAssigneeId("")
        setError("")
        setSubmitting(false)
    }

    function handleClose() {
        resetForm()
        onClose()
    }

    async function handleSubmit (e: React.FormEvent) {
        e.preventDefault()
        if(!title.trim()) { setError("Title is required."); return}
        if (assigneeId === "") { setError("Please select an assignee."); return}
        
        setSubmitting(true)
        setError("")
        try {
            await onAssign({
                title: title.trim(),
                description: description.trim() || undefined,
                priority,
                deadline: deadline || null,
                assignee_id: assigneeId as number,
            })
            // Reset before parent closes the modal - prevents ghost form on next open
            resetForm()
        } catch (err: unknown) {
            setError(extractErrorMessage(err, "Failed to assign task."))
            setSubmitting(false)
        }
    }

    const inputClass = "w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition bg-white"
    const selectClass = "w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition bg-white appearance-none"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm px-4">
            <div className="w-full max-w-2xl rounded-2xl bg-gradient-to-r from-indigo-50 via-sky-50 to-orange-50 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">

                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">Assign Task</h2>
                    <button
                        onClick={handleClose}
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
                            placeholder="Enter task title"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Write a short description"
                            className={inputClass}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Assignee</label>
                            <div className="relative">
                                <select
                                    value={assigneeId}
                                    onChange={e => setAssigneeId(Number(e.target.value))}
                                    className={selectClass}
                                >
                                    <option value="">Select person</option>
                                    {assignableUsers.map(u => (
                                        <option key={u.id} value={u.id}>
                                            {u.username} ({u.role})
                                        </option>
                                    ))}
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</span>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Priority</label>
                            <div className="relative">
                                <select
                                    value={priority}
                                    onChange={e => setPriority(e.target.value as Priority)}
                                    className={selectClass}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
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
                            onClick={handleClose}
                            className="rounded-2xl px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-pink-400 via-red-400 to-red-500 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.96]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-2xl px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 via-sky-500 to-orange-400 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.96] disabled:opacity-60"
                        >
                            {submitting ? "Assigning..." : "Assign Task"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default AssignTaskModal