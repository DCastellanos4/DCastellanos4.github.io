/**
 * VARIANT 4: INDUSTRIAL HARDWARE & PHYSICAL LAB
 * Core Script: Pure Web Audio API Synthesizer, Matter.js 2D Physics Sandbox,
 * Lenis Inertial Smooth Scroll, Tactile UI Controls.
 * 
 * 100% Offline Compatible (Zero External Audio Assets, Zero CORS issues).
 * Classic UMD execution safe for file:// and static servers.
 */

(function () {
  'use strict';

  /* ==========================================================================
     01. PURE WEB AUDIO API TACTILE SOUND ENGINE (Zero Audio File Assets)
     ========================================================================== */
  class TactileSoundEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.isMuted = false;
      this.lastTickTime = 0;
      this.lastCollisionTime = 0;
      this.initialized = false;
    }

    /**
     * Lazily initialize or resume AudioContext on first user interaction.
     * Respects browser autoplay policy with zero uncaught console warnings.
     */
    ensureContext() {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return null;
        try {
          this.ctx = new AudioContextClass();
          this.masterGain = this.ctx.createGain();
          // Safe maximum volume limiter (0.22 max) for hearing comfort
          this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.22, this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);
          this.initialized = true;
        } catch (e) {
          console.warn('Web Audio API could not be initialized:', e);
          return null;
        }
      }

      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    /**
     * Mechanical Cherry MX Tactile Click (Button / Link Tap)
     * High-speed transient pop: Bandpass-filtered triangle sweep decaying from 1800Hz to 120Hz.
     */
    playMechanicalClick() {
      const ctx = this.ensureContext();
      if (!ctx || this.isMuted) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.015);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.Q.setValueAtTime(3.0, now);

      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.02);
      osc.onended = () => {
        osc.disconnect();
        filter.disconnect();
        gain.disconnect();
      };
    }

    /**
     * Industrial Relay Clack (Drawer Toggles, Impulse Shakes, Hard Collisions)
     * Dual-pulse impulse: Solenoid magnetic pulse (0ms) + metallic latch strike (10ms).
     */
    playRelayClack(intensity = 1.0) {
      const ctx = this.ensureContext();
      if (!ctx || this.isMuted) return;

      const now = ctx.currentTime;
      const safeIntensity = Math.min(Math.max(intensity, 0.1), 1.0);

      // Pulse 1: Solenoid magnetic snap
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(650, now);
      osc1.frequency.exponentialRampToValueAtTime(80, now + 0.012);
      gain1.gain.setValueAtTime(0.5 * safeIntensity, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.012);
      osc1.connect(gain1);
      gain1.connect(this.masterGain);
      osc1.start(now);
      osc1.stop(now + 0.015);

      // Pulse 2: Metallic armature latch strike (+10ms)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(2800, now + 0.010);
      osc2.frequency.exponentialRampToValueAtTime(450, now + 0.024);
      gain2.gain.setValueAtTime(0.35 * safeIntensity, now + 0.010);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.026);
      osc2.connect(gain2);
      gain2.connect(this.masterGain);
      osc2.start(now + 0.010);
      osc2.stop(now + 0.030);

      osc2.onended = () => {
        osc1.disconnect();
        gain1.disconnect();
        osc2.disconnect();
        gain2.disconnect();
      };
    }

    /**
     * Rotary Stepper Dial Tick (Micro-interaction on scroll / navigation)
     * Ultra-subtle 4ms tick at 4200Hz, rate-limited to avoid ear fatigue.
     */
    playDialTick() {
      const ctx = this.ensureContext();
      if (!ctx || this.isMuted) return;

      const now = ctx.currentTime;
      if (now - this.lastTickTime < 0.05) return; // 50ms rate limit
      this.lastTickTime = now;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(4200, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.006);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.008);
      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    }

    /**
     * Physics Badge Impact Thud
     * Low-frequency damped sine on Matter.js rigid-body collisions, velocity-scaled.
     */
    playImpactThud(speed = 2.0) {
      const ctx = this.ensureContext();
      if (!ctx || this.isMuted) return;

      const now = ctx.currentTime;
      if (now - this.lastCollisionTime < 0.065) return; // 65ms cooldown to avoid crackle
      this.lastCollisionTime = now;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const normalized = Math.min(Math.max((speed - 1.8) / 8.0, 0.05), 0.4);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.035);

      gain.gain.setValueAtTime(normalized, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.04);
      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    }

    /**
     * Master Mute Toggle
     */
    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.22, this.ctx.currentTime);
      }
      return this.isMuted;
    }
  }

  const soundEngine = new TactileSoundEngine();

  // Unlock AudioContext on first user interaction anywhere on the document
  const unlockAudio = () => {
    soundEngine.ensureContext();
    document.removeEventListener('pointerdown', unlockAudio);
    document.removeEventListener('keydown', unlockAudio);
  };
  document.addEventListener('pointerdown', unlockAudio, { passive: true });
  document.addEventListener('keydown', unlockAudio, { passive: true });

  /* ==========================================================================
     02. AUDIO TOGGLE BUTTON WIRING
     ========================================================================== */
  function initAudioToggle() {
    const audioBtn = document.getElementById('audio-toggle');
    const audioLed = document.getElementById('audio-led');
    const audioText = document.getElementById('audio-text');
    if (!audioBtn) return;

    audioBtn.addEventListener('click', () => {
      const isMuted = soundEngine.toggleMute();
      if (isMuted) {
        audioBtn.setAttribute('aria-pressed', 'false');
        if (audioLed) audioLed.classList.remove('active');
        if (audioText) audioText.textContent = '[AUDIO: OFF]';
      } else {
        audioBtn.setAttribute('aria-pressed', 'true');
        if (audioLed) audioLed.classList.add('active');
        if (audioText) audioText.textContent = '[AUDIO: ON]';
        soundEngine.playMechanicalClick();
      }
    });
  }

  /* ==========================================================================
     03. MATTER.JS 2D REAL-TIME PHYSICS SANDBOX
     ========================================================================== */
  const SKILL_ITEMS = [
    // Backend Architectures
    { label: 'C# / .NET', cat: 'backend', color: '#ff4800' },
    { label: 'Java 21', cat: 'backend', color: '#ff4800' },
    { label: 'Spring Modulith', cat: 'backend', color: '#ff4800' },
    { label: 'ASP.NET Core', cat: 'backend', color: '#ff4800' },
    { label: 'Node.js', cat: 'backend', color: '#ff4800' },
    { label: 'PostgreSQL', cat: 'backend', color: '#ff4800' },
    { label: 'EF Core', cat: 'backend', color: '#ff4800' },
    { label: 'Redis', cat: 'backend', color: '#ff4800' },

    // Frontend Systems
    { label: 'Angular 20', cat: 'frontend', color: '#00d2ff' },
    { label: 'TypeScript', cat: 'frontend', color: '#00d2ff' },
    { label: 'React', cat: 'frontend', color: '#00d2ff' },
    { label: 'Vue.js', cat: 'frontend', color: '#00d2ff' },
    { label: 'Tailwind CSS', cat: 'frontend', color: '#00d2ff' },
    { label: 'HTML5 / CSS3', cat: 'frontend', color: '#00d2ff' },

    // Testing & QA Automation
    { label: 'Playwright', cat: 'qa', color: '#39ff14' },
    { label: 'Karate DSL', cat: 'qa', color: '#39ff14' },
    { label: 'Cucumber BDD', cat: 'qa', color: '#39ff14' },
    { label: 'Gatling', cat: 'qa', color: '#39ff14' },
    { label: 'JMeter', cat: 'qa', color: '#39ff14' },
    { label: 'JUnit 5', cat: 'qa', color: '#39ff14' },
    { label: 'SonarQube', cat: 'qa', color: '#39ff14' },

    // Cloud & DevOps
    { label: 'Docker', cat: 'cloud', color: '#b347ff' },
    { label: 'AWS', cat: 'cloud', color: '#b347ff' },
    { label: 'Azure', cat: 'cloud', color: '#b347ff' },
    { label: 'GitHub Actions', cat: 'cloud', color: '#b347ff' },
    { label: 'Linux', cat: 'cloud', color: '#b347ff' },

    // Enterprise Proven
    { label: 'El Corte Inglés QA', cat: 'enterprise', color: '#ffaa00' },
    { label: 'Mango POS', cat: 'enterprise', color: '#ffaa00' }
  ];

  function initPhysicsSandbox() {
    const chamberEl = document.getElementById('physics-chamber');
    const canvasEl = document.getElementById('physics-canvas');
    const fallbackEl = document.getElementById('physics-fallback');
    const fallbackList = document.getElementById('fallback-badges-list');
    const lcdBodies = document.getElementById('lcd-bodies-count');
    const lcdGravity = document.getElementById('lcd-gravity-val');
    const lcdFps = document.getElementById('lcd-engine-fps');
    const lcdCollisions = document.getElementById('lcd-collision-count');

    // 1. Fallback if Matter is unavailable
    if (typeof Matter === 'undefined') {
      if (canvasEl) canvasEl.style.display = 'none';
      if (fallbackEl) fallbackEl.hidden = false;
      if (fallbackList) {
        fallbackList.innerHTML = SKILL_ITEMS.map(item => `
          <div class="hw-badge" style="border-left: 3px solid ${item.color};">
            ${item.label}
          </div>
        `).join('');
      }
      return;
    }

    const {
      Engine,
      Render,
      Runner,
      Bodies,
      Composite,
      Mouse,
      MouseConstraint,
      Body,
      Events,
      Vector
    } = Matter;

    let width = chamberEl.clientWidth || 800;
    let height = chamberEl.clientHeight || 480;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // 2. Create Engine with realistic downward gravity
    const engine = Engine.create({
      gravity: { x: 0, y: 1.2, scale: 0.001 }
    });

    // 3. Create Custom Renderer
    const render = Render.create({
      element: chamberEl,
      canvas: canvasEl,
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: '#0e0f11',
        pixelRatio: dpr
      }
    });

    // 4. Create Thick Boundary Walls to prevent bodies escaping
    const WALL_THICKNESS = 120;
    let ground = Bodies.rectangle(width / 2, height + WALL_THICKNESS / 2, width * 2, WALL_THICKNESS, { isStatic: true, render: { visible: false } });
    let leftWall = Bodies.rectangle(-WALL_THICKNESS / 2, height / 2, WALL_THICKNESS, height * 2, { isStatic: true, render: { visible: false } });
    let rightWall = Bodies.rectangle(width + WALL_THICKNESS / 2, height / 2, WALL_THICKNESS, height * 2, { isStatic: true, render: { visible: false } });
    let ceiling = Bodies.rectangle(width / 2, -WALL_THICKNESS * 2, width * 2, WALL_THICKNESS, { isStatic: true, render: { visible: false } });

    Composite.add(engine.world, [ground, leftWall, rightWall, ceiling]);

    // 5. Spawn Skill Badges
    let badgeBodies = [];
    function spawnBadges() {
      // Remove existing dynamic bodies
      if (badgeBodies.length > 0) {
        Composite.remove(engine.world, badgeBodies);
        badgeBodies = [];
      }

      badgeBodies = SKILL_ITEMS.map((skill, index) => {
        const textWidth = skill.label.length * 8.5 + 46;
        const badgeWidth = Math.max(105, Math.min(185, textWidth));
        const badgeHeight = 42;

        // Spread spawn coordinates across top
        const startX = (width * 0.15) + (Math.random() * (width * 0.7));
        const startY = -40 - (index * 42);

        const body = Bodies.rectangle(startX, startY, badgeWidth, badgeHeight, {
          chamfer: { radius: 10 },
          restitution: 0.55,       // Bouncy tactile response
          friction: 0.15,          // Natural sliding
          frictionAir: 0.018,      // Mild air damping
          density: 0.0025,
          render: { visible: false } // High-craft custom render in afterRender
        });

        body.customData = {
          label: skill.label,
          color: skill.color,
          cat: skill.cat,
          width: badgeWidth,
          height: badgeHeight
        };
        return body;
      });

      Composite.add(engine.world, badgeBodies);
      if (lcdBodies) lcdBodies.textContent = String(badgeBodies.length);
    }

    spawnBadges();

    // 6. High-Craft Industrial Pill Canvas Rendering (`afterRender`)
    Events.on(render, 'afterRender', () => {
      const ctx = render.context;
      const bodies = Composite.allBodies(engine.world).filter(b => !b.isStatic);

      bodies.forEach(body => {
        const { position, angle, customData } = body;
        if (!customData) return;

        ctx.save();
        ctx.translate(position.x, position.y);
        ctx.rotate(angle);

        const w = customData.width;
        const h = customData.height;
        const r = 10;

        // Drop shadow for tactile depth
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 4;

        // Rounded Pill Chassis
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(-w / 2, -h / 2, w, h, r);
        } else {
          // Compatibility fallback for roundRect
          ctx.rect(-w / 2, -h / 2, w, h);
        }
        ctx.fill();

        // Clear shadow for crisp outlines
        ctx.shadowColor = 'transparent';

        // Precision Industrial 1.5px Hairline Border
        ctx.strokeStyle = '#18191c';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Color-coded Status LED Indicator Dot
        ctx.fillStyle = customData.color;
        ctx.beginPath();
        ctx.arc(-w / 2 + 16, 0, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Monospace Skill Typography
        ctx.fillStyle = '#111315';
        ctx.font = '700 12px "Space Mono", "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(customData.label, -w / 2 + 28, 1);

        ctx.restore();
      });
    });

    // 7. Mouse & Touch Drag Physics (CRITICAL SCROLL HIJACK PREVENTION)
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.25,
        damping: 0.1,
        render: { visible: false }
      }
    });

    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // CRITICAL: Prevent page scroll hijacking by removing wheel listener from Matter mouse
    if (mouseConstraint.mouse && mouseConstraint.mouse.element) {
      mouseConstraint.mouse.element.removeEventListener('mousewheel', mouseConstraint.mouse.mousewheel);
      mouseConstraint.mouse.element.removeEventListener('DOMMouseScroll', mouseConstraint.mouse.mousewheel);
    }

    // Set data-lenis-prevent on canvas container so Lenis does not hijack drag events
    chamberEl.setAttribute('data-lenis-prevent', 'true');

    // 8. Collision Audio Feedback & Telemetry
    let collisionCount = 0;
    Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach(pair => {
        collisionCount++;
        if (lcdCollisions) lcdCollisions.textContent = String(collisionCount);

        const speed = Math.hypot(
          pair.bodyA.velocity.x - pair.bodyB.velocity.x,
          pair.bodyA.velocity.y - pair.bodyB.velocity.y
        );

        if (speed > 1.8) {
          soundEngine.playImpactThud(speed);
        }
      });
    });

    // 9. Interactive Gravity Toggles
    const btn1g = document.getElementById('btn-grav-1g');
    const btn0g = document.getElementById('btn-grav-0g');
    const btnInv = document.getElementById('btn-grav-inv');
    const gravBtns = [btn1g, btn0g, btnInv];

    function setGravity(gVal, activeBtn, label) {
      engine.gravity.y = gVal;
      gravBtns.forEach(btn => {
        if (btn) btn.classList.remove('active');
      });
      if (activeBtn) activeBtn.classList.add('active');
      if (lcdGravity) lcdGravity.textContent = label;
      soundEngine.playMechanicalClick();
    }

    if (btn1g) btn1g.addEventListener('click', () => setGravity(1.2, btn1g, '+1.2 Y'));
    if (btn0g) btn0g.addEventListener('click', () => setGravity(0.0, btn0g, '0.0 ZERO-G'));
    if (btnInv) btnInv.addEventListener('click', () => setGravity(-1.0, btnInv, '-1.0 INVERT'));

    // 10. Shake Chamber Impulse Trigger
    const btnShake = document.getElementById('btn-shake-chamber');
    if (btnShake) {
      btnShake.addEventListener('click', () => {
        badgeBodies.forEach(body => {
          Body.setVelocity(body, {
            x: (Math.random() - 0.5) * 22,
            y: -Math.random() * 16 - 4
          });
          Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.4);
        });
        soundEngine.playRelayClack(1.0);
      });
    }

    // 11. Re-spawn Badges Trigger
    const btnRespawn = document.getElementById('btn-respawn-badges');
    if (btnRespawn) {
      btnRespawn.addEventListener('click', () => {
        spawnBadges();
        soundEngine.playRelayClack(0.8);
      });
    }

    // 12. Responsive Boundaries on Window Resize
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newW = chamberEl.clientWidth;
        const newH = chamberEl.clientHeight || 480;

        render.canvas.width = newW * dpr;
        render.canvas.height = newH * dpr;
        render.canvas.style.width = `${newW}px`;
        render.canvas.style.height = `${newH}px`;

        Body.setPosition(ground, { x: newW / 2, y: newH + WALL_THICKNESS / 2 });
        Body.setPosition(rightWall, { x: newW + WALL_THICKNESS / 2, y: newH / 2 });

        // Clamp non-static bodies within view
        badgeBodies.forEach(b => {
          if (b.position.x > newW - 40) Body.setPosition(b, { x: newW - 60, y: b.position.y });
          if (b.position.y > newH - 40) Body.setPosition(b, { x: b.position.x, y: newH - 60 });
        });
      }, 150);
    }, { passive: true });

    // 13. Run Simulation & Lifecycle Throttling
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // Frame rate telemetry monitoring
    let lastTime = performance.now();
    let frameCount = 0;
    function monitorFps() {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        if (lcdFps) lcdFps.textContent = `${frameCount} FPS`;
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(monitorFps);
    }
    requestAnimationFrame(monitorFps);

    // IntersectionObserver: Pause physics when off-screen to preserve CPU
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            Runner.start(runner, engine);
          } else {
            Runner.stop(runner);
          }
        });
      }, { threshold: 0.1 });
      observer.observe(chamberEl);
    }
  }

  /* ==========================================================================
     04. LENIS SMOOTH INERTIAL SCROLL & ANALOG HUD
     ========================================================================== */
  function initLenisScroll() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lcdScrollVal = document.getElementById('lcd-scroll-val');
    const lcdPosVal = document.getElementById('lcd-pos-val');
    const potDial = document.getElementById('pot-dial-indicator');
    const potVal = document.getElementById('pot-val');
    const backToTopBtn = document.getElementById('back-to-top');

    function updateScrollTelemetry(scrollPos, maxScroll) {
      const progress = maxScroll > 0 ? Math.min(Math.max(scrollPos / maxScroll, 0), 1) : 0;
      const pct = Math.round(progress * 100);
      const px = Math.round(scrollPos);

      if (lcdScrollVal) lcdScrollVal.textContent = `${String(pct).padStart(3, '0')}%`;
      if (lcdPosVal) lcdPosVal.textContent = `${String(px).padStart(4, '0')}PX`;

      if (potDial) {
        const deg = Math.round(progress * 270);
        potDial.style.transform = `rotate(${deg}deg)`;
      }
      if (potVal) {
        const deg = Math.round(progress * 270);
        potVal.textContent = `${String(deg).padStart(3, '0')}°`;
      }

      // Back to top visibility
      if (backToTopBtn) {
        if (scrollPos > 350) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }
    }

    // Check if Lenis is available and allowed
    if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
      try {
        const lenis = new Lenis({
          duration: 1.15,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 0.95,
          touchMultiplier: 1.8
        });

        lenis.on('scroll', (e) => {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          updateScrollTelemetry(e.scroll, maxScroll);
        });

        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      } catch (e) {
        console.warn('Lenis initialization skipped:', e);
      }
    }

    // Standard native scroll fallback listener
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY || window.pageYOffset || 0;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      updateScrollTelemetry(scrollPos, maxScroll);
      soundEngine.playDialTick();
    }, { passive: true });

    // Back to top button action
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        soundEngine.playMechanicalClick();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ==========================================================================
     05. PROJECT ARCHITECTURAL DRAWERS
     ========================================================================== */
  function initProjectDrawers() {
    const drawerButtons = document.querySelectorAll('.drawer-toggle-btn');
    drawerButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const drawer = document.getElementById(targetId);
        if (!drawer) return;

        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!isExpanded));
        drawer.hidden = isExpanded;

        const indicator = btn.querySelector('.btn-indicator');
        if (indicator) {
          indicator.textContent = isExpanded ? '+' : '−';
        }

        soundEngine.playRelayClack(0.7);
      });
    });
  }

  /* ==========================================================================
     06. SKILLS MATRIX CATEGORY FILTER TABS
     ========================================================================== */
  function initMatrixFilter() {
    const filterTabs = document.querySelectorAll('.matrix-tab-btn');
    const categoryCards = document.querySelectorAll('.matrix-category-card');

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const cat = tab.getAttribute('data-category');

        filterTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        categoryCards.forEach(card => {
          const cardCat = card.getAttribute('data-cat');
          if (cat === 'all' || cardCat === cat) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });

        soundEngine.playMechanicalClick();
      });
    });
  }

  /* ==========================================================================
     07. 1-CLICK EMAIL COPY WITH TACTILE NOTIFICATION
     ========================================================================== */
  function initEmailCopy() {
    const copyBtn = document.getElementById('btn-copy-email');
    const toast = document.getElementById('copy-toast');
    const emailStr = 'davidllanos2005@gmail.com';
    let toastTimeout = null;

    if (!copyBtn) return;

    copyBtn.addEventListener('click', () => {
      soundEngine.playMechanicalClick();

      // Fallback-safe clipboard copy
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailStr).then(showToast).catch(() => {
          fallbackCopy(emailStr);
        });
      } else {
        fallbackCopy(emailStr);
      }
    });

    function fallbackCopy(text) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast();
      } catch (e) {
        console.warn('Clipboard fallback copy error:', e);
      }
    }

    function showToast() {
      if (!toast) return;
      toast.hidden = false;
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toast.hidden = true;
      }, 3500);
    }
  }

  /* ==========================================================================
     08. MOBILE NAVIGATION MENU TOGGLE
     ========================================================================== */
  function initMobileMenu() {
    const toggleBtn = document.getElementById('hw-mobile-toggle');
    const navLinks = document.getElementById('hw-nav-links');
    if (!toggleBtn || !navLinks) return;

    toggleBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('open');
      if (isOpen) {
        navLinks.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      } else {
        navLinks.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
      soundEngine.playMechanicalClick();
    });

    // Close mobile nav when clicking any nav item
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        soundEngine.playMechanicalClick();
      });
    });
  }

  /* ==========================================================================
     09. TACTILE AUDIO FEEDBACK ON ALL BUTTONS & LINKS
     ========================================================================== */
  function initGlobalTactileSounds() {
    const clickableElements = document.querySelectorAll(
      'a, button, .hw-card, .strip-pill, .tactile-control-btn, .matrix-tab-btn'
    );

    clickableElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        soundEngine.playDialTick();
      }, { passive: true });
    });
  }

  /* ==========================================================================
     10. INITIALIZATION LIFECYCLE
     ========================================================================== */
  function init() {
    initAudioToggle();
    initPhysicsSandbox();
    initLenisScroll();
    initProjectDrawers();
    initMatrixFilter();
    initEmailCopy();
    initMobileMenu();
    initGlobalTactileSounds();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
