//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('WorkspaceContainer')

//@Require('Class')
//@Require('Obj')
//@Require('airbug.BoxView')
//@Require('airbug.IWorkspace')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Obj                             = bugpack.require('Obj');
var BoxView                         = bugpack.require('airbug.BoxView');
var IWorkspace                      = bugpack.require('airbug.IWorkspace');
var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                   = AutowiredAnnotation.autowired;
var bugmeta                     = BugMeta.context();
var property                    = PropertyAnnotation.property;
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

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {WorkspaceWidgetContainer}
         */
        this.currentWidget                  = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BoxView}
         */
        this.boxView                        = null;

        /**
         * @private
         * @type {WorkspaceModule}
         */
        this.workspaceModule                = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {BoxView}
     */
    getBoxView: function() {
        return this.boxView;
    },

    /**
     * @return {WorkspaceWidgetContainer}
     */
    getCurrentWidget: function() {
        return this.currentWidget;
    },

    /**
     * @return {WorkspaceModule}
     */
    getWorkspaceModule: function() {
        return this.workspaceModule;
    },


    //-------------------------------------------------------------------------------
    // IWorkspace Implementation
    //-------------------------------------------------------------------------------

    /**
     *
     */
    hideWorkspace: function() {
        this.boxView.hide();
        this.currentWidget = null;
    },

    /**
     *
     */
    showWorkspace: function() {
        this.boxView.show();
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

        view(BoxView)
            .name("boxView") //NOTE This was #image-editor-widget
            .build(this);


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.boxView);
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {WorkspaceWidgetContainer} widget
     * @param {string} workspaceName
     */
    showWidget: function(widget, workspaceName) {
        this.updateCurrentWidget(widget);
        this.getWorkspaceModule().openWorkspace(workspaceName);
    },

    /**
     * @protected
     * @param {WorkspaceWidgetContainer} widget
     * @param {string} workspaceName
     */
    toggleWidget: function(widget, workspaceName) {
        if (Obj.equals(this.currentWidget, widget)) {
            this.updateCurrentWidget(null);
            this.getWorkspaceModule().closeWorkspace();
        } else {
            this.updateCurrentWidget(widget);
            this.getWorkspaceModule().openWorkspace(workspaceName);
        }
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {WorkspaceWidgetContainer} widget
     */
    updateCurrentWidget: function(widget) {
        if (this.currentWidget !== widget) {
            if (this.currentWidget) {
                this.currentWidget.hideWidget();
            }
            this.currentWidget = widget;
            if (this.currentWidget) {
                this.currentWidget.showWidget();
            }
        }
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(WorkspaceContainer, IWorkspace);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(WorkspaceContainer).with(
    autowired().properties([
        property("workspaceModule").ref("workspaceModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.WorkspaceContainer", WorkspaceContainer);
