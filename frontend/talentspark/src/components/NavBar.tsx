import { useState } from "react";
import "./NavBar.css";

type Props = {
  onSearch?: (query: string) => void;
  onLogout?: () => void;
  onToggleMenu?: () => void;
};

function NavBar({ onSearch, onLogout, onToggleMenu }: Props) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;

    if (onSearch) {
      onSearch(query.trim());
    } else {
      console.log("Search:", query);
    }
  };

  return (
    <header className="navbar">
      {/* Hamburger & Logo */}
      <div className="navbar-left">
        <button className="hamburger-btn" onClick={onToggleMenu} aria-label="Toggle Navigation Menu">
          ☰
        </button>
        <h1>Rahul du Spark</h1>
      </div>

      {/* Search */}
      <div className="navbar-center">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search jobs, companies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          <button onClick={handleSearch}>
            🔍
          </button>
        </div>
      </div>

      {/* Right Side */}
      <div className="navbar-right">
        <span className="user">
          👤 Welcome
        </span>

        <button
          className="logout-nav"
          onClick={onLogout}
        >
          🚪 Logout
        </button>
      </div>
    </header>
  );
}

export default NavBar;