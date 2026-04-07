import React from "react";
import DashboardLayout from "../../../components/layouts/dashboard-layout";
import CalendarExperience from "../../../features/calendar/components/CalendarExperience";

const CalendarPage: React.FC = () => {
  return (
    <DashboardLayout>
      <CalendarExperience />
    </DashboardLayout>
  );
};

export default CalendarPage;
