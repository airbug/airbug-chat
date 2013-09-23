//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('WorkspaceContainer')

//@Require('Class')
//@Require('airbug.PanelView')
//@Require('airbug.TwoColumnView')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var CodeEditorWidgetContainer   = bugpack.require('airbug.CodeEditorWidgetContainer');
var PanelView                   = bugpack.require('airbug.PanelView');
var TwoColumnView               = bugpack.require('airbug.TwoColumnView');
var CarapaceContainer           = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var WorkspaceContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Models
        //-------------------------------------------------------------------------------


        // Modules
        //-------------------------------------------------------------------------------


        // Views
        //-------------------------------------------------------------------------------


        /**
         * @private
         * @type {airbug.PanelView}
         */
        this.panelView                  = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {airbug.CodeEditorWidgetContainer}
         */
        this.codeEditorWidgetContainer    = null;

        /**
         * @private
         * @type {airbug.PictureEditorWidgetContainer}
         */
        this.pictureEditorWidgetContainer = null;

    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        this._super(routerArgs);

    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------


        // Create Views
        //-------------------------------------------------------------------------------

        this.panelView =
            view(PanelView)
                .children([
                    view(TwoColumnView)
                        .attributes({
                            rowStyle: TwoColumnView.RowStyle.FLUID,
                            configuration: TwoColumnView.Configuration.HIDE_RIGHT
                        })
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.panelView);
    },

    createContainerChildren: function() {
        this.super();
        this.codeEditorWidgetContainer      = new CodeEditorWidgetContainer();
        this.addContainerChild(this.codeEditorWidgetContainer,  ".column1of2");
        //TODO
        // this.pictureEditorWidgetContainer   = new PictureEditorWidgetContainer();
        // this.addContainerChild(this.pictureEditorWidgetContainer, ".column2of2");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
    }


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------


});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.WorkspaceContainer", WorkspaceContainer);
