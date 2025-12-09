/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";

publicWidget.registry.EventzoWorkWithUs = publicWidget.Widget.extend({
    selector: '.s_eventzo_work_with_us',

    start() {
        this._bindFormSubmit();
        return this._super.apply(this, arguments);
    },

    _bindFormSubmit() {
        const form = this.el.querySelector('.eventzo_contact_form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Thank you! Your message has been submitted successfully.");
            form.reset();
        });
    },
});
