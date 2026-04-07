import React, { useState } from "react";
import icons from "../../../assets/icons/icons";
import AddLectureModal from "../../course-material/components/AddLectureModal";
import { Course, Lecture } from "../../../types/api";
import { useNavigate } from "react-router-dom";
import NewCourseModal from "./NewCourseModal";
import LoadingSpinner from "./LoadingSpinner";
import { paths } from "../../../config/paths";


interface ContentBoxProps {
  openCourseModal: () => void;
  closeCourseModal: () => void;
  isClassModalOpen: boolean;
  setCourses: React.Dispatch<React.SetStateAction<Course[] | null>>
  setActiveLecture: React.Dispatch<React.SetStateAction<string>>
  lecturesByCourse: Record<number, Lecture[]>;
  setLecturesByCourse: React.Dispatch<React.SetStateAction<Record<number, Lecture[]>>>;
  activeCourse: Course | null;
}

const ContentBox: React.FC<ContentBoxProps> = ({
  openCourseModal,
  closeCourseModal,
  isClassModalOpen,
  setCourses,
  setActiveLecture,
  lecturesByCourse,
  activeCourse,
  setLecturesByCourse,
}) => {
  const navigate = useNavigate();
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const openLectureModal = () => setIsLectureModalOpen(true);
  const closeLectureModal = () => setIsLectureModalOpen(false);

  // Get the lectures for the current class
  const currentLectures = activeCourse
    ? lecturesByCourse[parseInt(activeCourse.id)] || []
    : [];

  const handleLectureClick = (lecture: Lecture) => {
    setActiveLecture(lecture.title);
    navigate(paths.app.lecture.getHref(lecture.id), { state: { lecture, activeCourse } });
  };

  return (
    <div className="h-full">
      {isLoading ? (
        <LoadingSpinner type={"creation"}/>
      ) : (
        <>
          <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-lg border border-border bg-white p-6 shadow-sm lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-accent">Course workspace</p>
              <h1 className="mt-2 font-montserrat text-4xl font-semibold text-text">
                {activeCourse ? activeCourse.name : "Choose a course"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-muted">
                Keep your lecture material in one place, then open any item to read the source and generate a summary.
              </p>
            </div>
            <button
              className="flex flex-row items-center gap-2 rounded-lg bg-accent px-4 py-3 font-semibold text-white shadow-glow-accent transition hover:bg-accentHover"
              onClick={openCourseModal}
            >
              {icons.plusIcon}
              <p className="text-base">New Course</p>
            </button>
          </div>
          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-normal text-accent">Lectures</p>
                <h2 className="mt-2 font-montserrat text-2xl font-bold text-text">Course material</h2>
              </div>
            <button
              onClick={openLectureModal}
              className="flex flex-row items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              {icons.plusIcon} Add lecture
            </button>
            </div>
            {currentLectures.length === 0 ? (
              <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                <p className="text-lg font-semibold text-text">No lectures yet</p>
                <p className="mt-2 text-sm text-muted">
                  Add a lecture URL to create your first study item for this course.
                </p>
              </div>
            ) : (
            <ul className="flex flex-row gap-10 flex-wrap mt-6">
              {currentLectures.map((lectureItem, index) => (
                <li
                  key={index}
                  className="group w-64 cursor-pointer rounded-lg border border-border bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-lg hover:shadow-blue-100/70"
                  onClick={() => handleLectureClick(lectureItem)}
                >
                  <div className="flex h-full flex-col justify-between">
                  <div>
                  <div className="inline-flex rounded-full bg-accentSoft px-3 py-1 text-xs font-semibold text-accent">
                    Lecture
                  </div>
                  <div className="py-4 font-semibold text-text">
                    {lectureItem.title}
                  </div>
                  <p className="text-sm text-muted">
                    Open the original document, generate a summary, and keep the material attached to this course.
                  </p>
                  </div>
                  <p className="text-sm font-semibold text-accent group-hover:text-accentHover">Open workspace</p>
                  </div>
                </li>
              ))}
            </ul>
            )}
          </div>
          </div>
          {isClassModalOpen && (
            <NewCourseModal onClose={closeCourseModal} setCourses={setCourses} />
          )}
          {isLectureModalOpen && (
            <AddLectureModal
              onClose={closeLectureModal}
              activeCourse={activeCourse}
              setLectures={setLecturesByCourse}
              setIsLoading={setIsLoading}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ContentBox;
