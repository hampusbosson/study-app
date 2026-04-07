import React from "react";
import CallToActionButton from "./CallToActionButton";
import { paths } from "../../../config/paths";

const MainContent: React.FC = () => {
  return (
    <div className="mx-auto mt-14 flex max-w-6xl flex-col items-center px-4 sm:px-6 lg:px-8">
      <div className="flex max-w-5xl flex-col items-center gap-4 text-center">
        <h1 className="p-1 text-center font-montserrat text-5xl font-bold text-text">
          Master Your Studies, Effortlessly
        </h1>
        <h2 className="-mt-1 text-center font-raleway text-2xl font-normal leading-9 text-muted">
          Summarize PDFs, take interactive quizzes, and organise your study material in
          one place built for revision and planning.
        </h2>
      </div>

      <div className="mt-10 flex flex-col items-center">
        <CallToActionButton
          linkName={paths.auth.signup.getHref()}
          buttonName="Get started for free"
        />

        <div className="mt-14 w-full max-w-5xl rounded-lg border border-border bg-surface px-6 py-8 shadow-sm sm:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-surfaceAlt p-5">
              <p className="text-sm font-semibold uppercase tracking-normal text-accent">
                Courses
              </p>
              <p className="mt-3 text-base font-semibold text-text">
                Keep lectures grouped by subject.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-surfaceAlt p-5">
              <p className="text-sm font-semibold uppercase tracking-normal text-accent">
                Summaries
              </p>
              <p className="mt-3 text-base font-semibold text-text">
                Turn long PDFs into shorter review notes.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-surfaceAlt p-5">
              <p className="text-sm font-semibold uppercase tracking-normal text-accent">
                Study Plan
              </p>
              <p className="mt-3 text-base font-semibold text-text">
                Add quiz practice and schedule time to revise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
