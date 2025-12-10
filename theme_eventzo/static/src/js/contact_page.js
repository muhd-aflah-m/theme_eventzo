/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";

publicWidget.registry.EventzoContactPage = publicWidget.Widget.extend({
    selector: '.s_eventzo_contact',

    start() {
        this._animateOnScroll();
        return this._super.apply(this, arguments);
    },

    /**
     * Fade-in animations on scroll.
     */
    _animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate__fadeInUp");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        this.el.querySelectorAll(
            ".eventzo_contact_content, .eventzo_contact_buttons, .eventzo_contact_title"
        ).forEach((el) => observer.observe(el));
    },
});
