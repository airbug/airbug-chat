//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ListContainer')

//@Require('Class')
//@Require('Event')
//@Require('Map')
//@Require('airbug.BoxView')
//@Require('airbug.ListView')
//@Require('airbug.ListItemView')
//@Require('airbug.LoaderView')
//@Require('airbug.ScrollEvent')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')
//@Require('jquery.JQuery')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {});


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Event                           = bugpack.require('Event');
var Map                             = bugpack.require('Map');
var RemoveChange                    = bugpack.require('RemoveChange');
var BoxView                         = bugpack.require('airbug.BoxView');
var ListView                        = bugpack.require('airbug.ListView');
var ListItemView                    = bugpack.require('airbug.ListItemView');
var LoaderView                      = bugpack.require('airbug.LoaderView');
var ScrollEvent                     = bugpack.require('airbug.ScrollEvent');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');
var JQuery                          = bugpack.require('jquery.JQuery');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $                               = JQuery;
var view                            = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {CarapaceContainer}
 */
var ListContainer = Class.extend(CarapaceContainer, {

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
                    .appendTo("#box-{{cid}}")
                    .attributes({
                        placeholder: this.placeholder
                    })
                    .children([
                        view(LoaderView)
                            .name("loaderView")
                            .attributes({
                                size: LoaderView.Size.SMALL
                            })
                            .appendTo("#list-{{cid}}")
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
            var value = this.boxView.getBoxElement().scrollTop() + carapaceContainer.getViewTop().$el.position().top;
            this.boxView.getBoxElement().animate({
                scrollTop: value
            }, {
                duration: duration
            });
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
            var value = this.boxView.getBoxElement().scrollTop() + carapaceContainer.getViewTop().$el.position().top;
            this.boxView.getBoxElement().scrollTop(value);
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
        var scrollAreaHeight    = this.boxView.getBoxElement().height();
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
