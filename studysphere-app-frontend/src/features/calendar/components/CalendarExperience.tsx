import React, { useEffect, useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import AddEventModal from "./AddEventModal";
import { CalendarEvent, CalendarEventType, CalendarView } from "../types";
import { loadCalendarEvents, saveCalendarEvents } from "../lib/storage";

const eventTypeStyles: Record<CalendarEventType, string> = {
  study: "bg-accentSoft text-accent",
  session: "bg-emerald-500/12 text-emerald-300",
  deadline: "bg-rose-500/12 text-rose-300",
};

const CalendarExperience: React.FC = () => {
  const [view, setView] = useState<CalendarView>("week");
  const [selectedDate, setSelectedDate] = useState(() =>
    format(new Date(), "yyyy-MM-dd"),
  );
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>(() => loadCalendarEvents());

  useEffect(() => {
    saveCalendarEvents(events);
  }, [events]);

  const selectedDateObject = useMemo(() => parseISO(selectedDate), [selectedDate]);

  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });

    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDateObject, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, index) => addDays(start, index));
  }, [selectedDateObject]);

  const selectedDayEvents = useMemo(
    () =>
      events
        .filter((event) => event.date === selectedDate)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [events, selectedDate],
  );

  const goToPrevious = () => {
    if (view === "month") {
      setCurrentDate((date) => subMonths(date, 1));
      return;
    }

    if (view === "week") {
      const nextDate = subWeeks(selectedDateObject, 1);
      setCurrentDate(nextDate);
      setSelectedDate(format(nextDate, "yyyy-MM-dd"));
      return;
    }

    const nextDate = addDays(selectedDateObject, -1);
    setCurrentDate(nextDate);
    setSelectedDate(format(nextDate, "yyyy-MM-dd"));
  };

  const goToNext = () => {
    if (view === "month") {
      setCurrentDate((date) => addMonths(date, 1));
      return;
    }

    if (view === "week") {
      const nextDate = addWeeks(selectedDateObject, 1);
      setCurrentDate(nextDate);
      setSelectedDate(format(nextDate, "yyyy-MM-dd"));
      return;
    }

    const nextDate = addDays(selectedDateObject, 1);
    setCurrentDate(nextDate);
    setSelectedDate(format(nextDate, "yyyy-MM-dd"));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(format(today, "yyyy-MM-dd"));
  };

  const handleCreateEvent = (event: CalendarEvent) => {
    setEvents((currentEvents) =>
      [...currentEvents, event].sort((a, b) =>
        `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
      ),
    );
    setSelectedDate(event.date);
    setCurrentDate(parseISO(event.date));
    setIsModalOpen(false);
  };

  const eventsForDate = (date: Date) =>
    events
      .filter((event) => event.date === format(date, "yyyy-MM-dd"))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const title =
    view === "month"
      ? format(currentDate, "MMMM yyyy")
      : view === "week"
        ? `${format(weekDays[0], "MMM d")} - ${format(weekDays[6], "MMM d")}`
        : format(selectedDateObject, "EEEE, MMMM d");

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-accent">
              Calendar
            </p>
            <h1 className="mt-2 font-montserrat text-3xl font-bold text-text">
              Plan your study sessions
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted">
              Switch between day, week, and month views, then drop in study blocks, deadlines, or focused work sessions.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-surfaceAlt p-1">
              {(["day", "week", "month"] as CalendarView[]).map((item) => (
                <button
                  key={item}
                  onClick={() => setView(item)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    view === item
                      ? "bg-surface text-accent"
                      : "text-muted hover:text-text"
                  }`}
                >
                  {item[0].toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accentHover"
            >
              Add event
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-accent">
              {view} view
            </p>
            <h2 className="mt-2 font-montserrat text-2xl font-bold text-text">
              {title}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleToday}
              className="rounded-lg border border-border bg-surfaceAlt px-4 py-2 text-sm font-semibold text-text transition hover:bg-backgroundOverlay"
            >
              Today
            </button>
            <button
              onClick={goToPrevious}
              className="rounded-lg border border-border bg-surfaceAlt px-4 py-2 text-sm font-semibold text-text transition hover:bg-backgroundOverlay"
            >
              Previous
            </button>
            <button
              onClick={goToNext}
              className="rounded-lg border border-border bg-surfaceAlt px-4 py-2 text-sm font-semibold text-text transition hover:bg-backgroundOverlay"
            >
              Next
            </button>
          </div>
        </div>

        {view === "month" && (
          <div className="mt-6">
            <div className="grid grid-cols-7 gap-3">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div
                  key={day}
                  className="px-2 text-sm font-semibold uppercase tracking-normal text-muted"
                >
                  {day}
                </div>
              ))}
              {monthDays.map((day) => {
                const dayEvents = eventsForDate(day);
                const isSelected = isSameDay(day, selectedDateObject);
                const inCurrentMonth = isSameMonth(day, currentDate);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => {
                      setSelectedDate(format(day, "yyyy-MM-dd"));
                      setCurrentDate(day);
                    }}
                    className={`min-h-36 rounded-lg border p-3 text-left transition ${
                      isSelected
                        ? "border-accent bg-accentSoft"
                        : "border-border bg-surfaceAlt hover:border-accent hover:bg-surface"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-semibold ${
                          inCurrentMonth ? "text-text" : "text-muted"
                        }`}
                      >
                        {format(day, "d")}
                      </span>
                      <span className="text-xs text-muted">
                        {dayEvents.length > 0 ? `${dayEvents.length} items` : ""}
                      </span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className={`rounded-md px-2 py-1 text-xs font-semibold ${eventTypeStyles[event.type]}`}
                        >
                          {event.startTime} {event.title}
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {view === "week" && (
          <div className="mt-6 grid gap-4 xl:grid-cols-7">
            {weekDays.map((day) => {
              const dayEvents = eventsForDate(day);
              const isSelected = isSameDay(day, selectedDateObject);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(format(day, "yyyy-MM-dd"))}
                  className={`rounded-lg border p-4 text-left transition ${
                    isSelected
                      ? "border-accent bg-accentSoft"
                      : "border-border bg-surfaceAlt hover:border-accent hover:bg-surface"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-normal text-muted">
                    {format(day, "EEE")}
                  </p>
                  <p className="mt-1 font-montserrat text-2xl font-bold text-text">
                    {format(day, "d")}
                  </p>
                  <div className="mt-4 space-y-2">
                    {dayEvents.length === 0 ? (
                      <p className="text-sm text-muted">No events</p>
                    ) : (
                      dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className={`rounded-lg px-3 py-2 text-sm ${eventTypeStyles[event.type]}`}
                        >
                          <p className="font-semibold">{event.title}</p>
                          <p className="mt-1 text-xs">
                            {event.startTime} - {event.endTime}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {view === "day" && (
          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-lg border border-border bg-surfaceAlt p-5">
              <p className="text-sm font-semibold uppercase tracking-normal text-accent">
                Agenda
              </p>
              <h3 className="mt-2 font-montserrat text-2xl font-bold text-text">
                {format(selectedDateObject, "EEEE, MMMM d")}
              </h3>
              <div className="mt-6 space-y-3">
                {selectedDayEvents.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border bg-surface p-6 text-center">
                    <p className="text-sm font-semibold text-text">Nothing scheduled yet</p>
                    <p className="mt-2 text-sm text-muted">
                      Add a study session for this day and it will appear here.
                    </p>
                  </div>
                ) : (
                  selectedDayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-lg border border-border bg-surface p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-base font-semibold text-text">{event.title}</p>
                          <p className="mt-1 text-sm text-muted">
                            {event.startTime} - {event.endTime}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${eventTypeStyles[event.type]}`}
                        >
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
            </div>

            <aside className="rounded-lg border border-border bg-surface p-5">
              <p className="text-sm font-semibold uppercase tracking-normal text-accent">
                Quick add
              </p>
              <p className="mt-2 text-sm text-muted">
                Selected date: {format(selectedDateObject, "MMMM d, yyyy")}
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-accentHover dark:text-white"
              >
                Add session for this day
              </button>
            </aside>
          </div>
        )}
      </section>

      {isModalOpen && (
        <AddEventModal
          selectedDate={selectedDate}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateEvent}
        />
      )}
    </div>
  );
};

export default CalendarExperience;
