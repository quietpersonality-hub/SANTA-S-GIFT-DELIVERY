
import { GAME_CONFIG } from './config';

// Main Character: Ded Moroz on a hoverboard
export class Santa {
  x: number;
  y: number;
  vy: number = 0;
  angle: number = 0;
  private dropCooldown: number = 0;
  private dropCooldownTime: number = 30; // frames
  private frame: number = 0;

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
    this.frame++;
    
    // Smooth rotation based on velocity
    const targetAngle = Math.atan(this.vy / 15);
    this.angle = this.angle * 0.9 + targetAngle * 0.1;

    if (this.dropCooldown > 0) {
        this.dropCooldown--;
    }
    
    // Thruster particles
    const trailIntensity = Math.min(speedMultiplier, 3);
    for(let i=0; i < trailIntensity; i++) {
        // Random offset for engine spread
        const offsetY = (Math.random() - 0.5) * 10;
        particles.push(new Particle(
            this.x, 
            this.y + GAME_CONFIG.santaHeight - 15 + offsetY, 
            'trail', 
            speedMultiplier
        ));
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const w = GAME_CONFIG.santaWidth;
    const h = GAME_CONFIG.santaHeight;
    
    ctx.save();
    ctx.translate(this.x + w / 2, this.y + h / 2);
    ctx.rotate(this.angle);
    ctx.translate(-(this.x + w / 2), -(this.y + h / 2));
    
    // --- HOVERBOARD ---
    // Board Body gradient
    const boardGrad = ctx.createLinearGradient(this.x, this.y + h, this.x + w, this.y + h);
    boardGrad.addColorStop(0, '#2c3e50');
    boardGrad.addColorStop(0.5, '#95a5a6');
    boardGrad.addColorStop(1, '#2c3e50');

    // Board glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ffff';
    
    // Bottom plate (Neon)
    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    ctx.moveTo(this.x + 5, this.y + h);
    ctx.lineTo(this.x + w - 5, this.y + h);
    ctx.lineTo(this.x + w, this.y + h - 5);
    ctx.lineTo(this.x, this.y + h - 5);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Main Board Shape
    ctx.fillStyle = boardGrad;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + h - 5);
    ctx.lineTo(this.x + w, this.y + h - 5);
    ctx.lineTo(this.x + w - 5, this.y + h - 15); // Nose
    ctx.lineTo(this.x + 10, this.y + h - 15); // Tail
    ctx.closePath();
    ctx.fill();
    
    // Board Details
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(this.x + 20, this.y + h - 12, w - 40, 3);

    // --- SANTA ---
    
    // Coat (Body)
    const coatGrad = ctx.createRadialGradient(this.x + 30, this.y + 30, 5, this.x + 30, this.y + 30, 40);
    coatGrad.addColorStop(0, '#ff4d4d');
    coatGrad.addColorStop(1, '#990000');
    ctx.fillStyle = coatGrad;
    
    ctx.beginPath();
    ctx.ellipse(this.x + 35, this.y + 45, 20, 25, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // White Fur Trim (Vertical)
    ctx.fillStyle = '#ecf0f1';
    ctx.beginPath();
    ctx.ellipse(this.x + 35, this.y + 45, 6, 25, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#ffccbb'; // Skin
    ctx.beginPath();
    ctx.arc(this.x + 40, this.y + 20, 12, 0, Math.PI * 2);
    ctx.fill();

    // Beard
    ctx.fillStyle = '#ecf0f1';
    ctx.beginPath();
    ctx.moveTo(this.x + 50, this.y + 20);
    ctx.quadraticCurveTo(this.x + 55, this.y + 35, this.x + 40, this.y + 45); // Bottom of beard
    ctx.quadraticCurveTo(this.x + 25, this.y + 35, this.x + 30, this.y + 20);
    ctx.fill();

    // VR Glasses (Headset)
    ctx.fillStyle = '#212121'; // Dark grey headset body
    ctx.beginPath();
    // Positioned over eyes area
    ctx.roundRect(this.x + 38, this.y + 14, 18, 10, 3);
    ctx.fill();

    // VR Neon Visor
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ffff';
    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    // Glowing strip
    ctx.roundRect(this.x + 42, this.y + 16, 14, 6, 1); 
    ctx.fill();
    ctx.shadowBlur = 0;

    // VR Strap
    ctx.strokeStyle = '#212121';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.x + 38, this.y + 18);
    ctx.lineTo(this.x + 28, this.y + 20); // Going behind head
    ctx.stroke();

    // Hat
    ctx.fillStyle = '#c0392b';
    ctx.beginPath();
    ctx.moveTo(this.x + 28, this.y + 16);
    ctx.quadraticCurveTo(this.x + 35, this.y + 5, this.x + 52, this.y + 16);
    ctx.lineTo(this.x + 25, this.y + 25); // Back of hat (trailing)
    ctx.fill();

    // Hat Pom-pom
    ctx.fillStyle = 'white';
    ctx.beginPath();
    // Calculate sway for pom-pom
    const sway = Math.sin(this.frame * 0.2) * 5;
    ctx.arc(this.x + 22, this.y + 26 + sway/2, 5, 0, Math.PI * 2);
    ctx.fill();

    // Hat Trim
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.roundRect(this.x + 28, this.y + 12, 26, 8, 4);
    ctx.fill();
    
    ctx.restore();
  }
}

