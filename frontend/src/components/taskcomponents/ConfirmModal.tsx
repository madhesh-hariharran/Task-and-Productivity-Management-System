type ConfirmModalProps = {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
};

function ConfirmModal({ isOpen, message, onConfirm, onCancel }: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
            <div className="w-full max-w-md rounded-2xl bg-gradient-to-r from-indigo-50 via-sky-50 to-orange-50 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300">
                <p className="text-slate-900 text-lg font-semibold mb-6">{message}</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onCancel}
                        className="rounded-xl px-4 py-2 bg-gray-200 text-slate-700 hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded-xl px-4 py-2 bg-rose-500 text-white hover:bg-rose-600 transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;