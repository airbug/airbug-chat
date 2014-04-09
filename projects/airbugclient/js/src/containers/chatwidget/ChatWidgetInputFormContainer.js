//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ChatWidgetInputFormContainer')

//@Require('Class')
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

        /**
         * @private
         * @type {MessageHandlerModule}
         */
        this.messageHandlerModule           = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {FormView}
         */
        this.chatWidgetFormView             = null;

        /**
         * @private
         * @type {ButtonView}
         */
        this.chooseOrUploadImageButtonView  = null;

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

        view(TwoColumnView)
            .name("twoColumnView")
            .attributes({
                configuration: TwoColumnView.Configuration.THIN_RIGHT,
                rowStyle: MultiColumnView.RowStyle.FLUID
            })
            .children([
                view(FormView)
                    .name("chatWidgetFormView")
                    .attributes({
                        classes: "form-horizontal"
                    })
                    .appendTo("#column1of2-{{cid}}")
                    .children([
                        view(FormControlGroupView)
                            .attributes({
                                classes: "control-group-textarea"
                            })
                            .children([
                                view(TextAreaView)
                                    .name("textAreaView")
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
                                            .name("submitOnEnterCheckBoxView")
                                            .attributes({
                                                checked: true
                                            })
                                    ])
                            ])
                    ]),
                view(TwoColumnView)
                    .attributes({
                        configuration: TwoColumnView.Configuration.THICK_RIGHT,
                        rowStyle: MultiColumnView.RowStyle.FLUID
                    })
                    .children([
                        view(ButtonView)
                            .name("chooseOrUploadImageButtonView")
                            .appendTo("#column1of2-{{cid}}")
                            .attributes({
                                buttonClasses: "choose-or-upload-image-button"
                            })
                            .children([
                                view(IconView)
                                    .attributes({
                                        type: IconView.Type.CAMERA
                                    })
                                    .appendTo("#button-{{cid}}")
                            ]),
                        view(ButtonView)
                            .name("sendButtonView")
                            .appendTo("#column2of2-{{cid}}")
                            .attributes({
                                classes: "chat-widget-input-send-button-wrapper",
                                buttonClasses: "chat-widget-input-send-button"
                            })
                            .children([
                                view(TextView)
                                    .name("sendButtonTextView")
                                    .attributes({
                                        text: "Send"
                                    })
                                    .appendTo('#button-{{cid}}')
                            ])
                    ])
            ])
            .build(this);


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.twoColumnView);
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
        return this.chatWidgetFormView.getFormData();
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
        this.messageHandlerModule.sendMessage(chatMessageData);
        this.textAreaView.setValue("");
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
        this.commandModule.relayCommand(CommandType.DISPLAY.IMAGE_UPLOAD, {});
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
        } else {
            var formData  = this.getFormData();
            /*if (!/\S/.test(formData.text)) {
                this.sendButtonTextView.setText("Ok");
            } else {
                this.sendButtonTextView.setText("Send");
            }*/
        }
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ChatWidgetInputFormContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule"),
        property("messageHandlerModule").ref("messageHandlerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatWidgetInputFormContainer", ChatWidgetInputFormContainer);
