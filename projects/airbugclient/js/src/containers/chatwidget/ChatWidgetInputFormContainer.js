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
         * @type {FormView}
         */
        this.formView                       = null;

        /**
         * @private
         * @type {TextView}
         */
        this.sendButtonTextView                 = null;

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
                                            name: "body"
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
                        .appendTo(".column2of2")
                        .children([
                            view(TextView)
                                .id("sendButtonTextView")
                                .attributes({text: "Ok"})
                                .appendTo('button[id|="button"]')
                        ])
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.twoColumnView);

        this.formView                   = this.findViewById("chatWidgetInputForm");
        this.sendButtonTextView         = this.findViewById("sendButtonTextView");
        this.submitOnEnterCheckBoxView  = this.findViewById("submitOnEnterCheckBox");
        this.textAreaView               = this.findViewById("chatInputTextArea");
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.textAreaView.removeEventListener(KeyBoardEvent.EventTypes.KEY_UP, this.handleKeyUpEvent, this);
        this.twoColumnView.removeEventListener(FormViewEvent.EventType.SUBMIT, this.handleFormSubmittedEvent, this);
        this.twoColumnView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.handleButtonClickedEvent, this);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.textAreaView.addEventListener(KeyBoardEvent.EventTypes.KEY_UP, this.handleKeyUpEvent, this);
        this.twoColumnView.addEventListener(FormViewEvent.EventType.SUBMIT, this.handleFormSubmittedEvent, this);
        this.twoColumnView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.handleButtonClickedEvent, this);
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
     */
    processEnterKey: function() {
        var submitOnEnter = this.submitOnEnterCheckBoxView.isChecked();
        if (submitOnEnter) {
            this.submitForm();
        }
    },

    /**
     * @protected
     */
    relayChatMessage: function() {
        var formData = this.getFormData();
        console.log("formData:", formData);
        if (formData.body === "") {
            formData.body = "(y)";
        }
        if (!formData.type) {
            formData.type = "text";
        }
        this.commandModule.relayCommand(CommandType.SUBMIT.CHAT_MESSAGE, formData);
        this.textAreaView.setValue("");
        this.sendButtonTextView.setText("Ok");
    },


    //-------------------------------------------------------------------------------
    // View Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ButtonViewEvent} event
     */
    handleButtonClickedEvent: function(event) {
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
    handleKeyUpEvent: function(event) {
        var key     = event.getKeyCode();
        var ctl     = event.getControlKey();
        var shift   = event.getShiftKey();
        if (key === 13 && !ctl && !shift) {
            this.processEnterKey();
        } else {
            var formData  = this.getFormData();
            if (formData.body === "") {
                this.sendButtonTextView.setText("Ok");
            } else {
                this.sendButtonTextView.setText("Send");
            }
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
