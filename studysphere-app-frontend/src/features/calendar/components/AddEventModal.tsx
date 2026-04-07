import React, { useEffect, useState } from "react";
import { CalendarEvent, CalendarEventType } from "../types";

interface AddEventModalProps {
  selectedDate: string;
  onClose: () => void;
  onSubmit: (event: CalendarEvent) => void;
}

const defaultStartTime = "09:00";
const defaultEndTime = "10:30";

const AddEventModal: React.FC<AddEventModalProps> = ({
  selectedDate,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [endTime, setEndTime] = useState(defaultEndTime);
  const [type, setType] = useState<CalendarEventType>("study");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (endTime <= startTime) {
      setError("End time must be later than start time.");
      return;
    }

    onSubmit({
      id: crypto.randomUUID(),
      title: title.trim(),
      date,
      startTime,
      endTime,
      type,
      notes: notes.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-lg border border-border bg-surface p-6 text-text shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-accent">
              New session
            </p>
            <h2 className="mt-2 font-montserrat text-2xl font-bold text-text">
              Add a study event
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-muted transition hover:bg-surfaceAlt hover:text-text"
          >
            Close
          </button>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-text">Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Physics revision session"
              className="rounded-lg border border-border bg-surfaceAlt px-4 py-3 text-text placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-soft)]"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-text">Date</label>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="rounded-lg border border-border bg-surfaceAlt px-4 py-3 text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-soft)]"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-text">Type</label>
              <select
                value={type}
                onChange={(event) =>
                  setType(event.target.value as CalendarEventType)
                }
                className="rounded-lg border border-border bg-surfaceAlt px-4 py-3 text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-soft)]"
              >
                <option value="study">Study</option>
                <option value="session">Session</option>
                <option value="deadline">Deadline</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-text">Start time</label>
              <input
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                className="rounded-lg border border-border bg-surfaceAlt px-4 py-3 text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-soft)]"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-text">End time</label>
              <input
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                className="rounded-lg border border-border bg-surfaceAlt px-4 py-3 text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-soft)]"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-text">Notes</label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Chapter 3, practice problems 1-10"
              rows={4}
              className="rounded-lg border border-border bg-surfaceAlt px-4 py-3 text-text placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-soft)]"
            />
          </div>

          {error && <p className="text-sm font-medium text-red-400">{error}</p>}

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-text transition hover:bg-surfaceAlt"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accentHover"
            >
              Save event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
