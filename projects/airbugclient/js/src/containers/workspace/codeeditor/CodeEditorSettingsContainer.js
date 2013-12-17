//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CodeEditorSettingsContainer')

//@Require('Class')
//@Require('airbug.ButtonGroupView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CodeEditorCloseButtonContainer')
//@Require('airbug.CodeEditorSettingsView')
//@Require('airbug.CommandModule')
//@Require('airbug.NakedButtonView')
//@Require('airbug.TextView')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var ButtonGroupView                 = bugpack.require('airbug.ButtonGroupView');
var ButtonViewEvent                 = bugpack.require('airbug.ButtonViewEvent');
var CodeEditorCloseButtonContainer  = bugpack.require('airbug.CodeEditorCloseButtonContainer');
var CodeEditorSettingsView          = bugpack.require('airbug.CodeEditorSettingsView');
var CommandModule                   = bugpack.require('airbug.CommandModule');
var NakedButtonView                 = bugpack.require('airbug.NakedButtonView');
var TextView                        = bugpack.require('airbug.TextView');
var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


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

var CodeEditorSettingsContainer = Class.extend(CarapaceContainer, {

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
        this.commandModule                      = null;

        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CodeEditorSettingsView}
         */
        this.codeEditorSettingsView             = null;


        // Containers
        //-------------------------------------------------------------------------------


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

        this.codeEditorSettingsView =
            view(CodeEditorSettingsView)
                .id("code-editor-settings")
                .children([
                    view(ButtonToolbarView)
                        .id("code-editor-settings-toolbar")
                        .appendTo(".box-header")
                        .children([
                            view(ButtonGroupView)
                                .appendTo('#code-editor-settings-toolbar')
                                .children([
                                    view(NakedButtonView)
                                        .attributes({
                                            size: NakedButtonView.Size.NORMAL,
                                            disabled: true,
                                            type: NakedButtonView.Type.INVERSE
                                        })
                                        .children([
                                            view(IconView)
                                                .attributes({
                                                    type: IconView.Type.COG,
                                                    color: IconView.Color.WHITE
                                                })
                                                .appendTo('button[id|="button"]'),
                                            view(TextView)
                                                .attributes({
                                                    text: " Settings"
                                                })
                                                .appendTo('button[id|="button"]')
                                        ])
                                ]),
                            view(ButtonGroupView)
                                .appendTo('#code-editor-settings-toolbar')
                                .children([
                                    view(NakedButtonView)
                                        .id("back-to-code-editor-button")
                                        .attributes({
                                            size: NakedButtonView.Size.SMALL
                                        })
                                        .children([
                                            view(IconView)
                                                .attributes({
                                                    type: IconView.Type.CHEVRON_LEFT
                                                })
                                                .appendTo("#back-to-code-editor-button"),
                                            view(IconView)
                                                .attributes({
                                                    type: IconView.Type.CHEVRON_RIGHT
                                                })
                                                .appendTo("#back-to-code-editor-button"),
                                            view(TextView)
                                                .attributes({
                                                    text: "Editor"
                                                })
                                                .appendTo("#back-to-code-editor-button")
                                        ])
                                ])
                        ]),
                    view(ButtonView)
                        .id("apply-code-editor-settings-button")
                        .attributes({
                            block: true
                        })
                        .children([
                            view(TextView)
                                .attributes({text: "Apply"})
                                .appendTo("#apply-code-editor-settings-button")
                        ])
                        .appendTo(".box-footer")
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.codeEditorSettingsView);

        this.backButtonView = this.findViewById("back-to-code-editor-button");
        this.applyButtonView = this.findViewById("apply-code-editor-settings-button");
    },

    createContainerChildren: function() {
        this._super();
        this.codeEditorCloseButtonContainer = new CodeEditorCloseButtonContainer();
        this.addContainerChild(this.codeEditorCloseButtonContainer, "#code-editor-settings-toolbar .btn-group:last-child");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.initializeEventListeners();
    },

    deinitializeConatainer: function() {
        this._super();
        this.deinitializeEventListeners();
    },

    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    initializeEventListeners: function() {
        this.backButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED,  this.handleBackButtonClickedEvent,  this);
        this.applyButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.handleApplyButtonClickedEvent, this);
    },

    deinitializeEventListeners: function() {
        this.backButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED,  this.handleBackButtonClickedEvent,  this);
        this.applyButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.handleApplyButtonClickedEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    handleBackButtonClickedEvent: function() {
        this.commandModule.relayCommand(CommandType.TOGGLE.CODE_EDITOR_SETTINGS, {});
    },

    handleApplyButtonClickedEvent: function() {
        this.commandModule.relayCommand(CommandType.TOGGLE.CODE_EDITOR_SETTINGS, {});
    }
});

//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(CodeEditorSettingsContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule")
    ])
);

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CodeEditorSettingsContainer", CodeEditorSettingsContainer);
