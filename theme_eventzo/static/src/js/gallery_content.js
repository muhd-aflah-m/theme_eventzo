/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";

publicWidget.registry.EventzoGalleryContent = publicWidget.Widget.extend({
    selector: '.s_eventzo_gallery_content',
    events: {
        'click .js_filter_btn': '_onFilterClick',
        'click .js_view_image': '_onViewImage',
        'click .js_lightbox_close': '_onCloseLightbox',
        'click .js_gallery_lightbox': '_onLightboxBackdrop',
        'click .js_load_more': '_onLoadMore',
    },

    /**
     * @override
     */
start() {
    this._super(...arguments);

    // Show all gallery items immediately
    const allItems = this.el.querySelectorAll('.js_gallery_item');
    this.visibleItems = allItems.length; // Automatically detect and show all
    this.currentFilter = 'all';

    this._updateVisibility();
    return Promise.resolve();
},


    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------

    /**
     * Update gallery items visibility
     * @private
     */
    _updateVisibility() {
        const items = this.el.querySelectorAll('.js_gallery_item');
        let visibleCount = 0;

        items.forEach((item) => {
            // Check if item matches current filter
            const matchesFilter = this.currentFilter === 'all' || item.dataset.category === this.currentFilter;

            if (!matchesFilter) {
                item.style.display = 'none';
                return;
            }

            // Show/hide based on visible count
            if (visibleCount < this.visibleItems) {
                item.style.display = '';
                item.classList.remove('js_hidden');
                visibleCount++;
            } else {
                item.style.display = 'none';
                item.classList.add('js_hidden');
            }
        });

        // Update load more button visibility
        const totalMatchingItems = Array.from(items).filter(item =>
            this.currentFilter === 'all' || item.dataset.category === this.currentFilter
        ).length;

        const loadMoreBtn = this.el.querySelector('.js_load_more');
        if (loadMoreBtn) {
            if (this.visibleItems >= totalMatchingItems) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'inline-flex';
            }
        }
    },

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * Handle filter button click
     * @private
     * @param {Event} ev
     */
    _onFilterClick(ev) {
        ev.preventDefault();

        const clickedBtn = ev.currentTarget;
        const category = clickedBtn.dataset.category;

        // Update active filter
        const allFilters = this.el.querySelectorAll('.js_filter_btn');
        allFilters.forEach((btn) => btn.classList.remove('js_active'));
        clickedBtn.classList.add('js_active');

        // Update current filter and reset visible count
        this.currentFilter = category;
        this.visibleItems = 999;
        this._updateVisibility();
    },

    /**
     * Handle view image button click
     * @private
     * @param {Event} ev
     */
    _onViewImage(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        const imageSrc = ev.currentTarget.dataset.image;
        const lightbox = this.el.querySelector('.js_gallery_lightbox');
        const lightboxImg = lightbox.querySelector('.js_lightbox_image');

        if (lightbox && lightboxImg) {
            lightboxImg.src = imageSrc;
            lightbox.classList.add('js_active');
            document.body.style.overflow = 'hidden';
        }
    },

    /**
     * Handle lightbox close
     * @private
     * @param {Event} ev
     */
    _onCloseLightbox(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        const lightbox = this.el.querySelector('.js_gallery_lightbox');
        if (lightbox) {
            lightbox.classList.remove('js_active');
            document.body.style.overflow = '';
        }
    },

    /**
     * Handle lightbox backdrop click
     * @private
     * @param {Event} ev
     */
    _onLightboxBackdrop(ev) {
        if (ev.target.classList.contains('js_gallery_lightbox')) {
            this._onCloseLightbox(ev);
        }
    },

    /**
     * Handle load more button click
     * @private
     * @param {Event} ev
     */
    _onLoadMore(ev) {
        ev.preventDefault();

        this.visibleItems += 6;
        this._updateVisibility();
    },
});