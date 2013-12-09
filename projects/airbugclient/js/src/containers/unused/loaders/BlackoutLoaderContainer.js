//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('BlackoutLoaderContainer')

//@Require('Class')
//@Require('airbug.BlackoutLoaderView')
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
var BlackoutLoaderView      = bugpack.require('airbug.BlackoutLoaderView');
var CarapaceContainer       = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BlackoutLoaderContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Modules
        //-------------------------------------------------------------------------------


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {airbug.BlackoutLoaderView}
         */
        this.blackoutLoaderView       = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Views
        //-------------------------------------------------------------------------------

        this.blackoutLoaderView =
            view(BlackoutLoaderView)
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.blackoutLoaderView);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
    },

    /**
     * @protected
     */
    activateContainer: function() {
        this._super();
    }


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.BlackoutLoaderContainer", BlackoutLoaderContainer);
