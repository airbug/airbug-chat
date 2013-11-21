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
var WorkspaceWidgetContainer    = bugpack.require('airbug.WorkspaceContainer');
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
         * @type {WorkspaceContainer}
         */
        this.workspaceContainer = null;

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
                        .attributes({configuration: FourColumnView.Configuration.ULTRA_THIN_RIGHT_HAMBURGER_LEFT_AND_RIGHT})
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
        this.addContainerChild(this.workspaceWidgetContainer, ".column3of4");
    },

    /**
     * @protected
     */
    activateContainer: function(routingArgs) {
        this._super(routingArgs);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.initializeCommandSubscriptions();
    },

    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initializeCommandSubscriptions: function() {
        this.commandModule.subscribe(CommandType.TOGGLE.WORKSPACE,      this.handleToggleWorkspaceCommand,      this);
        this.commandModule.subscribe(CommandType.TOGGLE.HAMBURGER_LEFT, this.handleToggleHamburgerLeftCommand,  this);
    },

    /**
     * @private
     * @param {PublisherMessage} message
     */
    handleToggleWorkspaceCommand: function(message) {
        // var topic           = message.getTopic();
        // var data            = message.getData();
        var workspace       = $("#page-row-container>.column3of4");

        workspace.toggleClass("workspace-open");
        this.updateColumnSpans();
    },

    /**
     * @private
     * @param {PublisherMessage} message
     */
    handleToggleHamburgerLeftCommand: function(message) {
        // var topic           = message.getTopic();
        // var data            = message.getData();
        var hamburgerLeft   = $("#page-row-container>.column1of4");

        hamburgerLeft.toggleClass("hamburger-panel-hidden");
        this.updateColumnSpans();
    },

    /**
     * @private
     * @param {PublisherMessage} message
     */
    handleToggleHamburgerRightCommand: function(message) {
        // var topic           = message.getTopic();
        // var data            = message.getData();
        var hamburgerRight  = $("#page-row-container>.column4of4");

        hamburgerRight.toggleClass("hamburger-panel-hidden");
        this.updateColumnSpans();
    },

    /**
     * @private
     */
    updateColumnSpans: function() {
        var hamburgerLeft           = $("#page-row-container>.column1of4");
        var roomspace               = $("#page-row-container>.column2of4");
        var workspace               = $("#page-row-container>.column3of4");
        var hamburgerRight          = $("#page-row-container>.column4of4");
        var hamburgerLeftIsOpen     = !hamburgerLeft.hasClass("hamburger-panel-hidden");
        var hamburgerRightIsOpen    = !hamburgerRight.hasClass("hamburger-panel-hidden");
        var workspaceIsOpen         = workspace.hasClass("workspace-open");

        if (hamburgerLeftIsOpen && hamburgerRightIsOpen) {
            if (workspaceIsOpen) {
                roomspace.removeClass("span11 span8 span5");
                roomspace.addClass("span3");
                workspace.removeClass("span4 span1");
                workspace.addClass("span3");
            } else {
                roomspace.removeClass("span11 span8 span3");
                roomspace.addClass("span5");
                workspace.removeClass("span4 span3");
                workspace.addClass("span1");
            }
        } else if (hamburgerLeftIsOpen || hamburgerRightIsOpen) {
            if (workspaceIsOpen) {
                roomspace.removeClass("span11 span8 span3");
                roomspace.addClass("span5");
                workspace.removeClass("span3 span1");
                workspace.addClass("span4");
            } else {
                roomspace.removeClass("span11 span8 span3");
                roomspace.addClass("span8");
                workspace.removeClass("span4 span3");
                workspace.addClass("span1");
            }
        } else {
            if (workspaceIsOpen) {
                roomspace.removeClass("span11 span5 span3");
                roomspace.addClass("span8");
                workspace.removeClass("span3 span1");
                workspace.addClass("span 4");
            } else {
                roomspace.removeClass("span8 span5 span3");
                roomspace.addClass("span11");
                workspace.removeClass("span4 span3");
                workspace.addClass("span1");
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
