import type { GroupBy } from "../../types/assigned_task";

type Option = { value: GroupBy; label: string}

type Props = {
    groupBy: GroupBy
    options: Option[]
    onChange: (groupBy: GroupBy) => void
}

function GroupBySelector({ groupBy, options, onChange}: Props) {
    return (
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
            <span className="text-slate-500 font-medium">Group by</span>
            {options.map(opt => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all duration-200 ${
                        groupBy === opt.value
                            ? "bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow"
                            : "text-slate-500 hover:bg-slate-100"
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    )
}

export default GroupBySelector
