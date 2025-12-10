/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";

publicWidget.registry.EventzoHeader = publicWidget.Widget.extend({
    selector: '.eventzo_header',
    events: {
        'click .js_mobile_menu_toggle': '_onMobileToggle',
        'click .js_mobile_dropdown_toggle': '_onMobileDropdownToggle',
    },

    /**
     * @override
     */
    start() {
        this._super(...arguments);
        this._initScrollBehavior();
        this._setActiveLink();
        return Promise.resolve();
    },

    /**
     * @override
     */
    destroy() {
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
        }
        this._super(...arguments);
    },

    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------

    /**
     * Initialize scroll behavior for header
     * @private
     */
    _initScrollBehavior() {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const scrollY = window.scrollY;

            if (scrollY > 50) {
                this.el.classList.add('js_scrolled');
            } else {
                this.el.classList.remove('js_scrolled');
            }

            lastScrollY = scrollY;
            ticking = false;
        };

        this.scrollHandler = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };

        window.addEventListener('scroll', this.scrollHandler, { passive: true });
    },

    /**
     * Set active link based on current URL
     * @private
     */
    _setActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = this.el.querySelectorAll('.eventzo_nav_link');

        navLinks.forEach((link) => {
            const linkPath = new URL(link.href).pathname;

            if (linkPath === currentPath) {
                link.classList.add('js_active');
            } else {
                link.classList.remove('js_active');
            }
        });
    },

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * Handle mobile menu toggle
     * @private
     * @param {Event} ev
     */
    _onMobileToggle(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        const toggle = ev.currentTarget;
        const mobileMenu = this.el.querySelector('.js_mobile_menu');

        toggle.classList.toggle('js_active');

        if (mobileMenu) {
            mobileMenu.classList.toggle('js_active');

            if (mobileMenu.classList.contains('js_active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    },

    /**
     * Handle mobile dropdown toggle
     * @private
     * @param {Event} ev
     */
    _onMobileDropdownToggle(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        const toggle = ev.currentTarget;
        const dropdown = toggle.closest('.eventzo_mobile_dropdown');
        const submenu = dropdown.querySelector('.eventzo_mobile_submenu');
        const icon = toggle.querySelector('.fa-chevron-down');

        if (submenu) {
            submenu.classList.toggle('js_active');

            if (icon) {
                if (submenu.classList.contains('js_active')) {
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    icon.style.transform = 'rotate(0deg)';
                }
            }
        }
    },
});