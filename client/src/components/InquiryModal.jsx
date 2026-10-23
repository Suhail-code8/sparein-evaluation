// product and quotation inquiry modal
import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function InquiryModal({ product, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: '1',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Com-Rail, I would like to inquire about: ${product?.title || 'Equipment'}${
      product?.partNumber ? ` (Model/Part #: ${product.partNumber})` : ''
    }.`
  );

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* modal header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Request Quotation</h2>
            <p className="modal-subtitle">
              DIRECT FACTORY INQUIRY // TAIAN COMMON DIESEL INDUSTRY
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* product summary */}
        {product && (
          <div className="modal-product-summary">
            <div className="modal-prod-name">{product.title}</div>
            <div className="modal-prod-sub">
              {product.partNumber && <span>MODEL / PART: <strong>{product.partNumber}</strong> · </span>}
              <span>DIVISION: {product.category || 'Test Equipment'}</span>
            </div>
          </div>
        )}

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="modal-row-grid">
              <div className="modal-form-group">
                <label className="modal-label">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. John Smith"
                  value={formData.name}
                  onChange={handleChange}
                  className="modal-input"
                />
              </div>

              <div className="modal-form-group">
                <label className="modal-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="e.g. john@workshop.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="modal-input"
                />
              </div>
            </div>

            <div className="modal-row-grid">
              <div className="modal-form-group">
                <label className="modal-label">WhatsApp / Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+86 132 0538 0077"
                  value={formData.phone}
                  onChange={handleChange}
                  className="modal-input"
                />
              </div>

              <div className="modal-form-group">
                <label className="modal-label">Desired Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="modal-input"
                />
              </div>
            </div>

            <div className="modal-form-group">
              <label className="modal-label">Company / Workshop Name</label>
              <input
                type="text"
                name="company"
                placeholder="e.g. Precision Diesel Services"
                value={formData.company}
                onChange={handleChange}
                className="modal-input"
              />
            </div>

            <div className="modal-form-group">
              <label className="modal-label">Requirements / Delivery Details</label>
              <textarea
                name="message"
                rows="3"
                placeholder="Include shipping destination or voltage requirements..."
                value={formData.message}
                onChange={handleChange}
                className="modal-input"
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn-submit-inquiry">
              <Send size={14} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
              Submit B2B Quotation Request
            </button>

            <div style={{ marginTop: 18, textAlign: 'center', fontSize: '0.78rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              DIRECT FACTORY CHANNEL:{' '}
              <a
                href={`https://wa.me/8613205380077?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--color-signal-orange)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: 4 }}
              >
                <MessageSquare size={13} />
                +8613205380077
              </a>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ color: 'var(--color-signal-orange)', marginBottom: 12 }}>
              <CheckCircle2 size={48} style={{ margin: '0 auto' }} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, marginBottom: 8, color: 'var(--color-ink-darkest)' }}>
              Quotation Request Received
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', maxWidth: 380, margin: '0 auto 24px', lineHeight: 1.6 }}>
              Thank you, <strong>{formData.name}</strong>. Your quotation request has been recorded. Our technical team will review your specifications and contact you directly.
            </p>
            <button onClick={onClose} className="btn-editorial-primary" style={{ margin: '0 auto' }}>
              <span>Done</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
