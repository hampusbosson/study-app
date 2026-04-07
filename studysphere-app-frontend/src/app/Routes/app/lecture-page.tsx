import React, { useState, useRef, useEffect } from "react";
import { Lecture } from "../../../types/api";
import { useNavigate, useParams } from "react-router-dom";
import CourseContent from "../../../features/course-material/components/course-content";
import Toolbar from "../../../features/course-material/components/toolbar";
import { paths } from "../../../config/paths";
import { useCourses } from "../../../hooks/courses/use-courses";
import getLecture from "../../../features/course-material/api/get-lecture";
import { summarizeLecture } from "../../../features/course-material/api/summarize-lecture";

const LecturePage: React.FC = () => {
  const navigate = useNavigate();
  const { lectureId } = useParams<{ lectureId: string }>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeButton, setActiveButton] = useState("pdf");
  const [summarizedContent, setSummarizedContent] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [lecture, setLecture] = useState<Lecture>();
  const { activeCourse, setActiveCourse } = useCourses();
  const lectureUrl = lecture?.url;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [summarizedContent]);

  useEffect(() => {
    const fetchLecture = async () => {
      if (!lectureId || !activeCourse) {
        return;
      }
      try {
        const fetchedLecture = await getLecture(activeCourse.id, lectureId);
        setLecture(fetchedLecture);
        setSummarizedContent(fetchedLecture.summarizedContent || "");
      } catch (error) {
        console.error("Error fetching lecture:", error);
      }
    };

    fetchLecture();
  }, [lectureId, activeCourse]);

  const summarizeContent = async (lectureId: string) => {
    setSummaryLoading(true);
    try {
      console.log("Summarizing lecture with ID:", lectureId);
      const summarizedLecture = await summarizeLecture(lectureId);
      const summarizedContent = summarizedLecture.summarizedContent;
      setSummarizedContent(summarizedContent || "");
    } catch (error) {
      console.error("Error summarizing content:", error);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleClassClick = () => {
    setActiveCourse(activeCourse);
    navigate(paths.app.course.getHref());
  };

  return (
    <div className="min-w-0">
      <div className="mb-6 rounded-lg border border-border bg-white p-6 shadow-sm">
      <div className="flex flex-row gap-2 text-sm text-muted">
        <button onClick={handleClassClick}>{activeCourse?.name}</button>
        <p> / </p>
        <p className="text-text">{lecture?.title}</p>
      </div>
      <h1 className="mt-3 font-montserrat text-3xl font-bold text-text">{lecture?.title}</h1>
      <p className="mt-2 text-sm text-muted">
        Switch between the source material and the study summary from one focused workspace.
      </p>
      </div>
      <div className="flex flex-col gap-4">
        <Toolbar
          lecture={lecture}
          setActiveButton={setActiveButton}
          activeButton={activeButton}
          courseItem={activeCourse}
          summarize={summarizeContent}
        />
        <CourseContent
          activeState={activeButton}
          summaryLoading={summaryLoading}
          summarizedContent={summarizedContent}
          lectureUrl={lectureUrl}
        />
      </div>
    </div>
  );
};

export default LecturePage;
