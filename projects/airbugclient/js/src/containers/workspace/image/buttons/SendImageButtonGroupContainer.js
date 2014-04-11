//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.SendImageButtonGroupContainer')

//@Require('Class')
//@Require('airbug.ButtonGroupView')
//@Require('airbug.SendImageNakedButtonContainer')
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
var SendImageNakedButtonContainer       = bugpack.require('airbug.SendImageNakedButtonContainer');
var CarapaceContainer                   = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view                                = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SendImageButtonGroupContainer = Class.extend(CarapaceContainer, {

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
         * @type {SendImageNakedButtonContainer}
         */
        this.sendImageNakedButtonContainer = null;

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
        this.sendImageNakedButtonContainer = new SendImageNakedButtonContainer();
        this.addContainerChild(this.sendImageNakedButtonContainer, ".btn-group");
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.SendImageButtonGroupContainer", SendImageButtonGroupContainer);