class SmokeParticle {
    x: number; y: number;
    vx: number; vy: number;
    alpha: number = 0.8; size: number;
    rotation: number;
    constructor(x:number, y:number) {
        this.x = x; this.y = y;
        this.vx = Math.random() * 1 - 0.5;
        this.vy = -Math.random() * 1 - 0.5;
        this.size = Math.random() * 8 + 5;
        this.rotation = Math.random() * Math.PI * 2;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        this.alpha -= 0.015;
        this.size += 0.1;
        this.rotation += 0.05;
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = '#bdc3c7';
        ctx.beginPath();
        // Draw a fluffier cloud shape (3 overlapping circles)
        ctx.arc(0, -this.size/3, this.size/2, 0, Math.PI * 2);
        ctx.arc(-this.size/3, this.size/3, this.size/2, 0, Math.PI * 2);
        ctx.arc(this.size/3, this.size/3, this.size/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
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
        this.targetGlow = Math.min(1, this.targetGlow + 0.1);
    } else {
        this.targetGlow = Math.max(0, this.targetGlow - 0.05);
    }

    // Emit smoke from chimney
    if (Math.random() > 0.6) {
        this.smokeParticles.push(new SmokeParticle(this.x + GAME_CONFIG.obstacleWidth / 2, this.topHeight + this.gap + 10));
    }
    this.smokeParticles.forEach(p => p.update());
    this.smokeParticles = this.smokeParticles.filter(p => p.alpha > 0);
  }
  
  private drawDetailedChimney(ctx: CanvasRenderingContext2D) {
    const bottomY = this.topHeight + this.gap;
    const chimneyHeight = ctx.canvas.height - bottomY;
    const w = GAME_CONFIG.obstacleWidth;

    // Main Structure Gradient
    const grad = ctx.createLinearGradient(this.x, bottomY, this.x + w, bottomY);
    grad.addColorStop(0, '#5d4037'); // Darker brown
    grad.addColorStop(0.5, '#8d6e63'); // Lighter center
    grad.addColorStop(1, '#4e342e'); // Dark side
    ctx.fillStyle = grad;
    ctx.fillRect(this.x, bottomY, w, chimneyHeight);

    // Bricks Texture
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    const brickH = 20;
    const brickW = 30;
    for(let y = bottomY; y < ctx.canvas.height; y += brickH) {
        const offset = ((y - bottomY) / brickH) % 2 === 0 ? 0 : 15;
        for(let x = this.x - 15; x < this.x + w; x += brickW) {
            if (x + offset > this.x && x + offset + brickW - 5 < this.x + w)
            ctx.fillRect(x + offset, y + 2, brickW - 4, brickH - 4);
        }
    }

    // Chimney Lip (Top rim)
    ctx.fillStyle = '#3e2723';
    ctx.beginPath();
    ctx.roundRect(this.x - 5, bottomY, w + 10, 20, 2);
    ctx.fill();

    // Snow cap on chimney
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(this.x - 5, bottomY);
    // Fluffy snow curves
    ctx.quadraticCurveTo(this.x + w * 0.2, bottomY + 15, this.x + w * 0.4, bottomY + 5);
    ctx.quadraticCurveTo(this.x + w * 0.6, bottomY + 20, this.x + w * 0.8, bottomY + 5);
    ctx.quadraticCurveTo(this.x + w, bottomY + 15, this.x + w + 5, bottomY);
    ctx.lineTo(this.x + w + 5, bottomY - 10); // Snow pile height
    ctx.quadraticCurveTo(this.x + w/2, bottomY - 15, this.x - 5, bottomY - 10);
    ctx.closePath();
    ctx.fill();
    
    // Snow shadow
    ctx.fillStyle = '#e3f2fd';
    ctx.beginPath();
    ctx.moveTo(this.x - 5, bottomY);
     ctx.quadraticCurveTo(this.x + w * 0.2, bottomY + 10, this.x + w * 0.4, bottomY + 2);
    ctx.lineTo(this.x + w + 5, bottomY);
     ctx.lineTo(this.x + w + 5, bottomY - 5);
     ctx.lineTo(this.x - 5, bottomY - 5);
     ctx.fill();

    // Target Glow Indicator
    if (this.targetGlow > 0) {
        ctx.save();
        ctx.globalAlpha = this.targetGlow;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ffd700';
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x, bottomY, w, 40);
        ctx.restore();
    }

