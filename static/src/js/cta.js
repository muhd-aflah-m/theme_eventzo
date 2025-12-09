/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";

publicWidget.registry.EventzoCTA = publicWidget.Widget.extend({
    selector: '.s_eventzo_cta',

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
     * Initialize all image sliders
     * @private
     */
    _initSliders() {
        const sliders = this.el.querySelectorAll('.js_cta_slider');
        this.sliderIntervals = [];

        sliders.forEach((slider) => {
            this._setupSlider(slider);
        });
    },

    /**
     * Setup individual slider
     * @private
     * @param {Element} slider
     */
    _setupSlider(slider) {
        const images = slider.querySelectorAll('.js_slider_img');

        if (images.length <= 1) {
            return;
        }

        let currentIndex = 0;

        const nextSlide = () => {
            const currentImg = images[currentIndex];
            currentIndex = (currentIndex + 1) % images.length;
            const nextImg = images[currentIndex];

            currentImg.classList.remove('js_active');
            nextImg.classList.add('js_active');
        };

        // Start slider with 3 second interval
        const interval = setInterval(nextSlide, 3000);
        this.sliderIntervals.push(interval);

        // Pause on hover
        slider.addEventListener('mouseenter', () => {
            clearInterval(interval);
            const index = this.sliderIntervals.indexOf(interval);
            if (index > -1) {
                this.sliderIntervals.splice(index, 1);
            }
        });

        // Resume on mouse leave
        slider.addEventListener('mouseleave', () => {
            const newInterval = setInterval(nextSlide, 3000);
            this.sliderIntervals.push(newInterval);
        });
    },
});