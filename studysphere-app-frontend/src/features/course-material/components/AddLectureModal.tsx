import React, { useState } from "react";
import InputField from "../../auth/components/InputField";
import icons from "../../../assets/icons/icons";
import { createLecture } from "../api/create-lecture";
import { Lecture } from "../../../types/api";
import { useNavigate } from "react-router-dom";
import { Course } from "../../../types/api";
import { paths } from "../../../config/paths";


interface AddSubjectModalProps {
  activeCourse: Course | null;
  onClose: () => void;
  setLectures: React.Dispatch<React.SetStateAction<Record<number, Lecture[]>>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddLectureModal: React.FC<AddSubjectModalProps> = ({
  activeCourse,
  onClose,
  setLectures,
  setIsLoading
}) => {
  const navigate = useNavigate();
  const [subjectName, setSubjectName] = useState("");
  const [url, setUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeButton, setActiveButton] = useState("url");

  const handleAddLecture = async (e: React.FormEvent) => {
    e.preventDefault();

    if (subjectName.trim() === "") {
      setErrorMessage("Lecture name cannot be empty");
      return;
    }

    onClose();
    
    try {
      setIsLoading(true);
      const newLecture = await createLecture(
        activeCourse?.id,
        subjectName.trim(),
        url.trim(),
      );
      if (!activeCourse?.id) {
        throw new Error("Class ID is undefined");
      }

      // Wait for lectures state to update before navigating
      await new Promise((resolve) => {
        setLectures((prev) => {
          const updatedLectures = {
            ...prev,
            [activeCourse.id]: [...(prev[parseInt(activeCourse.id)] || []), newLecture],
          };
          resolve(updatedLectures); //ensure it's updated before navigating
          return updatedLectures;
        });
      });

      setIsLoading(false);
      navigateToLecturePage(newLecture);

    } catch (error) {
      console.error("Error creating lecture:", error);
      setErrorMessage("Failed to create lecture, Please try again.");
    }
  };

  const navigateToLecturePage = (lecture: Lecture) => {
    navigate(paths.app.lecture.getHref(lecture.id), { state: { lecture, activeCourse } });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-lg border border-border bg-surface p-6 text-text shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-accent">
              New lecture
            </p>
            <h2 className="mt-2 font-montserrat text-2xl font-bold text-text">
              Add lecture material
            </h2>
            <p className="mt-2 text-sm text-muted">
              Save a source document to this course so you can read it, summarize it, and generate quiz questions from it.
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
          className="mt-6 flex w-full flex-col gap-5"
          onSubmit={handleAddLecture}
        >
          <div className="rounded-lg border border-border bg-surfaceAlt p-4">
            <InputField
              label="Lecture title"
              type="text"
              value={subjectName}
              onValueChange={setSubjectName}
              placeholder="Week 4: Thermodynamics"
            />
          </div>
          {errorMessage && (
            <p className="w-full text-left text-xs text-red-400">
              {errorMessage}
            </p>
          )}
          <div className="rounded-lg border border-border bg-surfaceAlt p-4">
            <div className="flex w-full flex-row justify-around gap-2 border-b border-border">
              <button
                type="button"
                className={`relative flex w-full flex-col items-center pb-3 text-sm ${activeButton === "url" ? "font-semibold text-text" : "text-muted hover:text-text"}`}
                onClick={() => setActiveButton("url")}
              >
                <div className="flex items-center gap-2">
                  {icons.linkIcon(
                    activeButton === "url" ? "white" : "lightgray",
                  )}
                  <span>URL</span>
                </div>
                {activeButton === "url" && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-accent"></span>
                )}
              </button>
              <button
                type="button"
                className={`relative flex w-full flex-col items-center pb-3 text-sm ${activeButton === "upload" ? "font-semibold text-text" : "text-muted hover:text-text"}`}
                onClick={() => setActiveButton("upload")}
              >
                <div className="flex items-center gap-2">
                  {icons.cloudIcon(
                    activeButton === "upload" ? "white" : "lightgray",
                  )}
                  <span>Upload</span>
                </div>
                {activeButton === "upload" && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-accent"></span>
                )}
              </button>
            </div>
            {activeButton === "url" && (
              <div className="mt-4">
                <InputField
                  label="Source URL"
                  type="text"
                  value={url}
                  onValueChange={setUrl}
                  placeholder="Paste a PDF or document link"
                />
                <div className="mt-5">
                  <p className="mb-2 text-sm font-semibold text-text">Supported sources</p>
                  <ul className="flex flex-col gap-2 text-sm text-muted">
                    <li>- Online PDF's</li>
                    <li>- Google Docs</li>
                    <li>- Google Slides</li>
                  </ul>
                </div>
              </div>
            )}
            {activeButton === "upload" && (
              <div className="mt-4 flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-surface py-14">
                <p className="text-text">Drag and drop a PDF file here</p>
                <div className="flex items-center w-52">
                  <span className="h-[1px] flex-grow bg-border"></span>
                  <span className="px-4 text-muted">or</span>
                  <span className="h-[1px] flex-grow bg-border"></span>
                </div>
                <button
                  className="mt-2 flex flex-row items-center gap-2 rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-accentHover"
                  type="button"
                >
                  {icons.uploadIcon}
                  Choose file
                </button>
              </div>
            )}
          </div>
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

export default AddLectureModal;
