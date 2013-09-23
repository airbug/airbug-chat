//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('PageContainer')

//@Require('Class')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.PageView')
//@Require('airbug.FourColumnView')
//@Require('airbug.WorkspaceWidgetContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var ApplicationContainer        = bugpack.require('airbug.ApplicationContainer');
var FourColumnView              = bugpack.require('airbug.FourColumnView');
var PageView                    = bugpack.require('airbug.PageView');
var WorkspaceWidgetContainer    = bugpack.require('airbug.WorkspaceContainer');
var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PageContainer = Class.extend(ApplicationContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {airbug.WorkspaceContainer}
         */
        this.workspaceContainer = null;

        // Views
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {airbug.PageView}
         */
        this.pageView           = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Views
        //-------------------------------------------------------------------------------

        this.pageView =
            view(PageView)
                .children([
                    view(FourColumnView)
                        .attributes({configuration: FourColumnView.Configuration.EXTRA_THIN_RIGHT_HAMBURGER_LEFT_AND_RIGHT})
                ])
                .build();

        this.applicationView.addViewChild(this.pageView, "#application-" + this.applicationView.cid);

    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.workspaceWidgetContainer = new WorkspaceWidgetContainer();
        this.addContainerChild(this.workspaceContainer, ".column3of4");
    },

    activateContainer: function(routingArgs){
        this._super(routingArgs);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.workspaceWidgetContainer.getViewTop().addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearWorkspaceTrayButtonClick, this);
    },

    /**
     * @param {airbug.ButtonViewEvent} event
     */
    hearWorkspaceTrayButtonClick: function(event){
        
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.PageContainer", PageContainer);
