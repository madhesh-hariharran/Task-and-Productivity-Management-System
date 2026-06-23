type Props = {
    message: string
    onDismiss: () => void
}

function ActionError({ message, onDismiss }: Props) {
    return (
        <div className="
            flex items-center justify-between gap-4
            rounded-2xl
            border border-red-200
            bg-gradient-to-r from-rose-50 via-orange-50 to-white
            px-5 py-3
            shadow-[0_4px_12px_rgba(0,0,0,0.06)]
            animate-[fadeUp_0.3s_ease-in-out]
        ">
            <p className="text-sm text-red-700 font-medium">{message}</p>
            <button
                onClick={onDismiss}
                className="shrink-0 rounded-lg px-3 py-1 text-xs font-semibold text-red-500 hover:bg-red-100 transition-colors duration-200"
            >
                Dismiss
            </button>
        </div>
    )
}

export default ActionError
