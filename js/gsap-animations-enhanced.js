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
    initProductPageShowcase();
    initBlogPageShowcase();
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
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle || heroTitle.dataset.enhanced === 'true') return;

    const textNodes = [];
    heroTitle.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            textNodes.push({ type: 'text', text: node.textContent.trim() });
        } else if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('highlight')) {
            textNodes.push({ type: 'highlight', text: node.textContent.trim() });
        }
    });

    if (textNodes.length === 0) return;

    heroTitle.innerHTML = '';
    const fragment = document.createDocumentFragment();

    textNodes.forEach((part, index) => {
        const partWrapper = document.createElement('span');
        partWrapper.className = part.type === 'highlight' ? 'hero-title-part highlight' : 'hero-title-part';
        partWrapper.style.cssText = 'display:inline-flex; flex-wrap:wrap; gap:0.22em; margin-right:0.22em;';

        const words = part.text.split(/\s+/).filter(Boolean);
        words.forEach((word) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'hero-word';
            wordSpan.textContent = word;
            wordSpan.style.cssText = 'display:inline-block; opacity:0; transform: translateY(46px) rotateX(-18deg); transform-origin: 50% 100%; will-change: transform, opacity;';
            partWrapper.appendChild(wordSpan);
        });

        fragment.appendChild(partWrapper);
        if (index < textNodes.length - 1) {
            fragment.appendChild(document.createTextNode(' '));
        }
    });

    heroTitle.appendChild(fragment);
    heroTitle.dataset.enhanced = 'true';

    const titleParts = heroTitle.querySelectorAll('.hero-title-part');
    const wordSpans = heroTitle.querySelectorAll('.hero-word');

    gsap.to(wordSpans, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.9,
        stagger: 0.06,
        ease: 'power3.out',
        delay: 0.24
    });

    titleParts.forEach((part, index) => {
        if (!part.classList.contains('highlight')) return;

        gsap.fromTo(part,
            {
                filter: 'drop-shadow(0 0 0 rgba(255,77,0,0))'
            },
            {
                filter: 'drop-shadow(0 0 28px rgba(255,143,112,0.38))',
                duration: 1.2,
                ease: 'power2.out',
                delay: 0.85 + index * 0.08
            }
        );

        gsap.to(part, {
            y: -3,
            duration: 2.8,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 1.6
        });
    });

    const eyebrow = document.querySelector('.hero-eyebrow');
    if (eyebrow) {
        gsap.from(eyebrow, {
            opacity: 0,
            y: 24,
            duration: 0.6,
            ease: 'power2.out'
        });
    }

    const brand = document.querySelector('.hero-brand');
    if (brand) {
        gsap.from(brand, {
            opacity: 0,
            y: 18,
            scale: 0.96,
            duration: 0.7,
            ease: 'power2.out',
            delay: 0.08
        });
    }

    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        gsap.from(subtitle, {
            opacity: 0,
            y: 28,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.85
        });
    }

    const proof = document.querySelector('.hero-proof');
    if (proof) {
        gsap.from(proof, {
            opacity: 0,
            y: 22,
            duration: 0.8,
            ease: 'power2.out',
            delay: 1
        });
    }

    const heroIcons = document.querySelectorAll('.hero-apps .app-icon-item');
    if (heroIcons.length) {
        gsap.from(heroIcons, {
            opacity: 0,
            y: 30,
            scale: 0.86,
            duration: 0.7,
            stagger: 0.08,
            ease: 'back.out(1.7)',
            delay: 1.05
        });
    }

    const statBadges = document.querySelectorAll('.hero-stats-inline .stat-badge');
    if (statBadges.length) {
        gsap.from(statBadges, {
            opacity: 0,
            y: 26,
            scale: 0.92,
            duration: 0.65,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 1.2
        });
    }

    const trustStrip = document.querySelectorAll('.hero-trust-strip span');
    if (trustStrip.length) {
        gsap.from(trustStrip, {
            opacity: 0,
            y: 18,
            duration: 0.55,
            stagger: 0.08,
            ease: 'power2.out',
            delay: 1.35
        });
    }

    const heroBtn = document.querySelector('.btn-hero-primary');
    if (heroBtn) {
        gsap.fromTo(heroBtn,
            {
                opacity: 0,
                scale: 0.9,
                y: 24,
                immediateRender: false
            },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.7,
                ease: 'back.out(1.8)',
                delay: 1.1,
                clearProps: 'opacity,transform'
            }
        );

        heroBtn.addEventListener('mousemove', (e) => {
            const rect = heroBtn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(heroBtn, {
                x: x * 0.12,
                y: y * 0.12,
                duration: 0.25,
                ease: 'power2.out'
            });
        });

        heroBtn.addEventListener('mouseleave', () => {
            gsap.to(heroBtn, {
                x: 0,
                y: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
    }
}

// ========================================
// 4. PRODUCT PAGE SHOWCASE
// ========================================

function initProductPageShowcase() {
    const productHero = document.querySelector('.product-hero-grid');
    if (!productHero) return;

    const productInfo = productHero.querySelector('.product-info');
    const productIcon = productHero.querySelector('.product-icon');
    const productTitle = productHero.querySelector('.product-info h1');
    const productSubtitle = productHero.querySelector('.product-subtitle');
    const productStats = productHero.querySelectorAll('.product-stats-hero .stat-badge');
    const productActions = productHero.querySelectorAll('.product-actions .btn-download');
    const productMockup = productHero.querySelector('.product-mockup');
    const productMockupImage = productHero.querySelector('.product-mockup img');

    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (productInfo) {
        heroTimeline.from(productInfo, {
            opacity: 0,
            x: -36,
            duration: 0.7
        });
    }

    if (productIcon) {
        heroTimeline.from(productIcon, {
            opacity: 0,
            scale: 0.82,
            y: 18,
            duration: 0.5
        }, productInfo ? '-=0.42' : 0);
    }

    if (productTitle) {
        heroTimeline.from(productTitle, {
            opacity: 0,
            y: 28,
            duration: 0.55
        }, '-=0.28');
    }

    if (productSubtitle) {
        heroTimeline.from(productSubtitle, {
            opacity: 0,
            y: 26,
            duration: 0.6
        }, '-=0.22');
    }

    if (productStats.length) {
        heroTimeline.from(productStats, {
            opacity: 0,
            y: 22,
            scale: 0.94,
            duration: 0.48,
            stagger: 0.08
        }, '-=0.18');
    }

    if (productActions.length) {
        heroTimeline.from(productActions, {
            opacity: 0,
            y: 20,
            scale: 0.96,
            duration: 0.45,
            stagger: 0.08
        }, '-=0.12');
    }

    if (productMockup) {
        heroTimeline.from(productMockup, {
            opacity: 0,
            x: 42,
            y: 18,
            rotateY: -10,
            transformPerspective: 1200,
            duration: 0.9,
            clearProps: 'transform'
        }, 0.08);
    }

    if (productMockupImage) {
        gsap.fromTo(productMockupImage,
            {
                filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))'
            },
            {
                filter: 'drop-shadow(0 24px 48px var(--theme-glow, rgba(167, 139, 250, 0.28)))',
                duration: 1.1,
                ease: 'power2.out',
                delay: 0.45
            }
        );
    }

    const quickFeatures = gsap.utils.toArray('.quick-feature');
    if (quickFeatures.length) {
        gsap.from(quickFeatures, {
            y: 24,
            duration: 0.55,
            stagger: 0.07,
            ease: 'power2.out',
            clearProps: 'transform',
            scrollTrigger: {
                trigger: quickFeatures[0].closest('.quick-features') || quickFeatures[0],
                start: 'top 82%',
                once: true
            }
        });
    }

    const featureCards = gsap.utils.toArray('.feature-card-large');
    if (featureCards.length) {
        gsap.from(featureCards, {
            y: 42,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: {
                trigger: featureCards[0].closest('.content-section') || featureCards[0],
                start: 'top 78%',
                once: true
            }
        });
    }

    const useCaseCards = gsap.utils.toArray('.use-case-card');
    if (useCaseCards.length) {
        gsap.from(useCaseCards, {
            y: 34,
            scale: 0.96,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            clearProps: 'transform',
            scrollTrigger: {
                trigger: useCaseCards[0].closest('.content-section') || useCaseCards[0],
                start: 'top 78%',
                once: true
            }
        });
    }

    const specCards = gsap.utils.toArray('.spec-card');
    if (specCards.length) {
        gsap.from(specCards, {
            y: 34,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            clearProps: 'transform',
            scrollTrigger: {
                trigger: specCards[0].closest('.content-section') || specCards[0],
                start: 'top 80%',
                once: true
            }
        });
    }

    const comparisonRows = gsap.utils.toArray('.comparison-table tbody tr');
    if (comparisonRows.length) {
        gsap.from(comparisonRows, {
            x: -24,
            duration: 0.45,
            stagger: 0.06,
            ease: 'power2.out',
            clearProps: 'transform',
            scrollTrigger: {
                trigger: comparisonRows[0].closest('.comparison-table-wrapper') || comparisonRows[0],
                start: 'top 82%',
                once: true
            }
        });
    }

    const reviewCards = gsap.utils.toArray('.review-card');
    if (reviewCards.length) {
        gsap.from(reviewCards, {
            y: 30,
            duration: 0.55,
            stagger: 0.08,
            ease: 'power2.out',
            clearProps: 'transform',
            scrollTrigger: {
                trigger: reviewCards[0].closest('.content-section') || reviewCards[0],
                start: 'top 80%',
                once: true
            }
        });
    }

    const faqItems = gsap.utils.toArray('.faq-item');
    if (faqItems.length) {
        gsap.from(faqItems, {
            y: 24,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power2.out',
            clearProps: 'transform',
            scrollTrigger: {
                trigger: faqItems[0].closest('.content-section') || faqItems[0],
                start: 'top 82%',
                once: true
            }
        });
    }

    const guideCards = gsap.utils.toArray('.guide-card');
    if (guideCards.length) {
        gsap.from(guideCards, {
            y: 28,
            duration: 0.55,
            stagger: 0.08,
            ease: 'power2.out',
            clearProps: 'transform',
            scrollTrigger: {
                trigger: guideCards[0].closest('.content-section') || guideCards[0],
                start: 'top 80%',
                once: true
            }
        });
    }

    const relatedProducts = gsap.utils.toArray('.related-product-card');
    if (relatedProducts.length) {
        gsap.from(relatedProducts, {
            y: 26,
            scale: 0.96,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
            clearProps: 'transform',
            scrollTrigger: {
                trigger: relatedProducts[0].closest('.content-section') || relatedProducts[0],
                start: 'top 82%',
                once: true
            }
        });
    }

    const sectionHeadings = gsap.utils.toArray('.content-section h2, .content-section .section-subtitle');
    if (sectionHeadings.length) {
        gsap.from(sectionHeadings, {
            y: 26,
            duration: 0.55,
            stagger: 0.06,
            ease: 'power2.out',
            clearProps: 'transform',
            scrollTrigger: {
                trigger: sectionHeadings[0].closest('.content-section') || sectionHeadings[0],
                start: 'top 82%',
                once: true
            }
        });
    }

    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
        gsap.from(ctaSection, {
            y: 36,
            duration: 0.7,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: {
                trigger: ctaSection,
                start: 'top 84%',
                once: true
            }
        });
    }
}

