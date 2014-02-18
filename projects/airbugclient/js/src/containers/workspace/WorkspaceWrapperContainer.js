//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('WorkspaceWrapperContainer')

//@Require('Class')
//@Require('airbug.CodeEditorWorkspaceContainer')
//@Require('airbug.ImageWorkspaceContainer')
//@Require('airbug.PanelView')
//@Require('airbug.WorkspaceEvent')
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
var CodeEditorWorkspaceContainer    = bugpack.require('airbug.CodeEditorWorkspaceContainer');
var ImageWorkspaceContainer         = bugpack.require('airbug.ImageWorkspaceContainer');
var PanelView                       = bugpack.require('airbug.PanelView');
var WorkspaceEvent                  = bugpack.require('airbug.WorkspaceEvent');
var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                       = AutowiredAnnotation.autowired;
var bugmeta                         = BugMeta.context();
var property                        = PropertyAnnotation.property;
var view                            = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var WorkspaceWrapperContainer = Class.extend(CarapaceContainer, {

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
         * @private
         * @type {CodeEditorWorkspaceContainer}
         */
        this.codeEditorWorkspaceContainer       = null;

        /**
         * @private
         * @type {ImageWorkspaceContainer}
         */
        this.imageWorkspaceContainer            = null;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {WorkspaceModule}
         */
        this.workspaceModule                    = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {PanelView}
         */
        this.panelView                          = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {CodeEditorWorkspaceContainer}
     */
    getCodeEditorWorkspaceContainer: function() {
        return this.codeEditorWorkspaceContainer;
    },

    /**
     * @return {ImageWorkspaceContainer}
     */
    getImageWorkspaceContainer: function() {
        return this.imageWorkspaceContainer;
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
        this.updateWorkspaceVisibility();
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Views
        //-------------------------------------------------------------------------------

        view(PanelView)
            .name("panelView")
            .build(this);


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.panelView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.codeEditorWorkspaceContainer   = new CodeEditorWorkspaceContainer();
        this.imageWorkspaceContainer        = new ImageWorkspaceContainer();
        this.addContainerChild(this.codeEditorWorkspaceContainer, "#panel-body-" + this.panelView.getCid());
        this.addContainerChild(this.imageWorkspaceContainer, "#panel-body-" + this.panelView.getCid());
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.workspaceModule.removeEventListener(WorkspaceEvent.EventType.CLOSED, this.hearWorkspaceClosed, this);
        this.workspaceModule.removeEventListener(WorkspaceEvent.EventType.OPENED, this.hearWorkspaceOpened, this);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.workspaceModule.addEventListener(WorkspaceEvent.EventType.CLOSED, this.hearWorkspaceClosed, this);
        this.workspaceModule.addEventListener(WorkspaceEvent.EventType.OPENED, this.hearWorkspaceOpened, this);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    updateWorkspaceVisibility: function() {
        var workspaceIsOpen     = this.workspaceModule.isOpen();
        if (workspaceIsOpen) {
            this.panelView.show();
        } else {
            this.panelView.hide();
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
        this.updateWorkspaceVisibility();
    },

    /**
     * @private
     * @param {Event} event
     */
    hearWorkspaceOpened: function(event) {
        this.updateWorkspaceVisibility();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(WorkspaceWrapperContainer).with(
    autowired().properties([
        property("workspaceModule").ref("workspaceModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.WorkspaceWrapperContainer", WorkspaceWrapperContainer);
