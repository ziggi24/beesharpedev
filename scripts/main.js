/**
 * Portfolio Website - Main JavaScript
 * Professional portfolio with Apple Liquid Glass design
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    ThemeManager.init();
    NavigationManager.init();
    ProjectsManager.init();
    AnimationManager.init();
    
    // Defer sphere init to ensure styles/layout are fully applied (more stable across iOS/WebKit)
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (!prefersReducedMotion) {
        requestAnimationFrame(() => SpherePhysics.init());
    }
    
    // Set footer year
    const yearEl = document.querySelector('.footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/**
 * Theme Management
 */
const ThemeManager = {
    init() {
        this.toggle = document.querySelector('.theme-toggle');
        this.body = document.body;
        
        // Load saved theme or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme);
        
        // Toggle event
        this.toggle?.addEventListener('click', () => {
            const newTheme = this.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Button feedback animation
            this.toggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.toggle.style.transform = '';
            }, 150);
        });
    },
    
    setTheme(theme) {
        this.body.setAttribute('data-theme', theme);
    }
};

/**
 * Navigation Management
 */
const NavigationManager = {
    init() {
        this.nav = document.getElementById('nav');
        this.lastScroll = 0;
        
        // Scroll-aware navigation
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offset = 100;
                    const position = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top: position, behavior: 'smooth' });
                }
            });
        });
    },
    
    handleScroll() {
        const currentScroll = window.scrollY;
        
        // Add scrolled class for glass effect
        if (currentScroll > 50) {
            this.nav?.classList.add('scrolled');
        } else {
            this.nav?.classList.remove('scrolled');
        }
        
        this.lastScroll = currentScroll;
    }
};

/**
 * Projects Management
 */
const ProjectsManager = {
    async init() {
        try {
            const response = await fetch('assets/data/portfolio.json');
            const projects = await response.json();
            this.renderProjects(projects);
        } catch (error) {
            console.error('Error loading projects:', error);
            this.showError();
        }
    },
    
    renderProjects(projects) {
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;
        
        projects.forEach((project, index) => {
            const card = this.createCard(project, index);
            grid.appendChild(card);
        });
        
        // Observe cards for scroll animation
        AnimationManager.observeElements('.project-card');
    },
    
    createCard(project, index) {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.style.transitionDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="project-image-container">
                <img 
                    src="${project.img}" 
                    alt="${project.Name}" 
                    class="project-image" 
                    loading="lazy"
                >
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.Name}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-links">
                    <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-link primary">
                        <span>View Live</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M7 17L17 7M17 7H7M17 7V17"/>
                        </svg>
                    </a>
                    <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link secondary">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                        </svg>
                        <span>Source</span>
                    </a>
                </div>
            </div>
        `;
        
        return card;
    },
    
    showError() {
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;
        
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                <p>Unable to load projects. Please refresh the page.</p>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: var(--accent-primary); color: white; border: none; border-radius: 9999px; cursor: pointer; font-weight: 500;">
                    Retry
                </button>
            </div>
        `;
    }
};

/**
 * Animation Management
 */
const AnimationManager = {
    init() {
        // Observe hero elements
        this.observeElements('.hero-badge, .hero-title, .hero-subtitle, .hero-description, .hero-actions');
    },
    
    observeElements(selector) {
        const elements = document.querySelectorAll(selector);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(el => observer.observe(el));
    }
};

/**
 * Sphere Physics System
 * Creates fluid, physics-based movement for glass spheres
 */
