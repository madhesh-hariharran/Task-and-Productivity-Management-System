function TasksHeader() {
    return (
        <div
            className="
            mb-6
            rounded-2xl
            bg-gradient-to-r from-indigo-50 via-sky-50 to-orange-50
            p-6
            shadow-[0_4px_8px_rgba(0,0,0,0.06),0_12px_24px_rgba(0,0,0,0.08)]
            transition-all duration-300
            animate-[fadeUp_0.5s_ease-in-out]
            "
        >
            <h1 className="text-3xl font-bold text-slate-800">
                <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
                    My Tasks
                </span>
            </h1>

            <p className="mt-1 text-sm text-slate-500">
                Organize your work, track progress, and stay on top of deadlines.
                <span className="ml-1 text-orange-500 font-medium">Just do it.</span>
            </p>
        </div>
    );
}

export default TasksHeader;

