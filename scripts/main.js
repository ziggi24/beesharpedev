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
    SpherePhysics.init();
    
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
    minImpulseInterval: 1100,   // ms
    maxImpulseInterval: 2000,  // ms
    edgePadding: 12,
    
    init() {
        this.container = document.querySelector('.glass-sphere-container');
        if (!this.container) return;
        
        this.updateBounds();
        
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
        });
        
        this.start();
        window.addEventListener('resize', () => this.updateBounds());
    },
    
    updateBounds() {
        if (!this.container) return;
        const rect = this.container.getBoundingClientRect();
        this.bounds = { width: rect.width, height: rect.height };
    },
    
    update(sphere, dt, now) {
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
        
        // Boundary collisions
        const r = sphere.size / 2;
        
        // Soft steering near edges to reduce sudden flips
        const pad = this.edgePadding + r * 0.25;
        if (sphere.x - r < pad) sphere.vx += (pad - (sphere.x - r)) * 0.0009 * (dt * 60);
        if (sphere.x + r > this.bounds.width - pad) sphere.vx -= (sphere.x + r - (this.bounds.width - pad)) * 0.0009 * (dt * 60);
        if (sphere.y - r < pad) sphere.vy += (pad - (sphere.y - r)) * 0.0009 * (dt * 60);
        if (sphere.y + r > this.bounds.height - pad) sphere.vy -= (sphere.y + r - (this.bounds.height - pad)) * 0.0009 * (dt * 60);
        
        if (sphere.x - r < 0) {
            sphere.x = r;
            sphere.vx = Math.abs(sphere.vx) * sphere.bounce;
        } else if (sphere.x + r > this.bounds.width) {
            sphere.x = this.bounds.width - r;
            sphere.vx = -Math.abs(sphere.vx) * sphere.bounce;
        }
        
        if (sphere.y - r < 0) {
            sphere.y = r;
            sphere.vy = Math.abs(sphere.vy) * sphere.bounce;
        } else if (sphere.y + r > this.bounds.height) {
            sphere.y = this.bounds.height - r;
            sphere.vy = -Math.abs(sphere.vy) * sphere.bounce;
        }
        
        // Apply transform
        sphere.element.style.transform = `translate3d(${sphere.x}px, ${sphere.y}px, 0)`;
    },
    
    checkCollisions() {
        for (let i = 0; i < this.spheres.length; i++) {
            for (let j = i + 1; j < this.spheres.length; j++) {
                const a = this.spheres[i];
                const b = this.spheres[j];
                
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const dist = Math.hypot(dx, dy);
                const minDist = (a.size + b.size) / 2;
                
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
                    
                    // Elastic collision
                    const totalMass = a.mass + b.mass;
                    const newVx1 = ((a.mass - b.mass) * vx1 + 2 * b.mass * vx2) / totalMass;
                    const newVx2 = ((b.mass - a.mass) * vx2 + 2 * a.mass * vx1) / totalMass;
                    
                    // Rotate back
                    a.vx = newVx1 * cos - vy1 * sin;
                    a.vy = vy1 * cos + newVx1 * sin;
                    b.vx = newVx2 * cos - vy2 * sin;
                    b.vy = vy2 * cos + newVx2 * sin;
                    
                    // Separate spheres
                    const overlap = (minDist - dist) / 2;
                    const sepX = overlap * cos;
                    const sepY = overlap * sin;
                    
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
        const dt = Math.min((time - this.lastTime) / 1000, 0.1);
        this.lastTime = time;
        
        this.spheres.forEach(s => this.update(s, dt, time));
        this.checkCollisions();
        
        this.animationId = requestAnimationFrame(t => this.animate(t));
    },
    
    start() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.lastTime = 0;
        this.animationId = requestAnimationFrame(t => this.animate(t));
    },
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    },
    
    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
};
