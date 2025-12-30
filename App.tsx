
import React, { useState, useEffect, useRef } from 'react';
import { WEDDING_DETAILS, SCHEDULE } from './constants';
import { RSVPData } from './types';
import Countdown from './components/Countdown';
import TableSelection from './components/TableSelection';
import AIAssistant from './components/AIAssistant';
import AdminPanel from './components/AdminPanel';
import MusicPlayer from './components/MusicPlayer';

const useScrollReveal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setIsVisible(entry.isIntersecting));
    }, { threshold: 0.1 });
    
    if (domRef.current) observer.observe(domRef.current);
    return () => { if (domRef.current) observer.unobserve(domRef.current); };
  }, []);

  return { domRef, isVisible };
};

const SectionReveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  const { domRef, isVisible } = useScrollReveal();
  return (
    <div 
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${className} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {children}
    </div>
  );
};

const App: React.FC = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [rsvps, setRsvps] = useState<RSVPData[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState<Partial<RSVPData>>({
    name: '',
    attending: 'yes',
    partnerName: '',
    preferences: '',
    tableId: undefined
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('anniversary_rsvps');
    if (saved) setRsvps(JSON.parse(saved));
  }, []);

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
    
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % WEDDING_DETAILS.location.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + WEDDING_DETAILS.location.images.length) % WEDDING_DETAILS.location.images.length);
  };

  const getGoogleCalendarLink = () => {
    const start = "20260125T150000Z";
    const end = "20260125T235900Z";
    const title = encodeURIComponent("Ержан мен Гүлсара: Алтын Той");
    const details = encodeURIComponent("Ержан мен Гүлсараның 50 жылдық Алтын тойына шақырамыз.");
    const location = encodeURIComponent(WEDDING_DETAILS.location.address);
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;
  };

  return (
    <div className="min-h-screen font-sans selection:bg-gold/20 bg-cream">
      <AIAssistant />
      {showAdmin && <AdminPanel rsvps={rsvps} onClose={() => setShowAdmin(false)} />}

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center p-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cream"></div>
        
        <div className="relative z-10 max-w-4xl animate-fade-in-up">
          <div className="mb-12 flex justify-center">
            <MusicPlayer />
          </div>
          <p className="text-gold tracking-[0.5em] uppercase text-sm mb-6 font-semibold">1976 — 2026</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-4">
            <h1 className="text-6xl md:text-9xl font-serif text-earth drop-shadow-sm">
              {WEDDING_DETAILS.couple.husband}
            </h1>
            <span className="text-4xl font-serif text-gold italic">&</span>
            <h1 className="text-6xl md:text-9xl font-serif text-earth drop-shadow-sm">
              {WEDDING_DETAILS.couple.wife}
            </h1>
          </div>
          <p className="text-gold font-serif text-2xl md:text-4xl tracking-widest mb-12 uppercase">
            АЛТЫН ТОЙ
          </p>
          <div className="text-2xl font-serif tracking-widest text-earth/90 border-y border-gold/40 py-4 inline-block px-12">
            25.01.2026
          </div>
          
          <div className="mt-12">
            <a 
              href={getGoogleCalendarLink()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-white/50 backdrop-blur-md px-6 py-3 rounded-full text-[10px] uppercase tracking-widest text-earth font-bold border border-gold/20 hover:bg-gold hover:text-white transition-all shadow-lg"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z"/></svg>
              Күнтізбеге қосу
            </a>
          </div>
        </div>

        <button 
          onClick={() => setShowAdmin(true)}
          className="absolute top-4 right-4 text-[8px] text-gold/40 hover:text-gold uppercase"
        >
          Админ панелі
        </button>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-20 space-y-32">
        
        <SectionReveal className="text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl font-serif text-earth">Жарты ғасырлық махаббат</h2>
            <p className="text-earth/70 leading-relaxed max-w-xl mx-auto text-lg">
              Елу жылдық ортақ армандар, күлкі мен бақытты сәттер. Біз сізді Алтын тойымыздың қадірлі қонағы болуға шақырамыз.
            </p>
          </div>
          <Countdown targetDate={WEDDING_DETAILS.date} />
        </SectionReveal>

        {/* Location Section */}
        <SectionReveal className="text-center space-y-10">
          <h2 className="text-4xl font-serif text-earth">Өту орны</h2>
          <div className="bg-white rounded-[60px] overflow-hidden shadow-2xl border border-gold/10 group">
            <div className="relative h-[450px] overflow-hidden bg-earth/5">
              <button 
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {WEDDING_DETAILS.location.images.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
                  ></div>
                ))}
              </div>

              {WEDDING_DETAILS.location.images.map((img, idx) => (
                <div 
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                  <img src={img} alt={`Venue ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="absolute inset-0 bg-black/10 transition-all pointer-events-none"></div>
            </div>
            <div className="p-12 space-y-8">
              <div className="space-y-2">
                <h4 className="text-4xl font-serif text-earth">{WEDDING_DETAILS.location.name}</h4>
                <p className="text-gold font-bold uppercase tracking-widest text-xs">{WEDDING_DETAILS.location.address}</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <a 
                  href={WEDDING_DETAILS.location.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-4 bg-earth text-cream px-14 py-6 rounded-full text-sm uppercase tracking-[0.3em] font-bold hover:bg-gold hover:text-earth transition-all shadow-2xl shadow-earth/30"
                >
                  <img src="https://2gis.kz/favicon.ico" className="w-6 h-6 rounded-md" alt="2GIS" />
                  2GIS арқылы бару
                </a>
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* Schedule */}
        <SectionReveal className="space-y-16">
          <h2 className="text-4xl font-serif text-earth text-center">Той бағдарламасы</h2>
          <div className="space-y-12 relative max-w-lg mx-auto">
            <div className="absolute left-[7px] md:left-1/2 md:-translate-x-1/2 w-[1px] h-full bg-gold/30 top-0"></div>
            {SCHEDULE.map((item, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center gap-8 md:gap-14 relative">
                <div className="md:flex-1 md:text-right">
                  <span className="text-2xl font-serif text-gold font-bold">{item.time}</span>
                </div>
                <div className="w-4 h-4 rounded-full bg-gold border-4 border-white z-10 shadow-lg ml-[-1px] md:ml-0"></div>
                <div className="md:flex-1 text-left">
                  <h4 className="text-xl font-serif text-earth uppercase tracking-[0.2em] font-bold">{item.title}</h4>
                  <p className="text-sm text-earth/60 mt-1 italic leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* RSVP Section */}
        <SectionReveal id="rsvp" className="space-y-12">
          <h2 className="text-4xl font-serif text-earth text-center">Келетініңізді растау</h2>
          {submitted ? (
            <div className="bg-white p-20 rounded-[80px] text-center shadow-2xl border-2 border-gold/20 animate-bounce-in">
              <div className="text-7xl mb-8 animate-pulse">🥂</div>
              <h3 className="text-4xl font-serif text-gold mb-4">Рақмет!</h3>
              <p className="text-earth/60 text-xl font-serif">Жауабыңыз қабылданды. Сізді асыға күтеміз!</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-10 text-xs text-gold underline font-bold uppercase tracking-[0.2em] hover:text-earth transition-colors"
              >
                Өзгерту
              </button>
            </div>
          ) : (
            <div className="bg-white p-10 md:p-20 rounded-[80px] shadow-2xl border border-gold/10">
              <form onSubmit={handleRSVP} className="space-y-12">
                <div className="grid md:grid-cols-2 gap-16">
                  <div className="space-y-10">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-4">Толық аты-жөніңіз</label>
                      <input 
                        type="text"
                        required
                        placeholder="Аты-жөніңізді жазыңыз"
                        className="w-full bg-cream/30 border-b-2 border-gold/20 py-4 px-2 focus:border-gold outline-none transition-all text-xl font-serif placeholder:text-earth/20"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>

                    <div className="space-y-6">
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-gold font-bold">Келесіз бе?</label>
                      {[
                        { val: 'yes', label: 'Жалғыз келемін' },
                        { val: 'with-plus-one', label: 'Жұбайыммен келемін' },
                        { val: 'no', label: 'Өкінішке орай, келе алмаймын' },
                      ].map(opt => (
                        <label key={opt.val} className="flex items-center gap-5 cursor-pointer group">
                          <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${formData.attending === opt.val ? 'border-gold bg-gold scale-110 shadow-lg' : 'border-gold/20 group-hover:border-gold'}`}>
                            {formData.attending === opt.val && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                          </div>
                          <input 
                            type="radio"
                            className="hidden"
                            name="attending"
                            value={opt.val}
                            onChange={(e) => setFormData({...formData, attending: e.target.value as any})}
                          />
                          <span className={`text-base transition-colors ${formData.attending === opt.val ? 'text-earth font-bold' : 'text-earth/50'}`}>{opt.label}</span>
                        </label>
                      ))}
                    </div>

                    {formData.attending === 'with-plus-one' && (
                      <div className="animate-fade-in">
                        <label className="block text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-4">Жұбайыңыздың аты-жөні</label>
                        <input 
                          type="text"
                          placeholder="Аты-жөні"
                          className="w-full bg-cream/30 border-b-2 border-gold/20 py-4 px-2 focus:border-gold outline-none transition-all text-xl font-serif"
                          value={formData.partnerName}
                          onChange={(e) => setFormData({...formData, partnerName: e.target.value})}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-8">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-4">Тілектер немесе ерекше қажеттіліктер</label>
                      <textarea 
                        placeholder="Тілектеріңізді жазыңыз..."
                        rows={4}
                        className="w-full bg-cream/30 border-b-2 border-gold/20 py-4 px-2 focus:border-gold outline-none transition-all resize-none text-base font-serif italic"
                        value={formData.preferences}
                        onChange={(e) => setFormData({...formData, preferences: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-gold/10">
                  <TableSelection 
                    rsvps={rsvps}
                    selectedTableId={formData.tableId || null} 
                    onSelect={(id) => setFormData({...formData, tableId: id})}
                  />
                  {!formData.tableId && formData.attending !== 'no' && (
                    <p className="text-[10px] text-center mt-6 text-gold/60 animate-pulse font-bold tracking-[0.1em] uppercase">Жоғарыдағы тізімнен үстел таңдаңыз</p>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={loading || (!formData.tableId && formData.attending !== 'no')}
                  className={`w-full py-8 rounded-full text-sm uppercase tracking-[0.4em] font-bold shadow-2xl transition-all relative overflow-hidden ${
                    loading || (!formData.tableId && formData.attending !== 'no')
                    ? 'bg-earth/20 text-earth/40 cursor-not-allowed'
                    : 'bg-gold text-white hover:bg-earth hover:scale-[1.02] shadow-gold/40'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-4">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Жіберілуде...
                    </span>
                  ) : "Қатысуымды растаймын"}
                </button>
              </form>
            </div>
          )}
        </SectionReveal>

        {/* Contact Info */}
        <SectionReveal className="text-center p-20 bg-gold/5 rounded-[80px] border-2 border-gold/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full"></div>
          <h2 className="text-4xl font-serif text-earth mb-8">Сұрақтарыңыз бар ма?</h2>
          <p className="text-earth/60 text-lg mb-10 max-w-sm mx-auto font-serif italic">«Егер көлік немесе орналасқан жер бойынша сұрақтар туындаса, Жұман сізге көмектесуге дайын».</p>
          <div className="flex flex-col items-center gap-6 group">
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-bold mb-2">Байланыс телефоны</span>
              <a 
                href={`tel:${WEDDING_DETAILS.contact.phone}`} 
                className="text-4xl md:text-5xl font-serif text-earth hover:text-gold transition-all hover:scale-105"
              >
                {WEDDING_DETAILS.contact.phone}
              </a>
            </div>
            
            <a 
              href={WEDDING_DETAILS.contact.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold text-sm tracking-widest hover:scale-105 transition-all shadow-xl shadow-green-500/20"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.131c1.53.884 3.178 1.335 4.861 1.335h.005c5.455 0 9.894-4.44 9.897-9.896 0-2.644-1.03-5.13-2.901-7c-1.871-1.871-4.358-2.901-7.003-2.901-5.456 0-9.896 4.44-9.899 9.897-.001 1.769.463 3.498 1.345 5.021l-1.082 3.95 4.046-1.061zm11.033-5.577c-.307-.154-1.82-.9-2.101-1.002-.281-.102-.486-.154-.69.154-.204.307-.791.997-.97 1.203-.179.205-.359.231-.666.077-.307-.154-1.298-.479-2.471-1.527-.912-.812-1.528-1.815-1.707-2.122-.179-.307-.019-.473.135-.625.138-.138.307-.359.461-.538.154-.179.204-.307.307-.513.102-.205.051-.385-.026-.538-.077-.154-.69-1.667-.946-2.283-.25-.605-.503-.522-.69-.532-.178-.01-.383-.012-.588-.012s-.538.077-.82.385c-.282.308-1.077 1.051-1.077 2.564 0 1.513 1.102 2.974 1.256 3.179.154.205 2.17 3.313 5.258 4.643.735.316 1.309.505 1.755.647.739.235 1.412.202 1.944.123.594-.088 1.82-.744 2.076-1.462.256-.718.256-1.333.179-1.461-.077-.128-.282-.205-.589-.359z"/></svg>
              WhatsApp-қа жазу
            </a>
            <span className="bg-gold/10 px-4 py-1 rounded-full text-[10px] uppercase tracking-widest text-gold font-bold mt-4">Жұман — Той иесі</span>
          </div>
        </SectionReveal>

      </main>

      <footer className="bg-white py-24 text-center border-t border-gold/10 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-cream rounded-full border border-gold/10 flex items-center justify-center text-3xl shadow-xl">👑</div>
        <h2 className="text-5xl font-serif text-gold mb-6 drop-shadow-sm">Ержан мен Гүлсара</h2>
        <p className="text-earth/40 text-[10px] uppercase tracking-[0.6em] font-bold">50 жылдық берекелі ғұмыр • 1976 - 2026</p>
      </footer>
    </div>
  );
};

export default App;
