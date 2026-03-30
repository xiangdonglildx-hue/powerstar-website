/**
 * PowerStar Website - Enhanced GSAP Animations
 * Version: 4.0.0 - Premium Dynamic Effects
 * 
 * New Features:
 * - Banner: Ken Burns effect (zoom + pan), particle overlay
 * - Hero: SplitText letter animation, floating particles
 * - Products: Magnetic hover effect, glowing borders
 * - Scroll: Background color transitions, parallax layers
 * - Micro: Ripple effects, magnetic buttons
 */

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded');
        return;
    }
    
    gsap.registerPlugin(ScrollTrigger);
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        initMinimalAnimations();
    } else {
        initEnhancedAnimations();
    }
});

// ========================================
// ENHANCED ANIMATIONS (Premium Experience)
// ========================================

function initEnhancedAnimations() {
    initParticleBackground();
    initKenBurnsBanner();
    initHeroSplitText();
    initMagneticCards();
    initScrollBackground();
    initRippleButtons();
    initParallaxLayers();
    initStatsCounter();
    initNavigationEffects();
    initTestimonialSlider();
    
    console.log('✅ PowerStar Enhanced Animations v4.0 initialized');
}

// ========================================
// 1. FLOATING PARTICLES BACKGROUND
// ========================================

function initParticleBackground() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Create particle container
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        pointer-events: none;
        overflow: hidden;
    `;
    hero.appendChild(particleContainer);
    
    // Create particles
    const particleCount = 30;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2;
        const isOrange = Math.random() > 0.5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${isOrange ? '#ff4d00' : 'rgba(255,255,255,0.6)'};
            border-radius: 50%;
            opacity: ${Math.random() * 0.4 + 0.1};
            filter: blur(${size > 3 ? '1px' : '0px'});
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        
        particleContainer.appendChild(particle);
        particles.push(particle);
        
        // Floating animation
        gsap.to(particle, {
            y: `${Math.random() * -100 - 50}`,
            x: `${Math.random() * 50 - 25}`,
            opacity: Math.random() * 0.6 + 0.2,
            duration: Math.random() * 8 + 4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 2
        });
        
        // Glowing pulse
        gsap.to(particle, {
            scale: Math.random() * 1.5 + 1,
            opacity: Math.random() * 0.5 + 0.3,
            duration: Math.random() * 3 + 2,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            delay: Math.random() * 1
        });
    }
}

// ========================================
// 2. BANNER SLIDESHOW - 简洁淡入淡出效果
// ========================================

function initKenBurnsBanner() {
    const slides = document.querySelectorAll('.banner-slide img');
    if (slides.length === 0) return;
    
    // 初始化当前幻灯片索引
    window.currentSlide = 0;
    
    // 简单设置图片样式，不做动画
    slides.forEach((img) => {
        gsap.set(img, { scale: 1, x: 0, y: 0 });
    });
    
    // Banner 切换效果 - 淡入淡出，不做缩放
    window.showSlideKenBurns = function(index) {
        const allSlides = document.querySelectorAll('.banner-slide');
        const currentActive = document.querySelector('.banner-slide.active');
        const nextSlide = allSlides[index];
        
        if (!nextSlide || currentActive === nextSlide) return;
        
        const tl = gsap.timeline();
        
        // 当前幻灯片淡出
        if (currentActive) {
            tl.to(currentActive, {
                opacity: 0,
                duration: 1,
                ease: 'power2.inOut'
            });
            currentActive.classList.remove('active');
        }
        
        // 下一张幻灯片淡入
        gsap.set(nextSlide, { opacity: 0 });
        nextSlide.classList.add('active');
        
        tl.to(nextSlide, {
            opacity: 1,
            duration: 1,
            ease: 'power2.inOut'
        }, 0);
        
        // Dots 动画
        const dots = document.querySelectorAll('.banner-dots .dot');
        dots.forEach((dot, i) => {
            if (i === index) {
                gsap.to(dot, {
                    scale: 1.4,
                    backgroundColor: '#ff4d00',
                    boxShadow: '0 0 20px rgba(255,77,0,0.5)',
                    duration: 0.4,
                    ease: 'back.out(2)'
                });
            } else {
                gsap.to(dot, {
                    scale: 1,
                    backgroundColor: 'rgba(255,255,255,0.4)',
                    boxShadow: 'none',
                    duration: 0.3
                });
            }
        });
    };
    
    // Override goToSlide
    window.goToSlide = function(index) {
        window.currentSlide = index;
        if (typeof window.showSlideKenBurns === 'function') {
            window.showSlideKenBurns(index);
        }
    };
    
    // Auto-advance - 自动轮播
    let autoSlideInterval;
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            const nextIndex = (window.currentSlide + 1) % slides.length;
            window.goToSlide(nextIndex);
        }, 5000); // 5秒切换一次
    }
    
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        heroSection.addEventListener('mouseleave', startAutoSlide);
    }
    
    startAutoSlide();
}

// ========================================
// 3. HERO SPLIT TEXT ANIMATION
// ========================================

function initHeroSplitText() {
    const heroTitle = document.querySelector('.hero-content h1');
    if (!heroTitle) return;
    
    // Get text and create letter spans
    const fullText = heroTitle.textContent;
    const lines = fullText.split('\n').filter(l => l.trim());
    
    // Simple split by words for better effect
    heroTitle.innerHTML = '';
    
    const words = fullText.split(/(\s+)/);
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display: inline-block;';
    
    words.forEach(word => {
        if (word.trim() === '') {
            wrapper.appendChild(document.createTextNode(word));
        } else {
            const span = document.createElement('span');
            span.textContent = word;
            span.style.cssText = `
                display: inline-block;
                opacity: 0;
                transform: translateY(80px) rotateX(-40deg);
            `;
            wrapper.appendChild(span);
        }
    });
    
    heroTitle.appendChild(wrapper);
    
    // Staggered word entrance
    const wordSpans = heroTitle.querySelectorAll('span');
    gsap.to(wordSpans, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.5
    });
    
    // Span special animation (orange text)
    const heroSpan = heroTitle.querySelector('span:last-child');
    if (heroSpan && heroSpan.textContent.includes('Life')) {
        gsap.from(heroSpan, {
            textShadow: '0 0 40px rgba(255,77,0,1), 0 0 80px rgba(255,77,0,0.5)',
            scale: 1.2,
            duration: 1.5,
            ease: 'power2.out',
            delay: 1.5
        });
        
        // Continuous glow pulse
        gsap.to(heroSpan, {
            textShadow: '0 0 20px rgba(255,77,0,0.6)',
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }
    
    // Subtitle entrance
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        gsap.from(subtitle, {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power2.out',
            delay: 1.2
        });
    }
    
    // Button with magnetic effect
    const heroBtn = document.querySelector('.hero-content .btn-download');
    if (heroBtn) {
        gsap.from(heroBtn, {
            opacity: 0,
            scale: 0.8,
            y: 30,
            duration: 0.6,
            ease: 'back.out(2)',
            delay: 1.5
        });
        
        // Magnetic pull on mouse
        heroBtn.addEventListener('mousemove', (e) => {
            const rect = heroBtn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(heroBtn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        heroBtn.addEventListener('mouseleave', () => {
            gsap.to(heroBtn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    }
}

// ========================================
// 4. MAGNETIC PRODUCT CARDS
// ========================================

function initMagneticCards() {
    // Target inline product cards first (from index.html)
    const inlineCards = document.querySelectorAll('#products a[style*="border-top"]');
    const productCards = document.querySelectorAll('.product-card');
    const allCards = inlineCards.length > 0 ? inlineCards : productCards;
    
    if (allCards.length === 0) return;
    
    // Scroll entrance with 3D effect
    gsap.from(allCards, {
        opacity: 0,
        y: 100,
        rotateX: 20,
        rotateY: -10,
        scale: 0.9,
        duration: 1,
        stagger: {
            amount: 0.8,
            from: 'start'
        },
        ease: 'power3.out',
        scrollTrigger: {
            trigger: allCards[0].parentElement,
            start: 'top 80%',
            once: true
        }
    });
    
    allCards.forEach(card => {
        // Magnetic hover effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate magnetic pull
            const pullX = (x - centerX) / centerX;
            const pullY = (y - centerY) / centerY;
            
            // 3D rotation + magnetic movement
            gsap.to(card, {
                x: pullX * 15,
                y: pullY * 10,
                rotateX: -pullY * 12,
                rotateY: pullX * 12,
                scale: 1.02,
                boxShadow: `${-pullX * 20}px ${-pullY * 15}px 40px rgba(255,77,0,0.2)`,
                duration: 0.4,
                ease: 'power2.out'
            });
            
            // Icon pop with direction
            const icon = card.querySelector('img[style*="width: 50px"]') || card.querySelector('.product-card-icon');
            if (icon) {
                gsap.to(icon, {
                    scale: 1.2,
                    rotate: pullX * 10,
                    duration: 0.3
                });
            }
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                x: 0,
                y: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                duration: 0.6,
                ease: 'elastic.out(1, 0.4)'
            });
            
            const icon = card.querySelector('img[style*="width: 50px"]') || card.querySelector('.product-card-icon');
            if (icon) {
                gsap.to(icon, {
                    scale: 1,
                    rotate: 0,
                    duration: 0.4
                });
            }
        });
        
        // Click ripple
        card.addEventListener('click', (e) => {
            const rect = card.getBoundingClientRect();
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                background: rgba(255,77,0,0.4);
                border-radius: 50%;
                transform: scale(0);
                pointer-events: none;
                left: ${e.clientX - rect.left}px;
                top: ${e.clientY - rect.top}px;
            `;
            
            card.style.position = 'relative';
            card.appendChild(ripple);
            
            gsap.to(ripple, {
                scale: 20,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out',
                onComplete: () => ripple.remove()
            });
        });
    });
}

