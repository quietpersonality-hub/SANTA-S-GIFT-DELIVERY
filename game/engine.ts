
import { Santa, Obstacle, Crystal, DroppedGift, Particle, BackgroundStar, BackgroundElement, Snowflake } from './entities';
import { GAME_CONFIG } from './config';
import { GameResult } from '../types';

interface GameCallbacks {
  onGameOver: (result: GameResult) => void;
  onVictory: (result: GameResult) => void;
  onStatsUpdate: (distance: number, gifts: number, crystals: number, progress: number) => void;
}

// Helper function for interpolation
function getInterpolatedValue(stages: { distance: number; [key: string]: number }[], currentDistance: number, key: string): number {
    const currentStage = stages.slice().reverse().find(s => currentDistance >= s.distance);
    const nextStage = stages.find(s => currentDistance < s.distance);

    if (!currentStage) return stages[0][key];
    if (!nextStage) return currentStage[key];

    const distanceRange = nextStage.distance - currentStage.distance;
    const distanceProgress = currentDistance - currentStage.distance;
    const progressPercent = distanceProgress / distanceRange;

    const valueRange = nextStage[key] - currentStage[key];
    return currentStage[key] + valueRange * progressPercent;
}


export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private callbacks: GameCallbacks;
  private viewWidth: number;
  private viewHeight: number;

  private santa: Santa;
  private obstacles: Obstacle[] = [];
  private crystals: Crystal[] = [];
  private droppedGifts: DroppedGift[] = [];
  private particles: Particle[] = [];
  private backgroundStars: BackgroundStar[] = [];
  private backgroundElements: BackgroundElement[] = [];
  private snowflakes: Snowflake[] = [];
  
  private distanceTraveled = 0;
  private giftsDelivered = 0;
  private crystalsCollected = 0;
  private startTime: number;

  private isRunning = false;
  private isPaused = false;
  private isGameOver = false;
  private animationFrameId: number = 0;
  
  // Aurora properties
  private auroraOffset = 0;
  
  private boundHandleAction: () => void;
  private boundHandleKeyDown: (e: KeyboardEvent) => void;
  private boundHandleTouch: (e: TouchEvent) => void;


  constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error("Could not get 2D context");
    this.ctx = context;
    this.callbacks = callbacks;
    
    const dpr = window.devicePixelRatio || 1;
    this.viewWidth = canvas.width / dpr;
    this.viewHeight = canvas.height / dpr;

    this.santa = new Santa(100, this.viewHeight / 2);
    this.startTime = Date.now();
    
    this.initBackground();
    
    this.boundHandleAction = this.handleAction.bind(this);
    this.boundHandleTouch = (e) => {
        if(e.cancelable) e.preventDefault(); // Stop scrolling
        this.handleAction();
    };
    this.boundHandleKeyDown = (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            this.handleAction();
        }
        if (e.key === 'Control' || e.key === 'ControlLeft' || e.key === 'ControlRight') {
            e.preventDefault();
            this.triggerGiftDrop();
        }
    };
    
    this.setupControls();
  }

  private initBackground() {
    for (let i = 0; i < GAME_CONFIG.starCount; i++) {
        this.backgroundStars.push(new BackgroundStar(this.viewWidth, this.viewHeight));
    }
    for (let i = 0; i < GAME_CONFIG.backgroundElementCount; i++) {
        this.backgroundElements.push(new BackgroundElement(this.viewWidth, this.viewHeight, i * (this.viewWidth / GAME_CONFIG.backgroundElementCount) ));
    }
    const initialSnowflakeCount = GAME_CONFIG.snowflakeStages[0].count;
    for (let i = 0; i < initialSnowflakeCount; i++) {
        this.snowflakes.push(new Snowflake(this.viewWidth, this.viewHeight));
    }
  }
  
  public resize(width: number, height: number) {
    this.viewWidth = width;
    this.viewHeight = height;
  }

  private handleAction() {
    if (!this.isRunning || this.isPaused || this.isGameOver) return;
    this.santa.flap();
  };

  public triggerGiftDrop() {
    if (!this.isRunning || this.isPaused || this.isGameOver || !this.santa.canDropGift()) return;

    // Find an obstacle that is currently a target and doesn't have a gift
    const targetObstacle = this.obstacles.find(o => o.isTarget && !o.hasGift);

    // Allow dropping even if not perfectly targeted, game logic handles success
    this.santa.dropGift();
    this.droppedGifts.push(new DroppedGift(this.santa.x + GAME_CONFIG.santaWidth / 2, this.santa.y + GAME_CONFIG.santaHeight));
  }

  private setupControls() {
    window.addEventListener('keydown', this.boundHandleKeyDown);
    this.canvas.addEventListener('mousedown', this.boundHandleAction);
    this.canvas.addEventListener('touchstart', this.boundHandleTouch, { passive: false });
  }

  public start() {
    this.isRunning = true;
    this.gameLoop();
  }

  public pause() {
      if (this.isRunning && !this.isGameOver) {
          this.isPaused = true;
      }
  }

  public resume() {
      if (this.isRunning && this.isPaused) {
          this.isPaused = false;
          this.gameLoop();
      }
  }

  public destroy() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('keydown', this.boundHandleKeyDown);
    this.canvas.removeEventListener('mousedown', this.boundHandleAction);
    this.canvas.removeEventListener('touchstart', this.boundHandleTouch);
  }

  private gameLoop = () => {
    if (!this.isRunning || this.isGameOver) return;
    if(this.isPaused) {
        this.animationFrameId = requestAnimationFrame(this.gameLoop);
        return;
    }

    this.update();
    this.draw();
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  private getCurrentSpeed(): number {
    return getInterpolatedValue(GAME_CONFIG.speedStages, this.distanceTraveled, 'speed');
  }

  private spawnObstacleAndCrystals() {
    const gapMin = getInterpolatedValue(GAME_CONFIG.gapStages, this.distanceTraveled, 'min');
    const gapMax = getInterpolatedValue(GAME_CONFIG.gapStages, this.distanceTraveled, 'max');
    const obstacleGap = Math.random() * (gapMax - gapMin) + gapMin;
    
    const newObstacle = new Obstacle(this.viewWidth, this.viewHeight, obstacleGap);
    this.obstacles.push(newObstacle);

    const gapCenterY = newObstacle.topHeight + obstacleGap / 2;
    const crystalX = this.viewWidth + GAME_CONFIG.obstacleWidth / 2;
    const pattern = Math.random();
    const crystalBuffer = 30;

    if (pattern < 0.25) { 
        const offset = (obstacleGap / 2 - GAME_CONFIG.crystalSize - crystalBuffer) * (Math.random() > 0.5 ? 1 : -1);
        this.crystals.push(new Crystal(crystalX, gapCenterY + offset));
    } else if (pattern < 0.5) { 
        const spacing = GAME_CONFIG.crystalSize * 3;
        if (obstacleGap > spacing * 2) {
             this.crystals.push(new Crystal(crystalX, gapCenterY - spacing));
             this.crystals.push(new Crystal(crystalX, gapCenterY));
             this.crystals.push(new Crystal(crystalX, gapCenterY + spacing));
        }
    } else if (pattern < 0.75) { 
        const spacingX = GAME_CONFIG.crystalSize * 2.5;
        const spacingY = GAME_CONFIG.crystalSize * 2;
        const direction = Math.random() > 0.5 ? 1 : -1;
        this.crystals.push(new Crystal(crystalX - spacingX, gapCenterY - spacingY * direction));
        this.crystals.push(new Crystal(crystalX, gapCenterY));
        this.crystals.push(new Crystal(crystalX + spacingX, gapCenterY + spacingY * direction));
    }
  }
  
  private updateDynamicElements(currentSpeed: number) {
      // Snowflake count adjustment
      const desiredSnowflakes = getInterpolatedValue(GAME_CONFIG.snowflakeStages, this.distanceTraveled, 'count');
      if (this.snowflakes.length < desiredSnowflakes && Math.random() > 0.9) {
          this.snowflakes.push(new Snowflake(this.viewWidth, this.viewHeight));
      }

      this.snowflakes.forEach(s => s.update(currentSpeed, this.viewWidth, this.viewHeight));
  }

  private update() {
    const currentSpeed = this.getCurrentSpeed();
    this.distanceTraveled += currentSpeed / 60; 
    this.auroraOffset += 0.02;

    this.santa.update(this.particles, currentSpeed / GAME_CONFIG.speedStages[0].speed);
    
    this.backgroundStars.forEach(star => star.update(currentSpeed, this.viewWidth));
    this.backgroundElements.forEach(b => b.update(currentSpeed, this.viewWidth));
    
    this.updateDynamicElements(currentSpeed);

    this.obstacles.forEach(obstacle => obstacle.update(currentSpeed, this.santa));
    this.obstacles = this.obstacles.filter(o => o.x + GAME_CONFIG.obstacleWidth > 0);

    const lastObstacle = this.obstacles[this.obstacles.length - 1];
    if (!lastObstacle || this.viewWidth - lastObstacle.x > GAME_CONFIG.obstacleSpawnInterval) {
        this.spawnObstacleAndCrystals();
    }
    
    this.crystals.forEach(c => c.update(currentSpeed, this.santa));
    this.crystals = this.crystals.filter(g => g.x + GAME_CONFIG.crystalSize > 0);
    this.droppedGifts.forEach(g => g.update());
    this.droppedGifts = this.droppedGifts.filter(g => g.y < this.viewHeight + 50);
    this.particles.forEach(p => p.update());
    this.particles = this.particles.filter(p => p.alpha > 0);

    this.checkInteractions();
    
    if (this.distanceTraveled >= GAME_CONFIG.finishDistance) {
        this.handleVictory();
    }
    
    this.callbacks.onStatsUpdate(this.distanceTraveled, this.giftsDelivered, this.crystalsCollected, this.distanceTraveled / GAME_CONFIG.finishDistance);
  }

  private checkInteractions() {
    // Ground/Ceiling collision
    if (this.santa.y + GAME_CONFIG.santaHeight < 0 || this.santa.y > this.viewHeight) {
      this.handleGameOver();
    }

    // Check collision with chimneys
    for (const obstacle of this.obstacles) {
      // Simple box collision for now, could be improved with polygon check
      if (
        this.santa.x < obstacle.x + GAME_CONFIG.obstacleWidth &&
        this.santa.x + GAME_CONFIG.santaWidth > obstacle.x &&
        this.santa.y + GAME_CONFIG.santaHeight > obstacle.topHeight + obstacle.gap
      ) {
         this.handleGameOver();
         return;
      }
       // Ceiling pipe collision check
      if (
          this.santa.x < obstacle.x + GAME_CONFIG.obstacleWidth &&
          this.santa.x + GAME_CONFIG.santaWidth > obstacle.x &&
          this.santa.y < obstacle.topHeight
      ) {
          this.handleGameOver();
          return;
      }
    }
    
    // Check collision with crystals
    for (const crystal of this.crystals) {
        if (crystal.isCollected) continue;
        const distX = (this.santa.x + GAME_CONFIG.santaWidth / 2) - crystal.x;
        const distY = (this.santa.y + GAME_CONFIG.santaHeight / 2) - crystal.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        if (distance < GAME_CONFIG.crystalSize + (GAME_CONFIG.santaWidth / 2) ) {
            crystal.isCollected = true;
            this.crystalsCollected++;
            for (let i = 0; i < 20; i++) {
                this.particles.push(new Particle(crystal.x, crystal.y, 'crystal_shatter'));
            }
        }
    }

    // Check if dropped gift landed in chimney
    for (const gift of this.droppedGifts) {
        if (gift.isLanded) continue;
        for (const obstacle of this.obstacles) {
            if (obstacle.hasGift) continue;
            const chimneyTopY = obstacle.topHeight + obstacle.gap;
            
            // Check if gift falls into the top opening of the chimney
            if (gift.x > obstacle.x && gift.x < obstacle.x + GAME_CONFIG.obstacleWidth &&
                gift.y > chimneyTopY && gift.y < chimneyTopY + 40) {
                
                gift.isLanded = true;
                obstacle.hasGift = true;
                this.giftsDelivered++;
                for (let i=0; i < 40; i++) {
                    this.particles.push(new Particle(gift.x, chimneyTopY, 'gift_success'));
                }
            }
        }
    }
  }

  private handleGameOver() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.isRunning = false;
    this.callbacks.onGameOver({
        distance: this.distanceTraveled,
        deliveredGifts: this.giftsDelivered,
        crystals: this.crystalsCollected,
        score: (this.giftsDelivered * GAME_CONFIG.giftDeliveryScore) + (this.crystalsCollected * GAME_CONFIG.crystalScore),
        time: Date.now() - this.startTime
    });
  }

  private handleVictory() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.isRunning = false;
    this.callbacks.onVictory({
        distance: this.distanceTraveled,
        deliveredGifts: this.giftsDelivered,
        crystals: this.crystalsCollected,
        score: (this.giftsDelivered * GAME_CONFIG.giftDeliveryScore) + (this.crystalsCollected * GAME_CONFIG.crystalScore) + Math.round(this.distanceTraveled),
        time: Date.now() - this.startTime
    });
  }
  
  private drawBackground() {
    // Deep Space Gradient
    const sky = this.ctx.createLinearGradient(0, 0, 0, this.viewHeight);
    sky.addColorStop(0, '#000015');
    sky.addColorStop(0.4, '#10002b');
    sky.addColorStop(1, '#240046');
    this.ctx.fillStyle = sky;
    this.ctx.fillRect(0, 0, this.viewWidth, this.viewHeight);
    
    // Moon
    this.ctx.save();
    this.ctx.shadowBlur = 50;
    this.ctx.shadowColor = '#fdfbf7';
    this.ctx.fillStyle = '#fdfbf7';
    const moonX = this.viewWidth * 0.8;
    const moonY = this.viewHeight * 0.2;
    const moonR = 40;
    this.ctx.beginPath();
    this.ctx.arc(moonX, moonY, moonR, 0, Math.PI*2);
    this.ctx.fill();
    // Craters
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = 'rgba(200, 200, 200, 0.2)';
    this.ctx.beginPath(); this.ctx.arc(moonX - 10, moonY + 5, 8, 0, Math.PI*2); this.ctx.fill();
    this.ctx.beginPath(); this.ctx.arc(moonX + 15, moonY - 10, 5, 0, Math.PI*2); this.ctx.fill();
    this.ctx.restore();
    
    // Aurora Borealis Effect
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'screen';
    const auroraGrad = this.ctx.createLinearGradient(0, 0, this.viewWidth, 0);
    auroraGrad.addColorStop(0, 'rgba(0, 255, 128, 0)');
    auroraGrad.addColorStop(0.2, 'rgba(0, 255, 128, 0.2)');
    auroraGrad.addColorStop(0.5, 'rgba(0, 255, 255, 0.3)');
    auroraGrad.addColorStop(0.8, 'rgba(138, 43, 226, 0.2)');
    auroraGrad.addColorStop(1, 'rgba(138, 43, 226, 0)');

    this.ctx.fillStyle = auroraGrad;
    
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.viewHeight * 0.4);
    
    // Wavy path
    for(let x = 0; x <= this.viewWidth; x += 50) {
        const y = Math.sin(x * 0.01 + this.auroraOffset) * 50 + Math.cos(x * 0.02 + this.auroraOffset * 1.5) * 30;
        this.ctx.lineTo(x, this.viewHeight * 0.4 + y);
    }
    
    this.ctx.lineTo(this.viewWidth, 0);
    this.ctx.lineTo(0, 0);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();

    this.backgroundStars.forEach(star => star.draw(this.ctx));
    
    // Distant Mountains/Skyline silhouette could go here if desired
  }

  private draw() {
    this.drawBackground();
    
    this.backgroundElements.forEach(b => b.draw(this.ctx));
    
    this.obstacles.forEach(obstacle => obstacle.draw(this.ctx));
    this.crystals.forEach(c => c.draw(this.ctx));
    this.droppedGifts.forEach(g => g.draw(this.ctx));
    this.santa.draw(this.ctx);
    this.particles.forEach(p => p.draw(this.ctx));
    
    // Snowflakes on top for depth
    this.snowflakes.forEach(s => s.draw(this.ctx));

    const darkness = getInterpolatedValue(GAME_CONFIG.darknessStages, this.distanceTraveled, 'alpha');
    if (darkness > 0) {
        this.ctx.fillStyle = `rgba(0,0,0,${darkness})`;
        this.ctx.fillRect(0, 0, this.viewWidth, this.viewHeight);
    }

    if(this.distanceTraveled > GAME_CONFIG.finishDistance - this.viewWidth * 1.5) {
        const pixelsPerMeter = 10;
        const finishLineWorldX = GAME_CONFIG.finishDistance * pixelsPerMeter;
        const cameraWorldX = this.distanceTraveled * pixelsPerMeter;
        const finishLineScreenX = finishLineWorldX - cameraWorldX + this.santa.x;
        
        if (finishLineScreenX < this.viewWidth) {
            // Finish line post
            const gradient = this.ctx.createLinearGradient(finishLineScreenX, 0, finishLineScreenX + 10, 0);
            gradient.addColorStop(0, 'rgba(255, 215, 0, 0)');
            gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(finishLineScreenX, 0, 10, this.viewHeight);
            
            // Laser banner
            this.ctx.save();
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = 'gold';
            this.ctx.fillStyle = 'white';
            this.ctx.font = '900 60px sans-serif';
            this.ctx.textAlign = 'center';
            
            this.ctx.translate(finishLineScreenX + 40, this.viewHeight / 2);
            this.ctx.rotate(-Math.PI / 2);
            this.ctx.fillText('ФИНИШ', 0, 0);
            this.ctx.restore();
        }
    }
  }
}
