/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";

publicWidget.registry.EventzoContact = publicWidget.Widget.extend({
    selector: '.s_eventzo_contact',
    events: {
        'click .js_location_tab': '_onLocationTabClick',
    },

    /**
     * @override
     */
    start() {
        this._super(...arguments);
        return Promise.resolve();
    },

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * Handle location tab click
     * @private
     * @param {Event} ev
     */
    _onLocationTabClick(ev) {
        ev.preventDefault();

        const clickedTab = ev.currentTarget;
        const location = clickedTab.dataset.location;

        // Update active tab
        const allTabs = this.el.querySelectorAll('.js_location_tab');
        allTabs.forEach((tab) => tab.classList.remove('js_active'));
        clickedTab.classList.add('js_active');

        // Update active map
        const allMaps = this.el.querySelectorAll('.js_map_container');
        allMaps.forEach((map) => {
            if (map.dataset.location === location) {
                map.classList.add('js_active');
            } else {
                map.classList.remove('js_active');
            }
        });
    },
});