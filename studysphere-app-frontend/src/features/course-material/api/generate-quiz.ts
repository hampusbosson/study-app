import { api } from "../../../lib/api-client";
import { QuizQuestion } from "../../../types/api";

export async function generateQuiz(
  lectureId: string,
): Promise<QuizQuestion[]> {
  try {
    const response = await api.post("/lecture/quiz", {
      lectureId,
    });

    return response.data.questions;
  } catch (error) {
    console.error("Error generating quiz", error);
    throw new Error("Failed to generate quiz");
  }
}
