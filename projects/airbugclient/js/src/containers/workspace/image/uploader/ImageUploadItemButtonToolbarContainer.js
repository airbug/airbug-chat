//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ImageUploadItemButtonToolbarContainer')

//@Require('Class')
//@Require('airbug.ButtonToolbarView')
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
var SendImageButtonGroupContainer       = bugpack.require('airbug.SendImageButtonGroupContainer');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view                                = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ImageUploadItemButtonToolbarContainer = Class.extend(CarapaceContainer, {

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
         * @type {SendImageButtonGroupContainer}
         */
        this.sendImageButtonGroupContainer      = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Methods
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

        view(ButtonToolbarView)
            .name("buttonToolbarView")
            .build(this);


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.buttonToolbarView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.sendImageButtonGroupContainer      = new SendImageButtonGroupContainer();
        this.addContainerChild(this.sendImageButtonGroupContainer,      "#button-toolbar-" + this.buttonToolbarView.getCid());
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ImageUploadItemButtonToolbarContainer", ImageUploadItemButtonToolbarContainer);
