type TasksToolbarProps = {
    onCreateClick: () => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
};

function TasksToolbar({ onCreateClick, onClearFilters, hasActiveFilters }: TasksToolbarProps) {
    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h2 className="text-lg font-semibold text-slate-800">
                    Task Manager
                </h2>
            </div>

            <div className="flex gap-3">
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="
                            rounded-2xl
                            px-4 py-2
                            text-sm font-medium
                            text-slate-700
                            bg-gradient-to-r from-indigo-50 via-sky-50 to-white
                            border border-indigo-200
                            shadow-[0_4px_12px_rgba(0,0,0,0.06)]
                            transition-all duration-300
                            hover:shadow-lg hover:-translate-y-0.5
                        "
                    >
                        Clear Filters
                    </button>
                )}

                <button
                    onClick={onCreateClick}
                    className="
                        rounded-2xl
                        px-4 py-2
                        text-sm font-medium
                        text-white
                        bg-gradient-to-r from-indigo-600 via-sky-500 to-orange-400
                        shadow-md shadow-black-200/40
                        transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                        hover:shadow-lg hover:-translate-y-0.5
                        active:scale-[0.96]
                        disabled:cursor-not-allowed disabled:opacity-60
                    "
                >
                    + Create Task
                </button>
            </div>
        </div>
    );
}

export default TasksToolbar;