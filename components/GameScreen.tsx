import React, { useState, useCallback, useRef } from 'react';
import { GameState, GameResult } from '../types';
import GameCanvas from './GameCanvas';
import HUD from './HUD';
import PauseMenu from './PauseMenu';
import { GameEngine } from '../game/engine';

interface GameScreenProps {
  initialState: GameState;
  onGameOver: (result: GameResult) => void;
  onVictory: (result: GameResult) => void;
  onExit: () => void;
  setGameState: (state: GameState) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ initialState, onGameOver, onVictory, onExit, setGameState }) => {
  const [stats, setStats] = useState({ distance: 0, gifts: 0, crystals: 0, progress: 0 });
  const gameEngineRef = useRef<GameEngine | null>(null);

  const handleStatsUpdate = useCallback((distance: number, gifts: number, crystals: number, progress: number) => {
    setStats({ distance, gifts, crystals, progress });
  }, []);

  const handlePause = () => {
    gameEngineRef.current?.pause();
    setGameState(GameState.Paused);
  };

  const handleResume = () => {
    gameEngineRef.current?.resume();
    setGameState(GameState.Playing);
  };
  
  const handleRestart = () => {
     if(gameEngineRef.current){
         gameEngineRef.current.destroy();
         // A bit of a hack to force a re-render and new engine instance
         setGameState(GameState.MainMenu); 
         setTimeout(()=> setGameState(GameState.Playing), 10);
     }
  }

  const handleGiftDrop = useCallback(() => {
    gameEngineRef.current?.triggerGiftDrop();
  }, []);

  return (
    <div className="relative w-full h-full">
      <GameCanvas
        onGameOver={onGameOver}
        onVictory={onVictory}
        onStatsUpdate={handleStatsUpdate}
        setGameEngine={(engine) => (gameEngineRef.current = engine)}
        isPaused={initialState === GameState.Paused}
        onPause={handlePause}
      />
      <HUD 
        distance={stats.distance} 
        gifts={stats.gifts} 
        crystals={stats.crystals} 
        progress={stats.progress} 
        onPause={handlePause}
        onGiftDrop={handleGiftDrop}
      />
      {initialState === GameState.Paused && (
        <PauseMenu onContinue={handleResume} onRestart={handleRestart} onExit={onExit} />
      )}
    </div>
  );
};

export default GameScreen;