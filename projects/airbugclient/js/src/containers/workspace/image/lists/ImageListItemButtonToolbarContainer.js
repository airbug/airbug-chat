//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ImageListItemButtonToolbarContainer')

//@Require('Class')
//@Require('airbug.ButtonToolbarView')
//@Require('airbug.DeleteImageButtonGroupContainer')
//@Require('airbug.EmbedImageButtonGroupContainer')
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
var EmbedImageButtonGroupContainer      = bugpack.require('airbug.EmbedImageButtonGroupContainer');
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
        // Private Properties
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
         * @type {EmbedImageButtonGroupContainer}
         */
        this.embedImageButtonGroupContainer      = null;

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
        this.deleteImageButtonGroupContainer    = new DeleteImageButtonGroupContainer();
        this.embedImageButtonGroupContainer     = new EmbedImageButtonGroupContainer();
        this.sendImageButtonGroupContainer      = new SendImageButtonGroupContainer();

        this.addContainerChild(this.deleteImageButtonGroupContainer,    "#button-toolbar-" + this.buttonToolbarView.getCid());
        this.addContainerChild(this.embedImageButtonGroupContainer,     "#button-toolbar-" + this.buttonToolbarView.getCid());
        this.addContainerChild(this.sendImageButtonGroupContainer,      "#button-toolbar-" + this.buttonToolbarView.getCid());
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ImageListItemButtonToolbarContainer", ImageListItemButtonToolbarContainer);