function initBlogPageShowcase() {
    const blogHero = document.querySelector('.blog-hero');
    if (!blogHero) return;

    const heroTitle = blogHero.querySelector('h1');
    const heroText = blogHero.querySelector('p');
    const categoryButtons = gsap.utils.toArray('.category-btn');
    const featuredMain = document.querySelector('.featured-main');
    const featuredSidebarCards = gsap.utils.toArray('.featured-sidebar .sidebar-card');
    const blogCards = gsap.utils.toArray('.blog-card-enhanced');
    const tagLinks = gsap.utils.toArray('.tag-link');
    const newsletterSection = document.querySelector('.newsletter-section');
    const newsletterHeading = newsletterSection?.querySelector('h2');
    const newsletterText = newsletterSection?.querySelector('p');
    const newsletterForm = newsletterSection?.querySelector('.newsletter-form');

    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (heroTitle) {
        heroTimeline.from(heroTitle, {
            opacity: 0,
            y: 28,
            duration: 0.7
        });
    }

    if (heroText) {
        heroTimeline.from(heroText, {
            opacity: 0,
            y: 24,
            duration: 0.65
        }, '-=0.36');
    }

    if (categoryButtons.length) {
        heroTimeline.from(categoryButtons, {
            opacity: 0,
            y: 18,
            scale: 0.96,
            duration: 0.42,
            stagger: 0.06,
            clearProps: 'transform',
            immediateRender: false
        }, '-=0.2');
    }

    if (featuredMain) {
        gsap.from(featuredMain, {
            y: 34,
            scale: 0.98,
            duration: 0.72,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: {
                trigger: featuredMain,
                start: 'top 82%',
                once: true
            }
        });

        const featuredImage = featuredMain.querySelector('img');
        if (featuredImage) {
            gsap.fromTo(featuredImage,
                {
                    scale: 1.08
                },
                {
                    scale: 1,
                    duration: 1.2,
                    ease: 'power2.out',
                    clearProps: 'transform',
                    scrollTrigger: {
                        trigger: featuredMain,
                        start: 'top 82%',
                        once: true
                    }
                }
            );
        }
    }

    if (featuredSidebarCards.length) {
        gsap.from(featuredSidebarCards, {
            x: 28,
            duration: 0.55,
            stagger: 0.08,
            ease: 'power2.out',
            clearProps: 'transform',
            scrollTrigger: {
                trigger: featuredSidebarCards[0].closest('.featured-grid') || featuredSidebarCards[0],
                start: 'top 82%',
                once: true
            }
        });
    }

    if (blogCards.length) {
        gsap.from(blogCards, {
            y: 36,
            duration: 0.62,
            stagger: {
                each: 0.05,
                from: 'start'
            },
            ease: 'power2.out',
            clearProps: 'transform',
            scrollTrigger: {
                trigger: blogCards[0].parentElement,
                start: 'top 80%',
                once: true
            }
        });
    }

    if (tagLinks.length) {
        gsap.from(tagLinks, {
            y: 18,
            scale: 0.96,
            duration: 0.4,
            stagger: 0.04,
            ease: 'power2.out',
            clearProps: 'transform',
            scrollTrigger: {
                trigger: tagLinks[0].closest('.popular-tags') || tagLinks[0],
                start: 'top 84%',
                once: true
            }
        });
    }

    if (newsletterHeading || newsletterText || newsletterForm) {
        gsap.from([newsletterHeading, newsletterText, newsletterForm].filter(Boolean), {
            y: 28,
            duration: 0.55,
            stagger: 0.08,
            ease: 'power2.out',
            clearProps: 'transform',
            scrollTrigger: {
                trigger: newsletterSection,
                start: 'top 84%',
                once: true
            }
        });
    }
}

