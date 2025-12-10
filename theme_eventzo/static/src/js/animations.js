/** @odoo-module **/
'use strict';

import publicWidget from "@web/legacy/js/public/public_widget";

publicWidget.registry.EventzoHero = publicWidget.Widget.extend({
    selector: '.s_eventzo_hero',
    disabledInEditableMode: false,

    /**
     * @override
     */
    start() {
        this._super(...arguments);
        this._initBackgroundSlider();
        this._initParallax();
        this._initIntersectionObserver();
        return Promise.resolve();
    },

    /**
     * @override
     */
    destroy() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        if (this.sliderInterval) {
            clearInterval(this.sliderInterval);
        }
        this._super(...arguments);
    },

    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------

    /**
     * Initialize background image slider
     * @private
     */
    _initBackgroundSlider() {
        const bgImagesAttr = this.el.dataset.bgImages;
        const slideInterval = parseInt(this.el.dataset.slideInterval) || 2000;

        if (!bgImagesAttr) {
            return;
        }

        let bgImages;
        try {
            bgImages = JSON.parse(bgImagesAttr);
        } catch (e) {
            console.error('Invalid bg-images JSON:', e);
            return;
        }

        if (!Array.isArray(bgImages) || bgImages.length === 0) {
            return;
        }

        this.bgImages = bgImages;
        this.currentSlideIndex = 0;

        const slides = this.el.querySelectorAll('.eventzo_hero_bg_slide');
        this.slides = Array.from(slides);

        if (this.slides.length < 2) {
            console.error('Need at least 2 slide elements');
            return;
        }

        // Set initial images
        this.slides[0].style.backgroundImage = `url('${this.bgImages[0]}')`;
        this.slides[1].style.backgroundImage = `url('${this.bgImages[1 % this.bgImages.length]}')`;

        // Preload images
        this._preloadImages();

        // Start slider
        this.sliderInterval = setInterval(() => {
            this._nextSlide();
        }, slideInterval);
    },

    /**
     * Preload all background images
     * @private
     */
    _preloadImages() {
        this.bgImages.forEach((imgUrl) => {
            const img = new Image();
            img.src = imgUrl;
        });
    },

    /**
     * Transition to next slide
     * @private
     */
    _nextSlide() {
        const currentSlide = this.slides.find((slide) => slide.classList.contains('js_active'));
        const nextSlide = this.slides.find((slide) => !slide.classList.contains('js_active'));

        if (!currentSlide || !nextSlide) {
            return;
        }

        // Update index
        this.currentSlideIndex = (this.currentSlideIndex + 1) % this.bgImages.length;
        const nextImageIndex = (this.currentSlideIndex + 1) % this.bgImages.length;

        // Set next slide background
        nextSlide.style.backgroundImage = `url('${this.bgImages[this.currentSlideIndex]}')`;

        // Trigger transition
        nextSlide.classList.add('js_active');
        currentSlide.classList.remove('js_active');

        // Preload next image
        setTimeout(() => {
            const preloadSlide = this.slides.find((slide) => !slide.classList.contains('js_active'));
            if (preloadSlide) {
                preloadSlide.style.backgroundImage = `url('${this.bgImages[nextImageIndex]}')`;
            }
        }, 500);
    },

    /**
     * Initialize parallax effect on scroll
     * @private
     */
    _initParallax() {
        const floatingItems = this.el.querySelectorAll('.eventzo_float_item');
        const decorItems = this.el.querySelectorAll('.eventzo_decoration_item');

        let ticking = false;

        const updateParallax = () => {
            const scrollY = window.scrollY;
            const heroRect = this.el.getBoundingClientRect();

            if (heroRect.top < window.innerHeight && heroRect.bottom > 0) {
                floatingItems.forEach((item, index) => {
                    const speed = 0.5 + (index * 0.2);
                    const yPos = -(scrollY * speed);
                    item.style.transform = `translateY(${yPos}px)`;
                });

                decorItems.forEach((item, index) => {
                    const speed = 0.3 + (index * 0.15);
                    const yPos = -(scrollY * speed);
                    item.style.transform = `translateY(${yPos}px) rotate(${scrollY * 0.05}deg)`;
                });
            }

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    },

    /**
     * Initialize Intersection Observer for animation triggers
     * @private
     */
    _initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('js_animated');
                    this._triggerCountAnimation(entry.target);
                }
            });
        }, observerOptions);

        const animatedElements = this.el.querySelectorAll('.eventzo_hero_content, .eventzo_hero_visual');
        animatedElements.forEach((el) => {
            this.intersectionObserver.observe(el);
        });
    },

    /**
     * Trigger count-up animation for rating
     * @private
     * @param {Element} target
     */
    _triggerCountAnimation(target) {
        const ratingElement = target.querySelector('.eventzo_rating_text');

        if (ratingElement && !ratingElement.dataset.animated) {
            ratingElement.dataset.animated = 'true';

            const finalValue = 4.8;
            const duration = 2000;
            const startTime = performance.now();

            const animateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = (finalValue * easeOutQuart).toFixed(1);

                ratingElement.textContent = `${currentValue}/5 Rating`;

                if (progress < 1) {
                    window.requestAnimationFrame(animateCount);
                }
            };

            window.requestAnimationFrame(animateCount);
        }
    },
});


