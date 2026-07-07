import { useState } from "react";
import { searchRag } from "../Services/ragService";
import "./RagSearch.css";

interface SearchResult {
  job_id?: number;
  title?: string;
  description?: string;
  salary?: number;
  score?: number;
}

export default function RagSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) {
      alert("Please enter a search query.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await searchRag(query);

      console.log(response);

      if (Array.isArray(response.results)) {
        setResults(response.results);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to search.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rag-page">

      <div className="rag-search-box">

        <h1>🔍 AI Semantic Search</h1>

        <p>
          Search jobs using AI-powered semantic search.
        </p>

        <div className="search-row">

          <input
            type="text"
            placeholder="Search jobs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>

        </div>

      </div>

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      <div className="results">

        {!loading && results.length === 0 ? (
          <div className="empty-box">
            No search results.
          </div>
        ) : (
          results.map((job, index) => (
            <div
              className="result-card"
              key={index}
            >

              <h2>{job.title}</h2>

              <p>
                {job.description}
              </p>

              <p>
                <strong>Salary:</strong>{" "}
                ₹ {job.salary?.toLocaleString()}
              </p>

              <span className="score">
                Score : {job.score?.toFixed(4)}
              </span>

            </div>
          ))
        )}

      </div>

    </div>
  );
}