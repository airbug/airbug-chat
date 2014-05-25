//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.PreviousMessagesLoaderContainer')

//@Require('Class')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.PreviousMessagesLoaderView')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                                   = bugpack.require('Class');
    var ButtonViewEvent                         = bugpack.require('airbug.ButtonViewEvent');
    var PreviousMessagesLoaderView              = bugpack.require('airbug.PreviousMessagesLoaderView');
    var CarapaceContainer                       = bugpack.require('carapace.CarapaceContainer');
    var ViewBuilder                             = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var view                                    = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var PreviousMessagesLoaderContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.PreviousMessagesLoaderContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {PreviousMessagesLoaderView}
             */
            this.previousMessagesLoaderView = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Extensions
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        activateContainer: function() {
            this._super();
        },

        /**
         * @protected
         */
        createContainer: function() {
            this._super();

            // Create Views
            //-------------------------------------------------------------------------------

            this.previousMessagesLoaderView =
                view(PreviousMessagesLoaderView)
                    .build();

            // Wire Up
            //-------------------------------------------------------------------------------

            this.setViewTop(this.previousMessagesLoaderView);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.PreviousMessagesLoaderContainer", PreviousMessagesLoaderContainer);
});
