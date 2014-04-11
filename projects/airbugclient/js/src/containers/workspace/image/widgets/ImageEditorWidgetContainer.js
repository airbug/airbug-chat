//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ImageEditorWidgetContainer')

//@Require('Class')
//@Require('airbug.BoxView')
//@Require('airbug.CommandModule')
//@Require('airbug.ImageEditorContainer')
//@Require('airbug.WorkspaceWidgetContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var BoxView                             = bugpack.require('airbug.BoxView');
var CommandModule                       = bugpack.require('airbug.CommandModule');
var ImageEditorContainer                = bugpack.require('airbug.ImageEditorContainer');
var WorkspaceWidgetContainer            = bugpack.require('airbug.WorkspaceWidgetContainer');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var CommandType                         = CommandModule.CommandType;
var view                                = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {WorkspaceWidgetContainer}
 */
var ImageEditorWidgetContainer = Class.extend(WorkspaceWidgetContainer, {

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
         * @type {BoxView}
         */
        this.boxView                    = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ImageEditorContainer}
         */
        this.imageEditorContainer       = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Views
        //-------------------------------------------------------------------------------

        view(BoxView)
            .name("boxView")
            .build(this);


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.boxView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.imageEditorContainer     = new ImageEditorContainer();
        this.addContainerChild(this.imageEditorContainer, "#box-" + this.boxView.getCid());
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ImageEditorWidgetContainer", ImageEditorWidgetContainer);
