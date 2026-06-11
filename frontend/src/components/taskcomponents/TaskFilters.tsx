import type { Priority, Status } from "../../types/task";

type FilterState = {
    priority: "" | Priority;
    status: "" | Status;
    deadline_before: string;
    deadline_after: string;
    sort_by: "" | "created_at" | "deadline" | "priority" | "status";
    order: "" | "asc" | "desc";
};

type TaskFiltersProps = {
    filters: FilterState;
    onChange: (name: keyof FilterState, value: string) => void;
};

function TaskFilters({ filters, onChange }: TaskFiltersProps) {
    return (
        <div
            className="
            mb-6
            rounded-2xl
            border border-indigo-100
            bg-gradient-to-r from-indigo-50 via-sky-50 to-orange-50
            p-6
            shadow-[0_6px_18px_rgba(0,0,0,0.08)]
            transition-all duration-300
            ease-[cubic-bezier(0.34,1.56,0.64,1)]
            hover:shadow-lg
            "
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Priority
                    </label>

                    <select
                        value={filters.priority}
                        onChange={(e) => onChange("priority", e.target.value)}
                        className="
                        w-full rounded-xl
                        border border-indigo-100
                        bg-white/70
                        backdrop-blur
                        px-3 py-2 text-sm
                        outline-none
                        transition
                        focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200
                        "
                    >
                        <option value="">All</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Status
                    </label>

                    <select
                        value={filters.status}
                        onChange={(e) => onChange("status", e.target.value)}
                        className="
                        w-full rounded-xl
                        border border-indigo-100
                        bg-white/70
                        backdrop-blur
                        px-3 py-2 text-sm
                        outline-none
                        transition
                        focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200
                        "
                    >
                        <option value="">All</option>
                        <option value="todo">Todo</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Deadline After
                    </label>

                    <input
                        type="datetime-local"
                        value={filters.deadline_after}
                        onChange={(e) => onChange("deadline_after", e.target.value)}
                        className="
                        w-full rounded-xl
                        border border-indigo-100
                        bg-white/70
                        backdrop-blur
                        px-3 py-2 text-sm
                        outline-none
                        transition
                        focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200
                        "
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Deadline Before
                    </label>

                    <input
                        type="datetime-local"
                        value={filters.deadline_before}
                        onChange={(e) => onChange("deadline_before", e.target.value)}
                        className="
                        w-full rounded-xl
                        border border-indigo-100
                        bg-white/70
                        backdrop-blur
                        px-3 py-2 text-sm
                        outline-none
                        transition
                        focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200
                        "
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Sort By
                    </label>

                    <select
                        value={filters.sort_by}
                        onChange={(e) => onChange("sort_by", e.target.value)}
                        className="
                        w-full rounded-xl
                        border border-indigo-100
                        bg-white/70
                        backdrop-blur
                        px-3 py-2 text-sm
                        outline-none
                        transition
                        focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200
                        "
                    >
                        <option value="">None</option>
                        <option value="created_at">Created At</option>
                        <option value="deadline">Deadline</option>
                        <option value="priority">Priority</option>
                        <option value="status">Status</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Order
                    </label>

                    <select
                        value={filters.order}
                        onChange={(e) => onChange("order", e.target.value)}
                        className="
                        w-full rounded-xl
                        border border-indigo-100
                        bg-white/70
                        backdrop-blur
                        px-3 py-2 text-sm
                        outline-none
                        transition
                        focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200
                        "
                    >
                        <option value="">None</option>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>

            </div>
        </div>
    );
}

export default TaskFilters;