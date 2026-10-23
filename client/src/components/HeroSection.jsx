// refined industrial hero section
import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';

export default function HeroSection({ onExploreCatalog, onOpenInquiry }) {
  return (
    <section className="editorial-hero">
      <div className="container editorial-hero-grid">
        {/* left column: editorial manifesto */}
        <div className="hero-manifesto">
          <div className="hero-meta-kicker">
            <span className="hero-kicker-dot">■</span>
            <span>HIGH-PRESSURE DIESEL TEST SYSTEMS · TAIAN, SHANDONG</span>
          </div>

          <h1 className="hero-headline">
            HEAVY-DUTY COMMON RAIL TEST BENCHES. <span className="hero-headline-accent">ENGINEERED IN SHANDONG.</span>
          </h1>

          <p className="hero-manifesto-text">
            Original industrial testing systems and diesel injection components manufactured by Taian Common Diesel Industry. Heavy-duty CNC-machined chassis, real-time digital flow sensor measurement, and high-pressure simulation across Bosch, Denso, Delphi, Siemens, and Caterpillar architectures.
          </p>

          <div className="hero-actions-row">
            <button onClick={onExploreCatalog} className="btn-editorial-primary">
              <span>Explore 260+ Specifications</span>
              <ArrowDown size={14} />
            </button>
            <button
              onClick={() => onOpenInquiry({ title: 'Factory Direct Inquiry' })}
              className="btn-editorial-outline"
            >
              <span>Consult Factory Team</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* technical specification ledger */}
          <div className="hero-specs-ledger">
            <div className="spec-ledger-item">
              <span className="spec-ledger-num">260+</span>
              <span className="spec-ledger-label">Catalogued Items</span>
            </div>
            <div className="spec-ledger-item">
              <span className="spec-ledger-num">06</span>
              <span className="spec-ledger-label">Core Divisions</span>
            </div>
            <div className="spec-ledger-item">
              <span className="spec-ledger-num">B2B</span>
              <span className="spec-ledger-label">Direct Workshop Export</span>
            </div>
          </div>
        </div>

        {/* right column: prominent machinery showcase */}
        <div className="hero-machinery-showcase">
          <div className="machinery-stage-header">
            <span className="machinery-flagship-label">FACTORY FLAGSHIP</span>
            <span className="machinery-model-id">CRS-918 PLUS</span>
          </div>

          <div className="machinery-stage-body">
            <img
              src="/crs-918-plus.png"
              alt="CRS-918 PLUS Common Rail Test Bench"
              className="machinery-primary-photo"
              loading="eager"
            />
          </div>

          <div className="machinery-stage-caption">
            <h3 className="machinery-title">CRS-918 PLUS Multifunctional Test Bench</h3>
            <p className="machinery-summary">
              Precision common-rail pump and injector calibration system equipped with digital flow sensor measurement and variable frequency drive.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
