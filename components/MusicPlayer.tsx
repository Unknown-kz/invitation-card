
import React, { useState, useRef, useEffect } from 'react';
import { WEDDING_DETAILS } from '../constants';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Playback prevented or interrupted:", error);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuteState = !isMuted;
    audioRef.current.muted = newMuteState;
    setIsMuted(newMuteState);
  };

  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newIndex = parseInt(e.target.value);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentTrackIndex(newIndex);
    setIsPlaying(true);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-gold/20 flex flex-col md:flex-row items-center gap-4 transition-all hover:bg-white">
      <audio 
        ref={audioRef}
        src={WEDDING_DETAILS.music[currentTrackIndex].url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        loop
      />
      
      <div className="flex items-center gap-3">
        <button 
          onClick={togglePlay}
          aria-label={isPlaying ? "Тоқтату" : "Тыңдау"}
          className="w-12 h-12 bg-gold text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-gold/30"
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
        
        <button 
          onClick={toggleMute}
          aria-label={isMuted ? "Дауысты қосу" : "Дауысты өшіру"}
          className="p-2 text-earth/60 hover:text-gold transition-colors"
        >
          {isMuted ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
        </button>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-widest text-gold font-bold mb-1">Музыка таңдау</span>
        <select 
          className="bg-transparent border-none text-xs font-serif text-earth focus:ring-0 cursor-pointer"
          value={currentTrackIndex}
          onChange={handleTrackChange}
        >
          {WEDDING_DETAILS.music.map((track, idx) => (
            <option key={track.id} value={idx}>{track.title}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MusicPlayer;
