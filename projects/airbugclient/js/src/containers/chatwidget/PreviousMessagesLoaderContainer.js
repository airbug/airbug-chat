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
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


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

var view        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PreviousMessagesLoaderContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------


        // Modules
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

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.previousMessagesLoaderView);
    }


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------


});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.PreviousMessagesLoaderContainer", PreviousMessagesLoaderContainer);
