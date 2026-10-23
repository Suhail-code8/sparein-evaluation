// simplified architectural masthead component
import React from 'react';
import { Search, ArrowRight, FileText } from 'lucide-react';

export default function MainHeader({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  onOpenInquiry,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit(searchTerm);
  };

  return (
    <header className="main-masthead">
      <div className="container masthead-grid">
        {/* brand wordmark */}
        <a href="/" className="brand-masthead-link">
          <img
            src="/com-rail-logo.png"
            alt="Com-Rail Logo"
            className="brand-logomark"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="brand-typography">
            <span className="brand-logotype">COM-RAIL</span>
            <span className="brand-subtext">Common Rail Diesel Machinery</span>
          </div>
        </a>

        {/* clean industrial search bar */}
        <div className="masthead-search-box">
          <form onSubmit={handleSubmit} className="masthead-search-form">
            <Search size={16} className="masthead-search-icon" />
            <input
              type="text"
              placeholder="Search by model, part #, or brand (e.g. CRS-918, 0445110591)..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="masthead-search-input"
              aria-label="Search catalogue"
            />
            <button type="submit" className="masthead-search-btn">
              <span>Search</span>
              <ArrowRight size={13} />
            </button>
          </form>
        </div>

        {/* direct rfq action */}
        <div className="masthead-actions">
          <button
            onClick={() => onOpenInquiry({ title: 'Factory Direct Inquiry' })}
            className="masthead-cta-btn"
          >
            <FileText size={14} />
            <span>Request RFQ</span>
          </button>
        </div>
      </div>
    </header>
  );
}
