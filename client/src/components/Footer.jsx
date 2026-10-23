// footer component
import React from 'react';
import { MapPin, Phone, Mail, MessageSquare, ExternalLink } from 'lucide-react';

export default function Footer({ categories = [], onSelectCategory, onOpenInquiry }) {
  return (
    <footer className="editorial-footer">
      <div className="container">
        <div className="footer-dossier-grid">
          {/* company info */}
          <div className="footer-dossier-brand">
            <h2 className="colophon-title">TAIAN COMMON DIESEL</h2>
            <p className="colophon-text">
              Taian Common Diesel Industry Co.,Ltd manufactures and exports high-pressure common rail test benches, diesel diagnostic testers, and diesel injection components.
            </p>
            <div>
              <button
                onClick={() => onOpenInquiry({ title: 'Factory Direct Inquiry' })}
                className="btn-editorial-outline"
                style={{ color: '#ffffff', borderColor: '#4a4d55', padding: '10px 18px', fontSize: '0.75rem' }}
              >
                Inquire with Factory
              </button>
            </div>
          </div>

          {/* category links */}
          <div className="footer-nav-col">
            <h3>Equipment Divisions</h3>
            <ul className="footer-nav-links">
              {categories.map((c) => (
                <li key={c.slug}>
                  <button
                    onClick={() => {
                      onSelectCategory(c.slug);
                      window.scrollTo({ top: 750, behavior: 'smooth' });
                    }}
                    className="footer-nav-link"
                    style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* quick links */}
          <div className="footer-nav-col">
            <h3>Archive Navigation</h3>
            <ul className="footer-nav-links">
              <li>
                <a href="#catalogue" className="footer-nav-link">
                  Full Equipment Index
                </a>
              </li>
              <li>
                <a
                  href="https://www.com-rail.com/test-benchs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <span>Bench Demonstrations</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.com-rail.com/about-us/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <span>Manufacturing Facility</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.com-rail.com/contact-us/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <span>Contact Directory</span>
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* contact details */}
          <div className="footer-nav-col">
            <h3>Factory Dossier</h3>
            <ul className="footer-contact-ledger">
              <li className="footer-contact-row">
                <MapPin size={16} color="var(--color-signal-orange)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>24# Dongyue Street, Taian City, Shandong Province, China</span>
              </li>
              <li className="footer-contact-row">
                <Phone size={16} color="var(--color-signal-orange)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <a href="tel:0086-13205380077" style={{ color: '#ffffff' }}>+86-13205380077</a>
                  <span style={{ color: '#64748b' }}> / </span>
                  <a href="tel:0086-538-6112588" style={{ color: '#ffffff' }}>+86-538-6112588</a>
                </div>
              </li>
              <li className="footer-contact-row">
                <Mail size={16} color="var(--color-signal-orange)" style={{ flexShrink: 0, marginTop: 2 }} />
                <a href="mailto:biz@com-rail.com" style={{ color: '#ffffff' }}>biz@com-rail.com</a>
              </li>
              <li className="footer-contact-row">
                <MessageSquare size={16} color="var(--color-signal-orange)" style={{ flexShrink: 0, marginTop: 2 }} />
                <a href="https://wa.me/8613205380077" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-signal-orange)', fontWeight: 700 }}>
                  WhatsApp: +8613205380077
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* footer bottom */}
        <div className="footer-bottom-bar">
          <div>
            &copy; {new Date().getFullYear()} Taian Common Diesel Industry Co.,Ltd. All rights reserved.
          </div>
          <div>
            INDUSTRIAL B2B DIESEL BENCH &amp; TOOLING ARCHIVE
          </div>
        </div>
      </div>
    </footer>
  );
}
