// ========================================
// GSAP Animations Enhanced - Apple Style
// ========================================

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // ===== Hero Section Animations =====
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        // Animate hero elements on load
        gsap.from('.hero-brand', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: 0.2
        });

        gsap.from('.hero-eyebrow', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: 0.3
        });

        gsap.from('.hero-title', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: 0.4
        });

        gsap.from('.hero-subtitle', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: 0.5
        });

        gsap.from('.hero-apps', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: 0.6
        });

        gsap.from('.hero-cta', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: 0.7
        });

        gsap.from('.hero-stats-inline', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: 0.8
        });
    }

    // ===== Scroll Animations =====
    // Animate sections on scroll
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // ===== Product Cards Animation =====
    const productCards = document.querySelectorAll('.product-card-enhanced');
    productCards.forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // ===== Feature Cards Animation =====
    const featureCards = document.querySelectorAll('.feature-card-large');
    featureCards.forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // ===== Social Proof Animation =====
    const socialStats = document.querySelectorAll('.social-stat');
    socialStats.forEach((stat, index) => {
        gsap.from(stat, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: stat,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // ===== Testimonial Cards Animation =====
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // ===== Blog Cards Animation =====
    const blogCards = document.querySelectorAll('.blog-preview-card');
    blogCards.forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // ===== FAQ Items Animation =====
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
        gsap.from(item, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // ===== Navbar Scroll Effect =====
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let lastScrollY = 0;

        ScrollTrigger.create({
            trigger: 'body',
            start: 'top -80',
            end: 'max',
            onUpdate: (self) => {
                const scrollY = self.scroll();

                if (scrollY > 50) {
                    navbar.classList.add('scrolled');
                    gsap.to(navbar, {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
                        duration: 0.3
                    });
                } else {
                    navbar.classList.remove('scrolled');
                    gsap.to(navbar, {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        boxShadow: 'none',
                        duration: 0.3
                    });
                }

                lastScrollY = scrollY;
            }
        });
    }

    // ===== Smooth Scroll for Anchor Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                    ease: 'power2.inOut'
                });
            }
        });
    });

    // ===== Parallax Effect for Hero =====
    const hero = document.querySelector('.hero');
    if (hero) {
        gsap.to('.hero-content', {
            y: 100,
            opacity: 0.5,
            scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    // ===== Counter Animation for Stats =====
    const statValues = document.querySelectorAll('.stat-value, .social-stat-value');
    statValues.forEach(stat => {
        const text = stat.textContent;
        const hasPlus = text.includes('+');
        const hasM = text.includes('M');
        const hasK = text.includes('K');

        let target = parseFloat(text);

        if (hasM) {
            target = parseFloat(text) * 1000000;
        } else if (hasK) {
            target = parseFloat(text) * 1000;
        }

        if (!isNaN(target)) {
            gsap.from(stat, {
                textContent: 0,
                duration: 2,
                ease: 'power1.out',
                snap: { textContent: 1 },
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                onUpdate: function () {
                    const current = Math.ceil(parseFloat(stat.textContent));
                    if (hasM) {
                        stat.textContent = (current / 1000000).toFixed(0) + 'M+';
                    } else if (hasK) {
                        stat.textContent = (current / 1000).toFixed(0) + 'K+';
                    } else {
                        stat.textContent = current + (hasPlus ? '+' : '');
                    }
                }
            });
        }
    });

    // ===== Hover Effects for Cards =====
    const cards = document.querySelectorAll('.product-card-enhanced, .feature-card-large, .testimonial-card, .blog-preview-card, .faq-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // ===== Button Hover Effects =====
    const buttons = document.querySelectorAll('.btn-download, .btn-hero-primary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // ===== Image Hover Effects =====
    const images = document.querySelectorAll('.product-card-image, .blog-preview-image');
    images.forEach(image => {
        const card = image.closest('.product-card-enhanced, .blog-preview-card');
        if (card) {
            card.addEventListener('mouseenter', () => {
                gsap.to(image, {
                    scale: 1.05,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
        }
    });

    // ===== Scroll Progress Indicator =====
    const scrollProgress = document.createElement('div');
    scrollProgress.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--apple-blue), var(--apple-green));
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    });

    // ===== Lazy Loading for Images =====
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ===== Smooth Reveal for Sections =====
    const revealSections = document.querySelectorAll('.social-proof, .features-section, .testimonials-section, .blog-preview-section, .faq-section, .bottom-cta');
    revealSections.forEach(section => {
        gsap.from(section, {
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // ===== Stagger Animation for Grid Items =====
    const grids = document.querySelectorAll('.products-row, .features-grid-enhanced, .testimonials-grid, .blog-preview-grid, .faq-grid');
    grids.forEach(grid => {
        const items = grid.children;
        gsap.from(items, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.1,
            scrollTrigger: {
                trigger: grid,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // ===== Refresh ScrollTrigger on Load =====
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
});
