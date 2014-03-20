//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('PageContainer')

//@Require('Class')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.CommandModule')
//@Require('airbug.FourColumnView')
//@Require('airbug.MultiColumnView')
//@Require('airbug.PageView')
//@Require('airbug.WorkspaceEvent')
//@Require('airbug.WorkspaceTrayContainer')
//@Require('airbug.WorkspaceWrapperContainer')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var ApplicationContainer        = bugpack.require('airbug.ApplicationContainer');
var CommandModule               = bugpack.require('airbug.CommandModule');
var FourColumnView              = bugpack.require('airbug.FourColumnView');
var MultiColumnView             = bugpack.require('airbug.MultiColumnView');
var PageView                    = bugpack.require('airbug.PageView');
var WorkspaceEvent              = bugpack.require('airbug.WorkspaceEvent');
var WorkspaceTrayContainer      = bugpack.require('airbug.WorkspaceTrayContainer');
var WorkspaceWrapperContainer   = bugpack.require('airbug.WorkspaceWrapperContainer');
var AutowiredAnnotation         = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                   = AutowiredAnnotation.autowired;
var bugmeta                     = BugMeta.context();
var CommandType                 = CommandModule.CommandType;
var property                    = PropertyAnnotation.property;
var view                        = ViewBuilder.view;


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

        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CommandModule}
         */
        this.commandModule              = null;

        /**
         * @private
         * @type {WorkspaceModule}
         */
        this.workspaceModule            = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {WorkspaceTrayContainer}
         */
        this.workspaceTrayContainer     = null;

        /**
         * @private
         * @type {WorkspaceWrapperContainer}
         */
        this.workspaceWrapperContainer  = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {FourColumnView}
         */
        this.fourColumnView             = null;

        /**
         * @private
         * @type {PageView}
         */
        this.pageView                   = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        this._super(routerArgs);
        this.updateColumnSpans();
    },

    /**
     * @protected
     */
    createContainer: function(routingArgs) {
        this._super(routingArgs);

        // Create Views
        //-------------------------------------------------------------------------------

        view(PageView)
            .name("pageView")
            .children([
                view(FourColumnView)
                    .name("fourColumnView")
                    .id("page-row-container")
                    .attributes({
                        configuration: FourColumnView.Configuration.ULTRA_THIN_RIGHT_HAMBURGER_LEFT,
                        rowStyle: MultiColumnView.RowStyle.FLUID
                    })
            ])
            .build(this);

        this.getApplicationView().addViewChild(this.pageView, "#application-{{cid}}");
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.workspaceTrayContainer     = new WorkspaceTrayContainer();
        this.addContainerChild(this.workspaceTrayContainer, ".column4of4");
        this.workspaceWrapperContainer   = new WorkspaceWrapperContainer();
        this.addContainerChild(this.workspaceWrapperContainer, ".column3of4");
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.deinitializeEventListeners();
        this.deinitializeCommandSubscriptions();
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.initializeEventListeners();
        this.initializeCommandSubscriptions();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    deinitializeCommandSubscriptions: function() {
        this.commandModule.unsubscribe(CommandType.TOGGLE.HAMBURGER_LEFT,  this.handleToggleHamburgerLeftCommand,  this);
    },

    /**
     * @private
     */
    deinitializeEventListeners: function() {
        this.workspaceModule.removeEventListener(WorkspaceEvent.EventType.CLOSED, this.hearWorkspaceClosed, this);
        this.workspaceModule.removeEventListener(WorkspaceEvent.EventType.OPENED, this.hearWorkspaceOpened, this);
    },

    /**
     * @private
     */
    initializeCommandSubscriptions: function() {
        this.commandModule.subscribe(CommandType.TOGGLE.HAMBURGER_LEFT,  this.handleToggleHamburgerLeftCommand, this);
    },

    /**
     * @private
     */
    initializeEventListeners: function() {
        this.workspaceModule.addEventListener(WorkspaceEvent.EventType.CLOSED, this.hearWorkspaceClosed, this);
        this.workspaceModule.addEventListener(WorkspaceEvent.EventType.OPENED, this.hearWorkspaceOpened, this);
    },

    /**
     * @private
     * @param {PublisherMessage} message
     */
    handleToggleHamburgerLeftCommand: function(message) {
        var hamburgerLeft   = this.viewTop.$el.find("#page-row-container>.column1of4");
        hamburgerLeft.toggleClass("hamburger-panel-hidden");
        this.updateColumnSpans();
    },

    /**
     * @private
     * @param {PublisherMessage} message
     */
    handleToggleHamburgerRightCommand: function(message) {
        var hamburgerRight  = this.viewTop.$el.find("#page-row-container>.column4of4");
        hamburgerRight.toggleClass("hamburger-panel-hidden");
        this.updateColumnSpans();
    },

    /**
     * @private
     */
    updateColumnSpans: function() {
        var hamburgerLeft           = this.viewTop.$el.find("#page-row-container>.column1of4");
        var roomspace               = this.viewTop.$el.find("#page-row-container>.column2of4");
        var workspace               = this.viewTop.$el.find("#page-row-container>.column3of4");
        var hamburgerLeftIsOpen     = !hamburgerLeft.hasClass("hamburger-panel-hidden");
        var workspaceIsOpen         = this.workspaceModule.isOpen();

        if (hamburgerLeftIsOpen) {
            if (workspaceIsOpen) {
                roomspace.removeClass("span11 span9 span8 span6");
                workspace.removeClass("span3 span0");
                roomspace.addClass("span6");
                workspace.addClass("span3");
            } else {
                roomspace.removeClass("span11 span9  span8 span6");
                workspace.removeClass("span3 span0");
                roomspace.addClass("span9");
                workspace.addClass("span0");
            }
        } else {
            if (workspaceIsOpen) {
                roomspace.removeClass("span11 span9 span8 span6");
                workspace.removeClass("span3 span0");
                roomspace.addClass("span8");
                workspace.addClass("span3");
            } else {
                roomspace.removeClass("span11 span9 span8 span6");
                workspace.removeClass("span3 span0");
                roomspace.addClass("span11");
                workspace.addClass("span0");
            }
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearWorkspaceClosed: function(event) {
        this.updateColumnSpans();
    },

    /**
     * @private
     * @param {Event} event
     */
    hearWorkspaceOpened: function(event) {
        this.updateColumnSpans();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(PageContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule"),
        property("workspaceModule").ref("workspaceModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.PageContainer", PageContainer);