const SpherePhysics = {
    spheres: [],
    container: null,
    bounds: null,
    animationId: null,
    lastTime: 0,
    resizeObserver: null,
    minImpulseInterval: 1100,   // ms
    maxImpulseInterval: 2000,  // ms
    edgePadding: 0,  // Allow bubbles to extend to edges (overflow: visible handles clipping)
    
    init() {
        this.container = document.querySelector('.glass-sphere-container');
        if (!this.container) return;
        
        // Respect reduced motion at runtime too
        const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
        if (reducedMotion?.matches) return;
        
        this.updateBounds(false);
        
        const sphereEls = document.querySelectorAll('.glass-sphere');
        if (sphereEls.length === 0) return;
        
        sphereEls.forEach((el, i) => {
            const rect = el.getBoundingClientRect();
            const containerRect = this.container.getBoundingClientRect();
            
            // Get initial position
            const computed = window.getComputedStyle(el);
            let x = parseFloat(computed.left);
            let y = parseFloat(computed.top);
            
            // Handle 'auto' or percentage values
            if (isNaN(x)) x = rect.left - containerRect.left;
            if (isNaN(y)) y = rect.top - containerRect.top;
            
            // Speed multipliers for visual variety
            const speeds = [0.75, 0.85, 0.95];
            const speed = speeds[i] || 1.0;
            
            const now = performance.now();
            this.spheres.push({
                element: el,
                x,
                y,
                vx: (Math.random() - 0.5) * 0.28 * speed,
                vy: (Math.random() - 0.5) * 0.28 * speed,
                size: rect.width,
                mass: rect.width * 0.01,
                bounce: 0.75,
                friction: 0.996,
                maxSpeed: 0.95 * speed,
                minSpeed: 0.03 * speed,
                speed,
                nextImpulse: now + this.randomBetween(this.minImpulseInterval, this.maxImpulseInterval)
            });
            
            // Position absolute for physics control
            el.style.position = 'absolute';
            el.style.left = '0px';
            el.style.top = '0px';
            el.style.willChange = 'transform';
            // Ensure GPU acceleration is active
            el.style.transform = 'translateZ(0)';
        });
        
        this.start();
        
        // Keep bounds stable on mobile (orientation changes + dynamic viewport)
        window.addEventListener('resize', () => this.updateBounds(true), { passive: true });
        window.addEventListener('orientationchange', () => this.updateBounds(true), { passive: true });
        
        if ('ResizeObserver' in window) {
            this.resizeObserver = new ResizeObserver(() => this.updateBounds(true));
            this.resizeObserver.observe(this.container);
        }
        
        // Save battery and avoid iOS Safari rendering glitches while tabbed away
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) this.stop();
            else this.start();
        });
        
        // If user toggles reduced motion while open, stop animation
        reducedMotion?.addEventListener?.('change', (e) => {
            if (e.matches) this.stop();
            else this.start();
        });
    },
    
    updateBounds(clampSpheres) {
        if (!this.container) return;
        const rect = this.container.getBoundingClientRect();
        this.bounds = { width: rect.width, height: rect.height };
        
        // On responsive breakpoints/orientation, sphere sizes can change; refresh metrics
        this.refreshSphereMetrics();
        
        if (clampSpheres) {
            this.clampAllToBounds();
        }
    },
    
    refreshSphereMetrics() {
        if (!this.spheres.length) return;
        this.spheres.forEach(s => {
            const rect = s.element.getBoundingClientRect();
            const size = rect.width || s.size;
            s.size = size;
            s.mass = size * 0.01;
        });
    },
    
    clampAllToBounds() {
        if (!this.bounds || !this.spheres.length) return;
        this.spheres.forEach(s => {
            const r = (s.size || 0) / 2;
            const maxX = Math.max(r, this.bounds.width - r);
            const maxY = Math.max(r, this.bounds.height - r);
            s.x = Math.min(Math.max(s.x, r), maxX);
            s.y = Math.min(Math.max(s.y, r), maxY);
        });
    },
    
    update(sphere, dt, now) {
        if (!this.bounds) return;
        // Current direction of travel (fallback to random if nearly idle)
        const currentSpeed = Math.hypot(sphere.vx, sphere.vy);
        const dirAngle = currentSpeed > 0.0001 ? Math.atan2(sphere.vy, sphere.vx) : Math.random() * Math.PI * 2;
        const dirX = Math.cos(dirAngle);
        const dirY = Math.sin(dirAngle);
        
        // Timed random impulses to keep motion organic
        if (now >= sphere.nextImpulse) {
            const impulseMag = this.randomBetween(0.08, 0.16) * sphere.speed;
            sphere.vx += dirX * impulseMag;
            sphere.vy += dirY * impulseMag;
            sphere.nextImpulse = now + this.randomBetween(this.minImpulseInterval, this.maxImpulseInterval);
        }
        
        // Apply friction (scaled to frame time)
        const friction = Math.pow(sphere.friction, dt * 60);
        sphere.vx *= friction;
        sphere.vy *= friction;
        
        // Clamp speed
        const speed = Math.hypot(sphere.vx, sphere.vy);
        if (speed > sphere.maxSpeed) {
            sphere.vx = (sphere.vx / speed) * sphere.maxSpeed;
            sphere.vy = (sphere.vy / speed) * sphere.maxSpeed;
        }
        
        // Keep a minimum drift so spheres never stall
        if (speed < sphere.minSpeed) {
            const boost = (sphere.minSpeed - speed) + 0.02;
            sphere.vx += dirX * boost * 0.4;
            sphere.vy += dirY * boost * 0.4;
        }
        
        // Random drift
        if (Math.random() < 0.015) {
            const drift = this.randomBetween(0.004, 0.012) * sphere.speed;
            sphere.vx += dirX * drift;
            sphere.vy += dirY * drift;
        }
        
        // Update position
        sphere.x += sphere.vx * dt * 60;
        sphere.y += sphere.vy * dt * 60;
        
        // Boundary collisions - allow bubbles to extend slightly beyond bounds for full visibility
        const r = sphere.size / 2;
        // Allow bubbles to extend up to 50% of radius beyond container for full visibility
        const extendBounds = r * 0.5;
        const minX = -extendBounds;
        const maxX = this.bounds.width + extendBounds;
        const minY = -extendBounds;
        const maxY = this.bounds.height + extendBounds;
        
        // Soft steering near extended edges to reduce sudden flips
        const pad = r * 0.3;
        if (sphere.x - r < minX + pad) sphere.vx += ((minX + pad) - (sphere.x - r)) * 0.0009 * (dt * 60);
        if (sphere.x + r > maxX - pad) sphere.vx -= (sphere.x + r - (maxX - pad)) * 0.0009 * (dt * 60);
        if (sphere.y - r < minY + pad) sphere.vy += ((minY + pad) - (sphere.y - r)) * 0.0009 * (dt * 60);
        if (sphere.y + r > maxY - pad) sphere.vy -= (sphere.y + r - (maxY - pad)) * 0.0009 * (dt * 60);
        
        // Hard boundary collision at extended bounds
        if (sphere.x - r < minX) {
            sphere.x = minX + r;
            sphere.vx = Math.abs(sphere.vx) * sphere.bounce;
        } else if (sphere.x + r > maxX) {
            sphere.x = maxX - r;
            sphere.vx = -Math.abs(sphere.vx) * sphere.bounce;
        }
        
        if (sphere.y - r < minY) {
            sphere.y = minY + r;
            sphere.vy = Math.abs(sphere.vy) * sphere.bounce;
        } else if (sphere.y + r > maxY) {
            sphere.y = maxY - r;
            sphere.vy = -Math.abs(sphere.vy) * sphere.bounce;
        }
        
        // Apply transform with pixel-perfect rounding to prevent subpixel jitter
        // Round to nearest 0.5px for smoother rendering (half-pixel precision)
        const roundedX = Math.round(sphere.x * 2) / 2;
        const roundedY = Math.round(sphere.y * 2) / 2;
        sphere.element.style.transform = `translate3d(${roundedX}px, ${roundedY}px, 0)`;
    },
    
    checkCollisions() {
        for (let i = 0; i < this.spheres.length; i++) {
            for (let j = i + 1; j < this.spheres.length; j++) {
                const a = this.spheres[i];
                const b = this.spheres[j];
                
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const dist = Math.hypot(dx, dy);
                // Allow 30% more overlap: reduce minDist by 30% (multiply by 0.7)
                // This means bubbles can overlap up to 30% more than before
                const minDist = (a.size + b.size) / 2 * 0.7;
                
                if (dist < minDist && dist > 0) {
                    // Collision response
                    const angle = Math.atan2(dy, dx);
                    const sin = Math.sin(angle);
                    const cos = Math.cos(angle);
                    
                    // Rotate velocities
                    const vx1 = a.vx * cos + a.vy * sin;
                    const vy1 = a.vy * cos - a.vx * sin;
                    const vx2 = b.vx * cos + b.vy * sin;
                    const vy2 = b.vy * cos - b.vx * sin;
                    
                    // Elastic collision with stronger bounce to help separation
                    const totalMass = a.mass + b.mass;
                    const newVx1 = ((a.mass - b.mass) * vx1 + 2 * b.mass * vx2) / totalMass;
                    const newVx2 = ((b.mass - a.mass) * vx2 + 2 * a.mass * vx1) / totalMass;
                    
                    // Rotate back
                    a.vx = newVx1 * cos - vy1 * sin;
                    a.vy = vy1 * cos + newVx1 * sin;
                    b.vx = newVx2 * cos - vy2 * sin;
                    b.vy = vy2 * cos + newVx2 * sin;
                    
                    // Add repulsion force to velocities to help bubbles separate
                    const overlap = (minDist - dist);
                    const repulsionStrength = 0.15; // Stronger repulsion
                    const repulseX = cos * overlap * repulsionStrength;
                    const repulseY = sin * overlap * repulsionStrength;
                    
                    a.vx -= repulseX;
                    a.vy -= repulseY;
                    b.vx += repulseX;
                    b.vy += repulseY;
                    
                    // Always separate positionally to prevent sticking
                    const sepX = overlap * cos * 0.8; // Stronger separation
                    const sepY = overlap * sin * 0.8;
                    
                    a.x -= sepX;
                    a.y -= sepY;
                    b.x += sepX;
                    b.y += sepY;
                }
            }
        }
    },
    
    animate(time) {
        if (!this.lastTime) this.lastTime = time;
        // Clamp delta time for stability, but use more precise timing
        const dt = Math.min((time - this.lastTime) / 1000, 0.016); // Cap at ~60fps
        this.lastTime = time;
        
        // Batch DOM updates for better performance
        this.spheres.forEach(s => this.update(s, dt, time));
        this.checkCollisions();
        
        // Use requestAnimationFrame with high priority
        this.animationId = requestAnimationFrame(t => this.animate(t));
    },
    
    start() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.lastTime = 0;
        // Add animating class for mobile optimization
        if (this.container) {
            this.container.classList.add('animating');
        }
        this.animationId = requestAnimationFrame(t => this.animate(t));
    },
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        // Remove animating class when stopped
        if (this.container) {
            this.container.classList.remove('animating');
        }
    },
    
    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
};
