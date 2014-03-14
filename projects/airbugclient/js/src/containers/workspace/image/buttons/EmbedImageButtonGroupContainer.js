//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('EmbedImageButtonGroupContainer')

//@Require('Class')
//@Require('airbug.ButtonGroupView')
//@Require('airbug.EmbedImageNakedButtonContainer')
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
var ButtonGroupView                     = bugpack.require('airbug.ButtonGroupView');
var EmbedImageNakedButtonContainer      = bugpack.require('airbug.EmbedImageNakedButtonContainer');
var CarapaceContainer                   = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view                                = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EmbedImageButtonGroupContainer = Class.extend(CarapaceContainer, {

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
         * @type {ButtonGroupView}
         */
        this.buttonGroupView        = null;

        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {EmbedImageNakedButtonContainer}
         */
        this.embedImageNakedButtonContainer = null;

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

        this.buttonGroupView =
            view(ButtonGroupView)
                .build();

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.buttonGroupView);

    },

    createContainerChildren: function() {
        this._super();
        this.embedImageNakedButtonContainer = new EmbedImageNakedButtonContainer();
        this.addContainerChild(this.embedImageNakedButtonContainer, ".btn-group");
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.EmbedImageButtonGroupContainer", EmbedImageButtonGroupContainer);
