/**
 * PowerStar Website - GSAP Animations
 * Version: 3.0.0 - Premium Animations
 * 
 * Features:
 * - Hero: Banner transitions with text animations, parallax, split text entrance
 * - Product Cards: 3D tilt hover, image zoom, dynamic shadows
 * - Scroll Effects: Staggered entrance, number counters, background changes
 * - Micro-interactions: Button effects, nav changes, click feedback
 */

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded');
        return;
    }
    
    // Register plugins
    gsap.registerPlugin(ScrollTrigger);
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        console.log('Reduced motion preference detected - animations minimized');
        initMinimalAnimations();
    } else {
        initPremiumAnimations();
    }
});

// ========================================
// PREMIUM ANIMATIONS (Full Experience)
// ========================================

function initPremiumAnimations() {
    initHeroAnimations();
    initBannerSlider();
    initStatsCounter();
    initProductCards();
    initScrollEffects();
    initMicroInteractions();
    initNavigationEffects();
    
    console.log('✅ PowerStar Premium Animations v3.0 initialized');
}

// ========================================
// 1. HERO ANIMATIONS
// ========================================

function initHeroAnimations() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Create a timeline for hero entrance
    const heroTl = gsap.timeline({ delay: 0.3 });
    
    // Parallax banner on scroll
    const bannerImages = document.querySelectorAll('.banner-slide img');
    bannerImages.forEach(img => {
        gsap.to(img, {
            yPercent: 30,
            scale: 1.15,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 0.8
            }
        });
    });
    
    // Split text animation for hero title
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        // Get the text content
        const text = heroTitle.innerHTML;
        const lines = heroTitle.querySelectorAll('br');
        
        heroTl.from(heroTitle, {
            opacity: 0,
            y: 80,
            duration: 1.2,
            ease: 'power3.out'
        });
        
        // Animate the span separately with color reveal
        const titleSpan = heroTitle.querySelector('span');
        if (titleSpan) {
            gsap.from(titleSpan, {
                opacity: 0,
                x: -30,
                duration: 1,
                delay: 0.8,
                ease: 'power3.out'
            });
        }
    }
    
    // Hero subtitle with staggered letter effect feel
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        heroTl.from(heroSubtitle, {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.6');
    }
    
    // CTA button with bounce effect
    const heroBtn = document.querySelector('.hero-content .btn-download');
    if (heroBtn) {
        heroTl.from(heroBtn, {
            opacity: 0,
            y: 30,
            scale: 0.9,
            duration: 0.6,
            ease: 'back.out(1.7)'
        }, '-=0.4');
    }
    
    // Banner dots entrance
    const dots = document.querySelectorAll('.banner-dots .dot');
    if (dots.length) {
        heroTl.from(dots, {
            opacity: 0,
            scale: 0,
            stagger: 0.1,
            duration: 0.4,
            ease: 'back.out(1.7)'
        }, '-=0.3');
    }
    
    // Scroll indicator with continuous animation
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        heroTl.from(scrollIndicator, {
            opacity: 0,
            duration: 0.6
        }, '-=0.2');
        
        // Pulsing arrow animation
        gsap.to(scrollIndicator, {
            y: 10,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }
}

// ========================================
// 2. BANNER SLIDER ANIMATIONS
// ========================================

function initBannerSlider() {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.banner-dots .dot');
    
    if (slides.length === 0) return;
    
    // Enhanced slide transition with scale and fade
    window.showSlideWithAnimation = function(index) {
        const currentActive = document.querySelector('.banner-slide.active');
        const nextSlide = slides[index];
        
        if (!nextSlide || currentActive === nextSlide) return;
        
        // Create transition timeline
        const slideTl = gsap.timeline();
        
        // Fade out current slide with scale
        if (currentActive) {
            slideTl.to(currentActive, {
                opacity: 0,
                scale: 1.05,
                duration: 0.8,
                ease: 'power2.inOut',
                onComplete: () => {
                    currentActive.classList.remove('active');
                    gsap.set(currentActive, { scale: 1 });
                }
            });
        }
        
        // Prepare and fade in next slide
        gsap.set(nextSlide, { opacity: 0, scale: 1.1 });
        nextSlide.classList.add('active');
        
        slideTl.to(nextSlide, {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power2.inOut'
        }, '-=0.3');
        
        // Animate dots
        dots.forEach((dot, i) => {
            if (i === index) {
                gsap.to(dot, {
                    scale: 1.3,
                    backgroundColor: '#ff4d00',
                    borderColor: '#ffffff',
                    duration: 0.3,
                    ease: 'back.out(1.7)'
                });
            } else {
                gsap.to(dot, {
                    scale: 1,
                    backgroundColor: 'rgba(255,255,255,0.4)',
                    borderColor: 'transparent',
                    duration: 0.3
                });
            }
        });
    };
    
    // Override the existing goToSlide function
    const originalGoToSlide = window.goToSlide;
    window.goToSlide = function(index) {
        if (typeof window.showSlideWithAnimation === 'function') {
            window.showSlideWithAnimation(index);
        }
        window.currentSlide = index;
    };
    
    // Auto-advance with enhanced timing
    let autoSlideInterval;
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            const nextIndex = (window.currentSlide + 1) % slides.length;
            window.goToSlide(nextIndex);
        }, 5000);
    }
    
    // Pause on hover
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        heroSection.addEventListener('mouseleave', startAutoSlide);
    }
    
    startAutoSlide();
}

