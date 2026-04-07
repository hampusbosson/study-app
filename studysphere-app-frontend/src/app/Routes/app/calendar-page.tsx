import React from "react"
import DashboardLayout from "../../../components/layouts/dashboard-layout"

const CalendarPage: React.FC = () => {
    return (
        <DashboardLayout>
            <div className="rounded-lg border border-border bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-normal text-accent">Calendar</p>
                <h1 className="mt-2 font-montserrat text-3xl font-bold text-text">Plan your study rhythm</h1>
                <p className="mt-3 max-w-2xl text-sm text-muted">
                    This section is ready to become a scheduler for revision blocks, deadlines, and upcoming lectures.
                </p>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg bg-slate-50 p-5">
                        <p className="text-sm font-semibold text-text">Weekly plan</p>
                        <p className="mt-2 text-sm text-muted">Map deep work, reading sessions, and review blocks.</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-5">
                        <p className="text-sm font-semibold text-text">Course deadlines</p>
                        <p className="mt-2 text-sm text-muted">Keep assignments and exam prep visible in one place.</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-5">
                        <p className="text-sm font-semibold text-text">Lecture reminders</p>
                        <p className="mt-2 text-sm text-muted">Stay ahead of new material as your courses grow.</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default CalendarPage;