    // Draw Smoke (Behind the foreground, but for this 2D game, on top is fine or controlled by call order)
    ctx.save();
    this.smokeParticles.forEach(p => p.draw(ctx));
    ctx.restore();
  }
  
  private drawCeilingIcicles(ctx: CanvasRenderingContext2D) {
      // Only draw if there is a "ceiling" visible (simple check)
      // For this game, the "obstacle" includes the top part
      const h = this.topHeight;
      const w = GAME_CONFIG.obstacleWidth;
      
      // Top block
      const grad = ctx.createLinearGradient(this.x, 0, this.x + w, 0);
      grad.addColorStop(0, '#2c3e50'); 
      grad.addColorStop(0.5, '#455a64');
      grad.addColorStop(1, '#2c3e50');
      ctx.fillStyle = grad;
      ctx.fillRect(this.x, 0, w, h);

      // Ice at bottom of top block
      ctx.fillStyle = '#b3e5fc'; // Ice blue
      ctx.beginPath();
      ctx.moveTo(this.x, h);
      
      // Jagged icicles
      const spikes = 5;
      const spikeW = w / spikes;
      for(let i=0; i<spikes; i++) {
          const spikeH = Math.random() * 30 + 10;
          ctx.lineTo(this.x + i * spikeW + spikeW/2, h + spikeH); // Tip
          ctx.lineTo(this.x + (i+1) * spikeW, h); // Base
      }
      ctx.closePath();
      ctx.fill();
      
      // Snow on top of bottom pipe?? No, this is a ceiling pipe.
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.drawCeilingIcicles(ctx);
    this.drawDetailedChimney(ctx);
  }
}

export class Crystal {
    x: number;
    y: number;
    isCollected = false;
    private angle = Math.random() * Math.PI * 2;
    private bobOffset = 0;
    private frame = Math.random() * 100;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    update(speed: number, santa: Santa) {
        this.x -= speed;
        this.angle += 0.02;
        this.frame += 0.1;
        this.bobOffset = Math.sin(this.frame) * 5;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.isCollected) return;

        const s = GAME_CONFIG.crystalSize;
        const yPos = this.y + this.bobOffset;

        ctx.save();
        ctx.translate(this.x, yPos);
        ctx.rotate(this.angle);

        // Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00bfff';

        // Diamond shape composed of triangles for "facet" look
        ctx.fillStyle = 'rgba(135, 206, 250, 0.9)';
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s, 0);
        ctx.lineTo(0, s);
        ctx.lineTo(-s, 0);
        ctx.closePath();
        ctx.fill();
        
        // Inner facet
        ctx.fillStyle = 'rgba(224, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.6);
        ctx.lineTo(s * 0.6, 0);
        ctx.lineTo(0, s * 0.6);
        ctx.lineTo(-s * 0.6, 0);
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;
        
        // Shine sparkle
        if (Math.floor(this.frame * 5) % 20 === 0) {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(-s*0.3, -s*0.3, 2, 0, Math.PI*2);
            ctx.fill();
        }

        ctx.restore();
    }
}

