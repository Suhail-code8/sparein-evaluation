// simplified industrial utility bar
import React from 'react';
import { Phone, Mail, MessageSquare, MapPin } from 'lucide-react';

export default function UtilityBar() {
  return (
    <div className="utility-ledger">
      <div className="container utility-ledger-content">
        <div className="utility-ledger-left">
          <span className="utility-factory-tag">FACTORY DIRECT</span>
          <span className="utility-ledger-item">
            <MapPin size={12} color="var(--color-signal-orange)" />
            <span>Taian Common Diesel Industry · Shandong, China</span>
          </span>
        </div>

        <div className="utility-ledger-right">
          <a href="tel:0086-13205380077" className="utility-ledger-item">
            <Phone size={12} />
            <span>+86-13205380077</span>
          </a>
          <a href="mailto:biz@com-rail.com" className="utility-ledger-item">
            <Mail size={12} />
            <span>biz@com-rail.com</span>
          </a>
          <a
            href="https://wa.me/8613205380077"
            target="_blank"
            rel="noopener noreferrer"
            className="utility-ledger-item utility-whatsapp-link"
          >
            <MessageSquare size={12} />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
