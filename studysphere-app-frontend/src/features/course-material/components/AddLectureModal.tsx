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
        className="flex flex-col items-center rounded-lg border border-border bg-surface px-14 text-text shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="pt-6 text-2xl font-bold text-text">
          Create new lecture
        </h2>
        <form
          className="flex flex-col gap-4 mt-4 w-full justify-center items-center"
          onSubmit={handleAddLecture}
        >
          <InputField
            label="Lecture Title"
            type="text"
            value={subjectName}
            onValueChange={setSubjectName}
          />
          {errorMessage && (
            <p className="text-red-500 text-xs text-left -mt-2 -mb-2 w-full pl-1">
              {errorMessage}
            </p>
          )}
          <div className="w-72 mt-4 items-center justify-center">
            <div className="flex w-full flex-row justify-around gap-2 border-b border-border">
              <button
                type="button"
                className={`relative flex w-36 flex-col items-center pb-2 text-lg ${activeButton === "url" ? "font-semibold text-text" : "text-muted hover:text-text"}`}
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
                className={`relative flex w-36 flex-col items-center pb-2 text-lg ${activeButton === "upload" ? "font-semibold text-text" : "text-muted hover:text-text"}`}
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
          </div>
          <div className="w-full h-64">
            {activeButton === "url" && (
              <div>
                <InputField
                  type="text"
                  value={url}
                  onValueChange={setUrl}
                  placeholder="Paste a URL here"
                />
                <div className="mt-4">
                  <p className="mb-2 text-text">Supports:</p>
                  <ul className="flex flex-col gap-2 text-muted">
                    <li>- Online PDF's</li>
                    <li>- Google Docs</li>
                    <li>- Google Slides</li>
                  </ul>
                </div>
              </div>
            )}
            {activeButton === "upload" && (
              <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-border py-16">
                <p className="text-text">Drag and drop a PDF file here</p>
                <div className="flex items-center w-52">
                  <span className="h-[1px] flex-grow bg-border"></span>
                  <span className="px-4 text-muted">or</span>
                  <span className="h-[1px] flex-grow bg-border"></span>
                </div>
                <button
                  className="mt-2 flex flex-row items-center gap-2 rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-accentHover dark:text-white"
                  type="button"
                >
                  {icons.uploadIcon}
                  Choose file
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-row items-center justify-center gap-4 mt-4 pb-6">
            <button
              onClick={onClose}
              type="button"
              className="rounded-lg px-5 py-2 font-semibold text-text transition hover:bg-surfaceAlt"
            >
              Cancel
            </button>
            <button
              className="rounded-lg bg-accent px-5 py-2 font-semibold text-slate-950 transition hover:bg-accentHover dark:text-white"
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
