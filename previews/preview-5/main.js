/**
 * David Castellanos — Portfolio Variant 5: Interactive 3D Pipeline & WebGL Shaders
 * Aesthetic: Deep Obsidian Cloud & CI/CD Telemetry Pipeline Visualizer
 * Libraries: Three.js (r128), GSAP 3 (ScrollTrigger), Lenis Inertial Scroll, Native SVG Filters
 * Safety: 100% offline file:// compatible, zero type="module" dependencies, zero console errors
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. TELEMETRY LIVE UTC CLOCK
  // =========================================================================
  function initTelemetryClock() {
    const clockEl = document.getElementById('telemetry-clock');
    if (!clockEl) return;

    function updateClock() {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const timeStr = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}Z`;
      clockEl.textContent = timeStr;
    }

    updateClock();
    setInterval(updateClock, 1000);
  }

  // =========================================================================
  // 2. MOBILE NAVIGATION DRAWER
  // =========================================================================
  function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close when clicking nav links
    const navLinks = navMenu.querySelectorAll('.nav-link, .btn-laser');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // =========================================================================
  // 3. THREE.JS INTERACTIVE 3D WEBGL CANVAS
  // =========================================================================
  function initThreeWebGL() {
    const canvas = document.getElementById('webgl-canvas');
    const container = document.getElementById('webgl-canvas-container');
    const dprReadout = document.getElementById('dpr-val');
    const fpsReadout = document.getElementById('fps-val');

    if (!canvas || !container) return;

    // Feature Detection: WebGL availability
    function isWebGLSupported() {
      try {
        const testCanvas = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext &&
          (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
        );
      } catch (e) {
        return false;
      }
    }

    if (typeof THREE === 'undefined' || !isWebGLSupported()) {
      container.classList.add('webgl-fallback');
      if (fpsReadout) fpsReadout.textContent = 'CSS_FALLBACK';
      return;
    }

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Fog (Deep obsidian atmosphere)
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.003);

    // 2. Perspective Camera
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 40, 130);
    camera.lookAt(0, 0, 0);

    // 3. High-Performance WebGL Renderer
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: (window.devicePixelRatio || 1) < 2,
        powerPreference: 'high-performance'
      });
    } catch (err) {
      container.classList.add('webgl-fallback');
      return;
    }

    // DPR Clamping to Math.min(DPR, 2) to guarantee 60 FPS on 4K displays
    const clampedDPR = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(clampedDPR);
    renderer.setSize(width, height);

    if (dprReadout) {
      dprReadout.textContent = clampedDPR.toFixed(1) + 'x';
    }

    // 4. Undulating 3D Pipeline Wireframe Grid
    const GRID_W = 320;
    const GRID_H = 200;
    const SEGS_X = 54;
    const SEGS_Y = 36;
    const planeGeo = new THREE.PlaneGeometry(GRID_W, GRID_H, SEGS_X, SEGS_Y);
    planeGeo.rotateX(-Math.PI / 2.3);

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.24
    });
    const pipelineMesh = new THREE.Mesh(planeGeo, wireMat);
    pipelineMesh.position.y = -15;
    scene.add(pipelineMesh);

    // 5. Floating Data-Packet Particles (Cyan + Amber)
    const PARTICLE_COUNT = 850;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(PARTICLE_COUNT * 3);
    const particleColors = new Float32Array(PARTICLE_COUNT * 3);

    const colorCyan = new THREE.Color(0x00e5ff);
    const colorAmber = new THREE.Color(0xf59e0b);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      particlePos[i3] = (Math.random() - 0.5) * GRID_W;
      particlePos[i3 + 1] = (Math.random() - 0.2) * 80;
      particlePos[i3 + 2] = (Math.random() - 0.5) * GRID_H;

      // 80% Cyan, 20% Amber
      const chosenColor = Math.random() > 0.2 ? colorCyan : colorAmber;
      particleColors[i3] = chosenColor.r;
      particleColors[i3 + 1] = chosenColor.g;
      particleColors[i3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Dynamic Cursor Velocity & Scroll Trajectory Tracking
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    let lastMouseX = 0, lastMouseY = 0;
    let cursorVelocity = 0;
    let scrollY = window.scrollY || 0;
    let isTabVisible = true;

    window.addEventListener(
      'pointermove',
      (e) => {
        const rawX = (e.clientX / window.innerWidth) * 2 - 1;
        const rawY = -(e.clientY / window.innerHeight) * 2 + 1;

        targetX = rawX * 35;
        targetY = rawY * 22;

        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        cursorVelocity = Math.min(Math.hypot(dx, dy) * 0.05, 4.0);
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      },
      { passive: true }
    );

    window.addEventListener(
      'scroll',
      () => {
        scrollY = window.scrollY || window.pageYOffset;
      },
      { passive: true }
    );

    // 7. FPS Counter & Render Loop
    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = performance.now();
    const clock = new THREE.Clock();

    const posAttr = planeGeo.attributes.position;
    const originalPositions = Float32Array.from(posAttr.array);

    function animate() {
      if (!isTabVisible) return;
      requestAnimationFrame(animate);

      const now = performance.now();
      frameCount++;
      if (now - lastFpsUpdate >= 1000) {
        if (fpsReadout) {
          fpsReadout.textContent = String(Math.round((frameCount * 1000) / (now - lastFpsUpdate)));
        }
        frameCount = 0;
        lastFpsUpdate = now;
      }

      const time = clock.getElapsedTime();

      // Smooth Lerp for Cursor Trajectory
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      cursorVelocity *= 0.94; // Exponential velocity decay

      // Dynamic Camera Position from cursor and scroll trajectory
      camera.position.x = mouseX * 0.5;
      camera.position.y = 40 + mouseY * 0.35 - scrollY * 0.015;
      camera.lookAt(0, -5, 0);

      // Animate Undulating 3D Pipeline Mesh with Cursor Wave Disturbance
      for (let i = 0; i < posAttr.count; i++) {
        const idx = i * 3;
        const origX = originalPositions[idx];
        const origY = originalPositions[idx + 1];

        // Complex wave pattern
        const distToCenter = Math.hypot(origX - mouseX, origY - mouseY);
        const wave =
          Math.sin(origX * 0.045 + time * 2.1) * Math.cos(origY * 0.045 + time * 1.7) * 4.2;
        const disturbance = Math.max(0, 1 - distToCenter / 70) * cursorVelocity * 8.5;

        posAttr.setZ(i, wave + disturbance);
      }
      posAttr.needsUpdate = true;

      // Particle Drift
      particles.rotation.y = time * 0.035;
      const partPosAttr = particleGeo.attributes.position;
      for (let j = 1; j < partPosAttr.count * 3; j += 3) {
        partPosAttr.array[j] += Math.sin(time + j) * 0.02;
      }
      partPosAttr.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();

    // 8. Tab Visibility Throttling (Conserve resources)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isTabVisible = false;
      } else {
        isTabVisible = true;
        clock.getDelta(); // reset delta
        animate();
      }
    });

    // 9. Resize Handling
    function onResize() {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    }

    window.addEventListener('resize', onResize, { passive: true });
  }

  // =========================================================================
  // 4. INTERACTIVE LIQUID REFRACTION / DISTORTION (SVG feDisplacementMap)
  // =========================================================================
  function initLiquidRefraction() {
    const dispMap = document.getElementById('fe-disp');
    const refractReadout = document.getElementById('refract-val');
    const targets = document.querySelectorAll('.pipeline-card, .visualizer-frame');

    if (!dispMap || targets.length === 0) return;

    let currentScale = 0;
    let targetScale = 0;
    let isRefracting = false;

    function renderRefraction() {
      if (!isRefracting && Math.abs(currentScale - targetScale) < 0.1) {
        currentScale = 0;
        dispMap.setAttribute('scale', '0');
        if (refractReadout) refractReadout.textContent = '0.00px';
        return;
      }

      currentScale += (targetScale - currentScale) * 0.14;
      dispMap.setAttribute('scale', currentScale.toFixed(2));
      if (refractReadout) {
        refractReadout.textContent = currentScale.toFixed(2) + 'px';
      }

      requestAnimationFrame(renderRefraction);
    }

    targets.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        targetScale = 22.0; // Peak displacement
        if (!isRefracting) {
          isRefracting = true;
          renderRefraction();
        }
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const offsetX = (e.clientX - rect.left) / rect.width - 0.5;
        const offsetY = (e.clientY - rect.top) / rect.height - 0.5;
        const dist = Math.hypot(offsetX, offsetY);
        targetScale = 14.0 + dist * 16.0;
      });

      card.addEventListener('mouseleave', () => {
        targetScale = 0;
        isRefracting = false;
      });
    });
  }

  // =========================================================================
  // 5. GSAP + SCROLLTRIGGER HORIZONTAL CI/CD PIPELINE SHOWCASE
  // =========================================================================
  function initHorizontalPipeline() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const section = document.getElementById('proyectos');
    const track = document.getElementById('pipeline-track');
    const pinViewport = document.querySelector('.pipeline-pin-viewport');
    const pips = document.querySelectorAll('.stage-pip');

    if (!section || !track || !pinViewport) return;

    function updatePips(progress) {
      if (!pips.length) return;
      const totalStages = pips.length;
      const activeIdx = Math.min(totalStages - 1, Math.floor(progress * totalStages));

      pips.forEach((pip, idx) => {
        if (idx === activeIdx) {
          pip.classList.add('active');
          pip.classList.remove('passed');
        } else if (idx < activeIdx) {
          pip.classList.add('passed');
          pip.classList.remove('active');
        } else {
          pip.classList.remove('active', 'passed');
        }
      });
    }

    // Responsive Pinning using matchMedia: Desktop gets pinned scrub, Mobile gets touch scroll
    ScrollTrigger.matchMedia({
      // Desktop / Tablet Landscape (Pinned Horizontal CI/CD scrub)
      '(min-width: 769px)': function () {
        const getScrollDistance = () => -(track.scrollWidth - window.innerWidth + 96);

        const scrubTween = gsap.to(track, {
          x: getScrollDistance,
          ease: 'none'
        });

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth + 96}`,
          pin: pinViewport,
          animation: scrubTween,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            updatePips(self.progress);
          }
        });

        return () => {
          trigger.kill();
          scrubTween.kill();
        };
      },

      // Mobile / Tablet Portrait (<768px): Touch-swipeable horizontal track with snap
      '(max-width: 768px)': function () {
        gsap.set(track, { clearProps: 'all' });
      }
    });

    window.addEventListener('resize', () => {
      ScrollTrigger.refresh();
    });
  }

  // =========================================================================
  // 6. LENIS INERTIAL SCROLL & GSAP SYNCHRONIZATION
  // =========================================================================
  function initLenis() {
    if (
      typeof Lenis === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    try {
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.95
      });

      if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } else {
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
    } catch (e) {
      // Graceful fallback to native browser scroll
    }
  }

  // =========================================================================
  // 7. SKILLS MATRIX INTERACTIVE FILTERING
  // =========================================================================
  function initSkillsFilter() {
    const tabs = document.querySelectorAll('.skills-tab');
    const nodes = document.querySelectorAll('.skill-node');

    if (!tabs.length || !nodes.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const filter = tab.getAttribute('data-filter');

        nodes.forEach((node) => {
          const cat = node.getAttribute('data-cat');
          if (filter === 'all' || cat === filter) {
            node.style.display = 'flex';
          } else {
            node.style.display = 'none';
          }
        });
      });
    });
  }

  // =========================================================================
  // 8. 1-CLICK EMAIL CLIPBOARD COPY WITH TOAST FEEDBACK
  // =========================================================================
  function initEmailCopy() {
    const copyBtn = document.getElementById('copy-email-btn');
    const copyBtnText = document.getElementById('copy-btn-text');
    const toast = document.getElementById('toast');
    const emailStr = 'davidllanos2005@gmail.com';

    if (!copyBtn) return;

    function showToast() {
      if (!toast) return;
      toast.classList.add('active');
      setTimeout(() => {
        toast.classList.remove('active');
      }, 2600);
    }

    copyBtn.addEventListener('click', () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(emailStr)
          .then(() => {
            if (copyBtnText) copyBtnText.textContent = '¡COPIADO!';
            showToast();
            setTimeout(() => {
              if (copyBtnText) copyBtnText.textContent = 'COPIAR EMAIL';
            }, 2500);
          })
          .catch(() => {
            fallbackCopy(emailStr);
          });
      } else {
        fallbackCopy(emailStr);
      }
    });

    function fallbackCopy(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        if (copyBtnText) copyBtnText.textContent = '¡COPIADO!';
        showToast();
        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = 'COPIAR EMAIL';
        }, 2500);
      } catch (err) {
        // Fallback failed
      }
      document.body.removeChild(textarea);
    }
  }

  // =========================================================================
  // 9. BACK-TO-TOP BUTTON
  // =========================================================================
  function initBackToTop() {
    const btt = document.getElementById('back-to-top');
    if (!btt) return;

    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 350) {
          btt.classList.add('visible');
        } else {
          btt.classList.remove('visible');
        }
      },
      { passive: true }
    );

    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // INITIALIZATION ON DOM CONTENT LOADED
  // =========================================================================
  function init() {
    initTelemetryClock();
    initMobileNav();
    initThreeWebGL();
    initLiquidRefraction();
    initLenis();
    initHorizontalPipeline();
    initSkillsFilter();
    initEmailCopy();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
