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
