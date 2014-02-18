//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('WorkspaceTrayContainer')

//@Require('Class')
//@Require('Map')
//@Require('airbug.CodeEditorTrayButtonContainer')
//@Require('airbug.CodeEditorWorkspace')
//@Require('airbug.ImageEditorTrayButtonContainer')
//@Require('airbug.ImageWorkspace')
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
var Map                             = bugpack.require('Map');
var CodeEditorTrayButtonContainer   = bugpack.require('airbug.CodeEditorTrayButtonContainer');
var CodeEditorWorkspace             = bugpack.require('airbug.CodeEditorWorkspace');
var ImageEditorTrayButtonContainer  = bugpack.require('airbug.ImageEditorTrayButtonContainer');
var ImageWorkspace                  = bugpack.require('airbug.ImageWorkspace');
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

/**
 * @class
 * @extends {CarapaceContainer}
 */
var WorkspaceTrayContainer = Class.extend(CarapaceContainer, {

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
         * @type {Map.<string, CarapaceContainer>}
         */
        this.workspaceTrayButtonMap         = new Map();


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CodeEditorTrayButtonContainer}
         */
        this.codeEditorTrayButtonContainer  = null;

        /**
         * @private
         * @type {ImageEditorTrayButtonContainer}
         */
        this.imageEditorTrayButtonContainer = null;


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
        this.panelView                      = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------


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
        this.codeEditorTrayButtonContainer      = new CodeEditorTrayButtonContainer();
        this.imageEditorTrayButtonContainer     = new ImageEditorTrayButtonContainer();
        this.addContainerChild(this.codeEditorTrayButtonContainer, "#panel-body-" + this.panelView.getCid());
        this.addContainerChild(this.imageEditorTrayButtonContainer, "#panel-body-" + this.panelView.getCid());
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();

        // TODO BRN: FIX HACK. These buttons should register with the rest of the workspace system. Need some sort  of
        // API that allows workspaces to register buttons for the tray.

        this.workspaceTrayButtonMap.remove(CodeEditorWorkspace.WORKSPACE_NAME);
        this.workspaceTrayButtonMap.remove(ImageWorkspace.WORKSPACE_NAME);

        this.workspaceModule.removeEventListener(WorkspaceEvent.EventType.CHANGED, this.hearWorkspaceChanged, this);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();

        // TODO BRN: FIX HACK. These buttons should register with the rest of the workspace system. Need some sort  of
        // API that allows workspaces to register buttons for the tray.

        this.workspaceTrayButtonMap.put(CodeEditorWorkspace.WORKSPACE_NAME, this.codeEditorTrayButtonContainer);
        this.workspaceTrayButtonMap.put(ImageWorkspace.WORKSPACE_NAME, this.imageEditorTrayButtonContainer);

        this.workspaceModule.addEventListener(WorkspaceEvent.EventType.CHANGED, this.hearWorkspaceChanged, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearWorkspaceChanged: function(event) {
        var previousWorkspaceName   = event.getData().previousWorkspace;
        var workspaceName           = event.getData().workspace;
        if (previousWorkspaceName) {
            var previousWorkspaceTrayButton = this.workspaceTrayButtonMap.get(previousWorkspaceName);
            if (previousWorkspaceTrayButton) {
                previousWorkspaceTrayButton.setActive(false);
            }
        }
        if (workspaceName) {
            var workspaceTrayButton = this.workspaceTrayButtonMap.get(workspaceName);
            if (workspaceTrayButton) {
                workspaceTrayButton.setActive(true);
            }
        }
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(WorkspaceTrayContainer).with(
    autowired().properties([
        property("workspaceModule").ref("workspaceModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.WorkspaceTrayContainer", WorkspaceTrayContainer);
