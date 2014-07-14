/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ListContainer')

//@Require('Class')
//@Require('Event')
//@Require('Map')
//@Require('carapace.BoxView')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ListItemView')
//@Require('carapace.ListView')
//@Require('carapace.LoaderView')
//@Require('carapace.ScrollEvent')
//@Require('carapace.ViewBuilder')
//@Require('jquery.JQuery')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Event               = bugpack.require('Event');
    var Map                 = bugpack.require('Map');
    var BoxView             = bugpack.require('carapace.BoxView');
    var CarapaceContainer   = bugpack.require('carapace.CarapaceContainer');
    var ListItemView        = bugpack.require('carapace.ListItemView');
    var ListView            = bugpack.require('carapace.ListView');
    var LoaderView          = bugpack.require('carapace.LoaderView');
    var ScrollEvent         = bugpack.require('carapace.ScrollEvent');
    var ViewBuilder         = bugpack.require('carapace.ViewBuilder');
    var JQuery              = bugpack.require('jquery.JQuery');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $                   = JQuery;
    var view                = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var ListContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.ListContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} placeholder
         */
        _constructor: function(placeholder) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Map.<CarapaceModel, CarapaceContainer>}
             */
            this.carapaceModelToCarapaceContainerMap        = new Map();


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {BoxView}
             */
            this.boxView                                    = null;

            /**
             * @private
             * @type {ListView}
             */
            this.listView                                   = null;

            /**
             * @private
             * @type {LoaderView}
             */
            this.loaderView                                 = null;

            /**
             * @private
             * @type {string}
             */
            this.placeholder                                = placeholder;

            /**
             * @private
             * @type {ListContainer.ScrollState|string}
             */
            this.scrollState                                = ListContainer.ScrollState.NO_SCROLL;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {BoxView}
         */
        getBoxView: function() {
            return this.boxView;
        },

        /**
         * @return {ListView}
         */
        getListView: function() {
            return this.listView;
        },

        /**
         * @return {LoaderView}
         */
        getLoaderView: function() {
            return this.loaderView;
        },

        /**
         * @return {ListContainer.ScrollState|string}
         */
        getScrollState: function() {
            return this.scrollState;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createContainer: function() {

            this._super();


            // Create Views
            //-------------------------------------------------------------------------------

            view(BoxView)
                .name("boxView")
                .attributes({
                    scroll: true
                })
                .children([
                    view(ListView)
                        .name("listView")
                        .appendTo("#box-body-{{cid}}")
                        .attributes({
                            placeholder: this.placeholder
                        })
                        .children([
                            view(LoaderView)
                                .name("loaderView")
                                .appendTo("#list-{{cid}}")
                                .attributes({
                                    size: LoaderView.Size.SMALL
                                })
                        ])
                ])
                .build(this);


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.boxView);
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.boxView.removeEventListener(ScrollEvent.EventType.SCROLL, this.hearScrollEvent, this);
        },

        /**
        * @protected
        */
        destroyContainer: function() {
            this._super();
            this.clearModelMap();
        },


        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.boxView.addEventListener(ScrollEvent.EventType.SCROLL, this.hearScrollEvent, this);
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {CarapaceModel} carapaceModel
         * @param {number} duration
         */
        animateScrollToCarapaceModel: function(carapaceModel, duration) {
            var carapaceContainer = this.carapaceModelToCarapaceContainerMap.get(carapaceModel);
            if (carapaceContainer) {
                var value = this.boxView.getScrollTop() + carapaceContainer.getViewTop().$el.position().top;
                this.boxView.animateScrollTo(value, duration);
            }
        },

        /**
         *
         */
        hideLoader: function() {
            this.loaderView.hide();
        },

        /**
         *
         */
        hidePlaceholder: function() {
            this.listView.hidePlaceholder();
        },

        /**
         * @param {CarapaceModel} carapaceModel
         */
        scrollToCarapaceModel: function(carapaceModel) {
            var carapaceContainer = this.carapaceModelToCarapaceContainerMap.get(carapaceModel);
            if (carapaceContainer) {
                var value = this.boxView.getScrollTop() + carapaceContainer.getViewTop().$el.position().top;
                this.boxView.scrollTo(value);
            }
        },

        /**
         *
         */
        showLoader: function() {
            this.loaderView.show();
        },

        /**
         *
         */
        showPlaceholder: function() {
            this.listView.showPlaceholder();
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        clearModelMap: function() {
            this.carapaceModelToCarapaceContainerMap.clear();
        },

        /**
         * @protected
         * @param {CarapaceModel} carapaceModel
         * @return {CarapaceContainer}
         */
        getContainerForModel: function(carapaceModel) {
            return this.carapaceModelToCarapaceContainerMap.get(carapaceModel);
        },

        /**
         * @protected
         * @param {CarapaceModel} carapaceModel
         * @return {boolean}
         */
        hasCarapaceModel: function(carapaceModel) {
            return this.carapaceModelToCarapaceContainerMap.containsKey(carapaceModel);
        },

        /**
         * @protected
         * @param {CarapaceModel} carapaceModel
         * @param {CarapaceContainer} carapaceContainer
         */
        mapModelToContainer: function(carapaceModel, carapaceContainer) {
            this.carapaceModelToCarapaceContainerMap.put(carapaceModel, carapaceContainer);
        },

        /**
         * @protected
         * @param {CarapaceModel} carapaceModel
         */
        unmapModel: function(carapaceModel) {
            this.carapaceModelToCarapaceContainerMap.remove(carapaceModel);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {number} scrollTop
         */
        calculateScrollState: function(scrollTop) {
            var scrollAreaHeight    = this.boxView.getBoxBodyElement().height();
            var listHeight          = this.listView.getListElement().height();
            if (listHeight <= scrollAreaHeight) {
                this.updateScrollState(ListContainer.ScrollState.NO_SCROLL);
            } else if (scrollTop === 0) {
                this.updateScrollState(ListContainer.ScrollState.TOP);
            } else if (scrollTop === (listHeight - scrollAreaHeight)) {
                this.updateScrollState(ListContainer.ScrollState.BOTTOM);
            } else {
                this.updateScrollState(ListContainer.ScrollState.MIDDLE);
            }
        },

        /**
         * @private
         * @param {ListContainer.ScrollState} scrollState
         */
        updateScrollState: function(scrollState) {
            if (this.scrollState !== scrollState) {
                this.scrollState = scrollState;
                this.dispatchEvent(new Event(ListContainer.EventTypes.SCROLL_STATE_CHANGE, {
                    scrollState: this.scrollState
                }));
            }
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {ScrollEvent} event
         */
        hearScrollEvent: function(event) {
            this.calculateScrollState(event.getScrollTop());
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    ListContainer.EventTypes = {
        SCROLL_STATE_CHANGE: "ListContainer:ScrollStateChange"
    };

    /**
     * @static
     * @enum {string}
     */
    ListContainer.ScrollState = {
        BOTTOM: "ScrollState:Bottom",
        MIDDLE: "ScrollState:Middle",
        NO_SCROLL: "ScrollState:NoScroll",
        TOP: "ScrollState:Top"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ListContainer", ListContainer);
});
