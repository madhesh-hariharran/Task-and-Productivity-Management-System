type AverageCompletionProps = {
    avgHours: number | null;
};

function DashboardAverage({ avgHours }: AverageCompletionProps) {
    return (
        <div
        className="
            p-5
            rounded-2xl
            bg-gradient-to-br from-emerald-50 to-white
            shadow-[0_4px_10px_rgba(0,0,0,0.06)]
            mb-6
            transition-all duration-300
            hover:-translate-y-1 hover:shadow-lg
        "
        >
            <p className="text-sm text-slate-500">
                Average Completion Time
            </p>

            <p className="text-2xl font-semibold text-emerald-600 mt-1">
                {avgHours !== null ? `${avgHours} hrs` : "—"}
            </p>
        </div>
    );
}

export default DashboardAverage;