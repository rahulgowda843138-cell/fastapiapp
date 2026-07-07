import { useState } from "react";
import { jobMatch } from "../Services/ragService";
import "./JobMatch.css";

export default function JobMatch() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      alert("Please enter both Resume and Job Description.");
      return;
    }

    setLoading(true);

    try {
      const data = await jobMatch(
        resume,
        jobDescription
      );

      console.log(data);

      setResult(data);

    } catch (error: any) {

      console.error(error);

      if (error.response) {
        alert(JSON.stringify(error.response.data, null, 2));
      } else {
        alert("Job Match Failed");
      }

    } finally {
      setLoading(false);
    }
  };

  const getScoreClass = (score: number) => {
    if (score >= 80) return "score-excellent";
    if (score >= 60) return "score-good";
    if (score >= 40) return "score-average";
    return "score-poor";
  };

  return (
    <div className="jobmatch-page">

      <div className="jobmatch-input">

        <h2>💼 AI Job Match</h2>

        <p>
          Compare your resume with a job description using AI.
        </p>

        <label>Resume</label>

        <textarea
          rows={10}
          placeholder="Paste your Resume..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />

        <label>Job Description</label>

        <textarea
          rows={10}
          placeholder="Paste Job Description..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <button
          onClick={handleMatch}
          disabled={loading}
        >
          {loading ? "Matching..." : "Match Job"}
        </button>

      </div>

      <div className="jobmatch-result">

        <h2>Matching Result</h2>

        {result ? (
          <>
            <div className="match-score-badge-container">
              <div className={`match-score-radial ${getScoreClass(result.match_score)}`}>
                {result.match_score}%
              </div>
              <div className="recommendation-banner">
                {result.recommendation}
              </div>
            </div>

            <div className="skills-comparison">
              <div className="skills-list-block">
                <h4>Matched Skills ({result.matched_skills?.length || 0})</h4>
                <ul>
                  {result.matched_skills?.map((skill: string, index: number) => (
                    <li key={index} className="skill-tag matched">
                      ✓ {skill}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="skills-list-block">
                <h4>Missing Skills ({result.missing_skills?.length || 0})</h4>
                <ul>
                  {result.missing_skills?.map((skill: string, index: number) => (
                    <li key={index} className="skill-tag missing">
                      ✗ {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-result">
            No match analysis computed yet. Paste details on the left and click "Match Job" to proceed.
          </div>
        )}

      </div>

    </div>
  );
}