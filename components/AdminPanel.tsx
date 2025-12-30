
import React from 'react';
import { RSVPData } from '../types';

interface AdminPanelProps {
  rsvps: RSVPData[];
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ rsvps, onClose }) => {
  const stats = {
    total: rsvps.length,
    yes: rsvps.filter(r => r.attending === 'yes' || r.attending === 'with-plus-one').length,
    plusOnes: rsvps.filter(r => r.attending === 'with-plus-one').length,
    no: rsvps.filter(r => r.attending === 'no').length,
  };

  return (
    <div className="fixed inset-0 z-[100] bg-cream/95 overflow-y-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-earth/20 pb-4">
          <h2 className="text-3xl font-serif text-earth">Қонақтарды басқару (CRM)</h2>
          <button onClick={onClose} className="text-earth hover:text-earth/60 font-bold uppercase text-xs">Жабу ✕</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Барлық жауап', val: stats.total },
            { label: 'Қатысатындар', val: stats.yes },
            { label: 'Жұптар', val: stats.plusOnes },
            { label: 'Келе алмайтындар', val: stats.no }
          ].map((s, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-cream shadow-sm text-center">
              <div className="text-2xl font-serif text-gold font-bold">{s.val}</div>
              <div className="text-[10px] uppercase tracking-tighter text-earth font-bold">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-cream overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream/50 text-earth/60 uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-6 py-4">Қонақ аты</th>
                <th className="px-6 py-4">Мәртебесі</th>
                <th className="px-6 py-4">Үстел №</th>
                <th className="px-6 py-4">Тілектер</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream">
              {rsvps.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-earth/40">Әзірге жауаптар жоқ.</td></tr>
              ) : (
                rsvps.map((guest) => (
                  <tr key={guest.id} className="hover:bg-cream/20">
                    <td className="px-6 py-4 font-medium">{guest.name} {guest.partnerName ? `және ${guest.partnerName}` : ''}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        guest.attending.includes('yes') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}>
                        {guest.attending === 'yes' ? 'ҚАТЫСАДЫ' : guest.attending === 'with-plus-one' ? 'ЖҰППЕН' : 'КЕЛМЕЙДІ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-earth/60">{guest.tableId ? `№${guest.tableId} үстел` : '-'}</td>
                    <td className="px-6 py-4 italic text-earth/50">{guest.preferences || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
