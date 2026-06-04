function TasksLoading() {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 animate-[fadeUp_0.4s_ease-in-out]">
            {Array.from({ length: 4 }).map((_, index) => (
                <div
                    key={index}
                    className="
                    animate-pulse
                    rounded-2xl
                    border border-indigo-100
                    bg-gradient-to-r from-indigo-50 via-sky-50 to-white
                    p-5
                    shadow-[0_6px_16px_rgba(0,0,0,0.08)]
                    "
                >
                    <div className="mb-4 h-5 w-1/2 rounded bg-indigo-100" />

                    <div className="mb-2 h-4 w-full rounded bg-indigo-100" />
                    <div className="mb-4 h-4 w-4/5 rounded bg-indigo-100" />

                    <div className="mb-4 flex gap-2">
                        <div className="h-7 w-20 rounded-full bg-sky-100" />
                        <div className="h-7 w-24 rounded-full bg-sky-100" />
                    </div>

                    <div className="mb-5 h-4 w-2/3 rounded bg-indigo-100" />

                    <div className="flex gap-2">
                        <div className="h-9 w-24 rounded-xl bg-indigo-100" />
                        <div className="h-9 w-20 rounded-xl bg-indigo-100" />
                        <div className="h-9 w-20 rounded-xl bg-indigo-100" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TasksLoading;

