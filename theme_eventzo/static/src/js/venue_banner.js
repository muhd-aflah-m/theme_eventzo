/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";

publicWidget.registry.EventzoVenueBanner = publicWidget.Widget.extend({
    selector: '.s_eventzo_venue_banner',

    /**
     * @override
     */
    start() {
        this._super(...arguments);
        this._initSliders();
        return Promise.resolve();
    },

    /**
     * @override
     */
    destroy() {
        if (this.sliderIntervals) {
            this.sliderIntervals.forEach((interval) => {
                clearInterval(interval);
            });
        }
        this._super(...arguments);
    },

    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------

    /**
     * Initialize all venue image sliders
     * @private
     */
    _initSliders() {
        const sliders = this.el.querySelectorAll('.js_venue_slider');
        this.sliderIntervals = [];

        sliders.forEach((slider, index) => {
            // Add slight delay for each slider to create staggered effect
            setTimeout(() => {
                this._setupSlider(slider);
            }, index * 400);
        });
    },

    /**
     * Setup individual slider
     * @private
     * @param {Element} slider
     */
    _setupSlider(slider) {
        const images = slider.querySelectorAll('.js_venue_img');

        if (images.length <= 1) {
            console.log('Not enough images for slider');
            return;
        }

        let currentIndex = 0;

        const nextSlide = () => {
            // Remove active from current
            images.forEach((img) => img.classList.remove('js_active'));

            // Move to next index
            currentIndex = (currentIndex + 1) % images.length;

            // Add active to next
            images[currentIndex].classList.add('js_active');
        };

        // Start slider with 2 second interval
        const interval = setInterval(nextSlide, 2000);
        this.sliderIntervals.push(interval);

        // Store interval reference for pause/resume
        slider.dataset.intervalId = this.sliderIntervals.length - 1;

        // Pause on hover
        slider.addEventListener('mouseenter', () => {
            const intervalId = parseInt(slider.dataset.intervalId);
            if (this.sliderIntervals[intervalId]) {
                clearInterval(this.sliderIntervals[intervalId]);
            }
        });

        // Resume on mouse leave
        slider.addEventListener('mouseleave', () => {
            const newInterval = setInterval(nextSlide, 2000);
            const intervalId = parseInt(slider.dataset.intervalId);
            this.sliderIntervals[intervalId] = newInterval;
        });
    },
});