// ========================================
// 3. STATS COUNTER ANIMATION
// ========================================

function initStatsCounter() {
    const statItems = document.querySelectorAll('.stat-item');
    if (statItems.length === 0) return;
    
    // Animate stat items entrance
    gsap.from(statItems, {
        opacity: 0,
        y: 50,
        scale: 0.9,
        duration: 0.8,
        stagger: {
            amount: 0.6,
            from: 'center'
        },
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.stats-section',
            start: 'top 80%',
            once: true
        }
    });
    
    // Number counting animation
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const originalText = stat.textContent;
        const numericValue = parseFloat(originalText.replace(/[^0-9.]/g, ''));
        const suffix = originalText.replace(/[0-9.]/g, '');
        
        if (isNaN(numericValue)) return;
        
        // Create counting animation
        ScrollTrigger.create({
            trigger: stat,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                const counter = { value: 0 };
                
                gsap.to(counter, {
                    value: numericValue,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: () => {
                        const current = counter.value;
                        let display;
                        
                        // Format based on original text
                        if (originalText.includes('M+')) {
                            display = current.toFixed(0) + 'M+';
                        } else if (originalText.includes('+')) {
                            display = Math.round(current) + '+';
                        } else if (originalText.includes('.')) {
                            display = current.toFixed(1);
                        } else {
                            display = Math.round(current);
                        }
                        
                        stat.textContent = display;
                    }
                });
            }
        });
    });
}

// ========================================
// 4. PRODUCT CARDS - 3D TILT & HOVER
// ========================================

function initProductCards() {
    const cards = document.querySelectorAll('.product-card');
    if (cards.length === 0) return;
    
    // Scroll entrance with stagger
    gsap.from(cards, {
        opacity: 0,
        y: 80,
        rotateX: 15,
        duration: 0.8,
        stagger: {
            amount: 0.5,
            from: 'start'
        },
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.products-grid',
            start: 'top 75%',
            once: true
        }
    });
    
    cards.forEach(card => {
        const image = card.querySelector('.product-card-image');
        const content = card.querySelector('.product-card-content');
        const icon = card.querySelector('.product-card-icon');
        
        // 3D tilt effect on hover
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            // Image zoom
            if (image) {
                gsap.to(image, {
                    scale: 1.1,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            }
            
            // Icon pop
            if (icon) {
                gsap.to(icon, {
                    scale: 1.15,
                    rotation: 5,
                    duration: 0.3
                });
            }
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
            
            if (image) {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.4
                });
            }
            
            if (icon) {
                gsap.to(icon, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3
                });
            }
        });
        
        // Click feedback
        card.addEventListener('mousedown', () => {
            gsap.to(card, {
                scale: 0.98,
                duration: 0.1
            });
        });
        
        card.addEventListener('mouseup', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.2,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

// ========================================
// 5. SCROLL EFFECTS
// ========================================

function initScrollEffects() {
    // Features section entrance
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length) {
        gsap.from(featureCards, {
            opacity: 0,
            y: 60,
            scale: 0.95,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.features-grid',
                start: 'top 80%',
                once: true
            }
        });
        
        // Icon bounce on hover
        featureCards.forEach(card => {
            const icon = card.querySelector('span');
            
            card.addEventListener('mouseenter', () => {
                if (icon) {
                    gsap.to(icon, {
                        scale: 1.2,
                        y: -5,
                        duration: 0.3,
                        ease: 'back.out(1.7)'
                    });
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (icon) {
                    gsap.to(icon, {
                        scale: 1,
                        y: 0,
                        duration: 0.3
                    });
                }
            });
        });
    }
    
    // CTA section with background parallax
    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
        // Text reveal
        const ctaTl = gsap.timeline({
            scrollTrigger: {
                trigger: ctaSection,
                start: 'top 75%',
                once: true
            }
        });
        
        ctaTl.from('.cta-section h2', {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power3.out'
        })
        .from('.cta-section p', {
            opacity: 0,
            y: 30,
            duration: 0.6
        }, '-=0.4')
        .from('.cta-section .btn-download', {
            opacity: 0,
            scale: 0.9,
            duration: 0.5,
            ease: 'back.out(1.7)'
        }, '-=0.3');
    }
    
    // Footer stagger
    const footerColumns = document.querySelectorAll('.footer-column');
    if (footerColumns.length) {
        gsap.from(footerColumns, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 90%',
                once: true
            }
        });
    }
    
    // Color stripe animation on scroll
    const colorStripe = document.querySelector('.color-stripe');
    if (colorStripe) {
        gsap.from(colorStripe, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                once: true
            }
        });
    }
}

