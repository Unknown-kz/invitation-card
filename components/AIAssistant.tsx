
import React, { useState, useRef, useEffect } from 'react';
import { getGuestAssistance } from '../services/geminiService';
import { RSVPData } from '../types';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [chat, loading, isOpen]);

  const handleSend = async () => {
    if (!query.trim() || loading) return;
    const userMsg = query;
    setQuery('');
    setChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    
    const response = await getGuestAssistance(userMsg);
    
    if (response) {
      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const fc of response.functionCalls) {
          if (fc.name === 'submit_rsvp') {
            const args = fc.args as any;
            const savedRSVPs = JSON.parse(localStorage.getItem('anniversary_rsvps') || '[]');
            
            const newRSVP: RSVPData = {
              id: Math.random().toString(36).substr(2, 9),
              name: args.name,
              attending: args.attending,
              partnerName: args.partnerName,
              preferences: args.preferences,
              timestamp: Date.now(),
              tableId: args.tableId || 1
            };
            
            const updated = [...savedRSVPs, newRSVP];
            localStorage.setItem('anniversary_rsvps', JSON.stringify(updated));
            
            setChat(prev => [...prev, { 
              role: 'bot', 
              text: `Рақмет, ${args.name}! Сізді №${args.tableId} үстелге тіркедім. Келесі сұрағыңыз бар ма?` 
            }]);
            
            // Dispatch event to update UI across the app (App.tsx and TableSelection)
            window.dispatchEvent(new Event('storage'));
          }
        }
      } else {
        setChat(prev => [...prev, { role: 'bot', text: response.text || "Сұрағыңызды түсінбедім, қайталап көріңізші." }]);
      }
    } else {
      setChat(prev => [...prev, { role: 'bot', text: "Кешіріңіз, байланыс қатесі." }]);
    }
    
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[110]">
      {isOpen ? (
        <div className="bg-white rounded-[32px] shadow-2xl border border-gold/20 w-[350px] max-w-[90vw] h-[500px] flex flex-col overflow-hidden animate-bounce-in">
          <div className="p-5 bg-gold text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl shadow-inner">✨</div>
              <div className="flex flex-col text-left">
                <h4 className="font-serif text-lg leading-tight tracking-wide">Көмекші</h4>
                <span className="text-[8px] uppercase tracking-widest text-white/70">Ержан & Гүлсара</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all text-xl"
            >
              ✕
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-cream/20 custom-scroll">
            <div className="bg-white p-4 rounded-[20px] text-sm text-earth border border-gold/10 rounded-tl-none font-serif italic shadow-sm">
              Сәлеметсіз бе! Мен той көмекшісімін. Уақыт, бағдарлама немесе тіркелу туралы сұраңыз. ✨
            </div>
            
            {chat.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-[20px] text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-gold text-white rounded-tr-none' 
                  : 'bg-white text-earth border border-gold/10 rounded-tl-none font-serif italic'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/50 p-3 rounded-full flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          
          <div className="p-5 border-t border-gold/10 bg-white flex gap-3">
            <input 
              className="flex-1 bg-cream/40 border border-gold/10 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all placeholder:text-earth/30"
              placeholder="Сұрағыңыз..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend} 
              disabled={loading}
              className="bg-gold text-white w-12 h-12 flex items-center justify-center rounded-full hover:bg-earth transition-all shadow-xl shadow-gold/20 active:scale-95 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-gold text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-4 border-4 border-white active:scale-95 group"
        >
          <span className="hidden md:inline font-sans text-[10px] font-bold uppercase tracking-[0.2em] pl-2 group-hover:text-white/80">AI Көмекші</span>
          <div className="w-6 h-6 flex items-center justify-center">
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