// ========================================
// 5. SCROLL BACKGROUND TRANSITIONS
// ========================================

function initScrollBackground() {
    // Create gradient overlay that follows scroll
    const gradientOverlay = document.createElement('div');
    gradientOverlay.className = 'scroll-gradient';
    gradientOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        opacity: 0;
        background: linear-gradient(
            135deg,
            rgba(255,77,0,0.03) 0%,
            rgba(167,139,250,0.03) 25%,
            rgba(244,114,182,0.03) 50%,
            rgba(0,196,180,0.03) 75%,
            rgba(255,107,107,0.03) 100%
        );
        transition: opacity 0.3s;
    `;
    document.body.appendChild(gradientOverlay);
    
    // Fade in/out based on scroll position
    ScrollTrigger.create({
        start: 'top top',
        end: 'max',
        onUpdate: (self) => {
            const progress = self.progress;
            gsap.to(gradientOverlay, {
                opacity: progress > 0.1 ? 0.8 : 0,
                duration: 0.3
            });
        }
    });
    
    // Features section color shift
    const featuresSection = document.querySelector('.features') || document.querySelector('[style*="background: #f8f9fa"]');
    if (featuresSection) {
        ScrollTrigger.create({
            trigger: featuresSection,
            start: 'top 60%',
            end: 'bottom 40%',
            onEnter: () => {
                gsap.to('body', {
                    backgroundColor: '#f8f9fa',
                    duration: 0.5
                });
            },
            onLeaveBack: () => {
                gsap.to('body', {
                    backgroundColor: '#ffffff',
                    duration: 0.5
                });
            }
        });
    }
    
    // CTA section dark mode
    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
        ScrollTrigger.create({
            trigger: ctaSection,
            start: 'top 70%',
            onEnter: () => {
                gsap.to('body', {
                    backgroundColor: '#0a0a0a',
                    duration: 0.6
                });
            },
            onLeaveBack: () => {
                gsap.to('body', {
                    backgroundColor: '#ffffff',
                    duration: 0.4
                });
            }
        });
    }
}

// ========================================
// 6. RIPPLE BUTTON EFFECTS
// ========================================

function initRippleButtons() {
    const buttons = document.querySelectorAll('.btn-download');
    
    buttons.forEach(btn => {
        // Create ripple on click
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 0;
                height: 0;
                background: rgba(255,255,255,0.4);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
                left: ${e.clientX - rect.left}px;
                top: ${e.clientY - rect.top}px;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            gsap.to(ripple, {
                width: 200,
                height: 200,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                onComplete: () => ripple.remove()
            });
        });
        
        // Hover glow expansion
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                boxShadow: '0 0 30px rgba(255,77,0,0.5), 0 8px 25px rgba(255,77,0,0.3)',
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                boxShadow: '0 4px 15px rgba(255,77,0,0.2)',
                scale: 1,
                duration: 0.3
            });
        });
        
        // Magnetic effect for primary buttons
        if (btn.classList.contains('primary')) {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(btn, {
                    x: x * 0.2,
                    y: y * 0.15,
                    duration: 0.2
                });
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.4,
                    ease: 'elastic.out(1, 0.6)'
                });
            });
        }
    });
}

// ========================================
// 7. PARALLAX LAYERS
// ========================================

function initParallaxLayers() {
    // Hero content parallax vs background
    const heroContent = document.querySelector('.hero-content');
    const bannerImages = document.querySelectorAll('.banner-slide img');
    
    if (heroContent && bannerImages.length) {
        gsap.to(heroContent, {
            yPercent: -50,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 0.5
            }
        });
        
        bannerImages.forEach(img => {
            gsap.to(img, {
                yPercent: 30,
                scale: 1.2,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.8
                }
            });
        });
    }
    
    // Stats parallax
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        gsap.to(statsSection, {
            y: -50,
            ease: 'none',
            scrollTrigger: {
                trigger: statsSection,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.3
            }
        });
    }
}

// ========================================
// 8. STATS COUNTER (Enhanced)
// ========================================

function initStatsCounter() {
    const statItems = document.querySelectorAll('.stat-item');
    if (statItems.length === 0) return;
    
    // Entrance animation
    gsap.from(statItems, {
        opacity: 0,
        y: 60,
        scale: 0.8,
        rotateY: 20,
        duration: 0.8,
        stagger: {
            amount: 0.6,
            from: 'center'
        },
        ease: 'back.out(1.5)',
        scrollTrigger: {
            trigger: '.stats-section',
            start: 'top 75%',
            once: true
        }
    });
    
    // Number counting with glow
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const originalText = stat.textContent;
        const numericValue = parseFloat(originalText.replace(/[^0-9.]/g, ''));
        const suffix = originalText.replace(/[0-9.]/g, '');
        
        if (isNaN(numericValue)) return;
        
        ScrollTrigger.create({
            trigger: stat,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                // Glow effect during counting
                gsap.to(stat, {
                    textShadow: '0 0 30px rgba(255,77,0,0.6)',
                    duration: 0.5
                });
                
                const counter = { value: 0 };
                gsap.to(counter, {
                    value: numericValue,
                    duration: 2.5,
                    ease: 'power2.out',
                    onUpdate: () => {
                        const current = counter.value;
                        let display;
                        
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
                    },
                    onComplete: () => {
                        // Fade out glow
                        gsap.to(stat, {
                            textShadow: 'none',
                            duration: 0.5
                        });
                    }
                });
            }
        });
    });
}

// ========================================
// 9. NAVIGATION EFFECTS
// ========================================

function initNavigationEffects() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollY = 0;
    
    ScrollTrigger.create({
        start: 'top -80',
        end: 'max',
        onUpdate: (self) => {
            const scrollY = self.scroll();
            
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
                gsap.to(navbar, {
                    backgroundColor: 'rgba(255,255,255,0.98)',
                    boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
                    backdropFilter: 'blur(20px)',
                    duration: 0.3
                });
            } else {
                navbar.classList.remove('scrolled');
                gsap.to(navbar, {
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    boxShadow: 'none',
                    duration: 0.3
                });
            }
            
            lastScrollY = scrollY;
        }
    });
    
    // Logo star spinning
    const logoStar = document.querySelector('.logo-star');
    if (logoStar) {
        const logoLink = logoStar.closest('a');
        
        logoLink.addEventListener('mouseenter', () => {
            gsap.to(logoStar, {
                rotation: 360,
                scale: 1.3,
                color: '#ff4d00',
                duration: 0.6,
                ease: 'power2.out'
            });
        });
        
        logoLink.addEventListener('mouseleave', () => {
            gsap.to(logoStar, {
                rotation: 0,
                scale: 1,
                color: '#ff4d00',
                duration: 0.4
            });
        });
    }
}

// ========================================
// 10. TESTIMONIAL SLIDER (Prepared)
// ========================================

function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    if (testimonials.length === 0) return;
    
    // Entrance stagger
    gsap.from(testimonials, {
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: testimonials[0].parentElement,
            start: 'top 80%',
            once: true
        }
    });
}

// ========================================
// MINIMAL ANIMATIONS (Reduced Motion)
// ========================================

function initMinimalAnimations() {
    gsap.set([
        '.hero-content h1',
        '.hero-subtitle',
        '.hero-content .btn-download',
        '.stat-item',
        '.product-card'
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
        'a[style*="border-top"]'
    ], {
        onEnter: (elements) => gsap.to(elements, { opacity: 1, stagger: 0.05, duration: 0.3 })
    });
    
    console.log('✅ PowerStar Minimal Animations initialized');
}

// ========================================
// UTILITY
// ========================================

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => ScrollTrigger.refresh(), 200);
});

window.refreshPowerStarAnimations = function() {
    ScrollTrigger.refresh();
    console.log('🔄 PowerStar animations refreshed');
};