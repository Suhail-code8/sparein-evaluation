// industrial division directory section
import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CategoryGrid({
  categories = [],
  activeCategory,
  onSelectCategory,
}) {
  return (
    <section className="editorial-divisions-section">
      <div className="container">
        <div className="editorial-section-header">
          <div>
            <span className="editorial-tag">SECTION // 01 — DIVISIONS</span>
            <h2 className="editorial-title">MANUFACTURING &amp; SUPPLY DIVISIONS</h2>
            <p className="editorial-lead">
              Direct factory manufacturing of precision test benches, diagnostic electronic testers, disassembly tools, and genuine common rail diesel injection spare parts.
            </p>
          </div>
        </div>

        <div className="divisions-grid">
          {categories.map((cat, idx) => {
            const indexCode = `DIV.0${idx + 1}`;
            const isActive = activeCategory === cat.slug;

            return (
              <div
                key={cat.slug}
                className={`division-panel ${isActive ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.slug)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onSelectCategory(cat.slug);
                }}
              >
                <div className="division-top-line">
                  <span className="division-index-num">[{indexCode}]</span>
                  <span className="division-count">{cat.productCount} SPECIFICATIONS</span>
                </div>

                <h3 className="division-title">{cat.name}</h3>
                <p className="division-desc">{cat.description}</p>

                <div className="division-cta-link">
                  <span>INSPECT DIVISION</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
