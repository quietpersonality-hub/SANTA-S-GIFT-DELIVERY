import { GAME_CONFIG } from './config';

// Main Character: Santa on a hoverboard
export class Santa {
  x: number;
  y: number;
  vy: number = 0;
  angle: number = 0;
  private dropCooldown: number = 0;
  private dropCooldownTime: number = 30; // frames

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  flap() {
    this.vy = GAME_CONFIG.flapStrength;
  }

  canDropGift(): boolean {
      return this.dropCooldown <= 0;
  }
  
  dropGift() {
      this.dropCooldown = this.dropCooldownTime;
  }

  update(particles: Particle[], speedMultiplier: number) {
    this.vy += GAME_CONFIG.gravity;
    this.vy = Math.min(this.vy, GAME_CONFIG.maxFallSpeed);
    this.y += this.vy;
    this.angle = Math.atan(this.vy / 20);

    if (this.dropCooldown > 0) {
        this.dropCooldown--;
    }
    
    const trailIntensity = Math.min(speedMultiplier, 2.5);
    for(let i=0; i < trailIntensity; i++) {
        particles.push(new Particle(this.x + 10, this.y + GAME_CONFIG.santaHeight - 10, 'trail', speedMultiplier));
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const w = GAME_CONFIG.santaWidth;
    const h = GAME_CONFIG.santaHeight;
    ctx.save();
    ctx.translate(this.x + w / 2, this.y + h / 2);
    ctx.rotate(this.angle);
    ctx.translate(-(this.x + w / 2), -(this.y + h / 2));
    
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(this.x + w / 2, this.y + h + 5, w / 2, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#4a4a4a'; 
    ctx.beginPath();
    ctx.ellipse(this.x + w / 2, this.y + h - 10, w / 2, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ffff';
    ctx.fillRect(this.x + 10, this.y + h - 8, w - 20, 4);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#a11b1b';
    ctx.beginPath();
    ctx.arc(this.x + 15, this.y + h - 25, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#c0392b';
    ctx.fillRect(this.x + 20, this.y + 15, w - 40, h - 25);
    ctx.fillStyle = 'white';
    ctx.fillRect(this.x + 20, this.y + h - 15, w - 40, 5);

    ctx.fillStyle = '#f0d2b6'; 
    ctx.beginPath();
    ctx.arc(this.x + w / 2, this.y + 15, 15, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(this.x + w/2 - 12, this.y + 18);
    ctx.quadraticCurveTo(this.x + w/2, this.y + 45, this.x + w/2 + 12, this.y + 18);
    ctx.fill();

    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(this.x + w/2 - 15, this.y + 8, 30, 12);
    ctx.fillStyle = '#6a0dad';
    ctx.fillRect(this.x + w/2 - 13, this.y + 10, 26, 8);


    ctx.restore();
  }
}

class SmokeParticle {
    x: number; y: number;
    vx: number; vy: number;
    alpha: number = 1; size: number;
    constructor(x:number, y:number) {
        this.x = x; this.y = y;
        this.vx = Math.random() * 0.5 - 0.25;
        this.vy = -Math.random() * 0.5 - 0.2;
        this.size = Math.random() * 10 + 10;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        this.alpha -= 0.02;
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = Math.max(0, this.alpha * 0.5);
        ctx.fillStyle = '#bdc3c7';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

export class Obstacle {
  x: number;
  topHeight: number;
  gap: number;
  isTarget: boolean = false;
  hasGift: boolean = false;
  private smokeParticles: SmokeParticle[] = [];
  private targetGlow: number = 0;

  constructor(x: number, canvasHeight: number, gap: number) {
    this.x = x;
    this.gap = gap;
    const minH = GAME_CONFIG.obstacleMinHeight;
    const availableHeight = canvasHeight - (minH * 2) - this.gap;
    this.topHeight = minH + Math.random() * availableHeight;
  }

  update(speed: number, santa: Santa) {
    this.x -= speed;

    if (this.x < santa.x + GAME_CONFIG.santaWidth && this.x + GAME_CONFIG.obstacleWidth > santa.x) {
        this.isTarget = true;
    } else {
        this.isTarget = false;
    }

    if (this.isTarget && !this.hasGift) {
        this.targetGlow = Math.min(1, this.targetGlow + 0.05);
    } else {
        this.targetGlow = Math.max(0, this.targetGlow - 0.05);
    }

    if (Math.random() > 0.5) {
        this.smokeParticles.push(new SmokeParticle(this.x + GAME_CONFIG.obstacleWidth / 2, this.topHeight + this.gap));
    }
    this.smokeParticles.forEach(p => p.update());
    this.smokeParticles = this.smokeParticles.filter(p => p.alpha > 0);
  }
  
  private drawDetailedChimney(ctx: CanvasRenderingContext2D) {
    const bottomY = this.topHeight + this.gap;
    const chimneyHeight = ctx.canvas.height - bottomY;
    const w = GAME_CONFIG.obstacleWidth;

    ctx.fillStyle = '#6e3c30';
    ctx.fillRect(this.x, bottomY, w, chimneyHeight);
    
    ctx.fillStyle = '#542e24';
    ctx.fillRect(this.x - 5, bottomY, w + 10, 15);

    ctx.strokeStyle = 'rgba(40, 20, 15, 0.4)';
    ctx.lineWidth = 1;
    const brickHeight = 12;
    for (let r = 0; r < chimneyHeight / brickHeight; r++) {
        ctx.beginPath();
        ctx.moveTo(this.x, bottomY + r * brickHeight);
        ctx.lineTo(this.x + w, bottomY + r * brickHeight);
        ctx.stroke();
    }
    
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(this.x - 5, bottomY + 15);
    ctx.quadraticCurveTo(this.x + w/2, bottomY - 5, this.x + w + 5, bottomY + 15);
    ctx.closePath();
    ctx.fill();

    // Target Glow
    if (this.targetGlow > 0) {
        ctx.save();
        ctx.shadowBlur = 30;
        ctx.shadowColor = `rgba(255, 223, 0, ${this.targetGlow * 0.8})`;
        ctx.fillStyle = `rgba(255, 223, 0, ${this.targetGlow * 0.4})`;
        ctx.fillRect(this.x - 10, bottomY, w + 20, 40);
        ctx.restore();
    }

    ctx.save();
    this.smokeParticles.forEach(p => p.draw(ctx));
    ctx.restore();
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.drawDetailedChimney(ctx);
  }
}

export class Crystal {
    x: number;
    y: number;
    isCollected = false;
    private angle = Math.random() * Math.PI * 2;
    private bobOffset = 0;
    private glow = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    update(speed: number, santa: Santa) {
        this.x -= speed;
        this.angle += 0.03;
        this.bobOffset = Math.sin(this.angle * 2) * 4;

        // Glow when Santa is near
        const dist = Math.hypot(this.x - santa.x, this.y - santa.y);
        this.glow = Math.max(0, 1 - dist / 200);
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.isCollected) return;

        const s = GAME_CONFIG.crystalSize;
        const yPos = this.y + this.bobOffset;

        ctx.save();
        ctx.translate(this.x, yPos);
        ctx.rotate(this.angle);

        // Glow effect
        if (this.glow > 0) {
            const gradient = ctx.createRadialGradient(0, 0, s * 0.5, 0, 0, s * 1.5);
            gradient.addColorStop(0, `rgba(173, 216, 230, ${this.glow * 0.6})`);
            gradient.addColorStop(1, 'rgba(173, 216, 230, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(-s*1.5, -s*1.5, s*3, s*3);
        }

        // Crystal body
        ctx.beginPath();
        ctx.moveTo(0, -s); // top point
        ctx.lineTo(s * 0.8, -s * 0.2);
        ctx.lineTo(s * 0.5, s * 0.8);
        ctx.lineTo(-s * 0.5, s * 0.8);
        ctx.lineTo(-s * 0.8, -s * 0.2);
        ctx.closePath();

        ctx.fillStyle = 'rgba(100, 180, 255, 0.7)';
        ctx.strokeStyle = 'rgba(200, 230, 255, 0.9)';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    }
}

export class DroppedGift {
    x: number;
    y: number;
    vy: number = -2;
    angle: number = 0;
    isLanded: boolean = false;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    
    update() {
        if (this.isLanded) return;
        this.vy += GAME_CONFIG.gravity * 0.3; // Slower gravity for gifts
        this.y += this.vy;
        this.angle += 0.05;
    }
    
    draw(ctx: CanvasRenderingContext2D) {
        if (this.isLanded) return;
        const s = 20;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = '#c0392b';
        ctx.fillRect(-s/2, -s/2, s, s);
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-s/8, -s/2, s/4, s);
        ctx.fillRect(-s/2, -s/8, s, s/4);
        ctx.restore();
    }
}

type ParticleType = 'trail' | 'crystal_shatter' | 'gift_success';

export class Particle {
    x: number; y: number;
    vx: number; vy: number;
    alpha: number = 1;
    color: string = 'white';
    size: number;
    gravity: number = 0.1;

    constructor(x: number, y: number, type: ParticleType, speedMultiplier = 1) {
        this.x = x;
        this.y = y;

        switch (type) {
            case 'crystal_shatter':
                this.vx = (Math.random() - 0.5) * 8;
                this.vy = (Math.random() - 0.5) * 8;
                this.color = `rgba(173, 216, 230, ${Math.random() * 0.5 + 0.5})`;
                this.size = Math.random() * 4 + 1;
                this.gravity = 0.2;
                break;
            case 'trail':
                this.vx = - (GAME_CONFIG.speedStages[0].speed * speedMultiplier * 0.5);
                this.vy = (Math.random() - 0.5) * 2;
                this.color = Math.random() > 0.5 ? '#00ffff' : '#ff00ff';
                this.size = Math.random() * (2 * speedMultiplier) + 1;
                this.gravity = 0;
                break;
            case 'gift_success':
                 this.vx = (Math.random() - 0.5) * 6;
                this.vy = -Math.random() * 8;
                const colors = ['#ffd700', '#ff69b4', '#adff2f', '#00ffff'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.size = Math.random() * 4 + 2;
                this.gravity = 0.3;
                break;
        }
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.04;
        this.vy += this.gravity;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}


export class BackgroundStar {
    x: number; y: number;
    z: number; size: number;
    opacity: number;
    private baseOpacity: number;

    constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.z = Math.random() * 0.7 + 0.3;
        this.size = this.z * 2;
        this.baseOpacity = this.z * 0.8;
        this.opacity = this.baseOpacity;
    }
    
    update(speed: number, canvasWidth: number) {
        this.x -= speed * this.z * 0.5;
        if (this.x < 0) this.x = canvasWidth;
        this.opacity = this.baseOpacity * (0.5 + Math.random() * 0.5); // Twinkle
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

export class Snowflake {
    x: number; y: number;
    z: number; size: number;
    opacity: number; vx: number; vy: number;

    constructor(canvasWidth: number, canvasHeight: number) {
        this.z = Math.random() * 0.6 + 0.4;
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = this.z * 2.5;
        this.opacity = this.z * 0.9;
        this.vx = (this.z - 0.7) * 0.5;
        this.vy = this.z * 1.5;
    }

    update(speed: number, canvasWidth: number, canvasHeight: number) {
        this.x -= (speed * this.z * 0.8) - this.vx;
        this.y += this.vy;
        if (this.x < 0) this.x = canvasWidth;
        if (this.y > canvasHeight) {
            this.y = 0;
            this.x = Math.random() * canvasWidth;
        }
    }
    
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

export class BackgroundElement {
    x: number; y: number;
    width: number; height: number;
    z: number;
    type: 'house' | 'tree';

    constructor(canvasWidth: number, canvasHeight: number, initialX?: number) {
        this.x = initialX !== undefined ? initialX : Math.random() * canvasWidth;
        this.z = Math.random() * 0.3 + 0.1;
        this.y = canvasHeight;
        this.type = Math.random() > 0.4 ? 'house' : 'tree';

        if (this.type === 'house') {
            this.width = (Math.random() * 80 + 60) * this.z * 4;
            this.height = this.width * (Math.random() * 0.3 + 0.6);
            this.y -= this.height;
        } else { // tree
            this.width = (Math.random() * 40 + 30) * this.z * 4;
            this.height = this.width * (Math.random() * 1.5 + 2.0);
            this.y -= this.height;
        }
    }

    update(speed: number, canvasWidth: number) {
        this.x -= speed * this.z;
        if (this.x + this.width < 0) {
            this.x = canvasWidth;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.type === 'house') {
            this.drawHouse(ctx);
        } else {
            this.drawTree(ctx);
        }
    }

    private drawHouse(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#5C4033'; // Dark wood
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Roof
        ctx.fillStyle = '#8B4513'; // Saddle brown
        ctx.beginPath();
        ctx.moveTo(this.x - 10, this.y);
        ctx.lineTo(this.x + this.width / 2, this.y - this.height * 0.5);
        ctx.lineTo(this.x + this.width + 10, this.y);
        ctx.closePath();
        ctx.fill();
        
        // Snow on roof
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(this.x - 10, this.y);
        ctx.quadraticCurveTo(this.x + this.width/4, this.y - 5, this.x + this.width / 2, this.y - this.height * 0.5);
        ctx.quadraticCurveTo(this.x + this.width*0.75, this.y - 5, this.x + this.width + 10, this.y);
        ctx.closePath();
        ctx.fill();

        // Window with light
        if (Math.random() > 0.2) {
             ctx.fillStyle = `rgba(255, 223, 100, ${Math.random() * 0.3 + 0.6})`;
             ctx.fillRect(this.x + this.width * 0.4, this.y + this.height * 0.3, 20 * this.z, 20 * this.z);
        }
    }

    private drawTree(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#3B2A1A'; // Trunk
        ctx.fillRect(this.x + this.width * 0.4, this.y, this.width * 0.2, this.height);
        
        // Tiers of branches
        ctx.fillStyle = '#006400'; // Dark green
        for(let i=0; i < 5; i++) {
            const tierY = this.y + (this.height * 0.8) * (i/5);
            const tierWidth = this.width * (1 - (i/5));
            ctx.beginPath();
            ctx.moveTo(this.x + this.width/2 - tierWidth, tierY);
            ctx.lineTo(this.x + this.width/2, tierY - this.height*0.3);
            ctx.lineTo(this.x + this.width/2 + tierWidth, tierY);
            ctx.closePath();
            ctx.fill();

            // Snow on branches
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.moveTo(this.x + this.width/2 - tierWidth, tierY);
            ctx.quadraticCurveTo(this.x+this.width/2, tierY-5, this.x + this.width/2 + tierWidth, tierY);
            ctx.closePath();
            ctx.fill();
        }
    }
}
