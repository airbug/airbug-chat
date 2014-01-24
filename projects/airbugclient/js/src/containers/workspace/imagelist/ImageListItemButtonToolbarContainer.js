//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ImageListItemButtonToolbarContainer')

//@Require('Class')
//@Require('airbug.ButtonToolbarView')
//@Require('airbug.DeleteImageButtonGroupContainer')
//@Require('airbug.SendImageButtonGroupContainer')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var ButtonToolbarView                   = bugpack.require('airbug.ButtonToolbarView');
var CarapaceContainer                   = bugpack.require('carapace.CarapaceContainer');
var DeleteImageButtonGroupContainer     = bugpack.require('airbug.DeleteImageButtonGroupContainer');
var SendImageButtonGroupContainer       = bugpack.require('airbug.SendImageButtonGroupContainer');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view                                = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ImageListItemButtonToolbarContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ButtonToolbarView}
         */
        this.buttonToolbarView                  = null;

        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {DeleteImageButtonGroupContainer}
         */
        this.deleteImageButtonGroupContainer    = null;

        /**
         * @private
         * @type {SendImageButtonGroupContainer}
         */
        this.sendImageButtonGroupContainer      = null;

    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------


        // Create Views
        //-------------------------------------------------------------------------------

        this.buttonToolbarView =
            view(ButtonToolbarView)
                .build();

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.buttonToolbarView);

    },

    createContainerChildren: function() {
        this._super();
        this.deleteImageButtonGroupContainer    = new DeleteImageButtonGroupContainer();
        this.sendImageButtonGroupContainer      = new SendImageButtonGroupContainer();

        this.addContainerChild(this.deleteImageButtonGroupContainer,    ".btn-toolbar");
        this.addContainerChild(this.sendImageButtonGroupContainer,      ".btn-toolbar");
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ImageListItemButtonToolbarContainer", ImageListItemButtonToolbarContainer);