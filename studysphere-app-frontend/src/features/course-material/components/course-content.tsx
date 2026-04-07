import React from "react";
import { Tiptap } from "./TextEditor";
import PdfViewer from "./pdf-viewer";
import LoadingSpinner from "../../courses/components/LoadingSpinner";

interface CourseContentProps {
  activeState: string;
  summaryLoading: boolean;
  summarizedContent: string;
  lectureUrl: string | undefined; 
}

const CourseContent: React.FC<CourseContentProps> = ({
  activeState,
  summaryLoading,
  summarizedContent,
  lectureUrl,
}) => {

  const proxyUrl = `http://localhost:3000/api/lecture/proxy?url=${encodeURIComponent(lectureUrl || "")}`;

  return (
    <div className="pb-1">
      <div className={activeState === "pdf" ? "block" : "hidden"}>
        {lectureUrl ? (
          <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
            <PdfViewer url={proxyUrl} />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-lg font-semibold text-text">No source document attached</p>
            <p className="mt-2 text-sm text-muted">Add a lecture URL to read the original material here.</p>
          </div>
        )}
      </div>
      <div className={activeState === "summary" ? "block" : "hidden"}>
        {summaryLoading ? (<LoadingSpinner type="summary" />) : <Tiptap content={summarizedContent} />}
      </div>
      <div className={activeState === "quiz" ? "block" : "hidden"}>
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-lg font-semibold text-text">Quiz mode is the next step</p>
          <p className="mt-2 text-sm text-muted">
            The summary workflow is live today. Quiz generation can be layered on top of the same lecture content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
