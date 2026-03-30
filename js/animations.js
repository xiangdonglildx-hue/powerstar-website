/**
 * PowerStar Website - GSAP Animations
 * Version: 2.1.0 - Full Screen Hero Support
 */

document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        initAnimations();
    }
});

function initAnimations() {
    
    // ========================================
    // 1. Hero Animations - Full Screen
    // ========================================
    
    // Banner parallax effect
    gsap.to('.banner-slide.active img', {
        scale: 1.1,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });
    
    // Hero content fade in
    gsap.from('.hero-content h1', {
        opacity: 0,
        y: 60,
        duration: 1.2,
        delay: 0.3,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 0.5,
        ease: 'power2.out'
    });
    
    gsap.from('.hero-content .btn-download', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.7,
        ease: 'power2.out'
    });
    
    // Scroll indicator
    gsap.from('.scroll-indicator', {
        opacity: 0,
        duration: 1,
        delay: 1.2,
        ease: 'power2.out'
    });
    
    // ========================================
    // 2. Stats Section
    // ========================================
    gsap.from('.stat-item', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.stats-section',
            start: 'top 80%'
        }
    });
    
    // Number counter
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const text = stat.textContent;
        const num = parseInt(text.replace(/[^0-9]/g, ''));
        
        if (!isNaN(num) && num > 0) {
            gsap.from(stat, {
                textContent: 0,
                duration: 2,
                ease: 'power2.out',
                snap: { textContent: 1 },
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 80%'
                },
                onUpdate: function() {
                    const currentNum = Math.round(this.targets()[0].textContent);
                    if (text.includes('M')) {
                        stat.textContent = currentNum + 'M+';
                    } else if (text.includes('+')) {
                        stat.textContent = currentNum + '+';
                    } else {
                        stat.textContent = currentNum;
                    }
                }
            });
        }
    });
    
    // ========================================
    // 3. Product Cards
    // ========================================
    gsap.from('.product-card', {
        opacity: 0,
        y: 60,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.products-grid',
            start: 'top 80%'
        }
    });
    
    // Hover animations
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -8,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // ========================================
    // 4. Features Section
    // ========================================
    gsap.from('.feature-card', {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 80%'
        }
    });
    
    // ========================================
    // 5. CTA Section
    // ========================================
    gsap.from('.cta-section h2', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 80%'
        }
    });
    
    gsap.from('.cta-section p, .cta-section .btn-download', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.2,
        scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 80%'
        }
    });
    
    // ========================================
    // 6. Footer
    // ========================================
    gsap.from('.footer-brand', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 90%'
        }
    });
    
    gsap.from('.footer-column', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 90%'
        }
    });
    
    // ========================================
    // 7. Button Hover Effects
    // ========================================
    document.querySelectorAll('.btn-download').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.2,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.2,
                ease: 'power2.out'
            });
        });
    });
    
    // ========================================
    // 8. Reduced Motion Support
    // ========================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        gsap.globalTimeline.timeScale(0);
    }
    
    console.log('✅ PowerStar GSAP Animations v2.1 initialized');
}