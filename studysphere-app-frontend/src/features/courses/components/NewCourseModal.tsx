import React, { useState } from "react";
import InputField from "../../auth/components/InputField";
import { createCourse } from "../api/create-course";
import { Course } from "../../../types/api";

interface NewCourseModalProps {
  onClose: () => void;
  setCourses: React.Dispatch<React.SetStateAction<Course[] | null>>
}

const NewCourseModal: React.FC<NewCourseModalProps> = ({
  onClose,
  setCourses,
}) => {
  const [courseName, setCourseName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const capitalizeCourseName = (courseName: string) => {
    return courseName.charAt(0).toUpperCase() + courseName.slice(1);
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (courseName.trim() === "") {
      setErrorMessage("Course name cannot be empty");
      return;
    }

    try {
      console.log(courseName);
      const newCourseCapitalized = capitalizeCourseName(courseName);
      console.log(newCourseCapitalized);
      const newCourse = await createCourse(newCourseCapitalized);

      setCourses((prevCourses) => [...(prevCourses || []), newCourse]);
      setCourseName("");
      onClose();
    } catch (error) {
      console.error("Error creating course:", error);
      setErrorMessage("Failed to create course, Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-border bg-surface p-6 text-text shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-accent">
              New course
            </p>
            <h2 className="mt-2 font-montserrat text-2xl font-bold text-text">
              Create a course
            </h2>
            <p className="mt-2 text-sm text-muted">
              Start a new study space for a subject, module, or class.
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-muted transition hover:bg-surfaceAlt hover:text-text"
          >
            Close
          </button>
        </div>
        <form
          className="mt-6 flex flex-col gap-5"
          onSubmit={handleAddCourse}
        >
          <div className="rounded-lg border border-border bg-surfaceAlt p-4">
            <InputField
              label="Course name"
              type="text"
              value={courseName}
              onValueChange={setCourseName}
              placeholder="Modern Physics"
            />
          </div>
          {errorMessage && (
            <p className="text-left text-xs text-red-400">
              {errorMessage}
            </p>
          )}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
            <button
              onClick={onClose}
              type="button"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-text transition hover:bg-surfaceAlt"
            >
              Cancel
            </button>
            <button
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accentHover"
              type="submit"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCourseModal;
