
import React, { useRef, useEffect } from 'react';
import { GameEngine } from '../game/engine';
import { GameResult } from '../types';

interface GameCanvasProps {
  onGameOver: (result: GameResult) => void;
  onVictory: (result: GameResult) => void;
  onStatsUpdate: (distance: number, gifts: number, crystals: number, progress: number) => void;
  setGameEngine: (engine: GameEngine) => void;
  isPaused: boolean;
  onPause: () => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onGameOver, onVictory, onStatsUpdate, setGameEngine, isPaused, onPause }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    
    // Set canvas size based on device pixel ratio for sharpness
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const engine = new GameEngine(
      canvas,
      { onGameOver, onVictory, onStatsUpdate }
    );
    gameEngineRef.current = engine;
    setGameEngine(engine);

    engine.start();

    // Event listener for pausing with 'P' key
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 'p') {
            e.preventDefault();
            onPause();
        }
    };
    window.addEventListener('keydown', handleKeyDown);

    const handleResize = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        engine.resize(rect.width, rect.height);
    }
    window.addEventListener('resize', handleResize);


    return () => {
      engine.destroy();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isPaused) {
      gameEngineRef.current?.pause();
    } else {
      gameEngineRef.current?.resume();
    }
  }, [isPaused]);


  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
};

export default GameCanvas;