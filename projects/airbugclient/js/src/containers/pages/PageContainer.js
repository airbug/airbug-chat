//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('PageContainer')

//@Require('Class')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.CommandModule')
//@Require('airbug.PageView')
//@Require('airbug.FourColumnView')
//@Require('airbug.WorkspaceTrayContainer')
//@Require('airbug.WorkspaceWidgetContainer')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
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
var CommandModule               = bugpack.require('airbug.CommandModule');
var FourColumnView              = bugpack.require('airbug.FourColumnView');
var PageView                    = bugpack.require('airbug.PageView');
var WorkspaceTrayContainer      = bugpack.require('airbug.WorkspaceTrayContainer');
var WorkspaceWidgetContainer    = bugpack.require('airbug.WorkspaceWidgetContainer');
var AutowiredAnnotation         = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired   = AutowiredAnnotation.autowired;
var bugmeta     = BugMeta.context();
var CommandType = CommandModule.CommandType;
var property    = PropertyAnnotation.property;
var view        = ViewBuilder.view;


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
         * @type {CommandModule}
         */
        this.commandModule      = null;

        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {WorkspaceTrayContainer}
         */
        this.workspaceTrayContainer     = null;

        /**
         * @protected
         * @type {WorkspaceWidgetContainer}
         */
        this.workspaceWidgetContainer   = null;

        // Views
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {PageView}
         */
        this.pageView           = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function(routingArgs) {
        this._super(routingArgs);

        // Create Views
        //-------------------------------------------------------------------------------

        this.pageView =
            view(PageView)
                .children([
                    view(FourColumnView)
                        .id("page-row-container")
                        .attributes({configuration: FourColumnView.Configuration.ULTRA_THIN_RIGHT_HAMBURGER_LEFT})
                ])
                .build();

        this.bodyView.addViewChild(this.pageView, "#application-" + this.applicationView.cid);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.workspaceTrayContainer     = new WorkspaceTrayContainer();
        this.addContainerChild(this.workspaceTrayContainer, ".column4of4");
        this.workspaceWidgetContainer   = new WorkspaceWidgetContainer();
        this.addContainerChild(this.workspaceWidgetContainer, ".column3of4");
    },

    /**
     * @protected
     */
    activateContainer: function(routingArgs) {
        this._super(routingArgs);
        this.viewTop.$el.find("#page-row-container>.column3of4").removeClass("span3").hide();
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.initializeEventListeners();
        this.initializeCommandSubscriptions();
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.deinitializeEventListeners();
        this.deinitializeCommandSubscriptions();
    },

    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------

    initializeEventListeners: function() {

    },

    deinitializeEventListeners: function() {

    },

    /**
     * @private
     */
    initializeCommandSubscriptions: function() {
        this.commandModule.subscribe(CommandType.HIDE.WORKSPACE,         this.handleHideWorkspaceCommand,       this);
        this.commandModule.subscribe(CommandType.TOGGLE.WORKSPACE,       this.handleToggleWorkspaceCommand,     this);
        this.commandModule.subscribe(CommandType.TOGGLE.HAMBURGER_LEFT,  this.handleToggleHamburgerLeftCommand, this);
    },

    deinitializeCommandSubscriptions: function() {
        this.commandModule.unsubscribe(CommandType.HIDE.WORKSPACE,         this.handleHideWorkspaceCommand,        this);
        this.commandModule.unsubscribe(CommandType.TOGGLE.WORKSPACE,       this.handleToggleWorkspaceCommand,      this);
        this.commandModule.unsubscribe(CommandType.TOGGLE.HAMBURGER_LEFT,  this.handleToggleHamburgerLeftCommand,  this);
    },

    /**
     * @private
     * @param {PublisherMessage} message
     */
    handleToggleWorkspaceCommand: function(message) {
        /* source is the css style id of the button */
        var source = message.getData().source;
        var workspace               = this.viewTop.$el.find("#page-row-container>.column3of4");
        var workspaceWidgetIsOpen   = workspace.hasClass("workspace-open");
        var codeEditorWidgetIsOpen  = this.viewTop.$el.find("#code-editor-workspace").hasClass("workspace-widget-open");
        var imageEditorWidgetIsOpen = this.viewTop.$el.find("#image-editor-widget").hasClass("workspace-widget-open");

        if(workspaceWidgetIsOpen){
            if((source === "#code-editor-button" && codeEditorWidgetIsOpen) || (source === "#image-editor-button" && imageEditorWidgetIsOpen)) {
                workspace.toggleClass("workspace-open");
            }
        } else {
            workspace.toggleClass("workspace-open");
        }

        if(workspace.hasClass("workspace-open")){
            workspace.show();
        } else {
            workspace.hide();
        }
        this.updateColumnSpans();
    },

    /**
     * @private
     * @param {PublisherMessage} message
     */
    handleHideWorkspaceCommand: function(message) {
        var workspace       = this.viewTop.$el.find("#page-row-container>.column3of4");
        workspace.removeClass("workspace-open span3").hide();
        this.updateColumnSpans();
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
        var workspaceIsOpen         = workspace.hasClass("workspace-open");

        if (hamburgerLeftIsOpen) {
            if (workspaceIsOpen) {
                roomspace.removeClass("span11 span8 span5");
                roomspace.addClass("span5");
                workspace.addClass("span3");
            } else {
                roomspace.removeClass("span11 span8 span5");
                roomspace.addClass("span8");
                workspace.removeClass("span3");
            }
        } else {
            if (workspaceIsOpen) {
                roomspace.removeClass("span11 span8 span5");
                roomspace.addClass("span8");
                workspace.addClass("span3");
            } else {
                roomspace.removeClass("span11 span8 span5");
                roomspace.addClass("span11");
                workspace.removeClass("span3");
            }
        }
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(PageContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule")
    ])
);

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.PageContainer", PageContainer);