export class DroppedGift {
    x: number;
    y: number;
    vy: number = 5;
    angle: number = 0;
    isLanded: boolean = false;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    
    update() {
        if (this.isLanded) return;
        this.vy += GAME_CONFIG.gravity * 0.8; // Slower gravity for gifts
        this.y += this.vy;
        this.angle += 0.1;
    }
    
    draw(ctx: CanvasRenderingContext2D) {
        if (this.isLanded) return;
        const s = 24;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Box
        ctx.fillStyle = '#c0392b'; // Deep red
        ctx.fillRect(-s/2, -s/2, s, s);
        
        // Shadow on box (gradient)
        const grad = ctx.createLinearGradient(-s/2, -s/2, s/2, s/2);
        grad.addColorStop(0, 'rgba(255,255,255,0.2)');
        grad.addColorStop(1, 'rgba(0,0,0,0.1)');
        ctx.fillStyle = grad;
        ctx.fillRect(-s/2, -s/2, s, s);

        // Ribbon
        ctx.fillStyle = '#f1c40f'; // Gold
        ctx.fillRect(-s/6, -s/2, s/3, s); // Vertical
        ctx.fillRect(-s/2, -s/6, s, s/3); // Horizontal
        
        // Bow
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.ellipse(0, -s/2, s/3, s/6, 0, 0, Math.PI*2);
        ctx.fill();
        
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
                this.size = Math.random() * 3 + 1;
                this.gravity = 0.2;
                break;
            case 'trail':
                // Engine exhaust look
                this.vx = - (Math.random() * 4 + 2);
                this.vy = (Math.random() - 0.5) * 1;
                // Cyan to Purple to Transparent
                const hue = Math.random() > 0.5 ? 180 : 280; 
                this.color = `hsla(${hue}, 100%, 70%, 1)`;
                this.size = Math.random() * 4 + 1;
                this.gravity = -0.05; // Float up slightly
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
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow for particles
        if (this.alpha > 0.5) {
            ctx.shadowBlur = 5;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        ctx.restore();
    }
}


export class BackgroundStar {
    x: number; y: number;
    z: number; size: number;
    opacity: number;
    private baseOpacity: number;
    private twinkleSpeed: number;
    private twinkleOffset: number;

    constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.z = Math.random() * 0.7 + 0.1;
        this.size = Math.random() * 1.5 + 0.5;
        this.baseOpacity = Math.random() * 0.8 + 0.2;
        this.opacity = this.baseOpacity;
        this.twinkleSpeed = Math.random() * 0.05 + 0.01;
        this.twinkleOffset = Math.random() * Math.PI * 2;
    }
    
    update(speed: number, canvasWidth: number) {
        this.x -= speed * this.z * 0.2; // Very slow parallax
        if (this.x < 0) this.x = canvasWidth;
        
        this.opacity = this.baseOpacity + Math.sin(Date.now() * 0.002 + this.twinkleOffset) * 0.2;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, this.opacity)})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

export class Snowflake {
    x: number; y: number;
    z: number; size: number;
    opacity: number; vx: number; vy: number;
    sway: number = 0;

    constructor(canvasWidth: number, canvasHeight: number) {
        this.z = Math.random() * 0.8 + 0.2;
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = this.z * 3;
        this.opacity = this.z * 0.6;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = this.z * 2 + 1;
        this.sway = Math.random() * Math.PI * 2;
    }

