/**
 * Mobile Navigation Toggle - Power Star Apps
 * Vanilla JS hamburger menu functionality
 *
 * Features:
 * - Hamburger button toggle
 * - Mobile menu slide-in animation
 * - Overlay backdrop for closing
 * - ARIA accessibility attributes
 * - Keyboard support (Escape key)
 * - Body scroll lock when menu open
 */

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    let mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');

    if (!hamburger) {
        console.warn('Mobile nav elements not found');
        return;
    }

    if (!mobileMenu) {
        mobileMenu = createFallbackMobileMenu();
    }

    if (!mobileMenu) {
        console.warn('Mobile nav elements not found');
        return;
    }

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMenu();
    });

    // Close menu on overlay click
    if (overlay) {
        overlay.addEventListener('click', function() {
            closeMenu();
        });
    }

    // Close menu on link click
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    function createFallbackMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        if (!navLinks) {
            return null;
        }

        const fallbackMenu = document.createElement('div');
        fallbackMenu.className = 'mobile-menu';
        fallbackMenu.setAttribute('aria-hidden', 'true');

        const fallbackLinks = document.createElement('ul');
        fallbackLinks.className = 'mobile-nav-links';

        navLinks.querySelectorAll('a').forEach(function(link) {
            const item = document.createElement('li');
            item.appendChild(link.cloneNode(true));
            fallbackLinks.appendChild(item);
        });

        if (fallbackLinks.children.length === 0) {
            return null;
        }

        fallbackMenu.appendChild(fallbackLinks);
        document.body.appendChild(fallbackMenu);
        return fallbackMenu;
    }

    /**
     * Toggle menu visibility
     */
    function toggleMenu() {
        const isActive = hamburger.classList.contains('active');

        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    /**
     * Open mobile menu
     */
    function openMenu() {
        hamburger.classList.add('active');
        mobileMenu.classList.add('active');
        if (overlay) overlay.classList.add('active');

        // Update ARIA attributes for accessibility
        hamburger.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');

        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close mobile menu
     */
    function closeMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        if (overlay) overlay.classList.remove('active');

        // Update ARIA attributes for accessibility
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');

        // Restore body scroll
        document.body.style.overflow = '';
    }

    // Initialize ARIA attributes
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    mobileMenu.setAttribute('aria-hidden', 'true');

    console.log('Mobile navigation initialized');
});