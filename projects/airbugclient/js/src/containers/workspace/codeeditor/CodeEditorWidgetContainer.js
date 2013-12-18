//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CodeEditorWidgetContainer')

//@Require('Class')
//@Require('ace.Ace')
//@Require('ace.AceExts')
//@Require('ace.AceModes')
//@Require('ace.AceThemes')
//@Require('ace.KitchenSink')
//@Require('acemodes.Css')
//@Require('acemodes.Html')
//@Require('acemodes.Javascript')
//@Require('airbug.ButtonGroupView')
//@Require('airbug.ButtonToolbarView')
//@Require('airbug.ButtonView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CodeEditorCloseButtonContainer')
//@Require('airbug.CodeEditorSettingsButtonContainer')
//@Require('airbug.CodeEditorView')
//@Require('airbug.CodeEditorWidgetView')
//@Require('airbug.CommandModule')
//@Require('airbug.IconView')
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

var Class                               = bugpack.require('Class');
var Ace                                 = bugpack.require('ace.Ace');
var AceExts                             = bugpack.require('ace.AceExts');
var AceModes                            = bugpack.require('ace.AceModes');
//var AceSnippets                         = bugpack.require('ace.AceSnippets');
var AceThemes                           = bugpack.require('ace.AceThemes');
var KitchenSink                         = bugpack.require('ace.KitchenSink');
var Css                                 = bugpack.require('acemodes.Css');
var Html                                = bugpack.require('acemodes.Html');
var Javascript                          = bugpack.require('acemodes.Javascript');
var ButtonGroupView                     = bugpack.require('airbug.ButtonGroupView');
var ButtonToolbarView                   = bugpack.require('airbug.ButtonToolbarView');
var ButtonView                          = bugpack.require('airbug.ButtonView');
var ButtonViewEvent                     = bugpack.require('airbug.ButtonViewEvent');
var CodeEditorCloseButtonContainer      = bugpack.require('airbug.CodeEditorCloseButtonContainer');
var CodeEditorSettingsButtonContainer   = bugpack.require('airbug.CodeEditorSettingsButtonContainer');
var CodeEditorView                      = bugpack.require('airbug.CodeEditorView');
var CodeEditorWidgetView                = bugpack.require('airbug.CodeEditorWidgetView');
var CommandModule                       = bugpack.require('airbug.CommandModule');
var IconView                            = bugpack.require('airbug.IconView');
var NakedButtonView                     = bugpack.require('airbug.NakedButtonView');
var TextView                            = bugpack.require('airbug.TextView');
var AutowiredAnnotation                 = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation                  = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer                   = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


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

