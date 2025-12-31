
import React, { useState, useRef, useEffect } from 'react';

interface MusicPlayerProps {
  customMusic: { id: number; title: string; audioUrl: string }[];
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ customMusic }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = customMusic[currentTrackIndex];

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "auto";
    }

    const audio = audioRef.current;

    const handleCanPlay = () => {
      setLoading(false);
      setError(null);
    };
    
    const handleEnded = () => handleNext();
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      setError("Аудио жүктеу мүмкін болмады");
      setLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []);

  // Update source when track or music list changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const wasPlaying = isPlaying;
      setLoading(true);
      setError(null);
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      
      if (wasPlaying) {
        audioRef.current.play().catch(err => {
          console.warn("Playback blocked or interrupted:", err);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex, customMusic]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error("Playback error:", err);
        setError("Қосу мүмкін болмады");
      });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentTrackIndex(parseInt(e.target.value));
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % customMusic.length);
  };

  if (customMusic.length === 0) return null;

  return (
    <div className="relative">
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-gold/20 flex flex-col md:flex-row items-center gap-4 transition-all hover:bg-white min-w-[300px]">
        <div className="flex items-center gap-3">
          <button 
            onClick={togglePlay}
            disabled={loading}
            className={`w-12 h-12 bg-gold text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-gold/30 disabled:opacity-50`}
            aria-label={isPlaying ? "Пауза" : "Ойнату"}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          
          <button 
            onClick={toggleMute}
            className="p-2 text-earth/60 hover:text-gold transition-colors"
            aria-label={isMuted ? "Дауысты қосу" : "Дауысты өшіру"}
          >
            {isMuted ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </button>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Фондық музыка</span>
            {loading && <span className="text-[8px] text-gold animate-pulse uppercase">Жүктелуде...</span>}
            {error && <span className="text-[8px] text-red-500 font-bold uppercase">{error}</span>}
          </div>
          <select 
            className="bg-transparent border-none text-xs font-serif text-earth focus:ring-0 cursor-pointer p-0 appearance-none pr-6"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23C5A059\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '12px' }}
            value={currentTrackIndex}
            onChange={handleTrackChange}
          >
            {customMusic.map((track, idx) => (
              <option key={track.id} value={idx}>{track.title}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
