// refined technical catalogue archive component
import React from 'react';
import ProductCard from './ProductCard';
import {
  Search,
  X,
  AlertCircle,
  PackageOpen,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

export default function ProductsCatalog({
  catalogRef,
  products = [],
  loading = false,
  error = null,
  pagination = {},
  categories = [],
  activeCategory = '',
  searchTerm = '',
  selectedCompatible = '',
  hasPartNumber = '',
  sortBy = 'createdAt',
  onCategoryChange,
  onSearchChange,
  onCompatibleChange,
  onHasPartNumberChange,
  onSortChange,
  onResetFilters,
  onPageChange,
  onInquire,
  onRetry,
}) {
  const COMPATIBLE_OPTIONS = [
    'Bosch',
    'Denso',
    'Delphi',
    'Siemens',
    'Caterpillar',
    'Cummins',
  ];

  return (
    <section ref={catalogRef} id="catalog" className="catalogue-archive-section">
      <div className="container">
        {/* editorial section header */}
        <div className="editorial-section-header">
          <div>
            <span className="editorial-tag">SECTION // 02 — ARCHIVE</span>
            <h2 className="editorial-title">EQUIPMENT &amp; COMPONENT CATALOGUE</h2>
            <p className="editorial-lead">
              Filterable technical catalogue index of 260 factory test benches, specialized diagnostic testers, and original diesel injection assemblies.
            </p>
          </div>
        </div>

        {/* operational filter console */}
        <div className="archive-filter-console">
          <div className="filter-console-controls">
            {/* search input */}
            <div className="console-search-input-wrap">
              <Search size={15} className="console-search-icon" />
              <input
                type="text"
                placeholder="Search by model, title, or part number..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="console-search-input"
                aria-label="Search catalogue archive"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="console-clear-btn"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* division filter */}
            <select
              value={activeCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="console-select"
              aria-label="Filter by Division"
            >
              <option value="">All Divisions ({categories.reduce((acc, c) => acc + (c.productCount || 0), 0)})</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} ({c.productCount})
                </option>
              ))}
            </select>

            {/* part number availability filter */}
            <select
              value={hasPartNumber}
              onChange={(e) => onHasPartNumberChange(e.target.value)}
              className="console-select"
              aria-label="Filter by Part Number Availability"
            >
              <option value="">All Identifiers</option>
              <option value="true">With Model / Part # Only</option>
              <option value="false">Accessory / No Part #</option>
            </select>

            {/* sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="console-select"
              aria-label="Sort products by"
            >
              <option value="createdAt">Sort: Latest Added</option>
              <option value="partNumber">Sort: Part / Model #</option>
              <option value="title">Sort: Title (A-Z)</option>
            </select>
          </div>

          {/* compatibility selector bar */}
          <div className="console-systems-bar">
            <span className="systems-bar-label">Compatible Systems:</span>
            <button
              onClick={() => onCompatibleChange('')}
              className={`system-chip ${selectedCompatible === '' ? 'active' : ''}`}
            >
              All Systems
            </button>
            {COMPATIBLE_OPTIONS.map((brand) => (
              <button
                key={brand}
                onClick={() =>
                  onCompatibleChange(selectedCompatible === brand ? '' : brand)
                }
                className={`system-chip ${
                  selectedCompatible === brand ? 'active' : ''
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* results ledger tally */}
        <div className="archive-tally-bar">
          <div className="tally-breakdown">
            Showing <strong className="archive-tally-num">{products.length}</strong> of{' '}
            <strong className="archive-tally-num">{pagination.totalRecords || 0}</strong> items
            {activeCategory && (
              <span> in <strong>{categories.find((c) => c.slug === activeCategory)?.name || activeCategory}</strong></span>
            )}
            {selectedCompatible && (
              <span> · Compatible with <strong>{selectedCompatible}</strong></span>
            )}
            {searchTerm && (
              <span> · Matching &ldquo;<strong>{searchTerm}</strong>&rdquo;</span>
            )}
          </div>

          {(activeCategory || searchTerm || selectedCompatible || hasPartNumber) && (
            <button onClick={onResetFilters} className="btn-reset-ledger">
              <RotateCcw size={13} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* loading state */}
        {loading && (
          <div className="state-box">
            <div className="state-loading-spinner" />
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>
              Loading Specifications...
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
              Querying verified MongoDB catalogue records
            </p>
          </div>
        )}

        {/* error state */}
        {!loading && error && (
          <div className="state-box" style={{ borderColor: 'var(--color-signal-orange)' }}>
            <div style={{ color: 'var(--color-signal-orange)', marginBottom: 12 }}>
              <AlertCircle size={32} style={{ margin: '0 auto' }} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 8 }}>
              Communication Error
            </h3>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: 450, margin: '0 auto 16px', fontSize: '0.9rem' }}>
              {error}
            </p>
            <button onClick={onRetry} className="btn-editorial-primary" style={{ padding: '10px 20px' }}>
              <span>Retry Query</span>
            </button>
          </div>
        )}

        {/* empty state */}
        {!loading && !error && products.length === 0 && (
          <div className="state-box">
            <div style={{ color: 'var(--color-text-muted)', marginBottom: 12 }}>
              <PackageOpen size={36} style={{ margin: '0 auto' }} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: 8 }}>
              No Matching Specifications
            </h3>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: 450, margin: '0 auto 16px', fontSize: '0.875rem' }}>
              No catalogue records match your active query and filter combination. Clear filters to return to the full catalogue.
            </p>
            <button onClick={onResetFilters} className="btn-editorial-primary" style={{ padding: '10px 20px' }}>
              <RotateCcw size={13} />
              <span>Reset Filters</span>
            </button>
          </div>
        )}

        {/* product cards grid */}
        {!loading && !error && products.length > 0 && (
          <div className="archive-products-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id || product.sourceUrl}
                product={product}
                onInquire={onInquire}
              />
            ))}
          </div>
        )}

        {/* monospaced pagination ledger */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="archive-pagination-ledger">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              className="btn-pagination-step"
              aria-label="Previous Page"
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>

            <span className="pagination-info">
              Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong>
            </span>

            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
              className="btn-pagination-step"
              aria-label="Next Page"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
