type TasksErrorProps = {
    message: string;
};

function TasksError({ message }: TasksErrorProps) {
    return (
        <div
            className="
            rounded-2xl
            border border-orange-200
            bg-gradient-to-r from-rose-50 via-orange-50 to-white
            px-6 py-10
            text-center
            shadow-[0_6px_16px_rgba(0,0,0,0.08)]
            transition-all duration-300
            hover:shadow-[0_10px_24px_rgba(0,0,0,0.10)]
            "
        >

            <h3 className="text-lg font-semibold text-orange-700">
                Unable to load tasks
            </h3>

            <p className="mt-2 text-sm text-orange-600">
                {message}
            </p>
        </div>
    );
}

export default TasksError;

