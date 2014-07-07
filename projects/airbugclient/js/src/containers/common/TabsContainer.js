//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.TabsContainer')

//@Require('Class')
//@Require('carapace.TabsView')
//@Require('carapace.TabView')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var TabsView                = bugpack.require('carapace.TabsView');
    var TabView                 = bugpack.require('carapace.TabView');
    var CarapaceContainer       = bugpack.require('carapace.CarapaceContainer');
    var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var view                    = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var TabsContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.TabsContainer",


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
            this.tabs           = tabs;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {TabsView}
             */
            this.tabsView       = null;
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
});
