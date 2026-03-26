import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 50; // Decreased speed by 25% (40 * 1.25 = 50)

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastDirectionRef = useRef(INITIAL_DIRECTION);
  const directionQueueRef = useRef<{x: number, y: number}[]>([]);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    lastDirectionRef.current = INITIAL_DIRECTION;
    directionQueueRef.current = [];
    setFood(generateFood());
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    let nextDir = direction;
    if (directionQueueRef.current.length > 0) {
      nextDir = directionQueueRef.current.shift()!;
      setDirection(nextDir);
    }

    lastDirectionRef.current = nextDir;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      head.x += nextDir.x;
      head.y += nextDir.y;

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for game controls
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        setIsPaused(prev => !prev);
        return;
      }

      // Determine the last direction in the queue, or the current actual direction if queue is empty
      const lastQueuedDir = directionQueueRef.current.length > 0 
        ? directionQueueRef.current[directionQueueRef.current.length - 1]
        : lastDirectionRef.current;

      let newDir;
      switch (e.key) {
        case 'ArrowUp':
          if (lastQueuedDir.y === 0) newDir = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (lastQueuedDir.y === 0) newDir = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (lastQueuedDir.x === 0) newDir = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (lastQueuedDir.x === 0) newDir = { x: 1, y: 0 };
          break;
      }

      if (newDir) {
        // Limit queue size to prevent massive buffering
        if (directionQueueRef.current.length < 3) {
          directionQueueRef.current.push(newDir);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isGameOver && !isPaused) {
      gameLoopRef.current = window.setInterval(moveSnake, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isGameOver, isPaused]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Score Bar */}
      <div className="flex justify-between w-full max-w-[400px] px-4 py-3 bg-void border border-zinc-800 rounded-lg mb-2">
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-zinc-500 uppercase">SCORE</span>
          <span className="text-lg font-pixel text-cyan text-shadow-cyan">{score}</span>
        </div>
        <div className="flex items-center gap-4">
          <Trophy className="w-4 h-4 text-magenta" />
          <span className="text-xs font-mono text-zinc-500 uppercase">BEST</span>
          <span className="text-lg font-pixel text-magenta text-shadow-magenta">{highScore}</span>
        </div>
      </div>

      <div className="relative group">
        <div className="grid grid-cols-20 grid-rows-20 w-[320px] h-[320px] md:w-[400px] md:h-[400px] bg-void border-2 border-cyan relative overflow-hidden shadow-[0_0_15px_rgba(0,255,255,0.2)]">
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 pointer-events-none opacity-20">
            {Array.from({ length: 400 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-cyan/20" />
            ))}
          </div>

          {/* Snake */}
          {snake.map((segment, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${(segment.x * 100) / GRID_SIZE}%`,
                top: `${(segment.y * 100) / GRID_SIZE}%`,
                backgroundColor: i === 0 ? '#fff' : 'var(--color-cyan)',
                boxShadow: i === 0 ? '0 0 8px #fff' : 'none',
                zIndex: i === 0 ? 10 : 1
              }}
            />
          ))}

          {/* Food */}
          <div
            className="absolute"
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              left: `${(food.x * 100) / GRID_SIZE}%`,
              top: `${(food.y * 100) / GRID_SIZE}%`,
              backgroundColor: 'var(--color-magenta)',
              boxShadow: '0 0 10px var(--color-magenta)',
            }}
          />

          {/* Game Over Overlay */}
          {isGameOver && (
            <div className="absolute inset-0 bg-void/90 flex flex-col items-center justify-center z-50">
              <h2 className="text-3xl md:text-4xl font-pixel text-magenta text-shadow-magenta mb-6 glitch-text" data-text="GAME OVER">GAME OVER</h2>
              <p className="text-zinc-400 mb-8 font-mono text-xl">Final Score: {score}</p>
              <button
                onClick={resetGame}
                className="flex items-center gap-3 px-8 py-4 bg-cyan text-void font-pixel text-sm hover:bg-white transition-colors shadow-[4px_4px_0px_#ff00ff] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                <RotateCcw className="w-5 h-5" />
                RETRY
              </button>
            </div>
          )}

          {/* Pause Overlay */}
          {isPaused && !isGameOver && (
            <div className="absolute inset-0 bg-void/80 flex flex-col items-center justify-center z-40">
              <button
                onClick={() => setIsPaused(false)}
                className="w-20 h-20 bg-void border-2 border-cyan flex items-center justify-center group hover:bg-cyan/20 transition-all shadow-[0_0_15px_rgba(0,255,255,0.5)]"
              >
                <Play className="w-10 h-10 text-cyan fill-cyan" />
              </button>
              <p className="mt-6 text-cyan font-pixel text-xs animate-pulse">PRESS SPACE</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