var CodeEditorWidgetContainer = Class.extend(CarapaceContainer, {

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
         * @type {Ace}
         */
        this.aceEditor                  = null;


        // Models
        //-------------------------------------------------------------------------------

        /**
         * @type {CommandModule}
         */
        this.commandModule              = null;


        // Modules
        //-------------------------------------------------------------------------------


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CodeEditorView}
         */
        this.codeEditorView             = null;

        /**
         * @private
         * @type {CodeEditorWidgetView}
         */
        this.codeEditorWidgetView       = null;


        // Containers
        //-------------------------------------------------------------------------------

        this.closeButton                = null;

        this.settingsButton             = null;
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

        this.codeEditorWidgetView =
            view(CodeEditorWidgetView)
                .id("code-editor-widget")
                .children([
                    view(ButtonToolbarView)
                        .id("code-editor-widget-toolbar")
                        .appendTo("#code-editor-widget-header")
                        .children([
                            view(ButtonGroupView)
                                .appendTo('#code-editor-widget-toolbar')
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
                                                    type: IconView.Type.CHEVRON_LEFT,
                                                    color: IconView.Color.WHITE
                                                })
                                                .appendTo('button[id|="button"]'),
                                            view(IconView)
                                                .attributes({
                                                    type: IconView.Type.CHEVRON_RIGHT,
                                                    color: IconView.Color.WHITE
                                                })
                                                .appendTo('button[id|="button"]'),
                                            view(TextView)
                                                .attributes({
                                                    text: 'Editor'
                                                })
                                                .appendTo('button[id|="button"]')
                                        ])
                                ]),
                            view(ButtonGroupView)
                                .appendTo('#code-editor-widget-toolbar')
                        ]),
                    view(CodeEditorView)
                        .id("code-editor-view")
                        .attributes({
                            width: "300px",
                            height: "200px"
                        })
                        .appendTo("#code-editor-widget-body"),
                    view(ButtonView)
                        .id("embed-code-button")
                        .attributes({
                            type: "default",
                            size: ButtonView.Size.LARGE,
                            block: true
                        })
                        .children([
                            view(TextView)
                                .attributes({text: "embed"})
                                .appendTo("#embed-code-button")
                        ])
                        .appendTo("#code-editor-widget-footer")
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.codeEditorWidgetView);
        this.embedButtonView    = this.findViewById("embed-code-button");
        this.codeEditorView     = this.findViewById("code-editor-view");
        this.aceEditor          = Ace.edit(this.codeEditorView.$el.get(0));
    },

    createContainerChildren: function() {
        this._super();
        this.closeButton        = new CodeEditorCloseButtonContainer();
        this.settingsButton     = new CodeEditorSettingsButtonContainer();
        this.addContainerChild(this.settingsButton, ".btn-group:last-child");
        this.addContainerChild(this.closeButton, ".btn-group:last-child");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.initializeEventListeners();
        this.initializeCommandSubscriptions();
        this.configureAceEditor();
    },

    /**
     *
     */
    deinitializeContainer: function() {
        this._super();
        this.deinitializeEventListeners();
        this.deinitializeCommandSubscriptions();
    },

    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     *
     */
    initializeEventListeners: function() {
        this.embedButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearEmbedButtonClickedEvent, this);
    },

    /**
     *
     */
    deinitializeEventListeners: function() {
        this.embedButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearEmbedButtonClickedEvent, this);
    },

    /**
     *
     */
    initializeCommandSubscriptions: function() {
        this.commandModule.subscribe(CommandType.DISPLAY.CODE, this.handleDisplayCodeCommand, this);
    },

    /**
     *
     */
    deinitializeCommandSubscriptions: function() {
        this.commandModule.unsubscribe(CommandType.DISPLAY.CODE, this.handleDisplayCodeCommand, this);
    },

    /**
     * @param {ButtonViewEvent} event
     */
    hearEmbedButtonClickedEvent: function(event) {
        this.handleEmbedButtonClickedEvent(event);
    },


    //-------------------------------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @type {PublisherMessage} message
     */
    handleDisplayCodeCommand: function(message) {
        var code = message.getData().code;
        this.setEditorText(code);
    },

    /**
     * @param {ButtonViewEvent} event
     */
    handleEmbedButtonClickedEvent: function(event) {
        var code            = this.getEditorText();
        var codeLanguage    = this.getEditorLanguage();
        var chatMessageObject = {
            code: code,
            type: "code",
            codeLanguage: codeLanguage
        };

        console.log("code:", code);
        console.log("codeLanguage:", codeLanguage);
        console.log("chatMessageObject:", chatMessageObject);

        this.commandModule.relayCommand(CommandType.SUBMIT.CHAT_MESSAGE, chatMessageObject);
        event.stopPropagation();
    },


    //-------------------------------------------------------------------------------
    // Ace Config and Helper Methods
    //-------------------------------------------------------------------------------

    configureAceEditor: function() {
        AceExts.loadAll();
        AceModes.loadAll();
        AceThemes.loadAll();
        //AceSnippets.loadAll();
        //KitchenSink.load();
        //Ace.require("kitchen-sink/demo"); //TODO SUNG update html ids to avoid naming conflicts
;
        this.aceEditor.getSession().setMode("ace/mode/javascript");
        this.aceEditor.setTheme("ace/theme/twilight");
    },

    /**
     * @return {string}
     */
    getEditorLanguage: function() {
        var mode = this.aceEditor.getSession().getMode().$id;
        return mode.substring(mode.lastIndexOf("/") + 1);
    },

    /**
     * @return {string}
     */
    getEditorText: function() {
        if (this.aceEditor) {
            return this.aceEditor.getValue();
        } else {
            return "";
        }
    },

    /**
     * @param {string} value
     */
    setEditorText: function(value) {
        if (this.aceEditor) {
            this.aceEditor.setValue(value);
        }
    },

    /**
     *
     */
    setEditorToReadOnly: function() {
        if (this.aceEditor) {
            this.aceEditor.setReadOnly(true);
        }
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(CodeEditorWidgetContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CodeEditorWidgetContainer", CodeEditorWidgetContainer);
