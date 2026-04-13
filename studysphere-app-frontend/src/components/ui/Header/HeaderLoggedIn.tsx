import React, { useState, useRef, useEffect, useCallback } from "react";
import ProfileButton from "./ProfileButton";
import ProfileModal from "./ProfileModal";
import useAuth from "../../../hooks/auth/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { paths } from "../../../config/paths";
import useTheme from "../../../hooks/theme/useTheme";

const ThemeToggleIcon: React.FC<{ theme: "dark" | "light" }> = ({ theme }) => {
  if (theme === "dark") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className="size-5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75 9.75 9.75 0 0 1 8.25 6a9.718 9.718 0 0 1 .748-3.752 9.753 9.753 0 1 0 12.754 12.754Z"
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className="size-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v1.5M12 19.5V21M4.5 12H3m18 0h-1.5M6.697 6.697 5.636 5.636m12.728 12.728-1.061-1.061M6.697 17.303l-1.061 1.061m12.728-12.728-1.061 1.061M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
      />
    </svg>
  );
};

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
            type="button"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface text-text transition hover:bg-surfaceAlt"
          >
            <ThemeToggleIcon theme={theme} />
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
