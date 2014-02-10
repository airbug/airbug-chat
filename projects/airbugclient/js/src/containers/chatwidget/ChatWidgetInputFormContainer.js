//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatWidgetInputFormContainer')

//@Require('Class')
//@Require('airbug.BoxView')
//@Require('airbug.ButtonView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CheckBoxInputView')
//@Require('airbug.CommandModule')
//@Require('airbug.FormControlGroupView')
//@Require('airbug.FormView')
//@Require('airbug.FormViewEvent')
//@Require('airbug.IconView')
//@Require('airbug.KeyBoardEvent')
//@Require('airbug.LabelView')
//@Require('airbug.MultiColumnView')
//@Require('airbug.TextAreaView')
//@Require('airbug.TextView')
//@Require('airbug.TwoColumnView')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var BoxView                 = bugpack.require('airbug.BoxView');
var ButtonView              = bugpack.require('airbug.ButtonView');
var ButtonViewEvent         = bugpack.require('airbug.ButtonViewEvent');
var CheckBoxInputView       = bugpack.require('airbug.CheckBoxInputView');
var CommandModule           = bugpack.require('airbug.CommandModule');
var FormControlGroupView    = bugpack.require('airbug.FormControlGroupView');
var FormView                = bugpack.require('airbug.FormView');
var FormViewEvent           = bugpack.require('airbug.FormViewEvent');
var IconView                = bugpack.require('airbug.IconView');
var KeyBoardEvent           = bugpack.require('airbug.KeyBoardEvent');
var LabelView               = bugpack.require('airbug.LabelView');
var MultiColumnView         = bugpack.require('airbug.MultiColumnView');
var TextAreaView            = bugpack.require('airbug.TextAreaView');
var TextView                = bugpack.require('airbug.TextView');
var TwoColumnView           = bugpack.require('airbug.TwoColumnView');
var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer       = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired               = AutowiredAnnotation.autowired;
var bugmeta                 = BugMeta.context();
var CommandType             = CommandModule.CommandType;
var property                = PropertyAnnotation.property;
var view                    = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatWidgetInputFormContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {ConversationModel} conversationModel
     */
    _constructor: function(conversationModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ConversationModel}
         */
        this.conversationModel              = conversationModel;


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
         * @type {ButtonView}
         */
        this.chooseOrUploadImageButtonView  = null;

        /**
         * @private
         * @type {FormView}
         */
        this.formView                       = null;

        /**
         * @private
         * @type {TextView}
         */
        this.sendButtonTextView             = null;

        /**
         * @private
         * @type {ButtonView}
         */
        this.sendButtonView                 = null;

        /**
         * @private
         * @type {CheckBoxInputView}
         */
        this.submitOnEnterCheckBoxView      = null;

        /**
         * @private
         * @type {TextAreaView}
         */
        this.textAreaView                   = null;

        /**
         * @private
         * @type {TwoColumnView}
         */
        this.twoColumnView                  = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param routerArgs
     */
    activateContainer: function(routerArgs) {
        this._super(routerArgs);
        this.textAreaView.focus();
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Views
        //-------------------------------------------------------------------------------

        this.twoColumnView =
            view(TwoColumnView)
                .attributes({
                    configuration: TwoColumnView.Configuration.THIN_RIGHT,
                    rowStyle: MultiColumnView.RowStyle.FLUID
                })
                .id("chatWidgetInputRowContainer")
                .children([
                    view(FormView)
                        .id("chatWidgetInputForm")
                        .attributes({
                            classes: "form-horizontal"
                        })
                        .appendTo(".column1of2")
                        .children([
                            view(FormControlGroupView)
                                .attributes({
                                    classes: "control-group-textarea"
                                })
                                .children([
                                    view(TextAreaView)
                                        .id("chatInputTextArea")
                                        .attributes({
                                            name: "text"
                                        })
                                ]),
                            view(FormControlGroupView)
                                .attributes({
                                    classes: "control-group-checkbox"
                                })
                                .children([
                                    view(LabelView)
                                        .attributes({
                                            text: "Press enter to send",
                                            classes: "checkbox"
                                        })
                                        .children([
                                            view(CheckBoxInputView)
                                                .id("submitOnEnterCheckBox")
                                                .attributes({
                                                    checked: true
                                                })
                                        ])
                                ])
                        ]),
                    view(ButtonView)
                        .id("choose-or-upload-image-button")
                        .appendTo(".column2of2")
                        .children([
                            view(IconView)
                                .attributes({
                                    type: IconView.Type.CAMERA
                                })
                                .appendTo("#choose-or-upload-image-button")
                        ]),
                    view(ButtonView)
                        .id("chat-widget-input-send-button")
                        .appendTo(".column2of2")
                        .children([
                            view(TextView)
                                .id("sendButtonTextView")
                                .attributes({text: "Ok"})
                                .appendTo('#chat-widget-input-send-button')
                        ])
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.twoColumnView);

        this.chooseOrUploadImageButtonView  = this.findViewById("choose-or-upload-image-button");
        this.formView                       = this.findViewById("chatWidgetInputForm");
        this.sendButtonTextView             = this.findViewById("sendButtonTextView");
        this.sendButtonView                 = this.findViewById("chat-widget-input-send-button");
        this.submitOnEnterCheckBoxView      = this.findViewById("submitOnEnterCheckBox");
        this.textAreaView                   = this.findViewById("chatInputTextArea");
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.chooseOrUploadImageButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.handleChooseOrUploadImageViewClickedEvent, this);
        this.textAreaView.removeEventListener(KeyBoardEvent.EventTypes.KEY_PRESS, this.handleKeyPressEvent, this);
        this.textAreaView.removeEventListener(KeyBoardEvent.EventTypes.KEY_UP, this.handleKeyUpEvent, this);
        this.twoColumnView.removeEventListener(FormViewEvent.EventType.SUBMIT, this.handleFormSubmittedEvent, this);
        this.sendButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.handleSendButtonClickedEvent, this);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.chooseOrUploadImageButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.handleChooseOrUploadImageViewClickedEvent, this);
        this.textAreaView.addEventListener(KeyBoardEvent.EventTypes.KEY_PRESS, this.handleKeyPressEvent, this);
        this.textAreaView.addEventListener(KeyBoardEvent.EventTypes.KEY_UP, this.handleKeyUpEvent, this);
        this.twoColumnView.addEventListener(FormViewEvent.EventType.SUBMIT, this.handleFormSubmittedEvent, this);
        this.sendButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.handleSendButtonClickedEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @return {Object}
     */
    getFormData: function() {
        return this.formView.getFormData();
    },

    /**
     * @private
     * @param {KeyBoardEvent} event
     */
    processEnterKeyEvent: function(event) {
        var ctl             = event.getControlKey();
        var shift           = event.getShiftKey();
        var submitOnEnter   = this.submitOnEnterCheckBoxView.isChecked();
        if (submitOnEnter) {
            if (!ctl && !shift) {
                this.relayChatMessage();
            } else {
                this.insertLineBreak();
            }
        } else {
            if (ctl || shift) {
                this.relayChatMessage();
            } else {
                this.insertLineBreak();
            }
        }
    },

    /**
     * @protected
     */
    relayChatMessage: function() {
        // currently only supports text chatmessages via this function
        var formData = this.getFormData();
        console.log("formData:", formData);
        if (!/\S/.test(formData.text)) {
            formData.text = "(y)";
        }
        if (!formData.type) {
            formData.type = "text";
        }

        var chatMessageData = {
            type: formData.type,
            body: {parts: [{
                type: "text",
                text: formData.text
            }]}
        };
        this.commandModule.relayCommand(CommandType.SUBMIT.CHAT_MESSAGE, chatMessageData);
        this.textAreaView.setValue("");
        this.sendButtonTextView.setText("Ok");
    },

    /**
     * @protected
     */
    insertLineBreak: function() {
        var content     = this.textAreaView.getValue();
        var caret       = this.textAreaView.getCaret();
        this.textAreaView.setValue(content.substring(0, caret) +
            "\n" + content.substring(caret, content.length));
        this.textAreaView.setCaret(caret + 1);
    },


    //-------------------------------------------------------------------------------
    // View Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ButtonViewEvent} event
     */
    handleChooseOrUploadImageViewClickedEvent: function(event) {
        this.commandModule.relayCommand(CommandType.DISPLAY.WORKSPACE, {});
        this.commandModule.relayCommand(CommandType.DISPLAY.IMAGE_EDITOR, {});
        this.commandModule.relayCommand(CommandType.DISPLAY.IMAGE_UPLOAD, {});
        //NOTE: This will later show the ChooseOrUploadImageContainer
    },

    /**
     * @private
     * @param {ButtonViewEvent} event
     */
    handleSendButtonClickedEvent: function(event) {
        // fires off FormViewEvent.EventType.SUBMIT
        // gets picked up by the handleFormSubmittedEvent event listener function
        this.commandModule.relayMessage(CommandModule.MessageType.BUTTON_CLICKED, {buttonName: "ChatWidgetInputFormSendButton"});
        this.relayChatMessage();
    },

    /**
     * @private
     * @param {FormViewEvent} event
     */
    handleFormSubmittedEvent: function(event) {
        this.relayChatMessage();
    },

    /**
     * @private
     * @param {KeyBoardEvent} event
     */
    handleKeyPressEvent: function(event) {
        var key     = event.getKeyCode();
        if (key === 13) {
            var htmlEvent = event.getData().event;
            htmlEvent.preventDefault();
            htmlEvent.stopPropagation();
        } else {
            var formData  = this.getFormData();
            if (!/\S/.test(formData.text)) {
                this.sendButtonTextView.setText("Ok");
            } else {
                this.sendButtonTextView.setText("Send");
            }
        }
    },

    /**
     * @private
     * @param {KeyBoardEvent} event
     */
    handleKeyUpEvent: function(event) {
        var key     = event.getKeyCode();
        if (key === 13) {
            this.processEnterKeyEvent(event);
        }
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ChatWidgetInputFormContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatWidgetInputFormContainer", ChatWidgetInputFormContainer);
