//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CodeEditorWidgetContainer')

//@Require('Class')
//@Require('airbug.CodeEditorContainer')
//@Require('airbug.CodeEditorSettingsContainer')
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

var Class                               = bugpack.require('Class');
var CodeEditorContainer                 = bugpack.require('airbug.CodeEditorContainer');
var CodeEditorSettingsContainer         = bugpack.require('airbug.CodeEditorSettingsContainer');
var PanelView                           = bugpack.require('airbug.PanelView');
var TwoColumnView                       = bugpack.require('airbug.TwoColumnView');
var CarapaceContainer                   = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CodeEditorWidgetContainer = Class.extend(CarapaceContainer, {

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
        this.panelView                      = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {airbug.CodeEditorContainer}
         */
        this.codeEditorContainer            = null;

        /**
         * @private
         * @type {airbug.CodeEditorSettingsContainer}
         */
        this.codeEditorSettingsContainer    = null;

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
                            rowStyle: MultiColumnView.RowStyle.FLUID,
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
        this.codeEditorContainer            = new CodeEditorContainer();
        this.codeEditorSettingsContainer    = new CodeEditorSettingsContainer();
        this.addContainerChild(this.codeEditorContainer,            ".column1of2");
        this.addContainerChild(this.codeEditorSettingsContainer,    ".column2of2");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ListViewEvent} event
     */
    hearListViewItemSelectedEvent: function(event) {

    },

    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------


});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CodeEditorWidgetContainer", CodeEditorWidgetContainer);
