import express from "express";
import { createLecture, getLecturesForClass, deleteLecture, setPdfCorsHeader, summarizeLecture, getLectureById, generateLectureQuiz } from "../controllers/lectureController";

const router = express.Router();

router.post('/create', createLecture);
router.post('/summarize', summarizeLecture);
router.post('/quiz', generateLectureQuiz);
router.get('/lecture/:classId/:lectureId', getLectureById);
router.get('/lectures/:classId', getLecturesForClass);
router.post('/delete', deleteLecture);
router.get('/proxy', setPdfCorsHeader);

export default router;
