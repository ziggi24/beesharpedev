// Portfolio Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Theme Management
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add a subtle animation to the toggle
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Load and display projects
    async function loadProjects() {
        try {
            const response = await fetch('assets/data/portfolio.json');
            const projects = await response.json();
            
            const projectsGrid = document.getElementById('projectsGrid');
            
            projects.forEach((project, index) => {
                const projectCard = createProjectCard(project, index);
                projectsGrid.appendChild(projectCard);
            });
            
            // Add intersection observer for scroll animations
            observeProjectCards();
            
        } catch (error) {
            console.error('Error loading projects:', error);
            showError('Failed to load projects. Please refresh the page.');
        }
    }
    
    // Create project card element
    function createProjectCard(project, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="project-image-container">
                <img src="${project.img}" alt="${project.Name}" class="project-image" loading="lazy">
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.Name}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-links">
                    <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-link primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15,3 21,3 21,9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        Live Page
                    </a>
                    <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link secondary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                        </svg>
                        Source Code
                    </a>
                </div>
            </div>
        `;
        
        return card;
    }
    
    // Intersection Observer for scroll animations
    function observeProjectCards() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe all project cards
        document.querySelectorAll('.project-card').forEach(card => {
            observer.observe(card);
        });
    }
    
    
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });
        
        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }
    
    // Error handling
    function showError(message) {
        const projectsGrid = document.getElementById('projectsGrid');
        projectsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-secondary);">
                <p>${message}</p>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--accent-primary); color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
                    Try Again
                </button>
            </div>
        `;
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation to images
    document.addEventListener('DOMContentLoaded', function() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
            
            // Set initial opacity for smooth loading
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        });
    });
    
    // Keyboard navigation for theme toggle
    themeToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
    
    // Add focus styles for better accessibility
    const style = document.createElement('style');
    style.textContent = `
        .theme-toggle:focus {
            outline: 2px solid var(--accent-primary);
            outline-offset: 2px;
        }
        
        .project-link:focus,
        .cta-button:focus,
        .contact-method:focus {
            outline: 2px solid var(--accent-primary);
            outline-offset: 2px;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
            outline: 2px solid var(--accent-primary);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize the application
    loadProjects();
    
    // Initialize bubble physics
    initializeBubblePhysics();
    
    // Add page load animation
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Add CSS for page load animation
const loadAnimationStyle = document.createElement('style');
loadAnimationStyle.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded) .hero-content > * {
        opacity: 0;
        transform: translateY(30px);
    }
    
    .loaded .hero-content > * {
        animation: slideInUp 1s ease forwards;
    }
`;
document.head.appendChild(loadAnimationStyle);

// Bubble Physics System
class BubblePhysics {
    constructor() {
        this.bubbles = [];
        this.container = null;
        this.containerRect = null;
        this.animationId = null;
        this.lastTime = 0;
        this.deltaTime = 0;
        
        this.init();
    }
    
    init() {
        // Get container and bubbles
        this.container = document.querySelector('.floating-shapes');
        if (!this.container) {
            console.warn('BubblePhysics: Container not found');
            return;
        }
        
        // Update container bounds first
        this.updateContainerBounds();
        
        const shapes = document.querySelectorAll('.shape');
        if (shapes.length === 0) {
            console.warn('BubblePhysics: No shapes found');
            return;
        }
        
        console.log(`BubblePhysics: Initializing ${shapes.length} bubbles`);
        
        shapes.forEach((shape, index) => {
            // Disable CSS animations
            shape.style.animation = 'none';
            
            // Get initial position and size
            const rect = shape.getBoundingClientRect();
            
            // Calculate relative position within container
            const x = parseFloat(shape.style.left) || this.getComputedLeft(shape);
            const y = parseFloat(shape.style.top) || this.getComputedTop(shape);
            const size = rect.width;
            
            // Define speed multipliers for each bubble
            const speedMultipliers = [1.0, 1.05, 1.08]; // shape 1: 100%, shape 2: 105%, shape 3: 108%
            const speedMultiplier = speedMultipliers[index] || 1.0;
            
            // Create bubble object
            const bubble = {
                element: shape,
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 0.6 * speedMultiplier, // Random initial velocity with speed multiplier
                vy: (Math.random() - 0.5) * 0.6 * speedMultiplier,
                size: size,
                mass: size * 0.01, // Mass proportional to size
                bounce: 0.8, // Bounce factor
                friction: 0.998, // Air resistance
                maxSpeed: 1.8 * speedMultiplier, // Maximum speed with speed multiplier
                speedMultiplier: speedMultiplier, // Store multiplier for other calculations
                index: index
            };
            
            this.bubbles.push(bubble);
        });
        
        this.startAnimation();
        
        // Update container bounds on resize
        window.addEventListener('resize', () => {
            this.updateContainerBounds();
        });
    }
    
    getComputedLeft(element) {
        const computed = window.getComputedStyle(element);
        const left = computed.left;
        const right = computed.right;
        
        if (left !== 'auto') {
            return parseFloat(left);
        } else if (right !== 'auto') {
            // Convert right positioning to left positioning
            return this.containerRect.width - parseFloat(right) - element.offsetWidth;
        }
        return 0;
    }
    
    getComputedTop(element) {
        const computed = window.getComputedStyle(element);
        const top = computed.top;
        const bottom = computed.bottom;
        
        if (top !== 'auto') {
            return parseFloat(top);
        } else if (bottom !== 'auto') {
            // Convert bottom positioning to top positioning
            return this.containerRect.height - parseFloat(bottom) - element.offsetHeight;
        }
        return 0;
    }
    
