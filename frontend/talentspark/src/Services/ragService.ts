import api from "./api";

// -----------------------------
// Semantic Search
// -----------------------------
export const searchRag = async (query: string) => {
  try {
    const response = await api.post("/rag/search", {
      query,
    });

    return response.data;
  } catch (error) {
    console.error("RAG Search Error:", error);
    throw error;
  }
};

// -----------------------------
// AI Chat
// -----------------------------
export const askRag = async (question: string) => {
  try {
    const response = await api.post("/rag/ask", {
      question,
    });

    return response.data;
  } catch (error) {
    console.error("RAG Chat Error:", error);
    throw error;
  }
};

// -----------------------------
// Resume Analysis
// -----------------------------
export const analyseResume = async (
  resumeText: string
) => {
  try {
    const response = await api.post(
      "/rag/analyse-resume",
      {
        resume_text: resumeText,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Resume Analysis Error:", error);
    throw error;
  }
};

// -----------------------------
// Job Match
// -----------------------------
export const jobMatch = async (
  resumeText: string,
  jobDescription: string
) => {
  try {
    const response = await api.post(
      "/rag/job-match",
      {
        resume_text: resumeText,
        job_description: jobDescription,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Job Match Error:", error);
    throw error;
  }
};

export default api;