import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Zap, Terminal, Radio } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-void flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono text-cyan">
      {/* Glitch & Noise Effects */}
      <div className="noise-overlay" />
      <div className="crt-line" />

      {/* Header - Absolute Top */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-8 text-center z-10 w-full flex flex-col items-center"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <Zap className="w-8 h-8 text-cyan animate-pulse" />
          <h1 className="text-4xl md:text-6xl font-pixel text-white">
            NEON<span className="text-cyan text-shadow-cyan">SNAKE</span>
          </h1>
        </div>
        <p className="text-zinc-500 font-mono text-lg tracking-[0.5em] uppercase">ARCADE RHYTHM EXPERIENCE</p>
      </motion.header>

      {/* Main Content - Centered */}
      <main className="w-full flex flex-col items-center justify-center z-10 flex-1 mt-24 lg:mt-0">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          <SnakeGame />
        </motion.div>
      </main>

      {/* Floating Elements */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="hidden xl:flex fixed bottom-8 left-8 flex-col gap-6 z-50 w-72"
      >
        <div className="p-6 bg-void border-2 border-cyan shadow-[4px_4px_0px_#ff00ff]">
          <div className="flex items-center gap-2 mb-4 border-b border-cyan pb-2">
            <Terminal className="w-5 h-5 text-cyan" />
            <h2 className="text-sm font-pixel text-cyan">INPUT_VECTORS</h2>
          </div>
          <ul className="space-y-3 text-lg font-mono text-zinc-400">
            <li className="flex justify-between"><span>[MOVE]</span> <span className="text-magenta">ARROWS</span></li>
            <li className="flex justify-between"><span>[PAUSE]</span> <span className="text-magenta">SPACE</span></li>
            <li className="flex justify-between"><span>[REBOOT]</span> <span className="text-magenta">CLICK</span></li>
          </ul>
        </div>

        <div className="p-6 bg-void border-2 border-magenta shadow-[4px_4px_0px_#00ffff]">
          <div className="flex items-center gap-2 mb-4 border-b border-magenta pb-2">
            <Radio className="w-5 h-5 text-magenta" />
            <h2 className="text-sm font-pixel text-magenta">AUDIO_STREAM</h2>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full bg-zinc-900 border border-zinc-800 overflow-hidden">
              <motion.div 
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="h-full w-1/4 bg-cyan"
              />
            </div>
            <p className="text-sm text-zinc-500 font-mono uppercase animate-pulse">SYNCING FREQUENCIES...</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative lg:fixed lg:bottom-8 lg:right-8 z-50 w-full max-w-[350px] md:max-w-[400px] mt-8 lg:mt-0 flex flex-col items-center lg:items-end gap-6"
      >
        <MusicPlayer />
        
        <div className="w-full p-4 bg-void border border-zinc-800 text-center lg:text-right">
          <p className="text-sm text-zinc-600 font-mono uppercase leading-relaxed">
            SYS.STATUS: <span className="text-cyan">ONLINE</span><br/>
            v2.0.0 // PROTOCOL_GLITCH
          </p>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-zinc-700 font-mono text-sm uppercase tracking-[0.5em] z-10 hidden lg:block">
        &copy; 2026 NEON ARCADE SYSTEMS
      </footer>
    </div>
  );
}
