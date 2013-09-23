//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('WorkspaceContainer')

//@Require('Class')
//@Require('airbug.BoxWithHeaderAndFooterView')
//@Require('airbug.CodeEditorPanelContainer')
//@Require('airbug.PanelWithHeaderView')
//@Require('airbug.TextView')
//@Require('airbug.TrayIconView')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
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
var BoxWithHeaderAndFooterView  = bugpack.require('airbug.BoxWithHeaderAndFooterView');
var CodeEditorPanelContainer    = bugpack.require('airbug.CodeEditorPanelContainer');
var PanelWithHeaderView         = bugpack.require('airbug.PanelWithHeaderView');
var TextView                    = bugpack.require('airbug.TextView');
var TrayIconView                = bugpack.require('airbug.TrayIconView');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation         = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
var CarapaceContainer           = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta     = BugMeta.context();
var autowired   = AutowiredAnnotation.autowired;
var property    = PropertyAnnotation.property;
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
         * @type {airbug.CodeEditorPanelContainer}
         */
        this.codeEditorPanelContainer   = null;

    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        var _this = this;
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
        view(PanelWithHeaderView)
            .attributes({headerTitle: "Workspace"})
            .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.panelView);
    },

    createContainerChildren: function() {
        this.super();
        this.codeEditorPanelContainer = new CodeEditorPanelContainer();
        this.addContainerChild(this.codeEditorPanelContainer, "");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.listView.addEventListener(ListViewEvent.EventType.ITEM_SELECTED, this.hearListViewItemSelectedEvent, this);
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

// bugmeta.annotate(RoomListPanelContainer).with(
//     autowired().properties([
//         property("currentUserManagerModule").ref("currentUserManagerModule"),
//         property("navigationModule").ref("navigationModule"),
//         property("roomManagerModule").ref("roomManagerModule")
//     ])
// );


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.WorkspaceContainer", WorkspaceContainer);
