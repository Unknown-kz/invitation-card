
import React, { useState } from 'react';
import { getGuestAssistance } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;
    const userMsg = query;
    setQuery('');
    setChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    
    const response = await getGuestAssistance(userMsg);
    setChat(prev => [...prev, { role: 'bot', text: response }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-[32px] shadow-2xl border border-gold/20 w-[350px] max-h-[500px] flex flex-col overflow-hidden animate-bounce-in">
          <div className="p-5 bg-gold text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl shadow-inner">✨</div>
              <div className="flex flex-col">
                <h4 className="font-serif text-lg leading-tight tracking-wide">Той көмекшісі</h4>
                <span className="text-[8px] uppercase tracking-widest text-white/70">Қазір желіде</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all text-2xl leading-none"
              title="Жабу"
            >
              ✕
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-cream/20">
            {chat.length === 0 && (
              <div className="text-center py-6 space-y-2">
                <p className="text-[10px] text-earth/40 uppercase tracking-[0.2em] font-bold">Қош келдіңіз!</p>
                <p className="text-sm text-earth/60 font-serif italic">"Мен сізге той бағдарламасы, киім үлгісі немесе мейрамханаға бару жолы туралы айтып бере аламын. Қандай сұрағыңыз бар?"</p>
              </div>
            )}
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
            {loading && <div className="text-[10px] text-gold font-bold animate-pulse px-2 uppercase tracking-widest">Көмекші жазып жатыр...</div>}
          </div>
          
          <div className="p-5 border-t border-gold/10 bg-white flex gap-3">
            <input 
              className="flex-1 bg-cream/40 border border-gold/10 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all placeholder:text-earth/30"
              placeholder="Сұрақ қойыңыз..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend} 
              className="bg-gold text-white w-12 h-12 flex items-center justify-center rounded-full hover:bg-earth transition-all shadow-xl shadow-gold/20 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-gold text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-4 border-4 border-white active:scale-95"
        >
          <span className="hidden md:inline font-sans text-[10px] font-bold uppercase tracking-[0.2em] pl-2">Көмекшімен сөйлесу</span>
          <div className="w-6 h-6 flex items-center justify-center">
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
