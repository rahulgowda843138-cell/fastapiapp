import { useEffect, useState } from "react";

import NavBar from "./components/NavBar";
import CompanyCard from "./components/CompanyCard";
import JobCard from "./components/JobCard";
import Footer from "./components/Footer";
import FloatingChat from "./components/FloatingChat";

import Login from "./pages/Login";
import Register from "./pages/Register";
import RagSearch from "./pages/RagSearch";
import { RagChat } from "./pages/RagChat";
import ResumeAnalyse from "./pages/ResumeAnalyse";
import JobMatch from "./pages/JobMatch";

import {
  getCompanies,
  updateCompany,
  deleteCompany,
  createCompany,
} from "./Services/CompanyService";
import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} from "./Services/JobService";

import type { Company } from "./types/company";
import type { Job } from "./types/job";

import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  // toast: short message shown at top of page, auto-dismissed after 4s
  const [toast, setToast] = useState<string | null>(null);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [showRegister, setShowRegister] = useState(false);
  const [page, setPage] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Show a small toast message that auto-hides after 4 seconds
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }

  async function fetchCompanies() {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (err) {
      // Don't block the UI - just log and show toast
      console.error("Error fetching companies:", err);
      showToast("Could not load companies. Check your connection.");
    }
  }

  async function fetchJobs() {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      // Don't block the UI - just log and show toast
      console.error("Error fetching jobs:", err);
      showToast("Could not load jobs. Check your connection.");
    }
  }

  async function handleEdit(company: Company) {
    try {
      const updated = await updateCompany(company.id, company);

      setCompanies((prev) =>
        prev.map((c) =>
          c.id === updated.id ? updated : c
        )
      );
    } catch (err) {
      showToast("Failed to update company.");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteCompany(id);

      setCompanies((prev) =>
        prev.filter((company) => company.id !== id)
      );
    } catch (err) {
      showToast("Failed to delete company.");
    }
  }

  async function handleAdd(company: Company) {
    try {
      const created = await createCompany(company);

      setCompanies((prev) => [...prev, created]);
    } catch (err) {
      showToast("Failed to add company.");
    }
  }

  async function handleAddJob(job: Job) {
    try {
      const created = await createJob(job);
      setJobs((prev) => [...prev, created]);
    } catch (err) {
      console.error("Error adding job:", err);
      showToast("Failed to add job.");
    }
  }

  async function handleEditJob(job: Job) {
    if (!job.id) return;
    try {
      const updated = await updateJob(job.id, job);
      setJobs((prev) =>
        prev.map((j) => (j.id === updated.id ? updated : j))
      );
    } catch (err) {
      console.error("Error editing job:", err);
      showToast("Failed to update job.");
    }
  }

  async function handleDeleteJob(id: number) {
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
      showToast("Failed to delete job.");
    }
  }

  const handleLogin = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setToast(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setCompanies([]);
    setJobs([]);
    setToast(null);
    setPage("home");
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (query: string) => {
    console.log("Searching:", query);
  };

  useEffect(() => {
    if (token) {
      setLoading(true);
      Promise.all([fetchCompanies(), fetchJobs()]).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [token]);

  if (!token) {
    return showRegister ? (
      <Register
        onSwitchToLogin={() =>
          setShowRegister(false)
        }
      />
    ) : (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() =>
          setShowRegister(true)
        }
      />
    );
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <h2>Loading TalentSpark...</h2>
      </div>
    );
  }


  return (
    <div className="app">

      {/* Small toast banner - shows briefly on errors, then disappears */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1e293b",
            color: "#f8fafc",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "0.875rem",
            zIndex: 9999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span>⚠️ {toast}</span>
          <button
            onClick={() => setToast(null)}
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: "1rem",
              lineHeight: 1,
              padding: 0,
            }}
          >
            ✕
          </button>
        </div>
      )}

      <NavBar
        onLogout={handleLogout}
        onSearch={handleSearch}
        onToggleMenu={() => setIsMobileMenuOpen((prev) => !prev)}
      />

      <div className="dashboard">
        
        {/* Overlay backdrop when sidebar is slid open on mobile screens */}
        {isMobileMenuOpen && (
          <div 
            className="sidebar-overlay" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        <aside className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>

          <div className="sidebar-brand">
            <h2>TalentSpark</h2>
          </div>

          <nav className="sidebar-nav">
            <button
              className={page === "home" ? "active" : ""}
              onClick={() => {
                setPage("home");
                setIsMobileMenuOpen(false);
              }}
            >
              🏠 Home
            </button>

            <button
              className={page === "search" ? "active" : ""}
              onClick={() => {
                setPage("search");
                setIsMobileMenuOpen(false);
              }}
            >
              🔍 RAG Search
            </button>

            <button
              className={page === "chat" ? "active" : ""}
              onClick={() => {
                setPage("chat");
                setIsMobileMenuOpen(false);
              }}
            >
              🤖 AI Chat
            </button>

            <button
              className={page === "resume" ? "active" : ""}
              onClick={() => {
                setPage("resume");
                setIsMobileMenuOpen(false);
              }}
            >
              📄 Resume Analysis
            </button>

            <button
              className={page === "jobmatch" ? "active" : ""}
              onClick={() => {
                setPage("jobmatch");
                setIsMobileMenuOpen(false);
              }}
            >
              💼 Job Match
            </button>

            <button
              className={page === "joblist" ? "active" : ""}
              onClick={() => {
                setPage("joblist");
                setIsMobileMenuOpen(false);
              }}
            >
              📋 Job Openings
            </button>
          </nav>

        </aside>

        <main className="content">

          {page === "home" && (
            <CompanyCard
              companies={companies}
              onedit={handleEdit}
              ondelete={handleDelete}
              onadd={handleAdd}
            />
          )}

          {page === "search" && (
            <RagSearch />
          )}

          {page === "chat" && (
            <RagChat />
          )}

          {page === "resume" && (
            <ResumeAnalyse />
          )}

          {page === "jobmatch" && (
            <JobMatch />
          )}

          {page === "joblist" && (
            <JobCard
              companies={companies}
              jobs={jobs}
              onAddJob={handleAddJob}
              onEditJob={handleEditJob}
              onDeleteJob={handleDeleteJob}
            />
          )}

        </main>

      </div>

      <Footer />

      <FloatingChat />

    </div>
  );
}

export default App;