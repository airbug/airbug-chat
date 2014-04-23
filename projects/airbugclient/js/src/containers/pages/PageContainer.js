//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.PageContainer')

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
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

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

    /**
     * @class
     * @extends {ApplicationContainer}
     */
    var PageContainer = Class.extend(ApplicationContainer, {

        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
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
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {FourColumnView}
         */
        getFourColumnView: function() {
            return this.fourColumnView;
        },

        /**
         * @return {PageView}
         */
        getPageView: function() {
            return this.pageView;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
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
            this.addContainerChild(this.workspaceTrayContainer, "#column4of4-" + this.fourColumnView.getCid());
            this.workspaceWrapperContainer   = new WorkspaceWrapperContainer();
            this.addContainerChild(this.workspaceWrapperContainer, "#column3of4-" + this.fourColumnView.getCid());
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.commandModule.unsubscribe(CommandType.TOGGLE.HAMBURGER_LEFT,  this.handleToggleHamburgerLeftCommand,  this);
            this.workspaceModule.removeEventListener(WorkspaceEvent.EventType.CLOSED, this.hearWorkspaceClosed, this);
            this.workspaceModule.removeEventListener(WorkspaceEvent.EventType.OPENED, this.hearWorkspaceOpened, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.commandModule.subscribe(CommandType.TOGGLE.HAMBURGER_LEFT,  this.handleToggleHamburgerLeftCommand, this);
            this.workspaceModule.addEventListener(WorkspaceEvent.EventType.CLOSED, this.hearWorkspaceClosed, this);
            this.workspaceModule.addEventListener(WorkspaceEvent.EventType.OPENED, this.hearWorkspaceOpened, this);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        updateColumnSpans: function() {
            var hamburgerLeft           = this.fourColumnView.getColumn1Of4Element();
            var roomspace               = this.fourColumnView.getColumn2Of4Element();
            var workspace               = this.fourColumnView.getColumn3Of4Element();
            var hamburgerLeftIsOpen     = !hamburgerLeft.hasClass("hamburger-panel-hidden");
            var workspaceIsOpen         = this.workspaceModule.isOpen();

            if (hamburgerLeftIsOpen) {
                if (workspaceIsOpen) {
                    roomspace.removeClass("span12 span11 span10 span9 span8 span7 span6 span5 span4 span3 span2 span1 span0");
                    workspace.removeClass("span12 span11 span10 span9 span8 span7 span6 span5 span4 span3 span2 span1 span0");
                    roomspace.addClass("span5");
                    workspace.addClass("span3");
                } else {
                    roomspace.removeClass("span12 span11 span10 span9 span8 span7 span6 span5 span4 span3 span2 span1 span0");
                    workspace.removeClass("span12 span11 span10 span9 span8 span7 span6 span5 span4 span3 span2 span1 span0");
                    roomspace.addClass("span8");
                    workspace.addClass("span0");
                }
            } else {
                if (workspaceIsOpen) {
                    roomspace.removeClass("span12 span11 span10 span9 span8 span7 span6 span5 span4 span3 span2 span1 span0");
                    workspace.removeClass("span12 span11 span10 span9 span8 span7 span6 span5 span4 span3 span2 span1 span0");
                    roomspace.addClass("span8");
                    workspace.addClass("span3");
                } else {
                    roomspace.removeClass("span12 span11 span10 span9 span8 span7 span6 span5 span4 span3 span2 span1 span0");
                    workspace.removeClass("span12 span11 span10 span9 span8 span7 span6 span5 span4 span3 span2 span1 span0");
                    roomspace.addClass("span11");
                    workspace.addClass("span0");
                }
            }
        },


        //-------------------------------------------------------------------------------
        // Message Handlers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {PublisherMessage} message
         */
        handleToggleHamburgerLeftCommand: function(message) {
            var hamburgerLeft   = this.fourColumnView.getColumn1Of4Element();
            hamburgerLeft.toggleClass("hamburger-panel-hidden");
            this.updateColumnSpans();
        },

        /**
         * @private
         * @param {PublisherMessage} message
         */
        handleToggleHamburgerRightCommand: function(message) {
            var hamburgerRight  = this.fourColumnView.getColumn4Of4Element();
            hamburgerRight.toggleClass("hamburger-panel-hidden");
            this.updateColumnSpans();
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
});
