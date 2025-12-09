/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";

publicWidget.registry.EventzoServices = publicWidget.Widget.extend({
    selector: '.s_eventzo_services',

    /**
     * @override
     */
    start() {
        this._super(...arguments);
        this._initAnimations();
        return Promise.resolve();
    },

    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------

    /**
     * Initialize scroll animations for service cards
     * @private
     */
    _initAnimations() {
        const cards = this.el.querySelectorAll('.js_service_card');

        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.dataset.animated = 'true';
                    }, index * 100);
                }
            });
        }, observerOptions);

        cards.forEach((card) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(2rem)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    },
});