import { useEffect, useState } from "react";
import type { CreateTaskPayload, Task, UpdateTaskPayload, Priority, Status } from "../../types/task";

type TaskFormModalProps = {
    isOpen: boolean;
    mode: "create" | "edit";
    task: Task | null;
    onClose: () => void;
    onCreate: (payload: CreateTaskPayload) => Promise<void>;
    onUpdate: (payload: UpdateTaskPayload) => Promise<void>;
};

function formatForDateTimeLocal(dateString: string | null | undefined) {
    if (!dateString) return "";
    return dateString.slice(0, 16); //since type datetime local doesnt have seconds
}

function TaskFormModal({ isOpen, mode, task, onClose, onCreate, onUpdate }: TaskFormModalProps) {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [priority, setPriority] = useState<Priority>("medium");
    const [status, setStatus] = useState<Status>("todo");
    const [deadline, setDeadline] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (mode === "edit" && task) {
            setTitle(task.title || "");
            setDescription(task.description || "");
            setPriority(task.priority || "medium");
            setStatus(task.status || "todo");
            setDeadline(formatForDateTimeLocal(task.deadline));
        } else {
            setTitle("");
            setDescription("");
            setPriority("medium");
            setStatus("todo");
            setDeadline("");
        }
        setError("");
        setSubmitting(false);
    }, [mode, task, isOpen]);

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!title.trim()) {
            setError("Title is required.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            const formattedDeadline = deadline || null;

            if (mode === "create") {
                const payload: CreateTaskPayload = {
                    title: title.trim(),
                    description: description.trim() || undefined,
                    priority,
                    deadline: formattedDeadline,
                };
                await onCreate(payload);
            } else {
                const payload: UpdateTaskPayload = {
                    title: title.trim(),
                    description: description.trim() || undefined,
                    priority,
                    status,
                    deadline: formattedDeadline,
                    is_completed: status === "completed",
                };
                await onUpdate(payload);
            }
        } catch (err: any) {
            const message = err?.response?.data?.detail || "Something went wrong";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    }

    const inputClass =
        "w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition bg-white";

    const selectClass =
        "w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition bg-white appearance-none pr-8 relative";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm px-4">
            <div className="w-full max-w-2xl rounded-2xl bg-gradient-to-r from-indigo-50 via-sky-50 to-orange-50 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">
                        {mode === "create" ? "Create Task" : "Edit Task"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-xl p-2 text-slate-500 hover:bg-red-100 hover:text-red-600 transition"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter task title"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            placeholder="Write a short description"
                            className={inputClass}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Priority</label>
                            <div className="relative">
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as Priority)}
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
                                onChange={(e) => setDeadline(e.target.value)}
                                className={inputClass}
                            />
                        </div>

                        {mode === "edit" && (
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
                                <div className="relative">
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as Status)}
                                        className={selectClass}
                                    >
                                        <option value="todo">Todo</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</span>
                                </div>
                            </div>
                        )}

                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-2xl px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-pink-400 via-red-400 to-red-500 shadow-sm shadow-red-200/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.96]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-2xl px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 via-sky-500 to-orange-400 shadow-md shadow-indigo-200/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.96] disabled:opacity-60"
                        >
                            {submitting
                                ? mode === "create"
                                    ? "Creating..."
                                    : "Saving..."
                                : mode === "create"
                                ? "Create Task"
                                : "Save Changes"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default TaskFormModal;