//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.WorkspaceContainer')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('airbug.IWorkspace')
//@Require('airbug.WorkspaceView')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var Map                             = bugpack.require('Map');
    var Obj                             = bugpack.require('Obj');
    var IWorkspace                      = bugpack.require('airbug.IWorkspace');
    var WorkspaceView                   = bugpack.require('airbug.WorkspaceView');
    var AutowiredTag             = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag              = bugpack.require('bugioc.PropertyTag');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
    var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                   = AutowiredTag.autowired;
    var bugmeta                     = BugMeta.context();
    var property                    = PropertyTag.property;
    var view                        = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     * @implements {IWorkspace}
     */
    var WorkspaceContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.WorkspaceContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} workspaceName
         */
        _constructor: function(workspaceName) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.currentWidgetName              = null;

            /**
             * @private
             * @type {Map.<string, WorkspaceWidgetContainer>}
             */
            this.widgetMap                      = new Map();

            /**
             * @private
             * @type {string}
             */
            this.workspaceName                  = workspaceName;


            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {PageStateModule}
             */
            this.pageStateModule                = null;

            /**
             * @private
             * @type {WorkspaceModule}
             */
            this.workspaceModule                = null;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {WorkspaceView}
             */
            this.workspaceView                  = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getCurrentWidgetName: function() {
            return this.currentWidgetName;
        },

        /**
         * @param {string} widgetName
         */
        setCurrentWidgetName: function(widgetName) {
            this.currentWidgetName = widgetName;
        },

        /**
         * @return {WorkspaceModule}
         */
        getWorkspaceModule: function() {
            return this.workspaceModule;
        },

        /**
         * @return {WorkspaceView}
         */
        getWorkspaceView: function() {
            return this.workspaceView;
        },
        

        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {WorkspaceWidgetContainer}
         */
        getCurrentWidget: function() {
            return this.widgetMap.get(this.currentWidgetName);
        },


        //-------------------------------------------------------------------------------
        // IWorkspace Implementation
        //-------------------------------------------------------------------------------

        /**
         *
         */
        hideWorkspace: function() {
            this.workspaceView.hide();
        },

        /**
         *
         */
        showWorkspace: function() {
            this.workspaceView.show();
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

            view(WorkspaceView)
                .name("workspaceView")
                .build(this);


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.workspaceView);
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.pageStateModule.putState(WorkspaceContainer.PageStates.CURRENT_WIDGET + ":" + this.workspaceName, this.currentWidgetName);
            this.workspaceModule.deregisterWorkspace(this.workspaceName);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.workspaceModule.registerWorkspace(this.workspaceName, this);
            this.currentWidgetName = this.pageStateModule.getState(WorkspaceContainer.PageStates.CURRENT_WIDGET + ":" + this.workspaceName);
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        closeCurrentWidget: function() {
            this.updateCurrentWidget(null);
            this.workspaceModule.closeWorkspace(this.workspaceName);
        },

        /**
         * @protected
         */
        closeWorkspace: function() {

        },

        /**
         * @protected
         * @param {string} widgetName
         */
        deregisterWidget: function(widgetName) {
            var widget = this.widgetMap.remove(widgetName);
            widget.hideWidget();
        },

        hideAllWidgets: function() {

        },

        /**
         * @protected
         */
        hideCurrentWidget: function() {
            var currentWidget = this.getCurrentWidget();
            if (currentWidget) {
                currentWidget.hideWidget();
            }
        },

        /**
         * @protected
         * @param {string} widgetName
         */
        openWidget: function(widgetName) {
            this.updateCurrentWidget(widgetName);
            this.getWorkspaceModule().openWorkspace(this.workspaceName);
        },

        /**
         * @protected
         */
        openWorkspace: function() {

        },

        /**
         * @protected
         * @param {string} widgetName
         * @param {WorkspaceWidgetContainer} widget
         */
        registerWidget: function(widgetName, widget) {
            this.widgetMap.put(widgetName, widget);
            if (this.currentWidgetName === widgetName) {
                widget.showWidget();
            } else {
                widget.hideWidget();
            }
        },

        /**
         * @protected
         */
        showCurrentWidget: function() {
            var currentWidget = this.getCurrentWidget();
            if (currentWidget) {
                currentWidget.showWidget();
            }
        },

        /**
         * @protected
         * @param {string} widgetName
         */
        showWidget: function(widgetName) {
            this.updateCurrentWidget(widgetName);
            this.getWorkspaceModule().openWorkspace(this.workspaceName);
        },

        /**
         * @protected
         * @param {string} widgetName
         */
        toggleWidget: function(widgetName) {
            if (Obj.equals(this.currentWidgetName, widgetName)) {
                this.hideWidget(widgetName);
            } else {
                this.showWidget(widgetName);
            }
        },

        /**
         * @protected
         */
        toggleWorkspace: function() {
            this.getWorkspaceModule().toggleWorkspace(this.workspaceName);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {string} widgetName
         */
        updateCurrentWidget: function(widgetName) {
            if (this.currentWidgetName !== widgetName) {
                if (this.currentWidgetName) {
                    this.hideCurrentWidget();
                }
                this.setCurrentWidgetName(widgetName);
                if (this.currentWidgetName) {
                    this.showCurrentWidget();
                }
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    WorkspaceContainer.PageStates = {
        CURRENT_WIDGET: "WorkspaceContainer:PageState:CurrentWidget"
    };


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(WorkspaceContainer, IWorkspace);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(WorkspaceContainer).with(
        autowired().properties([
            property("pageStateModule").ref("pageStateModule"),
            property("workspaceModule").ref("workspaceModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.WorkspaceContainer", WorkspaceContainer);
});
