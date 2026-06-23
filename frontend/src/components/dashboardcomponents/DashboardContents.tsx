import { useState, useEffect } from "react";
import DashboardAverage from "./DashboardAverage";
import DashboardBreakdown from "./DashboardBreakdown";
import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";
import DashboardTimeline from "./DashboardTimeline";
import type { ProductivityReport } from "../../types/report";
import { getProductivityReport } from "../../api/task";
import { useAuth } from "../../context/useAuth";
import { extractErrorMessage } from "../../utils/ErrorHandler";

function DashboardContent() {
    const { user } = useAuth()
    const [report, setReport] = useState<ProductivityReport | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [hasFetchError, setHasFetchError] = useState<boolean>(false);
    const [fetchErrorMessage, setFetchErrorMessage] = useState<string>("");

    useEffect(() => {
        let isMounted = true;

        async function fetchReport() {
            try {
                const reportData = await getProductivityReport();
                if (isMounted) {
                    setReport(reportData);
                    setHasFetchError(false);
                    setFetchErrorMessage("");
                }
            } catch (err: unknown) {
                if (isMounted) {
                    setHasFetchError(true);
                    setFetchErrorMessage(extractErrorMessage(err, "Unable to load dashboard data."));
            }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchReport();

        return () => {
            isMounted = false;
        };
    }, []);

    const dashboardReport: ProductivityReport = report ?? {
        total_tasks: 0,
        completed_tasks: 0,
        pending_tasks: 0,
        overdue_tasks: 0,
        completion_rate: 0,
        tasks_due_today: 0,
        tasks_due_this_week: 0,
        priority_breakdown: {
            low: 0,
            medium: 0,
            high: 0,
        },
        status_breakdown: {
            todo: 0,
            in_progress: 0,
            completed: 0,
        },
        avg_completion_time_hours: null,
    };

    const isEmpty = !hasFetchError && dashboardReport.total_tasks === 0;

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-r from-indigo-50 via-sky-50 to-orange-50 p-6 animate-pulse flex flex-col space-y-6">
                <div className="max-w-6xl w-full mx-auto">
                    <div className="h-16 bg-slate-200 rounded-xl mb-6"></div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-20 bg-slate-200 rounded-xl" />
                        ))}
                    </div>
                    <div className="h-32 bg-slate-200 rounded-xl mb-6"></div>
                    <div className="h-32 bg-slate-200 rounded-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-r from-indigo-50 via-sky-50 to-orange-50 py-8">
            <div className="max-w-6xl mx-auto px-6 space-y-6 animate-[fadeUp_0.5s_ease-in-out]">
                <DashboardHeader username={user?.username ?? null} />

                {hasFetchError && (
                    <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 shadow-sm">
                        <span>
                            {fetchErrorMessage} Showing a basic view for now.
                        </span>
                    </div>
                )}

                {isEmpty && (
                    <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 shadow-sm">
                        <span>
                            Your dashboard is ready. Create your first task to start
                            tracking productivity insights.
                        </span>
                    </div>
                )}

                <DashboardStats
                    total_tasks={dashboardReport.total_tasks}
                    completed_tasks={dashboardReport.completed_tasks}
                    pending_tasks={dashboardReport.pending_tasks}
                    overdue_tasks={dashboardReport.overdue_tasks}
                    completion_rate={dashboardReport.completion_rate}
                />

                <DashboardBreakdown
                    title="Priority Breakdown"
                    data={dashboardReport.priority_breakdown}
                />

                <DashboardBreakdown
                    title="Status Breakdown"
                    data={dashboardReport.status_breakdown}
                />

                <DashboardTimeline
                    dueToday={dashboardReport.tasks_due_today}
                    dueThisWeek={dashboardReport.tasks_due_this_week}
                />

                <DashboardAverage
                    avgHours={dashboardReport.avg_completion_time_hours}
                />
            </div>
        </div>
    );
}

export default DashboardContent;