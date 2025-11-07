
export enum GameState {
  MainMenu,
  Rules,
  Leaderboard,
  Playing,
  Paused,
  GameOver,
  Victory,
}

export interface GameResult {
  distance: number;
  deliveredGifts: number;
  crystals: number;
  score: number;
  time: number;
}

export interface LeaderboardEntry {
  score: number;
  deliveredGifts: number;
  crystals: number;
  date: string;
}