// trust and engineering section
import React from 'react';
import { Gauge, Settings, ShieldCheck, Monitor } from 'lucide-react';

export default function TrustSection() {
  const PILLARS = [
    {
      icon: Gauge,
      title: 'Digital Flow Sensor Systems',
      desc: 'Modern test bench configurations utilizing digital flow sensor measurement for injector and pump diagnostics.',
    },
    {
      icon: Settings,
      title: 'CNC Equipment Manufacturing',
      desc: 'Specialized test bench frames and disassembly tooling produced for diesel workshop calibration.',
    },
    {
      icon: ShieldCheck,
      title: 'Multi-Brand Compatibility',
      desc: 'Testing procedures and replacement components compatible with Bosch, Denso, Delphi, and Siemens systems.',
    },
    {
      icon: Monitor,
      title: 'Industrial Interface',
      desc: 'Test benches equipped with integrated display interfaces and calibration software for technician operation.',
    },
  ];

  return (
    <section className="editorial-blueprint-section" id="capabilities">
      <div className="container">
        <div className="blueprint-layout-grid">
          <div className="blueprint-manifesto-column">
            <span className="editorial-kicker">[ CAPABILITIES &amp; BENCH ARCHITECTURE ]</span>
            <h2 className="blueprint-manifesto-title">
              Precision Test Systems Built for Diesel Workshops
            </h2>
            <p className="blueprint-manifesto-desc">
              Com-Rail designs and manufactures common-rail test benches, injector calibrators, and disassembly tooling for diesel fuel injection servicing worldwide.
            </p>
            <div className="blueprint-metrics-strip">
              <div className="blueprint-metric-item">
                <span className="metric-item-num">04</span>
                <span className="metric-item-label">Major Injection Architectures</span>
              </div>
              <div className="blueprint-metric-item">
                <span className="metric-item-num">06</span>
                <span className="metric-item-label">Specialized Equipment Divisions</span>
              </div>
              <div className="blueprint-metric-item">
                <span className="metric-item-num">B2B</span>
                <span className="metric-item-label">Direct Workshop Supply</span>
              </div>
            </div>
          </div>

          <div className="blueprint-cards-grid">
            {PILLARS.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="blueprint-cell">
                  <div className="blueprint-cell-header">
                    <span className="blueprint-index-badge">SPEC // 0{i + 1}</span>
                    <div className="blueprint-icon-wrap">
                      <Icon size={20} />
                    </div>
                  </div>
                  <h3 className="blueprint-cell-title">{p.title}</h3>
                  <p className="blueprint-cell-desc">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
