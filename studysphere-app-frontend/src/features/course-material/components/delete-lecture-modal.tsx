import React from "react";
import { Lecture } from "../../../types/api";

interface DeleteLectureModalProps {
  lecture: Lecture | undefined;
  onClose: () => void;
  handleDelete: () => Promise<void>;
}

const DeleteLectureModal: React.FC<DeleteLectureModalProps> = ({ lecture, onClose, handleDelete }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="flex w-[40rem] flex-col items-center gap-4 rounded-lg border border-border bg-surface p-4 text-text shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-lg">
          Are you sure you want to delete the lecture{" "}
          <strong>{lecture?.title}</strong>? The lecture and all its content will be
          removed.
        </h1>
        <div className="flex flex-row gap-3 w-full justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-accent px-4 py-1 font-medium text-slate-950 hover:bg-accentHover dark:text-white"
          >
            Cancel
          </button>
          <button
            className="bg-red-700 rounded-lg py-1 px-4 font-medium hover:bg-red-800"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteLectureModal;
