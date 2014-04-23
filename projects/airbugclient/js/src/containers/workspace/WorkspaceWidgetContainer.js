//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.WorkspaceWidgetContainer')

//@Require('Class')
//@Require('carapace.CarapaceContainer')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var WorkspaceWidgetContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.WorkspaceWidgetContainer",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        hideWidget: function() {
            this.getViewTop().hide();
        },

        /**
         *
         */
        showWidget: function() {
            this.getViewTop().show();
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.WorkspaceWidgetContainer", WorkspaceWidgetContainer);
});