// ========================================
// 6. MICRO INTERACTIONS
// ========================================

function initMicroInteractions() {
    // Button hover effects with ripple
    const buttons = document.querySelectorAll('.btn-download');
    
    buttons.forEach(btn => {
        // Hover scale and glow
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.05,
                boxShadow: '0 8px 30px rgba(255, 77, 0, 0.4)',
                duration: 0.25,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                boxShadow: '0 4px 15px rgba(255, 77, 0, 0.2)',
                duration: 0.25
            });
        });
        
        // Click press effect
        btn.addEventListener('mousedown', () => {
            gsap.to(btn, {
                scale: 0.97,
                duration: 0.1
            });
        });
        
        btn.addEventListener('mouseup', () => {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.15,
                ease: 'power2.out'
            });
        });
    });
    
    // Footer links hover
    const footerLinks = document.querySelectorAll('.footer-column a');
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                x: 5,
                color: '#ff4d00',
                duration: 0.2
            });
        });
        
        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                x: 0,
                color: '#000000',
                duration: 0.2
            });
        });
    });
    
    // Dropdown menu animation
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        const items = dropdown.querySelectorAll('.dropdown-menu a');
        
        dropdown.addEventListener('mouseenter', () => {
            gsap.fromTo(menu, 
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
            );
            
            gsap.from(items, {
                opacity: 0,
                x: -10,
                duration: 0.3,
                stagger: 0.05,
                ease: 'power2.out'
            });
        });
    });
}

// ========================================
// 7. NAVIGATION EFFECTS
// ========================================

function initNavigationEffects() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollY = 0;
    let navHidden = false;
    
    // Scroll-based nav styling
    ScrollTrigger.create({
        start: 'top -80',
        end: 'max',
        onUpdate: (self) => {
            const scrollY = self.scroll();
            
            // Add background when scrolled
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
                gsap.to(navbar, {
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
                    duration: 0.3
                });
            } else {
                navbar.classList.remove('scrolled');
                gsap.to(navbar, {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    boxShadow: 'none',
                    duration: 0.3
                });
            }
            
            // Hide/show on scroll direction (desktop only)
            if (window.innerWidth > 768) {
                if (scrollY > lastScrollY && scrollY > 200 && !navHidden) {
                    // Scrolling down - hide nav
                    gsap.to(navbar, {
                        y: -80,
                        duration: 0.3,
                        ease: 'power2.inOut'
                    });
                    navHidden = true;
                } else if (scrollY < lastScrollY && navHidden) {
                    // Scrolling up - show nav
                    gsap.to(navbar, {
                        y: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    navHidden = false;
                }
            }
            
            lastScrollY = scrollY;
        }
    });
    
    // Logo star rotation on hover
    const logoStar = document.querySelector('.logo-star');
    if (logoStar) {
        const logoLink = logoStar.closest('a');
        
        logoLink.addEventListener('mouseenter', () => {
            gsap.to(logoStar, {
                rotation: 360,
                scale: 1.2,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        logoLink.addEventListener('mouseleave', () => {
            gsap.to(logoStar, {
                rotation: 0,
                scale: 1,
                duration: 0.3
            });
        });
    }
}

// ========================================
// MINIMAL ANIMATIONS (Reduced Motion)
// ========================================

function initMinimalAnimations() {
    // Simple fade-in without motion
    gsap.set([
        '.hero-content h1',
        '.hero-subtitle',
        '.hero-content .btn-download',
        '.stat-item',
        '.product-card',
        '.feature-card'
    ], { opacity: 0 });
    
    ScrollTrigger.batch([
        '.hero-content h1',
        '.hero-subtitle',
        '.hero-content .btn-download'
    ], {
        onEnter: (elements) => gsap.to(elements, { opacity: 1, duration: 0.3 })
    });
    
    ScrollTrigger.batch([
        '.stat-item',
        '.product-card',
        '.feature-card'
    ], {
        onEnter: (elements) => gsap.to(elements, { opacity: 1, stagger: 0.05, duration: 0.3 })
    });
    
    console.log('✅ PowerStar Minimal Animations initialized');
}

// ========================================
// UTILITY: Refresh on resize
// ========================================

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 200);
});

// ========================================
// UTILITY: Initialize for dynamic content
// ========================================

// Call this after AJAX/dynamic content loads
window.refreshPowerStarAnimations = function() {
    ScrollTrigger.refresh();
    console.log('🔄 PowerStar animations refreshed');
};