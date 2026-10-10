import React, { useState } from 'react';
import { Phone, ShieldAlert, Copy, Check, ExternalLink } from 'lucide-react';
import { EmergencyContact } from '../types';

export interface EmergencyHotlinesViewProps {
  contacts: EmergencyContact[];
}

export const EmergencyHotlinesView: React.FC<EmergencyHotlinesViewProps> = ({ contacts }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, phone: string) => {
    navigator.clipboard.writeText(phone).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {});
  };

  return (
    <div className="v2-fade-up w-full rounded-3xl bg-gradient-to-b from-red-950/60 to-red-950/20 border border-red-800/60 p-4 sm:p-5 shadow-xl shadow-red-950/30 space-y-4">
      <div className="flex items-center gap-3">
        <div className="v2-soft-pulse w-11 h-11 rounded-2xl v2-accent-bg flex items-center justify-center shadow-lg shadow-red-600/50 shrink-0">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold v2-text">Đường dây nóng khẩn cấp</h3>
          <p className="text-xs text-red-300">Cứu hộ 112 & hỗ trợ công dân Việt Nam 24/7</p>
        </div>
      </div>

      {/* Hotlines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`p-4 rounded-3xl border flex flex-col justify-between gap-3 transition ${
              contact.isNationalEmergency
                ? 'v2-accent-bg/15 border-red-500/60 shadow-lg shadow-red-950/40'
                : 'v2-card'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-sm font-bold v2-text">{contact.nameVi}</span>
              </div>
              <a
                href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                className={`inline-block text-2xl font-black tracking-wide tabular-nums px-3 py-1.5 rounded-2xl transition active:scale-95 ${
                  contact.isNationalEmergency
                    ? 'v2-accent-bg shadow-lg shadow-red-600/40 hover:bg-red-500'
                    : 'bg-slate-800 v2-text hover:bg-slate-700'
                }`}
              >
                {contact.phone}
              </a>
              <p className="text-[11px] v2-text-muted mt-1.5 leading-relaxed">{contact.descriptionVi}</p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                className={`flex-1 min-h-[52px] rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition active:scale-[0.97] ${
                  contact.isNationalEmergency
                    ? 'v2-accent-bg hover:bg-red-500 v2-text shadow-xl shadow-red-600/40'
                    : 'v2-accent-bg/15 hover:opacity-80/25 text-red-300 border border-red-500/40'
                }`}
              >
                <Phone className="w-5 h-5" />
                <span>Gọi ngay</span>
              </a>
              <button
                onClick={() => handleCopy(contact.id, contact.phone)}
                title="Sao chép số điện thoại"
                className="w-[52px] h-[52px] shrink-0 rounded-2xl bg-slate-800 v2-text-muted hover:opacity-70 hover:bg-slate-700 flex items-center justify-center transition active:scale-95"
              >
                {copiedId === contact.id ? (
                  <Check className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
            <span className="text-[10px] v2-text-faint">{contact.nameRu}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