// ========================================
// 5. MAGNETIC PRODUCT CARDS
// ========================================

function initMagneticCards() {
    const enhancedCards = document.querySelectorAll('.product-card-enhanced');
    const productCards = document.querySelectorAll('.product-card');
    const inlineCards = document.querySelectorAll('#products a[style*="border-top"]');
    const allCards = enhancedCards.length > 0
        ? enhancedCards
        : (productCards.length > 0 ? productCards : inlineCards);

    if (allCards.length === 0) return;

    gsap.fromTo(allCards,
        {
            y: 72,
            rotateX: 14,
            rotateY: -8,
            scale: 0.96,
            transformPerspective: 1200,
            transformOrigin: '50% 50% -120'
        },
        {
            y: 0,
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 1,
            stagger: {
                amount: 0.8,
                from: 'start'
            },
            ease: 'power3.out',
            clearProps: 'transform',
            immediateRender: false,
            scrollTrigger: {
                trigger: allCards[0].parentElement,
                start: 'top 80%',
                once: true
            }
        }
    );

    allCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const pullX = (x - centerX) / centerX;
            const pullY = (y - centerY) / centerY;

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

            const icon = card.querySelector('.product-card-icon') || card.querySelector('img[style*="width: 50px"]');
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

            const icon = card.querySelector('.product-card-icon') || card.querySelector('img[style*="width: 50px"]');
            if (icon) {
                gsap.to(icon, {
                    scale: 1,
                    rotate: 0,
                    duration: 0.4
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
    
    // Features section color shift - 只改变 section 自身，不影响 body
    const featuresSection = document.querySelector('.features') || document.querySelector('[style*="background: #f8f9fa"]');
    if (featuresSection) {
        ScrollTrigger.create({
            trigger: featuresSection,
            start: 'top 60%',
            end: 'bottom 40%',
            onEnter: () => {
                // 不再改变 body 背景，避免影响页面上其他元素
                gsap.to(featuresSection, {
                    backgroundColor: '#f8f9fa',
                    duration: 0.5
                });
            },
            onLeaveBack: () => {
                gsap.to(featuresSection, {
                    backgroundColor: '#ffffff',
                    duration: 0.5
                });
            }
        });
    }
    
    // CTA section dark mode - 只改变 CTA section 自身，不影响 body
    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
        ScrollTrigger.create({
            trigger: ctaSection,
            start: 'top 70%',
            onEnter: () => {
                // 不再改变 body 背景，避免影响页面上其他浅色元素
                gsap.to(ctaSection, {
                    backgroundColor: '#0a0a0a',
                    duration: 0.6
                });
            },
            onLeaveBack: () => {
                gsap.to(ctaSection, {
                    backgroundColor: 'linear-gradient(135deg, #ff4d00 0%, #000 100%)',
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
    const buttons = document.querySelectorAll('.btn-download, .btn-hero-primary');
    
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
    const visibleSelectors = [
        '.hero-brand',
        '.hero-eyebrow',
        '.hero-title',
        '.hero-subtitle',
        '.hero-proof',
        '.hero-apps .app-icon-item',
        '.hero-cta .btn-hero-primary',
        '.hero-content .btn-download',
        '.hero-stats-inline .stat-badge',
        '.hero-trust-strip span',
        '.scroll-indicator',
        '.section-header',
        '.section-kicker',
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
// ========================================
// COUNTER ANIMATION WITH DATA-TARGET
// ========================================
function initEnhancedCounter() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    statNumbers.forEach(stat => {
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

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    initEnhancedCounter();
});
