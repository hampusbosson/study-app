import React from "react";
import { Tiptap } from "./TextEditor";
import PdfViewer from "./pdf-viewer";
import LoadingSpinner from "../../courses/components/LoadingSpinner";
import { QuizQuestion } from "../../../types/api";
import QuizPanel from "./quiz-panel";

interface CourseContentProps {
  activeState: string;
  summaryLoading: boolean;
  summarizedContent: string;
  lectureUrl: string | undefined;
  quizQuestions: QuizQuestion[];
  quizLoading: boolean;
  onGenerateQuiz: () => void;
}

const CourseContent: React.FC<CourseContentProps> = ({
  activeState,
  summaryLoading,
  summarizedContent,
  lectureUrl,
  quizQuestions,
  quizLoading,
  onGenerateQuiz,
}) => {

  const proxyUrl = `http://localhost:3000/api/lecture/proxy?url=${encodeURIComponent(lectureUrl || "")}`;

  return (
    <div className="pb-1">
      <div className={activeState === "pdf" ? "block" : "hidden"}>
        {lectureUrl ? (
          <div className="rounded-lg border border-border bg-surface p-5 shadow-sm">
            <PdfViewer url={proxyUrl} />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-surface px-6 py-16 text-center shadow-sm">
            <p className="text-lg font-semibold text-text">No source document attached</p>
            <p className="mt-2 text-sm text-muted">Add a lecture URL to read the original material here.</p>
          </div>
        )}
      </div>
      <div className={activeState === "summary" ? "block" : "hidden"}>
        {summaryLoading ? (<LoadingSpinner type="summary" />) : <Tiptap content={summarizedContent} />}
      </div>
      <div className={activeState === "quiz" ? "block" : "hidden"}>
        <QuizPanel
          questions={quizQuestions}
          loading={quizLoading}
          onGenerate={onGenerateQuiz}
        />
      </div>
    </div>
  );
};

export default CourseContent;
