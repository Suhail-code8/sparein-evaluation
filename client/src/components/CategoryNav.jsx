// technical catalogue index bar
import React from 'react';

export default function CategoryNav({
  categories = [],
  activeCategory,
  onSelectCategory,
}) {
  const totalCount = categories.reduce((acc, c) => acc + (c.productCount || 0), 0);

  return (
    <nav className="catalogue-index-bar" aria-label="Technical catalogue index">
      <div className="container">
        <ul className="catalogue-index-list">
          <li className="catalogue-index-item">
            <button
              onClick={() => onSelectCategory('')}
              className={`catalogue-index-link ${activeCategory === '' ? 'active' : ''}`}
            >
              <span className="index-code-badge">[00]</span>
              <span>ALL DIVISIONS ({totalCount})</span>
            </button>
          </li>

          {categories.map((cat, idx) => {
            const indexCode = `0${idx + 1}`;
            return (
              <li key={cat.slug} className="catalogue-index-item">
                <button
                  onClick={() => onSelectCategory(cat.slug)}
                  className={`catalogue-index-link ${
                    activeCategory === cat.slug ? 'active' : ''
                  }`}
                >
                  <span className="index-code-badge">[{indexCode}]</span>
                  <span>{cat.name} ({cat.productCount})</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
