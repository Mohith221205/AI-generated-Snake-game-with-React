import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Radio } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "CYBERPUNK_DREAMS",
    artist: "AI_SYNTHWAVE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/cyber/200/200"
  },
  {
    id: 2,
    title: "NEON_HORIZON",
    artist: "DIGITAL_PULSE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/neon/200/200"
  },
  {
    id: 3,
    title: "MIDNIGHT_GRID",
    artist: "RETRO_FUTURE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/grid/200/200"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      audioRef.current.currentTime = (newProgress / 100) * duration;
      setProgress(newProgress);
    }
  };

  return (
    <div className="w-full max-w-[400px] bg-void border-2 border-magenta p-6 relative overflow-hidden group shadow-[4px_4px_0px_#00ffff]">
      <div className="absolute top-0 left-0 w-full h-1 bg-cyan opacity-20 group-hover:opacity-100 transition-opacity" />
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={handleNext}
      />

      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 border-2 border-cyan relative">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className={`w-full h-full object-cover grayscale contrast-150 ${isPlaying ? 'animate-pulse' : ''}`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-cyan/20 mix-blend-overlay" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-pixel text-cyan truncate mb-2">{currentTrack.title}</h3>
          <p className="text-xs font-mono text-magenta truncate uppercase tracking-widest">ID: {currentTrack.artist}</p>
        </div>
        <Radio className={`w-5 h-5 ${isPlaying ? 'text-magenta animate-bounce' : 'text-zinc-600'}`} />
      </div>

      <div className="space-y-4">
        <div className="relative h-3 w-full bg-zinc-900 border border-zinc-800 overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-magenta transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={handlePrev} className="text-zinc-500 hover:text-cyan transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-10 h-10 bg-cyan text-void flex items-center justify-center hover:bg-white transition-colors active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
            </button>
            <button onClick={handleNext} className="text-zinc-500 hover:text-cyan transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
          <div className="text-xs font-mono text-zinc-500">
            FREQ_SYNC
          </div>
        </div>
      </div>
    </div>
  );
}
