//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.DeleteImageButtonGroupContainer')

//@Require('Class')
//@Require('airbug.ButtonGroupView')
//@Require('airbug.DeleteImageNakedButtonContainer')
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
var DeleteImageNakedButtonContainer     = bugpack.require('airbug.DeleteImageNakedButtonContainer');
var CarapaceContainer                   = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view                                = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var DeleteImageButtonGroupContainer = Class.extend(CarapaceContainer, {

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
         * @type {ButtonGroupView}
         */
        this.buttonGroupView        = null;

        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {DeleteImageNakedButtonContainer}
         */
        this.deleteImageNakedButtonContainer = null;

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
        this.deleteImageNakedButtonContainer = new DeleteImageNakedButtonContainer();
        this.addContainerChild(this.deleteImageNakedButtonContainer, ".btn-group");
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.DeleteImageButtonGroupContainer", DeleteImageButtonGroupContainer);
