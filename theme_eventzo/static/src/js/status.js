/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";

publicWidget.registry.EventzoStatsGallery = publicWidget.Widget.extend({
    selector: '.s_eventzo_stats_gallery',
    events: {
        'click .js_gallery_item': '_onGalleryItemClick',
        'click .js_lightbox_close': '_onLightboxClose',
        'click .js_lightbox_prev': '_onLightboxPrev',
        'click .js_lightbox_next': '_onLightboxNext',
        'click .js_lightbox': '_onLightboxBackdrop',
    },

    /**
     * @override
     */
    start() {
        this._super(...arguments);
        this._initCounters();
        this._initGallery();
        this._initKeyboardNavigation();
        return Promise.resolve();
    },

    /**
     * @override
     */
    destroy() {
        if (this.keyboardHandler) {
            document.removeEventListener('keydown', this.keyboardHandler);
        }
        this._super(...arguments);
    },

    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------

    /**
     * Initialize counter animation
     * @private
     */
    _initCounters() {
        const counters = this.el.querySelectorAll('.eventzo_stat_number');

        const observerOptions = {
            threshold: 0.5,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    this._animateCounter(entry.target);
                    entry.target.dataset.animated = 'true';
                }
            });
        }, observerOptions);

        counters.forEach((counter) => {
            observer.observe(counter);
        });
    },

    /**
     * Animate counter numbers
     * @private
     * @param {Element} element
     */
    _animateCounter(element) {
        const target = parseFloat(element.dataset.count);
        const isDecimal = element.dataset.decimal === 'true';
        const duration = 2000;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = target * easeOutQuart;

            if (isDecimal) {
                element.textContent = currentValue.toFixed(1);
            } else {
                element.textContent = Math.floor(currentValue).toLocaleString();
            }

            if (progress < 1) {
                window.requestAnimationFrame(updateCounter);
            }
        };

        window.requestAnimationFrame(updateCounter);
    },

    /**
     * Initialize gallery data
     * @private
     */
    _initGallery() {
        const galleryItems = this.el.querySelectorAll('.js_gallery_item');

        this.galleryData = Array.from(galleryItems).map((item) => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.eventzo_gallery_caption');

            return {
                src: img.src,
                alt: img.alt,
                caption: caption ? caption.textContent : '',
            };
        });

        this.currentIndex = 0;
    },

    /**
     * Initialize keyboard navigation
     * @private
     */
    _initKeyboardNavigation() {
        this.keyboardHandler = (ev) => {
            const lightbox = this.el.querySelector('.js_lightbox');

            if (lightbox && lightbox.classList.contains('js_active')) {
                if (ev.key === 'Escape') {
                    this._closeLightbox();
                } else if (ev.key === 'ArrowLeft') {
                    this._showPrevImage();
                } else if (ev.key === 'ArrowRight') {
                    this._showNextImage();
                }
            }
        };

        document.addEventListener('keydown', this.keyboardHandler);
    },

    /**
     * Open lightbox with image
     * @private
     * @param {number} index
     */
    _openLightbox(index) {
        const lightbox = this.el.querySelector('.js_lightbox');
        const img = lightbox.querySelector('.js_lightbox_img');
        const caption = lightbox.querySelector('.js_lightbox_caption');

        if (!lightbox || !this.galleryData[index]) {
            return;
        }

        this.currentIndex = index;
        const data = this.galleryData[index];

        img.src = data.src;
        img.alt = data.alt;
        caption.textContent = data.caption;

        lightbox.classList.add('js_active');
        document.body.style.overflow = 'hidden';
    },

    /**
     * Close lightbox
     * @private
     */
    _closeLightbox() {
        const lightbox = this.el.querySelector('.js_lightbox');

        if (lightbox) {
            lightbox.classList.remove('js_active');
            document.body.style.overflow = '';
        }
    },

    /**
     * Show previous image
     * @private
     */
    _showPrevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.galleryData.length) % this.galleryData.length;
        this._updateLightboxImage();
    },

    /**
     * Show next image
     * @private
     */
    _showNextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.galleryData.length;
        this._updateLightboxImage();
    },

    /**
     * Update lightbox image
     * @private
     */
    _updateLightboxImage() {
        const img = this.el.querySelector('.js_lightbox_img');
        const caption = this.el.querySelector('.js_lightbox_caption');
        const data = this.galleryData[this.currentIndex];

        if (img && caption && data) {
            img.style.opacity = '0';

            setTimeout(() => {
                img.src = data.src;
                img.alt = data.alt;
                caption.textContent = data.caption;
                img.style.opacity = '1';
            }, 200);
        }
    },

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * Handle gallery item click
     * @private
     * @param {Event} ev
     */
    _onGalleryItemClick(ev) {
        ev.preventDefault();

        const item = ev.currentTarget;
        const index = parseInt(item.dataset.index);

        this._openLightbox(index);
    },

    /**
     * Handle lightbox close
     * @private
     * @param {Event} ev
     */
    _onLightboxClose(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this._closeLightbox();
    },

    /**
     * Handle previous button
     * @private
     * @param {Event} ev
     */
    _onLightboxPrev(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this._showPrevImage();
    },

    /**
     * Handle next button
     * @private
     * @param {Event} ev
     */
    _onLightboxNext(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this._showNextImage();
    },

    /**
     * Handle backdrop click
     * @private
     * @param {Event} ev
     */
    _onLightboxBackdrop(ev) {
        if (ev.target.classList.contains('js_lightbox')) {
            this._closeLightbox();
        }
    },
});