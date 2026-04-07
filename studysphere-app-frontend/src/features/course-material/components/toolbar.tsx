import React, { useState } from "react";
import icons from "../../../assets/icons/icons";
import { Lecture } from "../../../types/api";
import { Course } from "../../../types/api";
import DeleteLectureModal from "./delete-lecture-modal";
import { deleteLecture } from "../api/delete-lecture";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../../../hooks/courses/use-courses";
import { paths } from "../../../config/paths";

interface ToolbarProps {
  lecture: Lecture | undefined;
  activeButton: string;
  setActiveButton: React.Dispatch<React.SetStateAction<string>>;
  courseItem: Course | null;
  summarize: (lectureId: string) => void;
  generateQuiz: () => void;
  hasQuiz: boolean;
  quizLoading: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  lecture,
  activeButton,
  setActiveButton,
  courseItem,
  summarize,
  generateQuiz,
  hasQuiz,
  quizLoading,
}) => {
  const navigate = useNavigate();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { lecturesByCourse, setLecturesByCourse } = useCourses();
  const [summarized, setSummarized] = useState(false);

  const handlePdfClick = () => {
    setActiveButton("pdf");
  };

  const handleSummaryClick = () => {
    if (lecture && !lecture?.summarizedContent && !summarized) {
      summarize(lecture.id);
      setSummarized(true);
    }
    setActiveButton("summary");
  };

  const handleQuizClick = () => {
    if (!hasQuiz && !quizLoading) {
      generateQuiz();
    }
    setActiveButton("quiz");
  };

  const handleEditClick = () => {};

  const openDeleteModal = () => setDeleteModalVisible(true);
  const closeDeleteModal = () => setDeleteModalVisible(false);

  
  const handleDelete = async () => {
    if (!courseItem) {
      console.error("Course item is null");
      return;
    }
    const courseId = parseInt(courseItem.id);
    const currentLectures = lecturesByCourse[courseId] || [];
    const lectureToDelete = currentLectures.find(
      (lectureItem) => lectureItem.id === lecture?.id
    );

    if (!lectureToDelete) {
      console.error("Lecture not found");
      return;
    }

    try {
      if (lecture?.id) {
        await deleteLecture(parseInt(lecture.id));
      } else {
        console.error("Lecture ID is undefined");
      }

      const updatedLectures = currentLectures.filter(
        (lectureItem) => lectureItem.title !== lectureToDelete.title,
      );

      setLecturesByCourse((prev) => ({
        ...prev,
        [courseId]: updatedLectures,
      }));
    } catch (error) {
      console.error("Error deleting lecture:", error);
    } finally {
        navigate(paths.app.course.getHref());
    }
  };


  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2">
        <button
          className={`flex flex-row items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition ${
            activeButton === "pdf"
              ? "bg-slate-900 text-white"
              : "bg-surfaceAlt text-muted hover:bg-surfaceAlt hover:text-text"
          }`}
          onClick={handlePdfClick}
        >
          {icons.pdfIcon(activeButton === "pdf")}
          <p>PDF</p>
        </button>
        <button
          className={`flex flex-row items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition ${
            activeButton === "summary"
              ? "bg-slate-900 text-white"
              : "bg-surfaceAlt text-muted hover:bg-surfaceAlt hover:text-text"
          }`}
          onClick={handleSummaryClick}
        >
          {icons.summaryIcon(activeButton === "summary")}
          <p>Summary</p>
        </button>
        <button
          className={`flex flex-row items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition ${
            activeButton === "quiz"
              ? "bg-slate-900 text-white"
              : "bg-surfaceAlt text-muted hover:bg-surfaceAlt hover:text-text"
          }`}
          onClick={handleQuizClick}
        >
          {icons.quizIcon(activeButton === "quiz")}
          <p>Quiz</p>
        </button>
      </div>
      <div className="flex flex-row gap-2 items-center justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditClick();
          }}
          className="rounded-lg border border-border bg-surfaceAlt p-3 text-muted transition hover:bg-surface hover:text-text"
        >
          {icons.editIcon(5)}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            openDeleteModal();
          }}
          className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-300 transition hover:bg-red-500/20 hover:text-red-200"
        >
          {icons.deleteIcon(5)}
        </button>
      </div>
      {deleteModalVisible && (
        <DeleteLectureModal
          lecture={lecture}
          onClose={closeDeleteModal}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Toolbar;
