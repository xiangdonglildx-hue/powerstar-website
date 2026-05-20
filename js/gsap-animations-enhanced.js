// ========================================
// GSAP Animations - Simple & Stable
// Priority: page renders correctly first
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // ===== Hero Section - Simple Fade In =====
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        gsap.from('.hero-brand, .hero-eyebrow, .hero-title, .hero-subtitle, .hero-apps, .hero-cta, .hero-stats-inline', {
            opacity: 0,
            y: 20,
            duration: 0.6,
            stagger: 0.1
        });
    }

    // ===== Cards - Fade In Once =====
    const allCards = document.querySelectorAll('.product-card-enhanced, .feature-card-large, .testimonial-card, .blog-preview-card, .faq-item');
    allCards.forEach(card => {
        gsap.from(card, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                once: true
            }
        });
    });

    // ===== Sections - Fade In Once =====
    const sections = document.querySelectorAll('.social-proof, .features-section, .testimonials-section, .blog-preview-section, .faq-section, .bottom-cta');
    sections.forEach(section => {
        gsap.from(section, {
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                once: true
            }
        });
    });

    // ===== Navbar Scroll Effect =====
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // ===== Scroll Progress Indicator =====
    const scrollProgress = document.createElement('div');
    scrollProgress.style.cssText = 'position:fixed;top:0;left:0;width:0%;height:3px;background:linear-gradient(90deg,var(--apple-blue),var(--apple-green));z-index:9999;transition:width 0.1s ease;';
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    });
});
