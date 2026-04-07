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
          <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 shadow-sm lg:flex-row lg:items-start lg:justify-between">
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
          <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-normal text-accent">Lectures</p>
                <h2 className="mt-2 font-montserrat text-2xl font-bold text-text">Course material</h2>
                <p className="mt-2 text-sm text-muted">
                  Add source material, keep each lecture organized, and jump back into the exact topic you want to study.
                </p>
              </div>
              <button
                onClick={openLectureModal}
                className="group flex min-w-[220px] flex-row items-center justify-center gap-3 rounded-lg border border-accent/30 bg-accentSoft px-5 py-3 text-sm font-semibold text-text transition hover:border-accent hover:bg-accent hover:text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white">
                  {icons.plusIcon}
                </span>
                <span className="flex flex-col items-start leading-tight">
                  <span>Add lecture</span>
                  <span className="text-xs font-medium text-muted group-hover:text-blue-100">
                    Attach a PDF or document link
                  </span>
                </span>
              </button>
            </div>
            {currentLectures.length === 0 ? (
              <div className="mt-8 rounded-lg border border-dashed border-border bg-surfaceAlt px-6 py-12 text-center">
                <p className="text-lg font-semibold text-text">No lectures yet</p>
                <p className="mt-2 text-sm text-muted">
                  Add a lecture URL to create your first study item for this course.
                </p>
              </div>
            ) : (
            <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {currentLectures.map((lectureItem, index) => (
                <li
                  key={index}
                  className="group cursor-pointer rounded-lg border border-border bg-surfaceAlt p-5 transition hover:-translate-y-0.5 hover:border-accent hover:bg-surface hover:shadow-lg hover:shadow-black/10"
                  onClick={() => handleLectureClick(lectureItem)}
                >
                  <div className="flex h-full flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="inline-flex rounded-full bg-accentSoft px-3 py-1 text-xs font-semibold text-accent">
                        Lecture
                      </div>
                      <div className="rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-normal text-muted">
                        PDF
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="line-clamp-2 text-lg font-semibold leading-7 text-text">
                        {lectureItem.title}
                      </p>
                      <p className="mt-2 text-sm text-muted">
                        Open the source, review the summary, and generate a quiz from this lecture.
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-normal text-muted">
                          Study tools
                        </p>
                        <p className="mt-1 text-sm text-text">PDF, summary, quiz</p>
                      </div>
                      <p className="text-sm font-semibold text-accent group-hover:text-accentHover">
                        Open
                      </p>
                    </div>
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
