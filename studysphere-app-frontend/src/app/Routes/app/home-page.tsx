import React, { useEffect } from "react";
import { useCourses } from "@/hooks/courses/use-courses";
import { getCourses } from "@/features/courses/api/get-courses";
import { Lecture, Course } from "@/types/api";
import DashboardLayout from "../../../components/layouts/dashboard-layout";
import CourseOverview from "../../../features/courses/components/course-overview";


const HomePage: React.FC = () => {
  const { courses, setCourses, setActiveCourse, setLecturesByCourse } = useCourses();

    useEffect(() => {
      const fetchCoursesWithLectures = async () => {
        try {
          const userCourses = await getCourses();
          setCourses(userCourses || []);
          if (userCourses && userCourses.length > 0) {
            const storedCourseId = localStorage.getItem("activeCourseId");
            if (storedCourseId) {
              console.log(storedCourseId);
              const foundCourse = userCourses.find(course => parseInt(course.id) === parseInt(storedCourseId));
              console.log(foundCourse);
              if (foundCourse) {
                setActiveCourse(foundCourse);
              }
            } else {
              setActiveCourse(userCourses[0]);
            }
            const newLecturesByCourse: Record<number, Lecture[]> =
              userCourses.reduce(
                (acc: Record<number, Lecture[]>, courseItem: Course) => {
                  acc[parseInt(courseItem.id)] = courseItem.lectures || [];
                  return acc;
                },
                {},
              );
  
            setLecturesByCourse(newLecturesByCourse);
          }
        } catch (error) {
          console.error("Error fetching classes and lectures:", error);
        }
      };
  
      fetchCoursesWithLectures();
    }, []);

  const totalLectures =
    courses?.reduce((count, course) => count + (course.lectures?.length || 0), 0) || 0;
  const summarizedLectures =
    courses?.reduce(
      (count, course) =>
        count + (course.lectures?.filter((lecture) => lecture.summarizedContent).length || 0),
      0,
    ) || 0;

  return (
    <DashboardLayout>
      <div className="flex h-full flex-col gap-8">
        <section className="rounded-lg bg-accent-gradient px-8 py-8 text-white shadow-glow-accent">
          <p className="text-sm font-semibold uppercase tracking-normal text-blue-100">Dashboard</p>
          <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="font-montserrat text-4xl font-bold">Stay on top of every course.</h1>
              <p className="mt-3 text-base text-blue-50">
                Organize lecture material, jump into active courses, and turn long PDFs into study-ready notes.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-2xl font-bold">{courses?.length || 0}</p>
                <p className="text-sm text-blue-100">Active courses</p>
              </div>
              <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-2xl font-bold">{totalLectures}</p>
                <p className="text-sm text-blue-100">Lecture items</p>
              </div>
              <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-2xl font-bold">{summarizedLectures}</p>
                <p className="text-sm text-blue-100">AI summaries</p>
              </div>
            </div>
          </div>
        </section>
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <CourseOverview />
          <section className="rounded-lg border border-border bg-surface p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-normal text-accent">Study workflow</p>
            <h2 className="mt-3 font-montserrat text-2xl font-bold text-text">Your demo flow is already here.</h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-lg bg-surfaceAlt px-4 py-4">
                <p className="text-sm font-semibold text-text">1. Create a course</p>
                <p className="mt-1 text-sm text-muted">Set up each subject as its own workspace.</p>
              </div>
              <div className="rounded-lg bg-surfaceAlt px-4 py-4">
                <p className="text-sm font-semibold text-text">2. Add a lecture URL</p>
                <p className="mt-1 text-sm text-muted">Pull in a PDF or public document and save it to the course.</p>
              </div>
              <div className="rounded-lg bg-surfaceAlt px-4 py-4">
                <p className="text-sm font-semibold text-text">3. Read and summarize</p>
                <p className="mt-1 text-sm text-muted">Switch between source material and an AI-generated summary.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HomePage;
