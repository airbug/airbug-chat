//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('WorkspaceWidgetContainer')

//@Require('Class')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.PanelView')
//@Require('airbug.TwoColumnView')
//@Require('airbug.WorkspaceContainer')
//@Require('airbug.WorkspaceTrayContainer')
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
var ButtonViewEvent             = bugpack.require('airbug.ButtonViewEvent');
var PanelView                   = bugpack.require('airbug.PanelView');
var TwoColumnView               = bugpack.require('airbug.TwoColumnView');
var WorkspaceContainer          = bugpack.require('airbug.WorkspaceContainer');
var WorkspaceTrayContainer      = bugpack.require('airbug.WorkspaceTrayContainer');
var CarapaceContainer           = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var WorkspaceWidgetContainer = Class.extend(CarapaceContainer, {

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
         * @type {airbug.WorkspaceContainer}
         */
        this.workspaceContainer         = null;

        /**
         * @private
         * @type {airbug.WorkspaceTrayContainer}
         */
        this.workspaceTrayContainer     = null;

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
                        rowStyle:       TwoColumnView.RowStyle.FLUID,
                        configuration:  TwoColumnView.Configuration.HIDE_LEFT})
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.panelView);
    },

    /**
     *
     */
    createContainerChildren: function() {
        this.super();
        this.workspaceContainer         = new WorkspaceContainer();
        this.workspaceTrayContainer     = new WorkspaceTrayContainer();
        this.addContainerChild(this.workspaceContainer,         ".column1of2");
        this.addContainerChild(this.workspaceTrayContainer,     ".column2of2");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.workspaceTrayContainer.getViewTop().addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearWorkspaceTrayButtonClick, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @param {airbug.ButtonViewEvent} event
     * NOTE event.data @type {{buttonName: string}}
     */
    hearWorkspaceTrayButtonClick: function(event){
        this.viewTop.dispatchEvent(event);

        var data        = event.getData();
        var buttonName  = data.buttonName;
        var column1     = this.viewTop.$el(".column1of2");
        var column2     = this.viewTop.$el(".column2of2");
        column2.toggleClass("span12 span3");
        column1.toggleClass("span0 span9");
        var workspacePanel  = this.workspaceContainer.getViewTop();
        var 
        switch(buttonName){
            case "":
                break;
            case "":
                break;
        }
    }

});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.WorkspaceWidgetContainer", WorkspaceWidgetContainer);
