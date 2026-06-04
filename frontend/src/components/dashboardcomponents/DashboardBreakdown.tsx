type BreakdownData = {
    [key: string]: number;
};

type BreakdownProps = {
    title: string;
    data: BreakdownData;
};

function DashboardBreakdown({ title, data }: BreakdownProps) {
    return (
        <div
            className="
            p-6
            rounded-2xl
            bg-gradient-to-r from-indigo-50 via-sky-50 to-orange-50  /* horizontal gradient now */
            shadow-[0_4px_12px_rgba(0,0,0,0.08)]
            border border-indigo-100
            mb-6
            transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            hover:scale-[1.01] hover:shadow-lg
        "
        >
            <h2 className="text-lg font-semibold text-indigo-800 mb-4">{title}</h2>

            <div className="flex flex-wrap gap-3">
                {Object.entries(data).map(([key, value]) => (
                    <div
                        key={key}
                        className="
                        flex flex-col items-center justify-center
                        px-4 py-3
                        rounded-xl
                        bg-gradient-to-br from-pink-100 to-orange-50  /* more pink, mild orange */
                        min-w-[110px]
                        flex-1
                        shadow-[0_2px_8px_rgba(0,0,0,0.08)]
                        transition-all duration-300
                        hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]
                        "
                    >
                        <p className="text-xs text-indigo-600 capitalize">
                            {key.replace("_", " ")}
                        </p>
                        <p className="text-lg font-semibold text-indigo-900">{value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DashboardBreakdown;