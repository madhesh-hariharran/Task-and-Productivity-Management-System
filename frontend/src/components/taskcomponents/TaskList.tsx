import type { Task, Status } from "../../types/task";
import TaskCard from "./TaskCard";

type TaskListProps = {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (taskId: number) => void;
    onQuickStatusChange: (task: Task, nextStatus: Status) => void;
};

function TaskList({ tasks, onEdit, onDelete, onQuickStatusChange }: TaskListProps) {
    return (
        <div
            className="
            grid
            grid-cols-1
            gap-6
            md:grid-cols-2
            xl:grid-cols-2
            animate-[fadeUp_0.4s_ease-in-out]
            "
        >
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onQuickStatusChange={onQuickStatusChange}
                />
            ))}
        </div>
    );
}

export default TaskList;