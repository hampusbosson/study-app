export type CalendarView = "day" | "week" | "month";

export type CalendarEventType = "study" | "deadline" | "session";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: CalendarEventType;
  notes?: string;
}
