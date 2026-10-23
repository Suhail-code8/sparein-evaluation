// refined editorial industrial product card component
import React, { useState } from 'react';
import { ExternalLink, ArrowRight, ImageOff } from 'lucide-react';

export default function ProductCard({ product, onInquire }) {
  const [imgError, setImgError] = useState(false);

  const {
    title,
    partNumber,
    category,
    compatibleBrands = [],
    description,
    imageUrl,
    sourceUrl,
  } = product;

  return (
    <article className="editorial-product-card">
      {/* photographic stage */}
      <div className="product-image-box">
        {!imgError && imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="product-thumb-img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="product-thumb-fallback">
            <ImageOff size={28} strokeWidth={1.5} />
            <span>DIESEL SPECIFICATION</span>
          </div>
        )}

        {/* top metadata overlay: model identifier and category */}
        <div className="product-image-badges">
          <span className={`product-id-tag ${partNumber ? 'has-pn' : ''}`}>
            {partNumber ? partNumber : 'SPECIFICATION'}
          </span>
          {category && (
            <span className="product-category-subtag" title={category}>
              {category}
            </span>
          )}
        </div>
      </div>

      {/* technical details */}
      <div className="product-card-details">
        <h3 className="product-spec-title" title={title}>
          {title}
        </h3>

        {/* compatible system indicators */}
        {compatibleBrands && compatibleBrands.length > 0 && (
          <div className="product-systems-chips">
            {compatibleBrands.slice(0, 4).map((brand) => (
              <span key={brand} className="system-indicator-chip">
                {brand.toUpperCase()}
              </span>
            ))}
            {compatibleBrands.length > 4 && (
              <span className="system-indicator-chip system-chip-more">
                +{compatibleBrands.length - 4}
              </span>
            )}
          </div>
        )}

        <p className="product-spec-desc" title={description}>
          {description || 'Precision common rail diesel injection servicing and calibration hardware.'}
        </p>
      </div>

      {/* card footer actions */}
      <div className="product-card-footer">
        <button
          onClick={() => onInquire(product)}
          className="btn-card-rfq"
          aria-label={`Request RFQ for ${title}`}
        >
          <span>Request RFQ</span>
          <ArrowRight size={13} />
        </button>

        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-card-inspect"
            title="Inspect on Com-Rail Official Website"
            aria-label={`Inspect ${title} on Com-Rail official website`}
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </article>
  );
}
