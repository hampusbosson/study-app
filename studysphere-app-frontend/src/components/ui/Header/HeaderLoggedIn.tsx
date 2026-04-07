import React, { useState, useRef, useEffect, useCallback } from "react";
import ProfileButton from "./ProfileButton";
import ProfileModal from "./ProfileModal";
import useAuth from "../../../hooks/auth/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { paths } from "../../../config/paths";
import useTheme from "../../../hooks/theme/useTheme";

const HeaderLoggedIn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

    // Determine active button based on the current path.
  let activeButton = "";
  if (location.pathname.startsWith("/home")) activeButton = "home";
  else if (location.pathname.startsWith("/courses")) activeButton = "courses";
  else if (location.pathname.startsWith("/calendar")) activeButton = "calendar";

  // Memoize handleClickOutside to avoid unnecessary re-renders
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen, handleClickOutside]);

  const firstLetterEmail = user?.email.charAt(0).toUpperCase();

  const handleHomeClick = () => {
    navigate(paths.app.home.getHref());
  }

  const handleCoursesClick = () => {
    navigate(paths.app.course.getHref());
  }

  const handleCalendarClick = () => {
    navigate(paths.app.calendar.getHref());
  }
  return (
    <div className="sticky top-0 z-40 border-b border-border/80 bg-backgroundOverlay backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <div>
            <p className="font-montserrat text-xl font-bold text-text">StudySphere</p>
            <p className="text-sm text-muted">Focused study, clearer notes.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-surfaceAlt p-1">
            <button
              onClick={handleHomeClick}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeButton === "home"
                  ? "bg-surface text-accent shadow-sm"
                  : "text-muted hover:text-text"
              }`}
            >
              Home
            </button>
            <button
              onClick={handleCoursesClick}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeButton === "courses"
                  ? "bg-surface text-accent shadow-sm"
                  : "text-muted hover:text-text"
              }`}
            >
              Courses
            </button>
            <button
              onClick={handleCalendarClick}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeButton === "calendar"
                  ? "bg-surface text-accent shadow-sm"
                  : "text-muted hover:text-text"
              }`}
            >
              Calendar
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm font-semibold text-text transition hover:bg-surfaceAlt"
          >
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-text">Welcome back</p>
            <p className="max-w-56 truncate text-sm text-muted">{user?.email}</p>
          </div>
          <div className="relative">
            <ProfileButton firstLetterEmail={firstLetterEmail} onPress={openModal} />
            {isModalOpen && (
              <div ref={modalRef} className="absolute right-0 top-14">
                <ProfileModal email={user?.email} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderLoggedIn;