    updateContainerBounds() {
        if (!this.container) return;
        
        const rect = this.container.getBoundingClientRect();
        this.containerRect = {
            width: rect.width,
            height: rect.height,
            left: 0,
            top: 0,
            right: rect.width,
            bottom: rect.height
        };
    }
    
    updateBubble(bubble, deltaTime) {
        // Apply friction
        bubble.vx *= bubble.friction;
        bubble.vy *= bubble.friction;
        
        // Limit maximum speed
        const speed = Math.sqrt(bubble.vx * bubble.vx + bubble.vy * bubble.vy);
        if (speed > bubble.maxSpeed) {
            bubble.vx = (bubble.vx / speed) * bubble.maxSpeed;
            bubble.vy = (bubble.vy / speed) * bubble.maxSpeed;
        }
        
        // Add small random movement
        if (Math.random() < 0.02) { // 2% chance per frame
            bubble.vx += (Math.random() - 0.5) * 0.12 * bubble.speedMultiplier; // Random movement with speed multiplier
            bubble.vy += (Math.random() - 0.5) * 0.12 * bubble.speedMultiplier;
        }
        
        // Update position
        bubble.x += bubble.vx * deltaTime * 60; // Scale for 60fps
        bubble.y += bubble.vy * deltaTime * 60;
        
        // Handle container boundaries
        const radius = bubble.size / 2;
        
        // Left and right boundaries
        if (bubble.x - radius < this.containerRect.left) {
            bubble.x = this.containerRect.left + radius;
            bubble.vx = Math.abs(bubble.vx) * bubble.bounce;
        } else if (bubble.x + radius > this.containerRect.right) {
            bubble.x = this.containerRect.right - radius;
            bubble.vx = -Math.abs(bubble.vx) * bubble.bounce;
        }
        
        // Top and bottom boundaries
        if (bubble.y - radius < this.containerRect.top) {
            bubble.y = this.containerRect.top + radius;
            bubble.vy = Math.abs(bubble.vy) * bubble.bounce;
        } else if (bubble.y + radius > this.containerRect.bottom) {
            bubble.y = this.containerRect.bottom - radius;
            bubble.vy = -Math.abs(bubble.vy) * bubble.bounce;
        }
        
        // Apply position to element
        bubble.element.style.left = `${bubble.x}px`;
        bubble.element.style.top = `${bubble.y}px`;
        bubble.element.style.position = 'absolute';
    }
    
    checkCollisions() {
        for (let i = 0; i < this.bubbles.length; i++) {
            for (let j = i + 1; j < this.bubbles.length; j++) {
                const bubble1 = this.bubbles[i];
                const bubble2 = this.bubbles[j];
                
                const dx = bubble2.x - bubble1.x;
                const dy = bubble2.y - bubble1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = (bubble1.size + bubble2.size) / 2;
                
                if (distance < minDistance) {
                    // Collision detected
                    const angle = Math.atan2(dy, dx);
                    const sin = Math.sin(angle);
                    const cos = Math.cos(angle);
                    
                    // Rotate bubble1's position
                    const x1 = 0;
                    const y1 = 0;
                    
                    // Rotate bubble2's position
                    const x2 = dx * cos + dy * sin;
                    const y2 = dy * cos - dx * sin;
                    
                    // Rotate bubble1's velocity
                    const vx1 = bubble1.vx * cos + bubble1.vy * sin;
                    const vy1 = bubble1.vy * cos - bubble1.vx * sin;
                    
                    // Rotate bubble2's velocity
                    const vx2 = bubble2.vx * cos + bubble2.vy * sin;
                    const vy2 = bubble2.vy * cos - bubble2.vx * sin;
                    
                    // Collision reaction
                    const vxTotal = vx1 - vx2;
                    const vx1New = ((bubble1.mass - bubble2.mass) * vx1 + 2 * bubble2.mass * vx2) / (bubble1.mass + bubble2.mass);
                    const vx2New = vxTotal + vx1New;
                    
                    // Update velocities
                    bubble1.vx = vx1New * cos - vy1 * sin;
                    bubble1.vy = vy1 * cos + vx1New * sin;
                    bubble2.vx = vx2New * cos - vy2 * sin;
                    bubble2.vy = vy2 * cos + vx2New * sin;
                    
                    // Separate bubbles
                    const overlap = minDistance - distance;
                    const separationX = (overlap / 2) * cos;
                    const separationY = (overlap / 2) * sin;
                    
                    bubble1.x -= separationX;
                    bubble1.y -= separationY;
                    bubble2.x += separationX;
                    bubble2.y += separationY;
                }
            }
        }
    }
    
    animate(currentTime) {
        if (!this.lastTime) this.lastTime = currentTime;
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Update each bubble
        this.bubbles.forEach(bubble => {
            this.updateBubble(bubble, this.deltaTime);
        });
        
        // Check for collisions
        this.checkCollisions();
        
        // Continue animation
        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }
    
    startAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.lastTime = 0;
        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }
    
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// Initialize bubble physics when DOM is ready
function initializeBubblePhysics() {
    // Wait a bit for CSS to load and elements to be positioned
    setTimeout(() => {
        try {
            new BubblePhysics();
        } catch (error) {
            console.error('Error initializing bubble physics:', error);
            // Fallback: re-enable CSS animations if JS fails
            document.querySelectorAll('.shape').forEach(shape => {
                shape.style.animation = 'float 12s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite';
            });
        }
    }, 200); // Increased delay for mobile
}
