import { useState } from "react";
import type { Company } from "../types/company";
import "./CompanyCard.css";

type Props = {
  companies: Company[];
  onedit: (company: Company) => void;
  ondelete: (id: number) => void;
  onadd: (company: Company) => void;
};

function CompanyCard({ companies, onadd, onedit, ondelete }: Props) {
  const [editCompanyId, setEditCompanyId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Company | null>(null);

  const [addForm, setAddForm] = useState<Company>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    location: "",
    jobs: [],
  });

  const handleSave = () => {
    if (!editForm) return;
    onedit(editForm);
    setEditCompanyId(null);
    setEditForm(null);
  };

  const handleCancel = () => {
    setEditCompanyId(null);
    setEditForm(null);
  };

  const handleAdd = () => {
    if (!addForm.name.trim()) return;
    onadd(addForm);
    setAddForm({ id: 0, name: "", email: "", phone: "", location: "", jobs: [] });
  };

  // Generate initials for the company avatar
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="company-container">

      {/* Section Header */}
      <div className="company-header">
        <div className="company-header-icon">🏢</div>
        <div className="company-header-text">
          <h2>Companies</h2>
          <p>{companies.length} registered · Add or manage below</p>
        </div>
      </div>

      {/* Add Company Form */}
      <div className="add-company">
        <h3>➕ Add New Company</h3>

        <div className="form-grid">
          <input
            placeholder="Company Name *"
            value={addForm.name}
            onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
          />
          <input
            placeholder="Email address"
            value={addForm.email}
            onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
          />
          <input
            placeholder="Phone number"
            value={addForm.phone}
            onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
          />
          <input
            placeholder="City / Location"
            value={addForm.location}
            onChange={(e) => setAddForm({ ...addForm, location: e.target.value })}
          />
        </div>

        <button className="add-btn" onClick={handleAdd}>
          + Add Company
        </button>
      </div>

      {/* Companies Grid */}
      <div className="company-grid">

        {companies.length === 0 ? (
          <div className="company-empty">
            <div className="company-empty-icon">🏢</div>
            <p>No companies yet. Add your first one above!</p>
          </div>
        ) : (
          companies.map((company) => (
            <div key={company.id} className="company-card">

              {editCompanyId === company.id && editForm ? (
                /* ── Edit Mode ── */
                <>
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Company Name"
                  />
                  <input
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    placeholder="Email"
                  />
                  <input
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="Phone"
                  />
                  <input
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="Location"
                  />
                  <div className="button-group">
                    <button className="save-btn" onClick={handleSave}>✔ Save</button>
                    <button className="cancel-btn" onClick={handleCancel}>✕ Cancel</button>
                  </div>
                </>
              ) : (
                /* ── Read Mode ── */
                <>
                  {/* Avatar with initials */}
                  <div className="company-avatar">
                    {getInitials(company.name || "?")}
                  </div>

                  <h3>{company.name}</h3>

                  {company.email && (
                    <p><span className="info-icon">📧</span> {company.email}</p>
                  )}
                  {company.phone && (
                    <p><span className="info-icon">📞</span> {company.phone}</p>
                  )}
                  {company.location && (
                    <p><span className="info-icon">📍</span> {company.location}</p>
                  )}

                  <div className="button-group">
                    <button
                      className="edit-btn"
                      onClick={() => { setEditCompanyId(company.id); setEditForm(company); }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => ondelete(company.id)}
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

export default CompanyCard;