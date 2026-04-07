import React from "react";

interface DeleteCourseModalProps {
  courseName: string;
  onClose: () => void;
  handleDelete: () => Promise<void>;
}

const DeleteCourseModal: React.FC<DeleteCourseModalProps> = ({
  courseName,
  onClose,
  handleDelete,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex w-[40rem] flex-col items-center gap-4 rounded-lg border border-border bg-surface p-4 text-text shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-lg">
          Are you sure you want to delete the class <strong>{courseName}</strong>
          ? The class and all its content will be removed.
        </h1>
        <div className="flex flex-row gap-3 w-full justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-accent px-4 py-1 font-medium text-slate-950 hover:bg-accentHover dark:text-white"
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-red-700 px-4 py-1 font-medium text-white hover:bg-red-800"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCourseModal;
