// This file contains the main configuration for the game mechanics.
// (EN) Этот файл содержит основные настройки игровой механики.
export const GAME_CONFIG = {
    // Physics
    gravity: 0.6,
    flapStrength: -10,
    maxFallSpeed: 12,
    
    // Progressive Difficulty Stages
    // (EN) Этапы прогрессивной сложности
    speedStages: [
        { distance: 0, speed: 3.0 },
        { distance: 150, speed: 4.0 },
        { distance: 350, speed: 5.5 },
        { distance: 450, speed: 7.5 },
    ],
    gapStages: [
        { distance: 0, min: 200, max: 200 },
        { distance: 350, min: 190, max: 190 },
        { distance: 450, min: 180, max: 180 },
    ],
    snowflakeStages: [
        { distance: 0, count: 50 },
        { distance: 350, count: 100 },
        { distance: 450, count: 150 },
    ],
    darknessStages: [
        { distance: 0, alpha: 0.0 },
        { distance: 350, alpha: 0.1 },
        { distance: 450, alpha: 0.3 },
    ],

    // Santa
    santaWidth: 80,
    santaHeight: 60,
    
    // Obstacles
    obstacleWidth: 120, 
    obstacleMinHeight: 100, 
    obstacleSpawnInterval: 420, // Horizontal distance between obstacles
    
    // Scoring
    crystalSize: 30,
    crystalScore: 10,
    giftDeliveryScore: 50,
    
    // Gameplay
    finishDistance: 500,

    // Visuals
    trailLength: 25,
    starCount: 150,
    backgroundElementCount: 15,
};