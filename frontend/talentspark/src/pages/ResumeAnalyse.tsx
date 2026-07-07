import { useState } from "react";
import { analyseResume } from "../Services/ragService";
import "./ResumeAnalyse.css";

function ResumeAnalyse() {
  const [resume, setResume] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyse = async () => {
    if (!resume.trim()) {
      alert("Please enter your resume.");
      return;
    }

    setLoading(true);

    try {
      const data = await analyseResume(resume);

      setAnalysis(data.analysis);
    } catch (error) {
      console.error(error);
      alert("Resume Analysis Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-page">

      <div className="resume-card">

        <h1>AI Resume Analysis</h1>

        <p>
          Paste your resume below and let AI analyse your skills,
          experience and overall profile.
        </p>

        <textarea
          rows={16}
          placeholder="Paste your resume here..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />

        <button
          onClick={handleAnalyse}
          disabled={loading}
        >
          {loading ? "Analysing Resume..." : "Analyse Resume"}
        </button>

      </div>

      <div className="analysis-card">

        <h2>Analysis Result</h2>

        {analysis ? (
          <div className="analysis-result-content">{analysis}</div>
        ) : (
          <div className="empty">
            No analysis available yet.
          </div>
        )}

      </div>

    </div>
  );
}

export default ResumeAnalyse;