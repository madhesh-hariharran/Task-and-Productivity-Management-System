type EmptyTasksProps = {
    onCreateClick: () => void;
};

function EmptyTasks({ onCreateClick }: EmptyTasksProps) {
    return (
        <div
            className="
            rounded-2xl
            bg-gradient-to-r from-indigo-50 via-sky-50 to-orange-50
            px-8 py-14
            text-center
            shadow-[0_6px_18px_rgba(0,0,0,0.08)]
            border border-indigo-100
            transition-all duration-300
            ease-[cubic-bezier(0.34,1.56,0.64,1)]
            hover:-translate-y-1 hover:shadow-lg
            "
        >
            <h3 className="text-xl font-semibold text-slate-800">
                No tasks yet
            </h3>

            <p className="mt-2 text-sm text-slate-600">
                Start by creating your first task and build momentum from there.
            </p>

            <button
                onClick={onCreateClick}
                className="
                mt-6
                rounded-xl
                bg-gradient-to-r from-indigo-600 via-sky-500 to-orange-400
                px-5 py-2.5
                text-sm font-medium text-white
                shadow-md shadow-indigo-200/40
                transition-all duration-300
                ease-[cubic-bezier(0.34,1.56,0.64,1)]
                hover:-translate-y-0.5 hover:shadow-lg
                active:scale-[0.96]
                "
            >
                Create Your First Task
            </button>
        </div>
    );
}

export default EmptyTasks;