
import React, { useState, useCallback, useEffect } from 'react';
import { GameState, GameResult } from './types';
import MainMenu from './components/MainMenu';
import RulesScreen from './components/RulesScreen';
import Leaderboard from './components/Leaderboard';
import GameScreen from './components/GameScreen';
import EndScreen from './components/EndScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MainMenu);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const handleStartGame = () => setGameState(GameState.Playing);
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
