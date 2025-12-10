odoo.define('website.s_wedding_services_grid', function (require) {
    'use strict';

    const publicWidget = require('web.public.widget');
    const core = require('web.core');

    publicWidget.registry.weddingServicesGrid = publicWidget.Widget.extend({
        selector: '.s_wedding_services_grid',
        disabledInEditableMode: false,

        /**
         * @override
         */
        start: function () {
            this._super.apply(this, arguments);
            this._setupScrollAnimation();
            this._setupCardTracking();
            this._setupLazyLoading();
            return this._super.apply(this, arguments);
        },

        /**
         * Setup scroll animation for service cards
         * @private
         */
        _setupScrollAnimation: function () {
            const self = this;
            const section = this.$el[0];

            // Add animation class
            this.$el.addClass('animate-cards');

            // Intersection Observer for scroll animation
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        self.$el.addClass('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            observer.observe(section);
        },

        /**
         * Setup click tracking for service cards
         * @private
         */
        _setupCardTracking: function () {
            const self = this;

            this.$('.service_card').on('click', function (e) {
                const cardTitle = $(this).find('.service_title').text().trim();
                self._trackEvent('Service Card Click', 'Engagement', cardTitle);
            });
        },

        /**
         * Setup lazy loading for images
         * @private
         */
        _setupLazyLoading: function () {
            const images = this.$el.find('.service_image');

            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver(function (entries, observer) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            const card = $(img).closest('.service_card');

                            // Remove loading state
                            card.removeClass('loading');

                            // Stop observing this image
                            observer.unobserve(img);
                        }
                    });
                }, {
                    rootMargin: '50px'
                });

                images.each(function () {
                    imageObserver.observe(this);
                });
            }
        },

        /**
         * Track events (can be integrated with analytics)
         * @private
         */
        _trackEvent: function (action, category, label) {
            // Integration point for Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', action, {
                    'event_category': category,
                    'event_label': label
                });
            }

            // Integration point for Facebook Pixel
            if (typeof fbq !== 'undefined') {
                fbq('track', 'ViewContent', {
                    content_name: label,
                    content_category: category
                });
            }

            console.log('Event tracked:', {
                action: action,
                category: category,
                label: label
            });
        },

        /**
         * @override
         */
        destroy: function () {
            this.$('.service_card').off('click');
            this._super.apply(this, arguments);
        }
    });

    return publicWidget.registry.weddingServicesGrid;
});


// Vanilla JS version (Alternative implementation)
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        const serviceSections = document.querySelectorAll('.s_wedding_services_grid');

        serviceSections.forEach(function(section) {
            initializeSection(section);
        });
    });

    function initializeSection(section) {
        // Add animation class
        section.classList.add('animate-cards');

        // Setup scroll animation
        setupScrollAnimation(section);

        // Setup card interactions
        setupCardInteractions(section);

        // Setup lazy loading
        setupLazyLoading(section);
    }

    function setupScrollAnimation(section) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        observer.observe(section);
    }

    function setupCardInteractions(section) {
        const cards = section.querySelectorAll('.service_card');

        cards.forEach(function(card) {
            // Click tracking
            card.addEventListener('click', function(e) {
                const title = this.querySelector('.service_title');
                if (title) {
                    const serviceName = title.textContent.trim();
                    trackEvent('Service Card Click', 'Engagement', serviceName);
                }
            });

            // Hover effect enhancement
            card.addEventListener('mouseenter', function() {
                this.style.setProperty('--hover-scale', '1.02');
            });

            card.addEventListener('mouseleave', function() {
                this.style.setProperty('--hover-scale', '1');
            });
        });
    }

    function setupLazyLoading(section) {
        if (!('IntersectionObserver' in window)) {
            return;
        }

        const images = section.querySelectorAll('.service_image');

        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const card = img.closest('.service_card');

                    // Add loaded class
                    if (card) {
                        card.classList.add('image-loaded');
                        card.classList.remove('loading');
                    }

                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px'
        });

        images.forEach(function(img) {
            imageObserver.observe(img);
        });
    }

    function trackEvent(action, category, label) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: label,
                content_category: category
            });
        }

        // Console logging for debugging
        console.log('Service card interaction:', {
            action: action,
            category: category,
            label: label,
            timestamp: new Date().toISOString()
        });
    }

    // Utility: Add smooth scroll to anchor links (if needed)
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Initialize smooth scroll
    setupSmoothScroll();
})();