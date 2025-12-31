
import React, { useState, useRef } from 'react';
import { RSVPData } from '../types';

interface AdminPanelProps {
  rsvps: RSVPData[];
  onClose: () => void;
  musicList: { id: number; title: string; audioUrl: string }[];
  onUpdateMusic: (newList: { id: number; title: string; audioUrl: string }[]) => void;
  venueImages: string[];
  onUpdateVenueImages: (newImages: string[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  rsvps, onClose, musicList, onUpdateMusic, venueImages, onUpdateVenueImages 
}) => {
  const [activeTab, setActiveTab] = useState<'guests' | 'music' | 'venue'>('guests');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  
  const musicInputRef = useRef<HTMLInputElement>(null);
  const venueInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // New password requested: 990510
    if (password === '990510') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
      setPassword('');
    }
  };

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleVenueUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      onUpdateVenueImages([...venueImages, base64String]);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'yes': return 'КЕЛЕДІ';
      case 'with-plus-one': return 'ЖҰБЫМЕН';
      case 'no': return 'КЕЛМЕЙДІ';
      default: return 'БЕЛГІСІЗ';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[150] bg-earth/95 backdrop-blur-xl flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-[40px] p-12 text-center space-y-8 shadow-2xl animate-bounce-in border border-gold/20">
          <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-3xl">🔐</div>
          <div>
            <h2 className="text-3xl font-serif text-earth">Админ Панелі</h2>
            <p className="text-xs text-gold uppercase tracking-widest font-bold mt-2">Құпия сөзді енгізіңіз</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              autoFocus
              className={`w-full bg-cream border-2 rounded-2xl px-6 py-4 text-center text-2xl tracking-[0.5em] font-sans outline-none transition-all ${loginError ? 'border-red-400' : 'border-gold/20 focus:border-gold'}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
            />
            {loginError && <p className="text-red-500 text-[10px] uppercase font-bold tracking-widest">Құпия сөз қате!</p>}
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={onClose} className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-earth/40 hover:text-earth transition-colors">Болдырмау</button>
              <button type="submit" className="flex-1 bg-gold text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-earth transition-all shadow-lg">Кіру</button>
            </div>
          </form>
          {/* Hint removed as requested */}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] bg-cream/98 overflow-y-auto p-4 md:p-12 animate-fade-in-up font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gold/10 min-h-[80vh] flex flex-col">
        
        {/* Sidebar/Header */}
        <div className="flex flex-col md:flex-row border-b border-gold/10 bg-white">
          <div className="flex-1 flex overflow-x-auto p-4 md:p-6 gap-2">
            {[
              { id: 'guests', label: 'CRM', icon: '👥' },
              { id: 'music', label: 'Музыка', icon: '🎵' },
              { id: 'venue', label: 'Фотолар', icon: '🖼️' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all whitespace-nowrap text-xs font-bold uppercase tracking-widest ${
                  activeTab === tab.id ? 'bg-gold text-white shadow-lg' : 'text-earth/50 hover:bg-cream'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="p-6 text-earth/40 hover:text-earth transition-colors border-l border-gold/10 font-bold text-xs uppercase tracking-widest">
            Шығу ✕
          </button>
        </div>

        <div className="flex-1 p-6 md:p-12 overflow-y-auto custom-scroll">
          {activeTab === 'guests' && (
            <div className="space-y-12">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-cream/20 p-6 rounded-3xl border border-gold/5">
                  <div className="text-3xl font-serif font-bold text-gold">{rsvps.length}</div>
                  <div className="text-[9px] uppercase tracking-widest text-earth/40 font-bold">Барлығы</div>
                </div>
                <div className="bg-cream/20 p-6 rounded-3xl border border-gold/5">
                  <div className="text-3xl font-serif font-bold text-green-600">{rsvps.filter(r => r.attending.includes('yes')).length}</div>
                  <div className="text-[9px] uppercase tracking-widest text-earth/40 font-bold">Келеді</div>
                </div>
                <button onClick={() => {
                  const headers = ["Name", "Attendance", "Table"];
                  const csv = [headers, ...rsvps.map(r => [r.name, getStatusLabel(r.attending), r.tableId])].map(e => e.join(",")).join("\n");
                  const link = document.createElement("a");
                  link.href = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURI(csv);
                  link.download = 'guest_list.csv';
                  link.click();
                }} className="bg-earth text-white rounded-3xl flex flex-col items-center justify-center p-6 hover:bg-gold transition-all">
                   <span className="text-[9px] uppercase tracking-widest font-bold">Excel жүктеу</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-3xl border border-gold/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-cream/30 text-gold text-[9px] uppercase tracking-widest font-bold">
                    <tr><th className="px-8 py-5">Есімі</th><th className="px-8 py-5">Мәртебе</th><th className="px-8 py-5">Үстел №</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gold/5">
                    {rsvps.length === 0 ? (
                      <tr><td colSpan={3} className="px-8 py-10 text-center text-earth/30 italic font-serif">Тізім бос...</td></tr>
                    ) : rsvps.map(r => (
                      <tr key={r.id} className="hover:bg-cream/10 transition-colors">
                        <td className="px-8 py-5 font-serif text-lg text-earth">{r.name}</td>
                        <td className={`px-8 py-5 text-[10px] font-bold uppercase tracking-widest ${r.attending === 'no' ? 'text-red-500' : 'text-earth'}`}>
                          {getStatusLabel(r.attending)}
                        </td>
                        <td className="px-8 py-5 font-serif text-gold text-lg font-bold">№{r.tableId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'music' && (
            <div className="max-w-2xl mx-auto space-y-8">
              <input type="file" ref={musicInputRef} className="hidden" accept="audio/*" onChange={handleMusicUpload} />
              <button onClick={() => musicInputRef.current?.click()} className="w-full bg-gold text-white p-8 rounded-[40px] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-earth transition-all shadow-xl shadow-gold/10">
                {isUploading ? "Жүктелуде..." : "Жаңа ән қосу (+)"}
              </button>
              <div className="space-y-4">
                {musicList.length === 0 ? (
                  <p className="text-center text-earth/30 font-serif italic py-10">Плейлист бос...</p>
                ) : musicList.map(t => (
                  <div key={t.id} className="p-6 bg-white border border-gold/10 rounded-2xl flex justify-between items-center group hover:border-gold/30 transition-all shadow-sm">
                    <span className="font-serif italic text-earth text-lg">{t.title}</span>
                    <button onClick={() => onUpdateMusic(musicList.filter(x => x.id !== t.id))} className="text-red-300 hover:text-red-500 font-bold text-xs uppercase tracking-widest p-2">Жою</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'venue' && (
            <div className="space-y-8">
              <input type="file" ref={venueInputRef} className="hidden" accept="image/*" onChange={handleVenueUpload} />
              <button onClick={() => venueInputRef.current?.click()} className="w-full bg-gold text-white p-8 rounded-[40px] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-earth transition-all shadow-xl shadow-gold/10">
                {isUploading ? "Сурет жүктелуде..." : "Мейрамхана суретін қосу (+)"}
              </button>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {venueImages.length === 0 ? (
                  <p className="col-span-full text-center text-earth/30 font-serif italic py-10">Фотосуреттер жүктелмеген...</p>
                ) : venueImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-3xl overflow-hidden group border border-gold/10 shadow-md">
                    <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <button 
                      onClick={() => onUpdateVenueImages(venueImages.filter((_, i) => i !== idx))} 
                      className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity uppercase text-[10px] font-bold tracking-[0.2em] backdrop-blur-sm"
                    >
                      Жою
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
