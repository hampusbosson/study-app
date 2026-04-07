import { CalendarEvent } from "../types";

export const CALENDAR_STORAGE_KEY = "studysphere-calendar-events";

export const loadCalendarEvents = (): CalendarEvent[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = window.localStorage.getItem(CALENDAR_STORAGE_KEY);
  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as CalendarEvent[];
  } catch {
    return [];
  }
};

export const saveCalendarEvents = (events: CalendarEvent[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(events));
};
