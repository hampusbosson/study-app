import React from "react";
import { useCourses } from "../../../hooks/courses/use-courses";
import { useNavigate } from "react-router-dom";
import { paths } from "../../../config/paths";

const CourseOverview: React.FC = () => {
  const { courses, setActiveCourse } = useCourses();
  const navigate = useNavigate();

    const handleCourseClick = (courseId: string) => {
        const selectedCourse = courses?.find((course) => course.id === courseId) || null;
        setActiveCourse(selectedCourse);
        if (selectedCourse) {
          localStorage.setItem("activeCourseId", selectedCourse.id);
        }
        navigate(paths.app.course.getHref());
    };

  return (
    <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-accent">Courses</p>
          <h2 className="mt-2 font-montserrat text-2xl font-bold text-text">Active courses</h2>
        </div>
        <p className="rounded-full bg-accentSoft px-3 py-1 text-sm font-semibold text-accent">
          {courses?.length || 0} total
        </p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
  {courses?.map((course) => (
    <div
      key={course.id}
      onClick={() => handleCourseClick(course.id)}
      className="cursor-pointer rounded-lg border border-border bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-lg hover:shadow-blue-100/70"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-base font-semibold text-text">{course.name}</p>
        <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-muted">
          {(course.lectures?.length || 0).toString().padStart(2, "0")}
        </span>
      </div>
      <p className="mt-3 text-sm text-muted">Lectures: {course.lectures?.length || 0}</p>
      <div className="mt-4">
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-accent"
            style={{
              width: `${Math.min(
                100,
                Math.round((((course.lectures || []).filter((lecture) => lecture.summarizedContent).length || 0) /
                  Math.max(course.lectures?.length || 0, 1)) *
                  100),
              )}%`,
            }}
          />
        </div>
        <p className="mt-2 text-sm text-muted">
          {
            (course.lectures || []).filter((lecture) => lecture.summarizedContent)
              .length
          }{" "}
          summarized
        </p>
      </div>
    </div>
  ))}
</div>
    </div>
  );
};

export default CourseOverview;
