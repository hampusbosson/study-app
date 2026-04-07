import React from "react";
import { AuthProvider } from "../hooks/auth/auth-context";
import { CoursesProvider } from "../hooks/courses/courses-context";
import { ThemeProvider } from "../hooks/theme/theme-context";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThemeProvider>
      <AuthProvider>
          <CoursesProvider>
            {children}
          </CoursesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
