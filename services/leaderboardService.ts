
import { LeaderboardEntry } from '../types';

const LEADERBOARD_KEY = 'dedMorozGiftDeliveryLeaderboard_v2';
const MAX_SCORES = 5;

export const getScores = (): LeaderboardEntry[] => {
  try {
    const scoresJSON = localStorage.getItem(LEADERBOARD_KEY);
    if (scoresJSON) {
      return JSON.parse(scoresJSON);
    }
  } catch (error) {
    console.error("Could not retrieve scores from localStorage", error);
  }
  return [];
};

export const saveScore = (newScore: LeaderboardEntry) => {
  try {
    const scores = getScores();
    scores.push(newScore);
    scores.sort((a, b) => b.score - a.score);
    const updatedScores = scores.slice(0, MAX_SCORES);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updatedScores));
  } catch (error) {
    console.error("Could not save score to localStorage", error);
  }
};