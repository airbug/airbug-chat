//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ListContainer')

//@Require('Class')
//@Require('Event')
//@Require('Map')
//@Require('airbug.ListView')
//@Require('airbug.ListItemView')
//@Require('airbug.LoaderView')
//@Require('airbug.PanelView')
//@Require('airbug.ScrollEvent')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')
//@Require('jquery.JQuery')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Event                           = bugpack.require('Event');
var Map                             = bugpack.require('Map');
var RemoveChange                    = bugpack.require('RemoveChange');
var ListView                        = bugpack.require('airbug.ListView');
var ListItemView                    = bugpack.require('airbug.ListItemView');
var LoaderView                      = bugpack.require('airbug.LoaderView');
var PanelView                       = bugpack.require('airbug.PanelView');
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
        // Declare Variables
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
         * @type {PanelView}
         */
        this.panelView                                  = null;

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
     * @return {PanelView}
     */
    getPanelView: function() {
        return this.panelView;
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

        view(PanelView)
            .name("panelView")
            .children([
                view(ListView)
                    .name("listView")
                    .appendTo("#panel-body-{{cid}}")
                    .attributes({
                        placeholder: this.placeholder
                    })
                    .children([
                        view(LoaderView)
                            .name("loaderView")
                            .attributes({
                                size: LoaderView.Size.MEDIUM
                            })
                            .appendTo("#list-{{cid}}")
                    ])
            ])
            .build(this);


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.panelView);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.panelView.addEventListener(ScrollEvent.EventType.SCROLL, this.hearScrollEvent, this);
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.panelView.removeEventListener(ScrollEvent.EventType.SCROLL, this.hearScrollEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    // NOTE BRN: We don't do this by chat message Id because ChatMessageModels can be added to the container before they
    // ever have an ID (when they're being sent)

    /**
     * @param {CarapaceModel} carapaceModel
     * @param {number} duration
     */
    animateScrollToCarapaceModel: function(carapaceModel, duration) {
        var carapaceContainer = this.carapaceModelToCarapaceContainerMap.get(carapaceModel);
        if (carapaceContainer) {
            var value = this.panelView.getPanelBodyElement().scrollTop() + carapaceContainer.getViewTop().$el.position().top;
            this.panelView.getPanelBodyElement().animate({
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
            var value = this.panelView.getPanelBodyElement().scrollTop() + carapaceContainer.getViewTop().$el.position().top;
            this.panelView.getPanelBodyElement().scrollTop(value);
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
     *
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
        var panelBodyHeight = this.panelView.getPanelBodyElement().height();
        var listHeight      = this.listView.getListElement().height();
        if (listHeight <= panelBodyHeight) {
            this.updateScrollState(ListContainer.ScrollState.NO_SCROLL);
        } else if (scrollTop === 0) {
            this.updateScrollState(ListContainer.ScrollState.TOP);
        } else if (scrollTop === (listHeight - panelBodyHeight)) {
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
