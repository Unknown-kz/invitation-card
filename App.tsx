
import React, { useState, useEffect } from 'react';
import { WEDDING_DETAILS, SCHEDULE } from './constants';
import { RSVPData } from './types';
import Countdown from './components/Countdown';
import CalendarCard from './components/CalendarCard';
import TableSelection from './components/TableSelection';
import AIAssistant from './components/AIAssistant';
import AdminPanel from './components/AdminPanel';
import MusicPlayer from './components/MusicPlayer';
import VenueSlideshow from './components/VenueSlideshow';

const App: React.FC = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [rsvps, setRsvps] = useState<RSVPData[]>([]);
  const [musicList, setMusicList] = useState(WEDDING_DETAILS.music);
  const [venueImages, setVenueImages] = useState(WEDDING_DETAILS.location.images);
  const [formData, setFormData] = useState<Partial<RSVPData>>({
    name: '', attending: 'yes', partnerName: '', preferences: '', tableId: undefined
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guestName, setGuestName] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const to = urlParams.get('to');
    if (to) {
      setGuestName(to);
      setFormData(prev => ({ ...prev, name: to }));
    }

    const loadData = () => {
      const savedRSVPs = localStorage.getItem('anniversary_rsvps');
      if (savedRSVPs) setRsvps(JSON.parse(savedRSVPs));
      
      const savedMusic = localStorage.getItem('anniversary_music');
      if (savedMusic) setMusicList(JSON.parse(savedMusic));

      const savedVenue = localStorage.getItem('anniversary_venue_images');
      if (savedVenue) setVenueImages(JSON.parse(savedVenue));
    };

    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const handleUpdateMusic = (list: { id: number; title: string; audioUrl: string }[]) => {
    setMusicList(list);
    localStorage.setItem('anniversary_music', JSON.stringify(list));
  };

  const handleUpdateVenueImages = (list: string[]) => {
    setVenueImages(list);
    localStorage.setItem('anniversary_venue_images', JSON.stringify(list));
  };

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setLoading(true);
    const newRSVP: RSVPData = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      attending: formData.attending as any,
      partnerName: formData.partnerName,
      preferences: formData.preferences,
      tableId: formData.tableId,
      timestamp: Date.now()
    };
    const updated = [...rsvps, newRSVP];
    setRsvps(updated);
    localStorage.setItem('anniversary_rsvps', JSON.stringify(updated));
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-gold/20 bg-cream">
      <AIAssistant />
      {showAdmin && (
        <AdminPanel 
          rsvps={rsvps} 
          musicList={musicList} 
          venueImages={venueImages}
          onUpdateMusic={handleUpdateMusic}
          onUpdateVenueImages={handleUpdateVenueImages}
          onClose={() => setShowAdmin(false)} 
        />
      )}

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center p-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 grayscale scale-105"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream/50 to-cream"></div>
        
        <div className="relative z-10 max-w-4xl space-y-8 animate-fade-in-up">
          <MusicPlayer customMusic={musicList} />
          
          {guestName && (
            <div className="animate-bounce-in">
              <span className="bg-gold/10 px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] text-gold border border-gold/30 font-sans">
                Құрметті {guestName}!
              </span>
            </div>
          )}

          <p className="text-gold tracking-[0.6em] uppercase text-xs font-bold font-sans">1976 — 2026</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10">
            <h1 className="text-7xl md:text-9xl font-serif text-earth">{WEDDING_DETAILS.couple.husband}</h1>
            <span className="text-5xl font-serif text-gold italic">&</span>
            <h1 className="text-7xl md:text-9xl font-serif text-earth">{WEDDING_DETAILS.couple.wife}</h1>
          </div>
          <h2 className="text-gold font-serif text-2xl md:text-5xl tracking-[0.3em] uppercase">АЛТЫН ТОЙ</h2>
          
          <CalendarCard />
        </div>

        <button onClick={() => setShowAdmin(true)} className="absolute top-6 right-6 text-[10px] bg-white/40 backdrop-blur-sm border border-gold/20 px-4 py-2 rounded-full text-gold hover:bg-gold hover:text-white transition-all uppercase tracking-widest font-bold font-sans z-[100]">Admin</button>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-24 space-y-40 font-sans">
        
        <div className="text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-5xl font-serif text-earth">Жарты ғасырлық махаббат</h2>
            <p className="text-earth/60 leading-relaxed max-w-2xl mx-auto text-xl font-serif italic">
              "Жарты ғасыр – айтуға оңай болғанымен, бұл махаббат пен төзімнің, қиындық пен қуаныштың үлкен белесі. Елу жыл бұрын тағдыр қосқан екі жүрек бүгінде үлкен бәйтерекке айналып, ұрпақ жайып отыр. Біздің осынау алтын белесімізде, елу жылдық ортақ армандар мен бақытты сәттердің куәгері болып, салтанатты кешіміздің қадірлі қонағы болуға шақырамыз."
            </p>
          </div>
          <Countdown targetDate={WEDDING_DETAILS.date} />
        </div>

        {/* Venue Section with Slideshow */}
        <div className="text-center space-y-12">
          <h2 className="text-5xl font-serif text-earth">Өту орны</h2>
          <div className="bg-white rounded-[60px] overflow-hidden shadow-2xl border border-gold/10 group">
            <div className="h-[600px] bg-earth/5 overflow-hidden">
              <VenueSlideshow images={venueImages} />
            </div>
            <div className="p-16 space-y-8">
              <h4 className="text-4xl font-serif text-earth">{WEDDING_DETAILS.location.name}</h4>
              <p className="text-gold font-bold uppercase tracking-widest text-xs font-sans">{WEDDING_DETAILS.location.address}</p>
              <a href={WEDDING_DETAILS.location.mapLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-4 bg-earth text-cream px-14 py-6 rounded-full text-sm uppercase tracking-[0.3em] font-bold font-sans hover:bg-gold transition-all shadow-xl active:scale-95">
                2GIS Навигатор
              </a>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-20">
          <h2 className="text-5xl font-serif text-earth text-center">Той бағдарламасы</h2>
          <div className="space-y-16 relative max-w-md mx-auto">
            <div className="absolute left-[7px] md:left-1/2 md:-translate-x-1/2 w-[1px] h-full bg-gold/20 top-0"></div>
            {SCHEDULE.map((item, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center gap-8 relative">
                <div className="md:flex-1 md:text-right font-serif text-2xl text-gold font-bold">{item.time}</div>
                <div className="w-4 h-4 rounded-full bg-gold border-4 border-white z-10 shadow-lg -ml-[1px] md:ml-0"></div>
                <div className="md:flex-1 text-left">
                  <h4 className="text-lg font-bold text-earth uppercase tracking-widest font-sans">{item.title}</h4>
                  <p className="text-sm text-earth/50 italic font-serif">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RSVP Form */}
        <div id="rsvp" className="space-y-12 bg-white p-12 md:p-24 rounded-[80px] shadow-2xl border border-gold/10">
          <h2 className="text-5xl font-serif text-earth text-center">Тіркелу</h2>
          {submitted ? (
            <div className="text-center space-y-6 animate-bounce-in">
              <div className="text-7xl">🥂</div>
              <h3 className="text-3xl font-serif text-gold">Жауабыңыз қабылданды!</h3>
              <p className="text-earth/60 font-serif italic">Сізді Алтын тойда асыға күтеміз.</p>
            </div>
          ) : (
            <form onSubmit={handleRSVP} className="space-y-16">
              <div className="max-w-xl mx-auto space-y-12">
                <div className="border-b border-gold/20 pb-4">
                  <label className="block text-[10px] uppercase tracking-widest text-gold font-bold mb-4 font-sans text-center">Аты-жөніңіз</label>
                  <input type="text" required className="w-full bg-transparent outline-none text-2xl font-serif text-earth text-center" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-6">
                  <label className="block text-[10px] uppercase tracking-widest text-gold font-bold font-sans text-center">Қатысу мәртебесі</label>
                  <div className="flex flex-col items-center gap-6">
                    {[
                      {v: 'yes', l: 'Жалғыз келемін'}, 
                      {v: 'with-plus-one', l: 'Жұбымен келемін'}, 
                      {v: 'no', l: 'Келе алмаймын'}
                    ].map(o => (
                      <label key={o.v} className="flex items-center gap-4 cursor-pointer group w-full max-w-xs px-6 py-4 rounded-2xl border border-gold/10 hover:bg-gold/5 transition-all">
                        <input type="radio" className="hidden" name="att" value={o.v} checked={formData.attending === o.v} onChange={() => setFormData({...formData, attending: o.v as any})} />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.attending === o.v ? 'border-gold bg-gold' : 'border-gold/20 group-hover:border-gold'}`}>
                          {formData.attending === o.v && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <span className={`text-sm font-sans font-medium transition-colors ${formData.attending === o.v ? 'text-earth font-bold' : 'text-earth/40'}`}>{o.l}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <TableSelection rsvps={rsvps} selectedTableId={formData.tableId || null} onSelect={(id) => setFormData({...formData, tableId: id})} />
              <button type="submit" disabled={loading || (!formData.tableId && formData.attending !== 'no')} className="w-full py-8 bg-gold text-white rounded-full font-bold uppercase tracking-[0.5em] text-xs font-sans shadow-xl hover:bg-earth transition-all disabled:opacity-30 active:scale-95">
                {loading ? "Жіберілуде..." : "Растау"}
              </button>
            </form>
          )}
        </div>
      </main>

      <footer className="bg-white py-32 text-center border-t border-gold/10 font-sans">
        <h2 className="text-6xl font-serif text-gold mb-6">Ержан & Гүлсара</h2>
        <p className="text-earth/30 text-[10px] uppercase tracking-[0.8em] font-bold">50 ЖЫЛДЫҚ БЕРЕКЕЛІ ҒҰМЫР</p>
      </footer>
    </div>
  );
};

export default App;
