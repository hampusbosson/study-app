import React, { useMemo, useState } from "react";
import { QuizQuestion } from "../../../types/api";
import icons from "../../../assets/icons/icons";

interface QuizPanelProps {
  questions: QuizQuestion[];
  loading: boolean;
  onGenerate: () => void;
}

const QuizPanel: React.FC<QuizPanelProps> = ({
  questions,
  loading,
  onGenerate,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(
    {},
  );
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>(
    {},
  );

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(revealedAnswers).length;
  const score = useMemo(
    () =>
      questions.reduce((total, question, index) => {
        return revealedAnswers[index] &&
          selectedAnswers[index] === question.correctAnswer
          ? total + 1
          : total;
      }, 0),
    [questions, revealedAnswers, selectedAnswers],
  );

  const handleSelectAnswer = (answer: string) => {
    if (revealedAnswers[currentIndex]) {
      return;
    }

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: answer,
    }));
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswers[currentIndex]) {
      return;
    }

    setRevealedAnswers((prev) => ({
      ...prev,
      [currentIndex]: true,
    }));
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setRevealedAnswers({});
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-surface px-6 py-16 text-center shadow-sm">
        <div className="mx-auto flex max-w-md flex-col items-center">
          <div className="mb-5">{icons.loadingIcon}</div>
          <p className="text-lg font-semibold text-text">Building your quiz</p>
          <p className="mt-2 text-sm text-muted">
            AI is reading the lecture, picking out the most useful concepts, and turning them into multiple-choice questions.
          </p>
          <div className="mt-8 grid w-full gap-3">
            <div className="h-14 animate-pulse rounded-lg bg-surfaceAlt" />
            <div className="h-14 animate-pulse rounded-lg bg-surfaceAlt" />
            <div className="h-14 animate-pulse rounded-lg bg-surfaceAlt" />
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0 || !currentQuestion) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-surface px-6 py-16 text-center shadow-sm">
        <p className="text-lg font-semibold text-text">Generate a practice quiz</p>
        <p className="mt-2 text-sm text-muted">
          Create Quizlet-style multiple-choice questions from this lecture PDF.
        </p>
        <button
          onClick={onGenerate}
          className="mt-6 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-accentHover dark:text-white"
        >
          Generate quiz
        </button>
      </div>
    );
  }

  const selectedAnswer = selectedAnswers[currentIndex];
  const isRevealed = !!revealedAnswers[currentIndex];

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-accent">
              Practice mode
            </p>
            <h2 className="mt-2 font-montserrat text-2xl font-bold text-text">
              Question {currentIndex + 1} of {questions.length}
            </h2>
          </div>
          <button
            onClick={onGenerate}
            className="rounded-lg border border-border bg-surfaceAlt px-4 py-2 text-sm font-semibold text-text transition hover:bg-backgroundOverlay"
          >
            Refresh quiz
          </button>
        </div>

        <div className="mt-6 rounded-lg bg-surfaceAlt p-6">
          <p className="text-lg font-semibold leading-8 text-text">
            {currentQuestion.question}
          </p>
        </div>

        <div className="mt-6 grid gap-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = currentQuestion.correctAnswer === option;

            const stateClass = isRevealed
              ? isCorrect
                ? "border-emerald-500/40 bg-emerald-500/12 text-emerald-300"
                : isSelected
                  ? "border-rose-500/40 bg-rose-500/12 text-rose-300"
                  : "border-border bg-surface text-muted"
              : isSelected
                ? "border-accent bg-accentSoft text-text"
                : "border-border bg-surface text-text hover:border-accent hover:bg-accentSoft";

            return (
              <button
                key={option}
                onClick={() => handleSelectAnswer(option)}
                className={`rounded-lg border px-4 py-4 text-left text-sm font-semibold transition ${stateClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <button
              onClick={handleCheckAnswer}
              disabled={!selectedAnswer || isRevealed}
              className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-accentHover disabled:cursor-not-allowed disabled:bg-surfaceAlt disabled:text-muted dark:text-white"
            >
              Check answer
            </button>
            <button
              onClick={handleReset}
              className="rounded-lg border border-border bg-surface px-5 py-3 text-sm font-semibold text-text transition hover:bg-surfaceAlt"
            >
              Restart
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
              disabled={currentIndex === 0}
              className="rounded-lg border border-border bg-surface px-4 py-3 text-sm font-semibold text-text transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-surfaceAlt"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentIndex((index) => Math.min(questions.length - 1, index + 1))
              }
              disabled={currentIndex === questions.length - 1}
              className="rounded-lg border border-border bg-surface px-4 py-3 text-sm font-semibold text-text transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-surfaceAlt"
            >
              Next
            </button>
          </div>
        </div>

        {isRevealed && (
          <div className="mt-6 rounded-lg border border-border bg-surfaceAlt p-5">
            <p className="text-sm font-semibold uppercase tracking-normal text-accent">
              Explanation
            </p>
            <p className="mt-2 text-sm text-text">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      <aside className="rounded-lg border border-border bg-surface p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-normal text-accent">
          Progress
        </p>
        <p className="mt-2 font-montserrat text-3xl font-bold text-text">
          {score}/{questions.length}
        </p>
        <p className="mt-1 text-sm text-muted">
          {answeredCount} checked so far
        </p>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-surfaceAlt">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{
              width: `${(answeredCount / questions.length) * 100}%`,
            }}
          />
        </div>

        <div className="mt-6 grid grid-cols-4 gap-2">
          {questions.map((question, index) => {
            const isAnswered = !!revealedAnswers[index];
            const isCorrect = selectedAnswers[index] === question.correctAnswer;

            return (
              <button
                key={`${question.question}-${index}`}
                onClick={() => setCurrentIndex(index)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  currentIndex === index
                    ? "bg-accent text-slate-950 dark:text-white"
                    : isAnswered
                      ? isCorrect
                        ? "bg-emerald-500/12 text-emerald-300"
                        : "bg-rose-500/12 text-rose-300"
                      : "bg-surfaceAlt text-muted hover:bg-backgroundOverlay hover:text-text"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
};

export default QuizPanel;
