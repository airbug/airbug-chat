//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatWidgetInputFormContainer')

//@Require('Class')
//@Require('airbug.BoxView')
//@Require('airbug.ButtonView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.ChatWidgetInputFormView')
//@Require('airbug.CommandModule')
//@Require('airbug.FormViewEvent')
//@Require('airbug.IconView')
//@Require('airbug.MultiColumnView')
//@Require('airbug.TextView')
//@Require('airbug.ThreeColumnView')
//@Require('airbug.TwoColumnView')
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

var Class                   = bugpack.require('Class');
var BoxView                 = bugpack.require('airbug.BoxView');
var ButtonView              = bugpack.require('airbug.ButtonView');
var ButtonViewEvent         = bugpack.require('airbug.ButtonViewEvent');
var ChatWidgetInputFormView = bugpack.require('airbug.ChatWidgetInputFormView');
var CommandModule           = bugpack.require('airbug.CommandModule');
var FormViewEvent           = bugpack.require('airbug.FormViewEvent');
var IconView                = bugpack.require('airbug.IconView');
var MultiColumnView         = bugpack.require('airbug.MultiColumnView');
var TextView                = bugpack.require('airbug.TextView');
var ThreeColumnView         = bugpack.require('airbug.ThreeColumnView');
var TwoColumnView           = bugpack.require('airbug.TwoColumnView');
var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer       = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


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

var ChatWidgetInputFormContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(conversationModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @type {airbug.ConversationModel}
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
         * @type {TwoColumnView}
         */
        this.twoColumnView                  = null;

        /**
         * @private
         * @type {ChatWidgetInputFormView}
         */
        this.chatWidgetInputFormView        = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    activateContainer: function(routerArgs) {
        this._super(routerArgs);
        this.twoColumnView.$el.find("textarea")[0].focus();
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
                    view(ChatWidgetInputFormView)
                        .id("chatWidgetInputForm")
                        .appendTo(".column1of2"),
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
                                .attributes({text: "Send"})
                                .appendTo('button[id|="button"]')
                        ])
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.twoColumnView);

        this.chatWidgetInputFormView =  this.findViewById("chatWidgetInputForm");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.twoColumnView.addEventListener(FormViewEvent.EventType.SUBMIT, this.handleFormSubmittedEvent, this);
        this.twoColumnView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.handleButtonClickedEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {FormViewEvent} event
     */
    handleFormSubmittedEvent: function(event) {

        //NOTE SC: See ChatWidgetContainer

        var formData = event.getData().formData;
        this.commandModule.relayCommand(CommandType.SUBMIT.CHAT_MESSAGE, formData);
    },

    /**
     * @private
     * @param {ButtonViewEvent} event
     */
    handleButtonClickedEvent: function(event) {
        // fires off FormViewEvent.EventType.SUBMIT
        // gets picked up by the handleFormSubmittedEvent event listener function
        this.commandModule.relayMessage(CommandModule.MessageType.BUTTON_CLICKED, {buttonName: "ChatWidgetInputFormSendButton"});
        this.chatWidgetInputFormView.submitForm();
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
