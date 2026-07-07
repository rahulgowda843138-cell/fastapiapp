import { useState } from "react";
import type { Job } from "../types/job";
import type { Company } from "../types/company";
import "./JobCard.css";

/**
 * Props expected by the JobCard component.
 */
type Props = {
  companies: Company[];
  jobs: Job[];
  onAddJob: (job: Job) => void;
  onEditJob: (job: Job) => void;
  onDeleteJob: (id: number) => void;
};

function JobCard({ companies, jobs, onAddJob, onEditJob, onDeleteJob }: Props) {
  // Track which job is currently being edited
  const [editJobId, setEditJobId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Job | null>(null);

  // State for the "Add New Job" form
  const [addForm, setAddForm] = useState<Job>({
    title: "",
    salary: 0,
    description: "",
    company_id: 0,
  });

  // Save edits to an existing job
  const handleSave = () => {
    if (!editForm || !editForm.id) return;
    onEditJob(editForm);
    setEditJobId(null);
    setEditForm(null);
  };

  // Cancel edit mode
  const handleCancel = () => {
    setEditJobId(null);
    setEditForm(null);
  };

  // Add a new job
  const handleAdd = () => {
    if (!addForm.title || addForm.salary <= 0 || !addForm.company_id) {
      alert("Please fill in all fields and select a company.");
      return;
    }
    onAddJob(addForm);
    setAddForm({ title: "", salary: 0, description: "", company_id: 0 });
  };

  // Get company name by id
  const getCompanyName = (companyId: number): string => {
    const company = companies.find((c) => c.id === companyId);
    return company ? company.name : `Company #${companyId}`;
  };

  // Format salary: show as LPA if >= 1 lakh
  const formatSalary = (amount: number): string => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} LPA`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount}`;
  };

  return (
    <div className="jobs-section">

      {/* Section Header */}
      <div className="jobs-header">
        <div className="jobs-header-icon">💼</div>
        <div className="jobs-header-text">
          <h2>Job Openings</h2>
          <p>{jobs.length} active listing{jobs.length !== 1 ? "s" : ""} · Post or manage below</p>
        </div>
      </div>

      {/* Post a New Job Form */}
      <div className="add-job-card">
        <h3>🚀 Post a New Job Opportunity</h3>

        <div className="job-form-grid">
          <div className="form-field">
            <label>Job Title</label>
            <input
              type="text"
              placeholder="e.g. Software Engineer"
              value={addForm.title}
              onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
            />
          </div>

          <div className="form-field">
            <label>Salary (Annual)</label>
            <input
              type="number"
              placeholder="e.g. 1200000"
              value={addForm.salary || ""}
              onChange={(e) =>
                setAddForm({ ...addForm, salary: parseInt(e.target.value) || 0 })
              }
            />
          </div>

          <div className="form-field">
            <label>Associated Company</label>
            <select
              value={addForm.company_id || ""}
              onChange={(e) =>
                setAddForm({ ...addForm, company_id: parseInt(e.target.value) || 0 })
              }
            >
              <option value="">-- Choose Company --</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-field full-width">
          <label>Job Description</label>
          <textarea
            placeholder="Outline qualifications, role responsibilities, tech stack, benefits..."
            value={addForm.description}
            onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
            rows={3}
          />
        </div>

        <button className="post-job-btn" onClick={handleAdd}>
          💼 Post Job
        </button>
      </div>

      {/* Job Listings Grid */}
      <div className="job-grid">
        {jobs.length === 0 ? (
          <div className="empty-jobs">
            💼 No jobs posted yet. Use the form above to add your first job opening!
          </div>
        ) : (
          jobs.map((job) => (
            <div className="job-card" key={job.id}>

              {editJobId === job.id && editForm ? (
                /* ── Edit Mode ── */
                <div className="job-edit-mode">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Job Title"
                  />
                  <input
                    type="number"
                    value={editForm.salary}
                    onChange={(e) =>
                      setEditForm({ ...editForm, salary: parseInt(e.target.value) || 0 })
                    }
                    placeholder="Salary"
                  />
                  <select
                    value={editForm.company_id}
                    onChange={(e) =>
                      setEditForm({ ...editForm, company_id: parseInt(e.target.value) || 0 })
                    }
                  >
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Job Description"
                    rows={3}
                  />
                  <div className="job-button-group">
                    <button className="save-job-btn" onClick={handleSave}>✔ Save</button>
                    <button className="cancel-job-btn" onClick={handleCancel}>✕ Cancel</button>
                  </div>
                </div>
              ) : (
                /* ── Read Mode ── */
                <>
                  <div className="job-card-header">
                    <h3>{job.title}</h3>
                    <span className="job-badge-salary">
                      {formatSalary(job.salary)}
                    </span>
                  </div>

                  <p className="job-company-tag">
                    🏢 <strong>{getCompanyName(job.company_id)}</strong>
                  </p>

                  <p className="job-desc-preview">
                    {job.description || "No description provided."}
                  </p>

                  <div className="job-button-group">
                    <button
                      className="edit-job-btn"
                      onClick={() => {
                        setEditJobId(job.id || null);
                        setEditForm(job);
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="delete-job-btn"
                      onClick={() => { if (job.id) onDeleteJob(job.id); }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default JobCard;