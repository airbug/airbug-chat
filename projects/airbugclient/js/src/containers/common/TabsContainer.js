//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.TabsContainer')

//@Require('Class')
//@Require('airbug.TabsView')
//@Require('airbug.TabView')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var TabsView                = bugpack.require('airbug.TabsView');
var TabView                 = bugpack.require('airbug.TabView');
var CarapaceContainer       = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {CarapaceContainer}
 */
var TabsContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(tabs) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Array.<{container: CarapaceContainer, text: string}>}
         */
        this.tabs         = tabs;

        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {TabsView}
         */
        this.tabsView = null;

        // Modules
        //-------------------------------------------------------------------------------

    },

    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    activateContainer: function() {
        $(this.getViewTop().getId()).tabs();
    },

    createContainer: function() {
        this._super();


        // Create Views
        //-------------------------------------------------------------------------------

        view(TabsView)
            .name("tabsView")
            .build(this);


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.tabsView);

    },

    createContainerChildren: function() {
        console.log("TabsContainer#createContainerChildren");
        var _this = this;
        this._super();

        this.tabs.forEach(function(tab){
            console.log("TabsContainer#createContainerChildren for each add container child");

            _this.addContainerChild(tab.container);
            console.log("container id:", tab.container.getViewTop().getId());
            var tabView = view(TabView)
                .attributes({
                    href: tab.container.getViewTop().getId(),
                    text: tab.text
                })
                .build();

            console.log("TabsContainer#createContainerChildren for each add view child");

            _this.getViewTop().addViewChild(tabView, "ul");

        });
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.deinitializeEventListeners();
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.initializeEventListeners();
    },

    /**
     * @protected
     */
    deinitializeEventListeners: function() {

    },

    /**
     * @protected
     */
    initializeEventListeners: function() {

    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.TabsContainer", TabsContainer);
