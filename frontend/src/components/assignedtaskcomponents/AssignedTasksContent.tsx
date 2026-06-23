import { useEffect, useState } from "react"
import { useAuth } from "../../context/useAuth"
import { isManager } from "../../utils/roleGuard"
import { groupTasks } from "../../utils/assignedTaskGrouping"
import type { GroupBy } from "../../types/assigned_task"
import {
    getAssignedByMe,
    getAssignedToMe,
    getAssignableUsers,
    createAssignedTask,
    updateAssignedTask,
    deleteAssignedTask,
} from "../../api/assignedTask"
import type {
    AssignedTask,
    AssignableUser,
    CreateAssignedTaskPayload,
    UpdateAssignedTaskPayload,
} from "../../types/assigned_task"
import { extractErrorMessage } from "../../utils/ErrorHandler"
import type { Status } from "../../types/task"
import GroupedTaskView from "./GroupedTaskView"
import GroupBySelector from "./GroupBySelector"
import AssignTaskModal from "./AssignTaskModal"
import EditAssignedTaskModal from "./EditAssignedTaskModal"
import ConfirmModal from "../taskcomponents/ConfirmModal"
import TasksError from "../taskcomponents/TasksError"
import ActionError from "../taskcomponents/ActionError"

function AssignedTasksContent() {
    const { role } = useAuth()
    const managerView = isManager(role)
    const viewRole = managerView ? "manager" : "worker"

    const [tasks, setTasks] = useState<AssignedTask[]>([])
    const [assignableUsers, setAssignableUsers] = useState<AssignableUser[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [actionError, setActionError] = useState("")
    const [refreshKey, setRefreshKey] = useState(0)
    const [groupBy, setGroupBy] = useState<GroupBy>("person")

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
    const [editTask, setEditTask] = useState<AssignedTask | null>(null)
    const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null)
    
    const grouped = groupTasks(tasks, groupBy, viewRole)

    const groupByOptions: { value: GroupBy; label: string }[] = [
        { value: "person", label: managerView ? "Worker" : "Manager"},
        { value: "priority", label: "Priority"},
        { value: "status", label: "Status"}
    ]

    useEffect(() => {
        async function load() {
            setLoading(true)
            setError("")
            try {
                if (managerView) {
                    const [allTasks, users] = await Promise.all([
                        getAssignedByMe(),
                        getAssignableUsers(),
                    ])
                    setTasks(Object.values(allTasks).flat())
                    setAssignableUsers(users)
                } else {
                    setTasks(await getAssignedToMe())
                }
            } catch (err: unknown) {
                setError(extractErrorMessage(err, "Failed to load tasks. Please try again."))
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [managerView, refreshKey])

    function refresh() { setRefreshKey(prev => prev + 1)}

    async function handleAssign(payload: CreateAssignedTaskPayload) {
        await createAssignedTask(payload)
        setIsAssignModalOpen(false)
        refresh()
    }

    async function handleUpdate(payload: UpdateAssignedTaskPayload) {
        if (!editTask) return
        await updateAssignedTask(editTask.id, payload)
        setEditTask(null)
        refresh()
    }

    async function handleStatusChange(task: AssignedTask, status: Status) {
        try {
            await updateAssignedTask(task.id, { status, is_completed: status === "completed" })
            refresh()
        } catch (err: unknown) {
            setActionError(extractErrorMessage(err, "Failed to update status."))
        }
    }

    async function confirmDelete() {
        if (!deleteTaskId) return
        try {
            await deleteAssignedTask(deleteTaskId)
            refresh()
        } catch (err: unknown) {
            setActionError(extractErrorMessage(err, "Failed to delete task."))
        } finally {
            setDeleteTaskId(null)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-sky-50 to-orange-50">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6 animate-[fadeUp_0.5s_ease-in-out]">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-sky-500 to-orange-400 bg-clip-text text-transparent">
                            Assigned Tasks
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {managerView ? "Tasks you've assigned to your team" : "Tasks assigned to you"}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {tasks.length > 0 && (
                            <GroupBySelector
                                groupBy={groupBy}
                                options={groupByOptions}
                                onChange={setGroupBy}
                            />
                        )}
                        {managerView && (
                            <button
                                onClick={() => setIsAssignModalOpen(true)}
                                className="rounded-xl bg-gradient-to-r from-indigo-600 via-sky-500 to-orange-400 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.96]"
                            >
                                + Assign Task
                            </button>
                        )}
                    </div>
                </div>

                {actionError && (
                    <ActionError message={actionError} onDismiss={() => setActionError("")} />
                )}

                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-300 border-t-indigo-600" />
                    </div>
                ) : error ? (
                    <TasksError message={error} />
                ) : tasks.length === 0 ? (
                    <p className="text-center text-slate-400 py-16 text-sm">
                        {managerView ? "You haven't assigned any tasks yet." : "No tasks assigned to you yet."}
                    </p>
                ) : (
                    <GroupedTaskView
                        grouped={grouped}
                        viewAs={viewRole}
                        groupBy={groupBy}
                        onStatusChange={handleStatusChange}
                        onEdit={setEditTask}
                        onDelete={setDeleteTaskId}
                    />
                )}

            </div>

            <AssignTaskModal
                isOpen={isAssignModalOpen}
                assignableUsers={assignableUsers}
                onClose={() => setIsAssignModalOpen(false)}
                onAssign={handleAssign}
            />
            <EditAssignedTaskModal
                isOpen={editTask !== null}
                task={editTask}
                onClose={() => setEditTask(null)}
                onUpdate={handleUpdate}
            />
            <ConfirmModal
                isOpen={deleteTaskId !== null}
                message="Are you sure you want to delete this assigned task?"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTaskId(null)}
            />
        </div>
    )
}

export default AssignedTasksContent