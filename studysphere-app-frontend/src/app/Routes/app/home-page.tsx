import React, { useEffect, useMemo, useState } from "react";
import { useCourses } from "@/hooks/courses/use-courses";
import { getCourses } from "@/features/courses/api/get-courses";
import { Lecture, Course } from "@/types/api";
import DashboardLayout from "../../../components/layouts/dashboard-layout";
import CourseOverview from "../../../features/courses/components/course-overview";
import { CalendarEvent } from "../../../features/calendar/types";
import AddEventModal from "../../../features/calendar/components/AddEventModal";
import {
  loadCalendarEvents,
  saveCalendarEvents,
} from "../../../features/calendar/lib/storage";
import { format, isToday, parseISO } from "date-fns";

const HomePage: React.FC = () => {
  const { courses, setCourses, setActiveCourse, setLecturesByCourse } = useCourses();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

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

  useEffect(() => {
    setEvents(loadCalendarEvents());
  }, []);

  useEffect(() => {
    saveCalendarEvents(events);
  }, [events]);

  const totalLectures =
    courses?.reduce((count, course) => count + (course.lectures?.length || 0), 0) || 0;
  const summarizedLectures =
    courses?.reduce(
      (count, course) =>
        count + (course.lectures?.filter((lecture) => lecture.summarizedContent).length || 0),
      0,
    ) || 0;

  const todaysEvents = useMemo(
    () =>
      events
        .filter((event) => isToday(parseISO(event.date)))
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [events],
  );

  const upcomingEvents = useMemo(
    () =>
      events
        .filter((event) => parseISO(event.date) >= new Date() && !isToday(parseISO(event.date)))
        .sort((a, b) =>
          `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
        )
        .slice(0, 3),
    [events],
  );

  const handleAddEvent = (event: CalendarEvent) => {
    setEvents((currentEvents) =>
      [...currentEvents, event].sort((a, b) =>
        `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
      ),
    );
    setIsAddEventOpen(false);
  };

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
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-normal text-accent">Schedule</p>
                <h2 className="mt-3 font-montserrat text-2xl font-bold text-text">Today&apos;s events</h2>
                <p className="mt-2 text-sm text-muted">
                  Keep today in view and add a study block without leaving the dashboard.
                </p>
              </div>
              <button
                onClick={() => setIsAddEventOpen(true)}
                className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-accentHover dark:text-white"
              >
                Add event
              </button>
            </div>
            <div className="mt-6 space-y-4">
              {todaysEvents.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-surfaceAlt px-4 py-10 text-center">
                  <p className="text-sm font-semibold text-text">Nothing scheduled today</p>
                  <p className="mt-2 text-sm text-muted">
                    Add a study session or deadline to start building your routine.
                  </p>
                </div>
              ) : (
                todaysEvents.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-lg bg-surfaceAlt px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-text">{event.title}</p>
                        <p className="mt-1 text-sm text-muted">
                          {event.startTime} - {event.endTime}
                        </p>
                      </div>
                      <span className="rounded-full bg-accentSoft px-3 py-1 text-xs font-semibold text-accent">
                        {event.type}
                      </span>
                    </div>
                    {event.notes && (
                      <p className="mt-3 text-sm text-muted">{event.notes}</p>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-normal text-accent">
                Coming up
              </p>
              <div className="mt-4 space-y-3">
                {upcomingEvents.length === 0 ? (
                  <div className="rounded-lg bg-surfaceAlt px-4 py-4">
                    <p className="text-sm text-muted">No upcoming events yet.</p>
                  </div>
                ) : (
                  upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-lg bg-surfaceAlt px-4 py-4"
                    >
                      <p className="text-sm font-semibold text-text">{event.title}</p>
                      <p className="mt-1 text-sm text-muted">
                        {format(parseISO(event.date), "EEE, MMM d")} · {event.startTime}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
      {isAddEventOpen && (
        <AddEventModal
          selectedDate={format(new Date(), "yyyy-MM-dd")}
          onClose={() => setIsAddEventOpen(false)}
          onSubmit={handleAddEvent}
        />
      )}
    </DashboardLayout>
  );
};

export default HomePage;
