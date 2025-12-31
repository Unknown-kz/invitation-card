
import React from 'react';

const CalendarCard: React.FC = () => {
  return (
    <div className="flex justify-center my-12">
      <div className="relative w-48 h-56 bg-white rounded-2xl shadow-2xl border border-gold/20 overflow-hidden transform hover:rotate-2 transition-transform duration-500">
        {/* Calendar Header */}
        <div className="bg-gold h-12 flex items-center justify-center">
          <span className="text-white font-serif uppercase tracking-[0.2em] text-sm font-bold">Қаңтар / Январь</span>
        </div>
        
        {/* Calendar Body */}
        <div className="flex flex-col items-center justify-center h-44">
          <span className="text-[10px] uppercase tracking-widest text-gold font-bold mb-1">2026</span>
          <div className="relative">
            <span className="text-7xl font-serif text-earth font-bold">25</span>
            {/* Gold Heart Circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-24 h-24 text-gold/30" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-earth/50 font-bold mt-2">Жексенбі / Воскресенье</span>
        </div>
        
        {/* Ring holes at top */}
        <div className="absolute top-2 left-4 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-cream shadow-inner"></div>
          <div className="w-2 h-2 rounded-full bg-cream shadow-inner"></div>
        </div>
        <div className="absolute top-2 right-4 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-cream shadow-inner"></div>
          <div className="w-2 h-2 rounded-full bg-cream shadow-inner"></div>
        </div>
      </div>
    </div>
  );
};

export default CalendarCard;
