
import React, { useState, useRef } from 'react';
import { RSVPData } from '../types';

interface AdminPanelProps {
  rsvps: RSVPData[];
  onClose: () => void;
  musicList: { id: number; title: string; audioUrl: string }[];
  onUpdateMusic: (newList: { id: number; title: string; audioUrl: string }[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ rsvps, onClose, musicList, onUpdateMusic }) => {
  const [activeTab, setActiveTab] = useState<'guests' | 'music'>('guests');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = {
    total: rsvps.length,
    yes: rsvps.filter(r => r.attending === 'yes' || r.attending === 'with-plus-one').length,
    no: rsvps.filter(r => r.attending === 'no').length,
  };

  const exportToCSV = () => {
    if (rsvps.length === 0) return;
    const headers = ["Name", "Attendance", "Table", "Preferences", "Date"];
    const rows = rsvps.map(r => [
      `"${r.name}${r.partnerName ? ' & ' + r.partnerName : ''}"`,
      r.attending,
      r.tableId || "N/A",
      `"${r.preferences || ''}"`,
      new Date(r.timestamp).toLocaleDateString()
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "altyn_toi_guests.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      onUpdateMusic([...musicList, { id: Date.now(), title: file.name.split('.')[0], audioUrl: base64String }]);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-cream/98 overflow-y-auto p-4 md:p-12 animate-fade-in-up">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-gold/20 pb-6">
          <div className="flex gap-8">
            <button onClick={() => setActiveTab('guests')} className={`text-2xl font-serif ${activeTab === 'guests' ? 'text-earth border-b-2 border-gold' : 'text-earth/40 hover:text-earth transition-colors'}`}>CRM: Қонақтар</button>
            <button onClick={() => setActiveTab('music')} className={`text-2xl font-serif ${activeTab === 'music' ? 'text-earth border-b-2 border-gold' : 'text-earth/40 hover:text-earth transition-colors'}`}>Плейлист</button>
          </div>
          <button onClick={onClose} className="bg-gold/10 p-3 rounded-full text-gold hover:bg-gold hover:text-white transition-all">✕</button>
        </header>

        {activeTab === 'guests' ? (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Барлығы', val: stats.total },
                { label: 'Келеді', val: stats.yes },
                { label: 'Келмейді', val: stats.no },
              ].map((s, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gold/10">
                  <div className="text-3xl font-serif text-gold font-bold">{s.val}</div>
                  <div className="text-[10px] uppercase tracking-widest text-earth font-bold opacity-60">{s.label}</div>
                </div>
              ))}
              <button 
                onClick={exportToCSV}
                className="bg-earth text-white rounded-3xl p-6 flex flex-col items-center justify-center hover:bg-gold transition-all shadow-lg"
              >
                <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="text-[10px] font-bold uppercase tracking-widest">CSV Жүктеу</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gold/10">
              <table className="w-full text-left">
                <thead className="bg-cream/50 text-gold text-[10px] uppercase tracking-[0.2em] font-bold">
                  <tr>
                    <th className="px-8 py-5">Есімі</th>
                    <th className="px-8 py-5">Мәртебе</th>
                    <th className="px-8 py-5">Үстел</th>
                    <th className="px-8 py-5">Уақыты</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/5">
                  {rsvps.map(r => (
                    <tr key={r.id} className="hover:bg-cream/20 transition-colors">
                      <td className="px-8 py-5 font-medium">{r.name} {r.partnerName ? `(+${r.partnerName})` : ''}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold ${r.attending.includes('yes') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {r.attending === 'yes' ? 'ЖАЛҒЫЗ' : r.attending === 'with-plus-one' ? 'ЖҰП' : 'КЕЛМЕЙДІ'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-earth/60 font-serif">№{r.tableId}</td>
                      <td className="px-8 py-5 text-[10px] text-earth/40">{new Date(r.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-[50px] shadow-xl border border-gold/10 text-center space-y-8">
            <h3 className="text-3xl font-serif text-earth">Музыканы басқару</h3>
            <input type="file" ref={fileInputRef} className="hidden" accept="audio/*" onChange={handleFileUpload} />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-gold text-white px-12 py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-earth transition-all shadow-lg"
            >
              {isUploading ? "Жүктелуде..." : "Жаңа ән қосу"}
            </button>
            <div className="grid gap-4 max-w-xl mx-auto text-left">
              {musicList.map(t => (
                <div key={t.id} className="bg-cream/30 p-4 rounded-2xl flex justify-between items-center">
                  <span className="font-serif italic text-earth">{t.title}</span>
                  <button onClick={() => onUpdateMusic(musicList.filter(x => x.id !== t.id))} className="text-red-400 hover:text-red-600">✕</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
