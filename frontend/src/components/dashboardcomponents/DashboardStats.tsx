type StatsProps = {
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
    overdue_tasks: number;
    completion_rate: number;
};

function DashboardStats({total_tasks, completed_tasks, pending_tasks, overdue_tasks, completion_rate}: StatsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">

        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-white shadow-[0_4px_10px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <p className="text-sm text-slate-500">Total Tasks</p>
            <p className="text-xl font-semibold text-slate-800">{total_tasks}</p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-white shadow-[0_4px_10px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <p className="text-sm text-slate-500">Completed</p>
            <p className="text-xl font-semibold text-emerald-600">{completed_tasks}</p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-white shadow-[0_4px_10px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <p className="text-sm text-slate-500">Pending</p>
            <p className="text-xl font-semibold text-sky-600">{pending_tasks}</p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-white shadow-[0_4px_10px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <p className="text-sm text-slate-500">Overdue</p>
            <p className="text-xl font-semibold text-rose-600">{overdue_tasks}</p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-white shadow-[0_4px_10px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <p className="text-sm text-slate-500">Completion Rate</p>
            <p className="text-xl font-semibold text-orange-600">{completion_rate}%</p>
        </div>

        </div>
    );
}

export default DashboardStats;