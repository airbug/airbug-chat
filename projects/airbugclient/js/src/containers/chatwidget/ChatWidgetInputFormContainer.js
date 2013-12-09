//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatWidgetInputFormContainer')

//@Require('Class')
//@Require('airbug.ButtonView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.FormViewEvent')
//@Require('airbug.ChatWidgetInputFormView')
//@Require('airbug.CommandModule')
//@Require('airbug.MultiColumnView')
//@Require('airbug.TextView')
//@Require('airbug.ThreeColumnView')
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
var ButtonView              = bugpack.require('airbug.ButtonView');
var ButtonViewEvent         = bugpack.require('airbug.ButtonViewEvent');
var ChatWidgetInputFormView = bugpack.require('airbug.ChatWidgetInputFormView');
var CommandModule           = bugpack.require('airbug.CommandModule');
var FormViewEvent           = bugpack.require('airbug.FormViewEvent');
var MultiColumnView         = bugpack.require('airbug.MultiColumnView');
var TextView                = bugpack.require('airbug.TextView');
var ThreeColumnView         = bugpack.require('airbug.ThreeColumnView');
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
         * @type {ThreeColumnView}
         */
        this.threeColumnView                = null;

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
        this.threeColumnView.$el.find("textarea")[0].focus();
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Views
        //-------------------------------------------------------------------------------

        this.threeColumnView =
            view(ThreeColumnView)
                .attributes({
                    configuration: ThreeColumnView.Configuration.CHAT_WIDGET_INPUT_CONTAINER,
                    rowStyle: MultiColumnView.RowStyle.FLUID
                })
                .id("chatWidgetInputRowContainer")
                .children([
                    view(ChatWidgetInputFormView)
                        .id("chatWidgetInputForm")
                        .appendTo(".column1of3"),
                    //TODO Make real image button
                    view(ButtonView)
                        .appendTo(".column2of3")
                        .children([
                            view(TextView)
                                .attributes({text: "img"})
                                .appendTo('*[id|="button"]')
                        ]),
                    view(ButtonView)
                        .appendTo(".column3of3")
                        .children([
                            view(TextView)
                                .attributes({text: "Send"})
                                .appendTo('*[id|="button"]')
                        ])
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.threeColumnView);

        this.chatWidgetInputFormView = this.findViewById("chatWidgetInputForm");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.threeColumnView.addEventListener(FormViewEvent.EventType.SUBMIT, this.handleFormSubmittedEvent, this);
        this.threeColumnView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.handleButtonClickedEvent, this);

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
