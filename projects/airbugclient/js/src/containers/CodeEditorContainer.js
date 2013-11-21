//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CodeEditorContainer')

//@Require('Class')
//@Require('ace.Ace')
//@Require('ace.AceModes')
//@Require('ace.KitchenSink')
//@Require('airbug.BoxWithHeaderAndFooterView')
//@Require('airbug.ButtonView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CodeEditorSettingsButtonContainer')
//@Require('airbug.CommandModule')
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
var AceModes                            = bugpack.require('ace.AceModes');
var KitchenSink                         = bugpack.require('ace.KitchenSink');
var BoxWithHeaderAndFooterView          = bugpack.require('airbug.BoxWithHeaderAndFooterView');
var ButtonView                          = bugpack.require('airbug.ButtonView');
var ButtonViewEvent                     = bugpack.require('airbug.ButtonViewEvent');
var CodeEditorSettingsButtonContainer   = bugpack.require('airbug.CodeEditorSettingsButtonContainer');
var CommandModule                       = bugpack.require('airbug.CommandModule');
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

var CodeEditorContainer = Class.extend(CarapaceContainer, {

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
         * @type {ace.Ace}
         */
        this.aceEditor                  = null;

        // Models
        //-------------------------------------------------------------------------------

        /**
         * @type {airbug.CommandModule}
         */
        this.commandModule              = null;

        // Modules
        //-------------------------------------------------------------------------------


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {airbug.BoxWithHeaderAndFooterView}
         */
        this.boxView                   = null;


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
        this.configureAceEditor();
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

        this.boxView =
            view(BoxWithHeaderAndFooterView)
                .id("code-editor-container")
                .children([
                    view(TextView)
                        .attributes({text: "Code Editor"})
                        .appendTo(".box-header"),
                    view(ButtonView)
                        .id("embedButtonView")
                        .attributes({
                            type: "default",
                            size: ButtonView.Size.LARGE
                        })
                        .appendTo(".box-footer")
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.boxView);
        this.embedButtonView = this.findViewById("embedButtonView");
    },

    createContainerChildren: function() {
        this._super();
        this.settingsButton     = new CodeEditorSettingsButtonContainer();
        this.addContainerChild(this.settingsButton, ".box-header");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.initializeEventListeners();
        this.initializeCommandSubscriptions();
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
    initializeCommandSubscriptions: function() {
        this.commandModule.subscribe(CommandType.DISPLAY.CODE, this.handleDisplayCodeCommand, this);
    },

    /**
     * @param {airbug.ButtonViewEvent} event
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
     * @param {airbug.ButtonViewEvent} event
     */
    handleEmbedButtonClickedEvent: function(event) {
        var code            = this.getEditorText();
        var codeLanguage    = this.getEditorLanguage();
        var chatMessageObject = {
            code: code,
            type: "code",
            codeLanguage: codeLanguage
        };

        this.commandModule.relayCommand(CommandType.SUBMIT.CHAT_MESSAGE, chatMessageObject);
        event.stopPropagation();
    },


    //-------------------------------------------------------------------------------
    // Ace Config and Helper Methods
    //-------------------------------------------------------------------------------

    configureAceEditor: function() {
        this.aceEditor  = Ace.edit("box-body-" + this.boxView.cid);
        var aceModes    = new AceModes();
        KitchenSink.load();
        aceModes.loadTopTen();

        this.aceEditor.setTheme("ace/theme/textmate");
        this.aceEditor.getSession().setMode("ace/mode/javascript");
    },

    /**
     * @return {string}
     */
    getEditorLanguage: function() {
        var mode = this.aceEditor.getSession().getMode().$id;
        return mode.substring(mode.lastIndexOf("/"));
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

bugmeta.annotate(CodeEditorContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CodeEditorContainer", CodeEditorContainer);