    update(speed: number, canvasWidth: number, canvasHeight: number) {
        this.x -= (speed * this.z * 0.5) - this.vx + Math.sin(this.sway) * 0.5;
        this.y += this.vy;
        this.sway += 0.02;
        if (this.x < -10) this.x = canvasWidth + 10;
        if (this.y > canvasHeight) {
            this.y = -10;
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
        this.z = Math.random() * 0.4 + 0.3; // Mid-ground
        this.y = canvasHeight;
        this.type = Math.random() > 0.5 ? 'house' : 'tree';

        if (this.type === 'house') {
            this.width = (Math.random() * 80 + 80) * this.z * 1.5;
            this.height = this.width * (Math.random() * 0.2 + 0.5);
            this.y -= this.height;
        } else { // tree
            this.width = (Math.random() * 60 + 40) * this.z * 1.5;
            this.height = this.width * (Math.random() * 1.5 + 1.8);
            this.y -= this.height * 0.8; // Sink tree a bit
        }
    }

    update(speed: number, canvasWidth: number) {
        this.x -= speed * this.z;
        if (this.x + this.width * 1.5 < 0) {
            this.x = canvasWidth + Math.random() * 100;
            this.type = Math.random() > 0.5 ? 'house' : 'tree';
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        // Fog fade based on Z
        const alpha = this.z; 

        if (this.type === 'house') {
            this.drawHouse(ctx, alpha);
        } else {
            this.drawTree(ctx, alpha);
        }
    }

    private drawHouse(ctx: CanvasRenderingContext2D, alpha: number) {
        // Walls
        ctx.fillStyle = `rgba(50, 30, 20, ${alpha})`;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Windows (Glowing)
        ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.8})`;
        const winSize = this.width * 0.2;
        ctx.fillRect(this.x + winSize, this.y + this.height * 0.4, winSize, winSize);
        ctx.fillRect(this.x + this.width - winSize * 2, this.y + this.height * 0.4, winSize, winSize);

        // Window Frames
        ctx.strokeStyle = `rgba(30, 20, 10, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x + winSize, this.y + this.height * 0.4, winSize, winSize);
        ctx.strokeRect(this.x + this.width - winSize * 2, this.y + this.height * 0.4, winSize, winSize);
        ctx.beginPath();
        ctx.moveTo(this.x + winSize + winSize/2, this.y + this.height * 0.4);
        ctx.lineTo(this.x + winSize + winSize/2, this.y + this.height * 0.4 + winSize);
        ctx.stroke();

        // Roof
        ctx.beginPath();
        ctx.moveTo(this.x - 10, this.y);
        ctx.lineTo(this.x + this.width / 2, this.y - this.height * 0.6);
        ctx.lineTo(this.x + this.width + 10, this.y);
        ctx.fillStyle = `rgba(40, 30, 30, ${alpha})`;
        ctx.fill();
        
        // Snow on roof
        ctx.fillStyle = `rgba(240, 248, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(this.x - 10, this.y);
        ctx.quadraticCurveTo(this.x + this.width/4, this.y - 5, this.x + this.width / 2, this.y - this.height * 0.6);
        ctx.quadraticCurveTo(this.x + this.width*0.75, this.y - 5, this.x + this.width + 10, this.y);
        ctx.lineTo(this.x + this.width + 10, this.y - 10);
         ctx.lineTo(this.x + this.width/2, this.y - this.height * 0.6 - 10);
         ctx.lineTo(this.x - 10, this.y - 10);
        ctx.closePath();
        ctx.fill();
    }

    private drawTree(ctx: CanvasRenderingContext2D, alpha: number) {
        // Trunk
        ctx.fillStyle = `rgba(62, 39, 35, ${alpha})`;
        ctx.fillRect(this.x + this.width * 0.4, this.y, this.width * 0.2, this.height);
        
        // Branches (3 layers of triangles)
        const layers = 3;
        for(let i = 0; i < layers; i++) {
            const layerY = this.y - this.height * 0.2 + (this.height * 0.8) * (i / layers);
            const nextLayerY = this.y - this.height * 0.2 + (this.height * 0.8) * ((i + 1) / layers);
            const layerWidth = this.width * (0.4 + 0.2 * i);

            // Shadow/Dark Green
            ctx.fillStyle = `rgba(27, 94, 32, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(this.x + this.width/2 - layerWidth, nextLayerY);
            ctx.lineTo(this.x + this.width/2, layerY - 20);
            ctx.lineTo(this.x + this.width/2 + layerWidth, nextLayerY);
            ctx.fill();
            
            // Snow on branches edges
            ctx.fillStyle = `rgba(230, 255, 255, ${alpha * 0.9})`;
            ctx.beginPath();
             ctx.moveTo(this.x + this.width/2 - layerWidth, nextLayerY);
             ctx.lineTo(this.x + this.width/2, layerY - 20);
             ctx.lineTo(this.x + this.width/2 + layerWidth, nextLayerY);
             ctx.lineTo(this.x + this.width/2 + layerWidth - 10, nextLayerY - 5);
             ctx.lineTo(this.x + this.width/2, layerY - 15);
             ctx.lineTo(this.x + this.width/2 - layerWidth + 10, nextLayerY - 5);
             ctx.closePath();
             ctx.fill();
        }
    }
}
