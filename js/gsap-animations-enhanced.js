/**
 * PowerStar Website - Enhanced GSAP Animations
 * Version: 5.0.0 - Unified Motion Runtime
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
    initBlogCategoryButtons();

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
    initHomepageShowcase();
    initMagneticCards();
    initSharedPageReveals();
    initScrollBackground();
    initRippleButtons();
    initParallaxLayers();
    initStatsCounter();
    initNavigationEffects();
    initTestimonialSlider();
    initEnhancedCounter();

    console.log('✅ PowerStar Enhanced Animations v5.0 initialized');
}

function createRevealAnimation(targets, fromVars = {}, options = {}) {
    const elements = gsap.utils.toArray(targets);
    if (elements.length === 0) return;

    const {
        trigger = elements[0].parentElement || elements[0],
        start = 'top 82%',
        once = true,
        stagger,
        duration = 0.6,
        ease = 'power2.out',
        clearProps = 'opacity,transform,filter',
        ...scrollOptions
    } = options;

    const toVars = {
        opacity: 1,
        duration,
        ease,
        clearProps,
        scrollTrigger: {
            trigger,
            start,
            once,
            ...scrollOptions
        }
    };

    if (stagger !== undefined) {
        toVars.stagger = stagger;
    }

    ['x', 'y', 'scale', 'rotate', 'rotateX', 'rotateY'].forEach((prop) => {
        if (!Object.prototype.hasOwnProperty.call(fromVars, prop)) return;
        toVars[prop] = prop === 'scale' ? 1 : 0;
    });

    if (Object.prototype.hasOwnProperty.call(fromVars, 'filter')) {
        toVars.filter = 'blur(0px)';
    }

    gsap.fromTo(elements, {
        opacity: 0,
        ...fromVars
    }, toVars);
}

function animateOnScroll(targets, vars, scrollOptions = {}) {
    const {
        duration = 0.6,
        ease = 'power2.out',
        stagger,
        clearProps = 'opacity,transform,filter',
        ...fromVars
    } = vars;

    createRevealAnimation(targets, fromVars, {
        duration,
        ease,
        stagger,
        clearProps,
        ...scrollOptions
    });
}

// ========================================
// 1. FLOATING PARTICLES BACKGROUND
// ========================================

function initParticleBackground() {
    const hero = document.querySelector('.hero');
    if (!hero || hero.querySelector('.particle-container')) return;

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

    const particleCount = 30;

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

    window.currentSlide = 0;

    slides.forEach((img) => {
        gsap.set(img, { scale: 1, x: 0, y: 0 });
    });

    window.showSlideKenBurns = function(index) {
        const allSlides = document.querySelectorAll('.banner-slide');
        const currentActive = document.querySelector('.banner-slide.active');
        const nextSlide = allSlides[index];

        if (!nextSlide || currentActive === nextSlide) return;

        const tl = gsap.timeline();

        if (currentActive) {
            tl.to(currentActive, {
                opacity: 0,
                duration: 1,
                ease: 'power2.inOut'
            });
            currentActive.classList.remove('active');
        }

        gsap.set(nextSlide, { opacity: 0 });
        nextSlide.classList.add('active');

        tl.to(nextSlide, {
            opacity: 1,
            duration: 1,
            ease: 'power2.inOut'
        }, 0);

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

    window.goToSlide = function(index) {
        window.currentSlide = index;
        if (typeof window.showSlideKenBurns === 'function') {
            window.showSlideKenBurns(index);
        }
    };

    let autoSlideInterval;
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            const nextIndex = (window.currentSlide + 1) % slides.length;
            window.goToSlide(nextIndex);
        }, 5000);
    }

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        heroSection.addEventListener('mouseleave', startAutoSlide);
    }

    startAutoSlide();
}

// ========================================
// 3. HERO ENTRANCE ANIMATION
// ========================================

function initHeroSplitText() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (document.querySelector('.hero-brand')) {
        tl.from('.hero-brand', {
            opacity: 0,
            y: 24,
            scale: 0.96,
            duration: 0.55
        });
    }

    if (document.querySelector('.hero-title')) {
        tl.from('.hero-title', {
            opacity: 0,
            y: 48,
            scale: 0.97,
            duration: 0.9
        }, '-=0.2');
    }

    if (document.querySelector('.hero-title .highlight')) {
        tl.from('.hero-title .highlight', {
            opacity: 0,
            scale: 0.88,
            filter: 'blur(8px)',
            duration: 0.7
        }, '-=0.45');
    }

    if (document.querySelector('.hero-subtitle')) {
        tl.from('.hero-subtitle', {
            opacity: 0,
            y: 32,
            duration: 0.65
        }, '-=0.4');
    }

    const heroApps = gsap.utils.toArray('.hero-apps .app-icon-item');
    if (heroApps.length > 0) {
        tl.from(heroApps, {
            opacity: 0,
            y: 20,
            scale: 0.9,
            stagger: 0.08,
            duration: 0.45,
            ease: 'back.out(1.8)'
        }, '-=0.25');
    }

    const heroButtons = gsap.utils.toArray('.hero-cta .btn-hero-primary, .hero-content .btn-download');
    if (heroButtons.length > 0) {
        tl.from(heroButtons, {
            opacity: 0,
            y: 24,
            scale: 0.96,
            duration: 0.5
        }, '-=0.2');
    }

    const heroStats = gsap.utils.toArray('.hero-stats-inline .stat-badge');
    if (heroStats.length > 0) {
        tl.from(heroStats, {
            opacity: 0,
            y: 24,
            scale: 0.92,
            stagger: 0.08,
            duration: 0.45
        }, '-=0.2');
    }

    if (document.querySelector('.scroll-indicator')) {
        tl.from('.scroll-indicator', {
            opacity: 0,
            y: 12,
            duration: 0.4
        }, '-=0.15');
    }
}

// ========================================
// 4. HOMEPAGE SHOWCASE REVEALS
// ========================================

function initHomepageShowcase() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    document.querySelectorAll('.section-header').forEach((header) => {
        const items = Array.from(header.children);
        if (items.length === 0) return;

        createRevealAnimation(items, {
            y: 28
        }, {
            duration: 0.65,
            stagger: 0.12,
            ease: 'power2.out',
            trigger: header,
            start: 'top 85%'
        });
    });
}

// ========================================
// 5. MAGNETIC PRODUCT CARDS
// ========================================

function initMagneticCards() {
    const allCards = gsap.utils.toArray('.product-card-enhanced, .product-card');
    if (allCards.length === 0) return;

    const trigger = allCards[0].closest('.products-grid-full, .products-row, #products') || allCards[0].parentElement;

    gsap.fromTo(allCards, {
        opacity: 0,
        y: 80,
        rotateX: 14,
        rotateY: -8,
        scale: 0.94
    }, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.9,
        stagger: {
            amount: 0.5,
            from: 'start'
        },
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        scrollTrigger: {
            trigger,
            start: 'top 80%',
            once: true
        }
    });

    if (!window.matchMedia('(hover: hover)').matches) return;

    allCards.forEach((card) => {
        const baseShadow = window.getComputedStyle(card).boxShadow;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const pullX = (x - centerX) / centerX;
            const pullY = (y - centerY) / centerY;

            gsap.to(card, {
                x: pullX * 12,
                y: pullY * 8,
                rotateX: -pullY * 8,
                rotateY: pullX * 8,
                scale: 1.02,
                duration: 0.35,
                ease: 'power2.out'
            });

            const icon = card.querySelector('.product-card-icon') || card.querySelector('img');
            if (icon) {
                gsap.to(icon, {
                    scale: 1.14,
                    rotate: pullX * 8,
                    duration: 0.3,
                    ease: 'power2.out'
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
                boxShadow: baseShadow,
                duration: 0.55,
                ease: 'elastic.out(1, 0.45)'
            });

            const icon = card.querySelector('.product-card-icon') || card.querySelector('img');
            if (icon) {
                gsap.to(icon, {
                    scale: 1,
                    rotate: 0,
                    duration: 0.35,
                    ease: 'power2.out'
                });
            }
        });

        card.addEventListener('click', (e) => {
            const rect = card.getBoundingClientRect();
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                background: rgba(255,77,0,0.25);
                border-radius: 50%;
                transform: scale(0);
                pointer-events: none;
                left: ${e.clientX - rect.left}px;
                top: ${e.clientY - rect.top}px;
            `;

            card.style.position = 'relative';
            card.appendChild(ripple);

            gsap.to(ripple, {
                scale: 18,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out',
                onComplete: () => ripple.remove()
            });
        });
    });
}

// ========================================
// 6. SHARED PAGE REVEALS
// ========================================

function initSharedPageReveals() {
    initProductPageReveals();
    initBlogPageReveals();
}

function initProductPageReveals() {
    const productHero = document.querySelector('.product-hero-grid');
    if (!productHero) return;

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (document.querySelector('.product-icon')) {
        heroTl.from('.product-icon', {
            opacity: 0,
            y: 24,
            scale: 0.88,
            duration: 0.5
        });
    }

    heroTl.from('.product-info h1', {
        opacity: 0,
        y: 36,
        duration: 0.75
    }, '-=0.2');

    heroTl.from('.product-subtitle', {
        opacity: 0,
        y: 28,
        duration: 0.6
    }, '-=0.45');

    const heroStats = gsap.utils.toArray('.product-stats-hero .stat-badge');
    if (heroStats.length > 0) {
        heroTl.from(heroStats, {
            opacity: 0,
            y: 18,
            scale: 0.94,
            stagger: 0.08,
            duration: 0.4
        }, '-=0.3');
    }

    const heroActions = gsap.utils.toArray('.product-actions > *');
    if (heroActions.length > 0) {
        heroTl.from(heroActions, {
            opacity: 0,
            y: 18,
            stagger: 0.08,
            duration: 0.4
        }, '-=0.2');
    }

    if (document.querySelector('.product-mockup')) {
        heroTl.from('.product-mockup', {
            opacity: 0,
            x: 48,
            rotateY: -10,
            duration: 0.85
        }, '-=0.8');
    }

    document.querySelectorAll('.content-section').forEach((section) => {
        const items = Array.from(section.querySelectorAll(':scope h2, :scope .section-subtitle')).filter((item) => {
            const nearestContentSection = item.closest('.content-section');
            return nearestContentSection === section;
        });

        if (items.length === 0) return;

        createRevealAnimation(items, {
            y: 28
        }, {
            duration: 0.6,
            stagger: 0.12,
            ease: 'power2.out',
            trigger: section,
            start: 'top 85%'
        });
    });

    animateOnScroll('.quick-feature', {
        x: -24,
        stagger: 0.08,
        duration: 0.5
    }, {
        trigger: '.quick-features'
    });

    animateOnScroll('.screenshot-grid img', {
        y: 30,
        stagger: 0.08,
        duration: 0.55
    }, {
        trigger: '.screenshot-grid'
    });

    animateOnScroll('.feature-card-large', {
        y: 40,
        stagger: 0.12,
        duration: 0.65
    }, {
        trigger: '.features-grid-enhanced'
    });

    animateOnScroll('.use-case-card', {
        y: 36,
        stagger: 0.12,
        duration: 0.6
    }, {
        trigger: '.use-cases-grid'
    });

    animateOnScroll('.spec-card', {
        y: 40,
        stagger: 0.15,
        duration: 0.6
    }, {
        trigger: '.specs-grid'
    });

    animateOnScroll('.comparison-table tbody tr', {
        x: -20,
        stagger: 0.05,
        duration: 0.4
    }, {
        trigger: '.comparison-table'
    });

    animateOnScroll('.review-card', {
        y: 30,
        stagger: 0.12,
        duration: 0.55
    }, {
        trigger: '.reviews-grid'
    });

    animateOnScroll('.guide-card', {
        y: 30,
        stagger: 0.12,
        duration: 0.55
    }, {
        trigger: '.guides-grid'
    });

    animateOnScroll('.faq-item', {
        y: 24,
        stagger: 0.1,
        duration: 0.5
    }, {
        trigger: '.faq-grid'
    });

    animateOnScroll('.related-product-card', {
        y: 30,
        stagger: 0.1,
        duration: 0.55
    }, {
        trigger: '.related-products-grid'
    });
}

function initBlogPageReveals() {
    if (!document.querySelector('.blog-grid-enhanced')) return;

    animateOnScroll('.blog-card-enhanced', {
        y: 30,
        duration: 0.5,
        stagger: 0.08
    }, {
        trigger: '.blog-grid-enhanced',
        start: 'top 85%'
    });

    animateOnScroll('.sidebar-card', {
        x: 30,
        duration: 0.5,
        stagger: 0.15
    }, {
        trigger: '.featured-sidebar',
        start: 'top 80%'
    });

    animateOnScroll('.tag-link', {
        scale: 0.8,
        duration: 0.4,
        stagger: 0.05
    }, {
        trigger: '.tags-cloud',
        start: 'top 80%'
    });
}

function initBlogCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    if (categoryButtons.length === 0) return;

    categoryButtons.forEach((btn) => {
        btn.addEventListener('click', function() {
            categoryButtons.forEach((button) => button.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ========================================
// 7. SCROLL BACKGROUND TRANSITIONS
// ========================================

function initScrollBackground() {
    if (!document.body || document.querySelector('.scroll-gradient')) return;

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

    ScrollTrigger.create({
        start: 'top top',
        end: 'max',
        onUpdate: (self) => {
            gsap.to(gradientOverlay, {
                opacity: self.progress > 0.1 ? 0.8 : 0,
                duration: 0.3
            });
        }
    });

    const featuresSection = document.querySelector('.features') || document.querySelector('[style*="background: #f8f9fa"]');
    if (featuresSection) {
        ScrollTrigger.create({
            trigger: featuresSection,
            start: 'top 60%',
            end: 'bottom 40%',
            onEnter: () => {
                gsap.to(featuresSection, {
                    backgroundColor: '#f8f9fa',
                    duration: 0.5
                });
            },
            onLeaveBack: () => {
                gsap.set(featuresSection, { clearProps: 'backgroundColor' });
            }
        });
    }

    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
        ScrollTrigger.create({
            trigger: ctaSection,
            start: 'top 70%',
            onEnter: () => {
                gsap.to(ctaSection, {
                    backgroundColor: '#0a0a0a',
                    duration: 0.6
                });
            },
            onLeaveBack: () => {
                gsap.set(ctaSection, { clearProps: 'backgroundColor' });
            }
        });
    }
}

// ========================================
// 8. RIPPLE BUTTON EFFECTS
// ========================================

function initRippleButtons() {
    const buttons = document.querySelectorAll('.btn-download, .btn-hero-primary');

    buttons.forEach((btn) => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 0;
                height: 0;
                background: rgba(255,255,255,0.35);
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

        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.03,
                duration: 0.25,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.25,
                ease: 'power2.out'
            });
        });

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
// 9. PARALLAX LAYERS
// ========================================

function initParallaxLayers() {
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

        bannerImages.forEach((img) => {
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
// 10. STATS COUNTER (Enhanced)
// ========================================

function initStatsCounter() {
    const statItems = document.querySelectorAll('.stat-item');
    if (statItems.length === 0) return;

    createRevealAnimation(statItems, {
        y: 60,
        scale: 0.8,
        rotateY: 20
    }, {
        duration: 0.8,
        stagger: {
            amount: 0.6,
            from: 'center'
        },
        ease: 'back.out(1.5)',
        trigger: '.stats-section',
        start: 'top 75%',
        clearProps: 'opacity,transform'
    });

    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach((stat) => {
        const originalText = stat.textContent;
        const numericValue = parseFloat(originalText.replace(/[^0-9.]/g, ''));

        if (isNaN(numericValue)) return;

        ScrollTrigger.create({
            trigger: stat,
            start: 'top 80%',
            once: true,
            onEnter: () => {
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
// 11. NAVIGATION EFFECTS
// ========================================

function initNavigationEffects() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

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
        }
    });

    const logoStar = navbar.querySelector('.logo-star');
    if (logoStar) {
        const logoLink = logoStar.closest('a');
        if (!logoLink) return;

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
// 12. TESTIMONIAL SLIDER (Prepared)
// ========================================

function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    if (testimonials.length === 0) return;

    createRevealAnimation(testimonials, {
        y: 50,
        scale: 0.95
    }, {
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        trigger: testimonials[0].parentElement,
        start: 'top 80%',
        clearProps: 'opacity,transform'
    });
}

// ========================================
// MINIMAL ANIMATIONS (Reduced Motion)
// ========================================

function initMinimalAnimations() {
    const visibleSelectors = [
        '.hero-brand',
        '.hero-title',
        '.hero-subtitle',
        '.hero-apps .app-icon-item',
        '.hero-cta .btn-hero-primary',
        '.hero-content .btn-download',
        '.hero-stats-inline .stat-badge',
        '.scroll-indicator',
        '.section-header',
        '.product-card-enhanced',
        '.product-hero-grid',
        '.quick-feature',
        '.screenshot-grid img',
        '.feature-card-large',
        '.use-case-card',
        '.spec-card',
        '.comparison-table tbody tr',
        '.review-card',
        '.guide-card',
        '.faq-item',
        '.related-product-card',
        '.blog-card-enhanced',
        '.sidebar-card',
        '.tag-link',
        '.testimonial-card',
        '.stat-item',
        '.content-section h2',
        '.content-section .section-subtitle'
    ];

    const elements = gsap.utils.toArray(visibleSelectors.join(', '));
    if (elements.length === 0) return;

    gsap.set(elements, {
        opacity: 1,
        clearProps: 'opacity,transform,filter'
    });

    console.log('✅ PowerStar Minimal Animations initialized (content-first mode)');
}

// ========================================
// COUNTER ANIMATION WITH DATA-TARGET
// ========================================

function initEnhancedCounter() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');

    statNumbers.forEach((stat) => {
        const target = parseFloat(stat.dataset.target);
        const isDecimal = stat.dataset.decimal === 'true';

        ScrollTrigger.create({
            trigger: stat,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                const counter = { value: 0 };
                gsap.to(counter, {
                    value: target,
                    duration: 2.5,
                    ease: 'power2.out',
                    onUpdate: () => {
                        if (target >= 1000000) {
                            stat.textContent = (counter.value / 1000000).toFixed(0) + 'M+';
                        } else if (target >= 1000) {
                            stat.textContent = Math.round(counter.value) + '+';
                        } else if (isDecimal) {
                            stat.textContent = counter.value.toFixed(1);
                        } else {
                            stat.textContent = Math.round(counter.value);
                        }
                    }
                });
            }
        });
    });
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
