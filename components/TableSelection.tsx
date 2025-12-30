
import React from 'react';
import { TABLES_CONFIG } from '../constants';
import { RSVPData } from '../types';

interface TableSelectionProps {
  onSelect: (tableId: number) => void;
  selectedTableId: number | null;
  rsvps: RSVPData[];
}

const TableSelection: React.FC<TableSelectionProps> = ({ onSelect, selectedTableId, rsvps }) => {
  const getOccupancy = (tableId: number) => {
    return rsvps.filter(r => r.tableId === tableId && r.attending !== 'no').length;
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-lg border border-gold/10">
      <h3 className="text-2xl font-serif text-center mb-2 text-earth">Отыру жоспары</h3>
      <p className="text-center text-[10px] text-gold mb-8 uppercase tracking-widest font-bold">Ыңғайлы аймақты таңдаңыз</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {TABLES_CONFIG.map((table) => {
          const occupied = getOccupancy(table.id);
          const isFull = occupied >= table.capacity;
          const isSelected = selectedTableId === table.id;
          
          return (
            <button
              key={table.id}
              type="button"
              disabled={isFull && !isSelected}
              onClick={() => onSelect(table.id)}
              className={`
                relative flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300 border-2
                ${isSelected 
                  ? 'border-gold bg-gold/10 ring-4 ring-gold/5' 
                  : isFull 
                    ? 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed'
                    : 'border-cream bg-cream/30 hover:bg-cream/50'
                }
              `}
            >
              <div className={`
                w-12 h-12 rounded-full mb-3 flex items-center justify-center border-2 transition-all
                ${isSelected ? 'bg-gold border-gold text-white rotate-[360deg]' : 'bg-white border-gold/20 text-gold'}
              `}>
                {table.id}
              </div>
              <span className="text-[10px] font-sans font-bold text-earth uppercase tracking-tighter text-center">{table.name}</span>
              <div className="mt-2 flex items-center gap-1">
                <span className={`text-[10px] font-bold ${isFull ? 'text-red-500' : 'text-gold'}`}>
                  {occupied} / {table.capacity} орын
                </span>
              </div>
              
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-gold text-white rounded-full p-1.5 shadow-md">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              {isFull && !isSelected && (
                <span className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-3xl text-[10px] font-bold text-gray-400 uppercase tracking-widest -rotate-12">
                  Бос емес
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TableSelection;
