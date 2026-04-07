import React, { useMemo, useState } from "react";
import { QuizQuestion } from "../../../types/api";

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
        return selectedAnswers[index] === question.correctAnswer ? total + 1 : total;
      }, 0),
    [questions, selectedAnswers],
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
      <div className="rounded-lg border border-border bg-white px-6 py-16 text-center shadow-sm">
        <p className="text-lg font-semibold text-text">Building your quiz</p>
        <p className="mt-2 text-sm text-muted">
          AI is turning this lecture into a multiple-choice practice set.
        </p>
      </div>
    );
  }

  if (questions.length === 0 || !currentQuestion) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
        <p className="text-lg font-semibold text-text">Generate a practice quiz</p>
        <p className="mt-2 text-sm text-muted">
          Create Quizlet-style multiple-choice questions from this lecture PDF.
        </p>
        <button
          onClick={onGenerate}
          className="mt-6 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white shadow-glow-accent transition hover:bg-accentHover"
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
      <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
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
            className="rounded-lg border border-border bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Refresh quiz
          </button>
        </div>

        <div className="mt-6 rounded-lg bg-slate-50 p-6">
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
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : isSelected
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-border bg-white text-slate-600"
              : isSelected
                ? "border-blue-300 bg-blue-50 text-blue-700"
                : "border-border bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/50";

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
              className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300 hover:bg-accentHover"
            >
              Check answer
            </button>
            <button
              onClick={handleReset}
              className="rounded-lg border border-border bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Restart
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
              disabled={currentIndex === 0}
              className="rounded-lg border border-border bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentIndex((index) => Math.min(questions.length - 1, index + 1))
              }
              disabled={currentIndex === questions.length - 1}
              className="rounded-lg border border-border bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>

        {isRevealed && (
          <div className="mt-6 rounded-lg border border-border bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-normal text-accent">
              Explanation
            </p>
            <p className="mt-2 text-sm text-slate-700">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      <aside className="rounded-lg border border-border bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-normal text-accent">
          Progress
        </p>
        <p className="mt-2 font-montserrat text-3xl font-bold text-text">
          {score}/{questions.length}
        </p>
        <p className="mt-1 text-sm text-muted">
          {answeredCount} checked so far
        </p>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-200">
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
                    ? "bg-slate-900 text-white"
                    : isAnswered
                      ? isCorrect
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
