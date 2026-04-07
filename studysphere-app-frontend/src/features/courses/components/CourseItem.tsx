import React from "react";
import icons from "../../../assets/icons/icons";
import { Course } from "../../../types/api";
import { Lecture } from "../../../types/api";
import { useNavigate } from "react-router-dom";
import LectureListItem from "../../course-material/components/LectureListItem";
import { paths } from "../../../config/paths";

interface CourseItemProps {
  courseItem: Course;
  activeCourse: Course | null;
  listOpen: Record<string, boolean>;
  setActiveCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  handleEdit: (e: React.FormEvent, courseName: string) => void;
  handleEditClick: (courseName: string) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    courseName: string,
  ) => void;
  hoveredCourse: string | null;
  setHoveredCourse: React.Dispatch<React.SetStateAction<string | null>>;
  setDeleteModalName: React.Dispatch<React.SetStateAction<string>>;
  openDeleteModal: (courseName: string) => void;
  courseInEdit: string | null;
  inputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  lectures?: Record<number, Lecture[]>;
  editValues: Record<string, string>;
  openList: (courseName: string) => void;
  closeList: (courseName: string) => void;
  setActiveLecture: React.Dispatch<React.SetStateAction<string>>
  activeLecture: string;
}

const CourseItem: React.FC<CourseItemProps> = ({
  courseItem,
  activeCourse,
  listOpen,
  setActiveCourse,
  handleEdit,
  handleEditClick,
  handleChange,
  hoveredCourse,
  setHoveredCourse,
  openDeleteModal,
  courseInEdit,
  inputRefs,
  lectures = {},
  editValues,
  openList,
  closeList,
  setActiveLecture,
  activeLecture,
}) => {
  const navigate = useNavigate();

  const currentLectures = courseItem
    ? lectures[parseInt(courseItem.id)] || []
    : [];

  const handleCourseClick = (courseItem: Course) => {
    setActiveLecture("");
    setActiveCourse(courseItem);
    localStorage.setItem("activeCourseId", courseItem.id);
    navigate(paths.app.course.getHref());
  };

  return (
    <li
      className={`cursor-pointer rounded-lg border px-3 py-3 transition ${
        activeCourse?.name === courseItem.name
          ? "border-accent bg-accentSoft text-text"
          : "border-transparent text-muted hover:border-border hover:bg-surfaceAlt hover:text-text"
      }`}
      onClick={() => handleCourseClick(courseItem)}
      onMouseEnter={() => setHoveredCourse(courseItem.name)}
      onMouseLeave={() => setHoveredCourse(null)}
    >
      <div className="flex flex-row justify-between gap-2">
        {courseInEdit === courseItem.name ? (
          <div className="flex flex-row gap-1 items-center">
            <div
              className={`transform transition-transform duration-200 ${
                listOpen?.[courseItem.name] ? "rotate-90" : "rotate-0"
              }`}
            >
              {icons.chevronRight()}
            </div>
            <form
              onSubmit={(e) => handleEdit(e, courseItem.name)}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                ref={(el) => (inputRefs.current[courseItem.name] = el)}
                type="text"
                value={editValues[courseItem.name] || ""}
                onChange={(e) => handleChange(e, courseItem.name)}
                className="w-[90%] border-b border-border bg-transparent text-sm font-semibold text-text focus:outline-none"
              />
            </form>
          </div>
        ) : (
          <div className="flex flex-row gap-2 items-center">
            <button
              type="button"
              className="text-muted hover:text-text"
              onClick={(e) => {
                e.stopPropagation();
                if (listOpen?.[courseItem.name]) {
                  closeList(courseItem.name);
                } else {
                  openList(courseItem.name);
                }
              }}
            >
              <div
                className={`transform transition-transform duration-200 ${
                  listOpen?.[courseItem.name] ? "rotate-90" : "rotate-0"
                }`}
              >
                {icons.chevronRight()}
              </div>
            </button>
            <div>
              <span className="text-sm font-semibold">{courseItem.name}</span>
              <p className="text-xs text-muted">{currentLectures.length} lectures</p>
            </div>
          </div>
        )}
        {hoveredCourse === courseItem.name && (
          <div className="flex flex-row gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(courseItem.name);
              }}
            >
              {icons.editIcon(4)}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openDeleteModal(courseItem.name);
              }}
            >
              {icons.deleteIcon(4)}
            </button>
          </div>
        )}
      </div>
      {listOpen?.[courseItem.name] && (
        <ul
          className={`ml-6 mt-3 flex w-[90%] flex-col ${
            currentLectures && currentLectures.length > 0
              ? "gap-2 border-l border-border pl-3"
              : ""
          }`}
        >
          {currentLectures?.map((lectureItem, index) => (
            <li
              key={index}
              className="text-sm"
            >
              <LectureListItem 
                setActiveLecture={setActiveLecture}
                activeLecture={activeLecture}
                lectureItem={lectureItem}
              />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default CourseItem;
