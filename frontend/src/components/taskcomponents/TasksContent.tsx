import { useEffect, useMemo, useState } from "react";
import type { CreateTaskPayload, Task, UpdateTaskPayload, Priority, Status } from "../../types/task";
import TasksHeader from "./TasksHeader";
import TasksToolbar from "./TasksToolbar";
import TaskFilters from "./TaskFilters";
import TaskList from "./TaskList";
import TaskFormModal from "./TaskFormModal";
import EmptyTasks from "./EmptyTasks";
import TasksLoading from "./TasksLoading";
import TasksError from "./TasksError";
import ActionError from "./ActionError";
import ConfirmModal from "./ConfirmModal";
import {getTasks, createTask, updateTask, deleteTask} from "../../api/task";
import { extractErrorMessage } from "../../utils/ErrorHandler";


type FilterState = {
    priority: "" | Priority;
    status: "" | Status;
    deadline_before: string;
    deadline_after: string;
    sort_by: "" | "created_at" | "deadline" | "priority" | "status";
    order: "" | "asc" | "desc";
};

const initialFilters: FilterState = {
    priority: "",
    status: "",
    deadline_before: "",
    deadline_after: "",
    sort_by: "",
    order: "",
};

function TasksContent() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [actionError, setActionError] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [filters, setFilters] = useState<FilterState>(initialFilters);
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);

    const hasActiveFilters = useMemo(() => {
        return Boolean(
            filters.priority ||
            filters.status ||
            filters.deadline_before ||
            filters.deadline_after ||
            filters.sort_by ||
            filters.order
        );
    }, [filters]);

    useEffect(() => {
        async function fetchTasks() {
            setLoading(true);
            setError("");
            try {
                const params: Record<string, string> = {};
                if (filters.priority) params.priority = filters.priority;
                if (filters.status) params.status = filters.status;
                if (filters.deadline_before) params.deadline_before = filters.deadline_before;
                if (filters.deadline_after) params.deadline_after = filters.deadline_after;
                if (filters.sort_by) params.sort_by = filters.sort_by;
                if (filters.order) params.order = filters.order;
                const data = await getTasks(params)
                setTasks(data);
            } catch (err: unknown) {
                setError(extractErrorMessage(err, "Failed to load tasks. Please try again."));
                setTasks([]);
            } finally {
                setLoading(false);
            }
        }
        fetchTasks();
    }, [filters, hasActiveFilters, refreshKey]);

    function openCreateModal() {
        setModalMode("create");
        setSelectedTask(null);
        setIsModalOpen(true);
    }

    function openEditModal(task: Task) {
        setModalMode("edit");
        setSelectedTask(task);
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
        setSelectedTask(null);
    }

    async function handleCreateTask(payload: CreateTaskPayload) {
        try {
            await createTask(payload);
            closeModal();
            setRefreshKey(prev => prev + 1);
        } catch (err: unknown) {
            throw new Error(extractErrorMessage(err, "Failed to create task."));
        }
    }

    async function handleUpdateTask(payload: UpdateTaskPayload) {
        if (!selectedTask) return;
        try {
            await updateTask(selectedTask.id, payload);
            closeModal();
            setRefreshKey(prev => prev + 1);
        } catch (err: unknown) {
            throw new Error(extractErrorMessage(err, "Failed to update task."));
        }
    }

    function handleDeleteTask(taskId: number) {
        setDeleteTaskId(taskId);
    }

    async function confirmDelete() {
        if (!deleteTaskId) return;
        try {
            await deleteTask(deleteTaskId);
            setRefreshKey(prev => prev + 1);
        } catch (err: unknown) {
            setActionError(extractErrorMessage(err, "Failed to delete task."));
        } finally {
            setDeleteTaskId(null);
        }
    }

    function cancelDelete() {
        setDeleteTaskId(null);
    }

    async function handleQuickStatusChange(task: Task, nextStatus: Status) {
        const payload: UpdateTaskPayload = {
            status: nextStatus,
            is_completed: nextStatus === "completed",
        };
        try {
            await updateTask(task.id, payload);
            setRefreshKey(prev => prev + 1);
        } catch (err: unknown) {
            setActionError(extractErrorMessage(err, "Failed to update task status."));
        }
    }

    function handleFilterChange(name: keyof FilterState, value: string) {
        setFilters(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleClearFilters() {
        setFilters(initialFilters);
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-sky-50 to-orange-50">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6 animate-[fadeUp_0.5s_ease-in-out]">
                <TasksHeader />
                <TasksToolbar
                    onCreateClick={openCreateModal}
                    onClearFilters={handleClearFilters}
                    hasActiveFilters={hasActiveFilters}
                />
                <TaskFilters
                    filters={filters}
                    onChange={handleFilterChange}
                />
                {actionError && (
                    <ActionError
                        message={actionError}
                        onDismiss={() => setActionError("")}
                    />
                )}
                {loading ? (
                    <TasksLoading />
                ) : error ? (
                    <TasksError message={error} />
                ) : tasks.length === 0 ? (
                    <EmptyTasks onCreateClick={openCreateModal} />
                ) : (
                    <TaskList
                        tasks={tasks}
                        onEdit={openEditModal}
                        onDelete={handleDeleteTask}
                        onQuickStatusChange={handleQuickStatusChange}
                    />
                )}
                <TaskFormModal
                    isOpen={isModalOpen}
                    mode={modalMode}
                    task={selectedTask}
                    onClose={closeModal}
                    onCreate={handleCreateTask}
                    onUpdate={handleUpdateTask}
                />
                <ConfirmModal
                    isOpen={deleteTaskId !== null}
                    message="Are you sure you want to delete this task?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            </div>
        </div>
    ); 
}

export default TasksContent;