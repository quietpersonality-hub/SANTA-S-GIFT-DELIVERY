
import React, { useState, useCallback, useEffect } from 'react';
import { GameState, GameResult } from './types';
import MainMenu from './components/MainMenu';
import RulesScreen from './components/RulesScreen';
import Leaderboard from './components/Leaderboard';
import GameScreen from './components/GameScreen';
import EndScreen from './components/EndScreen';
import { audioManager } from './game/audio';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MainMenu);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  // Initialize audio on first interaction
  useEffect(() => {
    const initAudio = () => {
      audioManager.init();
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
      window.removeEventListener('touchstart', initAudio);
    };
    window.addEventListener('click', initAudio);
    window.addEventListener('keydown', initAudio);
    window.addEventListener('touchstart', initAudio);
    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
      window.removeEventListener('touchstart', initAudio);
    };
  }, []);

  // Manage Background Music
  useEffect(() => {
    switch (gameState) {
      case GameState.MainMenu:
      case GameState.Rules:
      case GameState.Leaderboard:
        audioManager.playMenuMusic();
        break;
      case GameState.Playing:
        audioManager.playGameMusic();
        break;
      case GameState.Paused:
        // Keep music playing or lower volume? Let's keep it for now.
        break;
      case GameState.GameOver:
        audioManager.stopMusic();
        audioManager.playCrash();
        break;
      case GameState.Victory:
        audioManager.stopMusic();
        audioManager.playWin();
        break;
    }
  }, [gameState]);

  const handleStartGame = () => {
      audioManager.init(); // Ensure initialized
      setGameState(GameState.Playing);
  };
  const handleShowRules = () => setGameState(GameState.Rules);
  const handleShowLeaderboard = () => setGameState(GameState.Leaderboard);
  const handleBackToMenu = () => {
    setGameResult(null);
    setGameState(GameState.MainMenu);
  };

  const handleGameOver = useCallback((result: GameResult) => {
    setGameResult(result);
    setGameState(GameState.GameOver);
  }, []);
  
  const handleVictory = useCallback((result: GameResult) => {
    setGameResult(result);
    setGameState(GameState.Victory);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (gameState === GameState.Playing || gameState === GameState.Paused)) {
        setGameState(GameState.MainMenu);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const renderContent = () => {
    switch (gameState) {
      case GameState.MainMenu:
        return (
          <MainMenu
            onStart={handleStartGame}
            onRules={handleShowRules}
            onLeaderboard={handleShowLeaderboard}
          />
        );
      case GameState.Rules:
        return <RulesScreen onBack={handleBackToMenu} />;
      case GameState.Leaderboard:
        return <Leaderboard onBack={handleBackToMenu} />;
      case GameState.Playing:
      case GameState.Paused:
        return (
          <GameScreen
            initialState={gameState}
            onGameOver={handleGameOver}
            onVictory={handleVictory}
            onExit={handleBackToMenu}
            setGameState={setGameState}
          />
        );

      case GameState.GameOver:
      case GameState.Victory:
        return (
          <EndScreen
            result={gameResult!}
            isVictory={gameState === GameState.Victory}
            onRestart={handleStartGame}
            onMenu={handleBackToMenu}
          />
        );
      default:
        return <MainMenu onStart={handleStartGame} onRules={handleShowRules} onLeaderboard={handleShowLeaderboard} />;
    }
  };

  return (
    <div className="w-screen h-[100dvh] bg-gray-900 text-white font-sans select-none overflow-hidden relative touch-none">
      {renderContent()}
    </div>
  );
};

export default App;
