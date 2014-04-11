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

    /**
     * @constructs
     * @param {Array.<{container: CarapaceContainer, text: string}>} tabs
     */
    _constructor: function(tabs) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
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
    },

    //-------------------------------------------------------------------------------
    // CarapaceContainer Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    activateContainer: function() {
        this._super();
        $(this.getViewTop().getId()).tabs();
    },

    /**
     * @protected
     */
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

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();

        var _this = this;
        this.tabs.forEach(function(tab){
            _this.addContainerChild(tab.container);
            var tabView = view(TabView)
                .attributes({
                    href: tab.container.getViewTop().getId(),
                    text: tab.text
                })
                .build();
            _this.getViewTop().addViewChild(tabView, "ul");
        });
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.TabsContainer", TabsContainer);
