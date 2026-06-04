type TimelineProps = {
    dueToday: number;
    dueThisWeek: number;
};

function DashboardTimeline({ dueToday, dueThisWeek }: TimelineProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6">

            <div
                className="
                    flex-1 p-5
                    rounded-2xl
                    bg-gradient-to-r from-orange-50 via-rose-50 to-rose-100
                    shadow-[0_4px_10px_rgba(0,0,0,0.08)]
                    transition-all duration-300
                    hover:-translate-y-1 hover:shadow-lg
                "
            >
                <p className="text-sm text-rose-600">
                    Due Today
                </p>

                <p className="text-2xl font-semibold text-rose-700 mt-1">
                    {dueToday}
                </p>
            </div>

            <div
                className="
                    flex-1 p-5
                    rounded-2xl
                    bg-gradient-to-r from-indigo-50 via-sky-50 to-sky-100
                    shadow-[0_4px_10px_rgba(0,0,0,0.06)]
                    transition-all duration-300
                    hover:-translate-y-1 hover:shadow-lg
                "
            >
                <p className="text-sm text-indigo-600">
                    Due This Week
                </p>

                <p className="text-2xl font-semibold text-indigo-800 mt-1">
                    {dueThisWeek}
                </p>
            </div>

        </div>
    );
}

export default DashboardTimeline;