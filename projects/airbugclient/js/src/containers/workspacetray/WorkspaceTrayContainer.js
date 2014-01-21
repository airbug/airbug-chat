//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('WorkspaceTrayContainer')

//@Require('Class')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CodeEditorTrayButtonContainer')
//@Require('airbug.ImageEditorTrayButtonContainer')
//@Require('airbug.CommandModule')
//@Require('airbug.IconView')
//@Require('airbug.ListView')
//@Require('airbug.TextView')
//@Require('airbug.PanelView')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
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
var ButtonViewEvent                 = bugpack.require('airbug.ButtonViewEvent');
var CodeEditorTrayButtonContainer   = bugpack.require('airbug.CodeEditorTrayButtonContainer');
var ImageEditorTrayButtonContainer  = bugpack.require('airbug.ImageEditorTrayButtonContainer');
var CommandModule                   = bugpack.require('airbug.CommandModule');
var IconView                        = bugpack.require('airbug.IconView');
var TextView                        = bugpack.require('airbug.TextView');
var PanelView                       = bugpack.require('airbug.PanelView');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var CommandType                     = CommandModule.CommandType;
var bugmeta                         = BugMeta.context();
var autowired                       = AutowiredAnnotation.autowired;
var property                        = PropertyAnnotation.property;
var view                            = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var WorkspaceTrayContainer = Class.extend(CarapaceContainer, {

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

        /**
         * @private
         * @type {CommandModule}
         */
        this.commandModule                  = null;

        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {PanelView}
         */
        this.panelView                      = null;

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
                .attributes({})
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.panelView);
    },

    /**
     *
     */
    createContainerChildren: function() {
        this._super();
        this.codeEditorTrayButtonContainer = new CodeEditorTrayButtonContainer();
        this.imageEditorTrayButtonContainer = new ImageEditorTrayButtonContainer();
        this.addContainerChild(this.codeEditorTrayButtonContainer, "#panel-body-" + this.panelView.getCid());
        this.addContainerChild(this.imageEditorTrayButtonContainer, "#panel-body-" + this.panelView.getCid());
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.initializeEventListeners();
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     *
     */
    initializeEventListeners: function() {
        this.codeEditorTrayButtonContainer.getViewTop().addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearCodeEditorButtonClickedEvent, this);
        this.imageEditorTrayButtonContainer.getViewTop().addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearImageEditorButtonClickedEvent, this);
    },

    /**
     *
     */
    hearCodeEditorButtonClickedEvent: function(event) {
        this.commandModule.relayCommand(CommandType.TOGGLE.WORKSPACE, {source: "#code-editor-button"});
        this.commandModule.relayCommand(CommandType.DISPLAY.CODE_EDITOR, {});
    },

    /**
     *
     */
    hearImageEditorButtonClickedEvent: function(event) {
        this.commandModule.relayCommand(CommandType.TOGGLE.WORKSPACE, {source: "#image-editor-button"});
        this.commandModule.relayCommand(CommandType.DISPLAY.IMAGE_EDITOR, {});
        this.commandModule.relayCommand(CommandType.DISPLAY.IMAGE_LIST, {});
    }
});

//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(WorkspaceTrayContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule"),
    ])
);

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.WorkspaceTrayContainer", WorkspaceTrayContainer);
