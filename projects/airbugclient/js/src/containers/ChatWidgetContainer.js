//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatWidgetContainer')

//@Require('Class')
//@Require('Obj')
//@Require('airbug.ChatMessageCollection')
//@Require('airbug.ChatWidgetInputFormContainer')
//@Require('airbug.ChatWidgetMessagesContainer')
//@Require('airbug.ChatMessageContainer')
//@Require('airbug.ChatWidgetView')
//@Require('airbug.CodeChatMessageModel')
//@Require('airbug.CommandModule')
//@Require('airbug.MessageView')
//@Require('airbug.PanelView')
//@Require('airbug.RequestFailedException')
//@Require('airbug.TextChatMessageModel')
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
var Obj                             = bugpack.require('Obj');
var ChatMessageCollection           = bugpack.require('airbug.ChatMessageCollection');
var ChatWidgetInputFormContainer    = bugpack.require('airbug.ChatWidgetInputFormContainer');
var ChatWidgetMessagesContainer     = bugpack.require('airbug.ChatWidgetMessagesContainer');
var ChatMessageContainer            = bugpack.require('airbug.ChatMessageContainer');
var ChatWidgetView                  = bugpack.require('airbug.ChatWidgetView');
var CodeChatMessageModel            = bugpack.require('airbug.CodeChatMessageModel');
var CommandModule                   = bugpack.require('airbug.CommandModule');
var MessageView                     = bugpack.require('airbug.MessageView');
var PanelView                       = bugpack.require('airbug.PanelView');
var RequestFailedException          = bugpack.require('airbug.RequestFailedException');
var TextChatMessageModel            = bugpack.require('airbug.TextChatMessageModel');
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

var ChatWidgetContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {airbug.ConversationModel} conversationModel
     */
    _constructor: function(conversationModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ConversationModel}
         */
        this.conversationModel              = conversationModel;

        /**
         * @private
         * @type {ChatMessageCollection}
         */
        this.chatMessageCollection          = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatWidgetView}
         */
        this.chatWidgetView                 = null;

        /**
         * @private
         * @type {ChatWidgetInputFormContainer}
         */
        this.chatWidgetInputFormContainer   = null;

        /**
         * @private
         * @type {ChatWidgetMessagesContainer}
         */
        this.chatWidgetMessagesContainer    = null;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatMessageManagerModule}
         */
        this.chatMessageManagerModule       = null;

        /**
         * @private
         * @type {airbug.CommandModule}
         */
         this.commandModule                 = null;

        /**
         * @private
         * @type {CurrentUserManagerModule}
         */
        this.currentUserManagerModule       = null;

        /**
         * @private
         * @type {UserManagerModule}
         */
        this.userManagerModule              = null;

    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        this._super(routerArgs);
        this.loadChatMessageCollection(this.conversationModel.get("id"));
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Models
        //-------------------------------------------------------------------------------

        this.chatMessageCollection = new ChatMessageCollection([]);
        this.addCollection("chatMessageCollection", this.chatMessageCollection);


        // Create Views
        //-------------------------------------------------------------------------------

        this.chatWidgetView =
            view(ChatWidgetView)
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.chatWidgetView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.chatWidgetMessagesContainer        = new ChatWidgetMessagesContainer(this.conversationModel);
        this.addContainerChild(this.chatWidgetMessagesContainer, '#chat-widget-messages-' + this.chatWidgetView.cid);
        this.chatWidgetInputFormContainer       = new ChatWidgetInputFormContainer();
        this.addContainerChild(this.chatWidgetInputFormContainer, "#chat-widget-input-" + this.chatWidgetView.cid);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.conversationModel.bind('change:id', this.handleConversationModelChangeId, this);
        this.chatMessageCollection.bind('add', this.handleChatMessageCollectionAdd, this);

        this.initializeCommandSubscriptions();
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    animateChatMessageCollectionAdd: function(){
        var panelBody = this.chatWidgetView.$el.find(".panel-body");
        panelBody.animate({scrollTop: panelBody.prop("scrollHeight")}, 600);
        //TODO:
        //make the transition time dynamic to fit the length of the message and the speed of incoming messages
    },

    /**
     * @protected
     */
    initializeCommandSubscriptions: function() {
        this.commandModule.subscribe(CommandType.SUBMIT.CHAT_MESSAGE, this.handleSubmitChatMessageCommand, this);
    },

    /**
     * @protected
     * @param {string} conversationId
     */
    loadChatMessageCollection: function(conversationId) {

        // TODO BRN: This is where we make an api call and send both the conversationUuid and the messageCollection.
        // The api call would then be responsible for adding ChatMessageModels to the chatMessageCollection.

        var _this = this;
        this.chatMessageManagerModule.retrieveChatMessagesByConversationId(conversationId, function(throwable, chatMessageMeldDocuments) {
            if (!throwable) {
                chatMessageMeldDocuments.forEach(function(chatMessageMeldDocument) {
                    var chatMessageModel = new TextChatMessageModel(chatMessageMeldDocument);
                    chatMessageModel.set({
                        pending: false,
                        failed: false
                    });
                    _this.chatMessageCollection.add(chatMessageModel);
                });
            }
        });
    },

    /**
     * @protected
     * @param {{*}} chatMessageData
     */
    sendChatMessage: function(chatMessageData) {
        var _this = this;
        var chatMessage = this.chatMessageManagerModule.generateChatMessage(Obj.merge(chatMessageData, {
            conversationId: this.conversationModel.get("id"),
            sentAt: new Date().toString()
        }));
        var newChatMessageModel = undefined;
        if (chatMessage.type === "text") {
            newChatMessageModel = new TextChatMessageModel(chatMessage);
        } else if (chatMessage.type === "code") {
            newChatMessageModel = new CodeChatMessageModel(chatMessage);
        }

        this.chatMessageCollection.add(newChatMessageModel);
        this.chatMessageManagerModule.createChatMessage(chatMessage, function(throwable, chatMessageMeldDocument) {

            console.log("Inside ChatWidgetContainer#handleInputFormSubmit callback");
            console.log("throwable:", throwable, " chatMessageMeldDocument:", chatMessageMeldDocument);

            if (!throwable) {
                _this.userManagerModule.retrieveUser(chatMessageMeldDocument.getData().senderUserId, function(throwable, senderUserMeldDocument) {
                    if (!throwable) {
                        newChatMessageModel.setMeldDocument(chatMessageMeldDocument);
                        newChatMessageModel.set({
                            sentBy: senderUserMeldDocument.getData().firstName + " " + senderUserMeldDocument.getData().lastName,
                            pending: false,
                            failed: false
                        });
                    } else {
                        if (Class.doesExtend(throwable, RequestFailedException)) {
                            newChatMessageModel.set({
                                failed: true,
                                pending: false
                            });
                        } else {
                            console.log("ERROR - unhandled throwable:", throwable);
                        }
                    }
                });
            } else {
                if (Class.doesExtend(throwable, RequestFailedException)) {
                    newChatMessageModel.set({
                        failed: true,
                        pending: false
                    });
                } else {
                    console.log("ERROR - unhandled throwable:", throwable);
                }
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Message Handlers
    //-------------------------------------------------------------------------------

    /**
     * @param {PublisherMessage} message
     */
    handleSubmitChatMessageCommand: function(message) {
        var chatMessageObject = message.getData();
        this.sendChatMessage(chatMessageObject);
    },


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    handleConversationModelChangeId: function() {
        this.loadChatMessageCollection(this.conversationModel.get('id'));
    },

    /**
     * @private
     * @param {ChatMessageModel} chatMessageModel
     */
    handleChatMessageCollectionAdd: function(chatMessageModel) {
        this.chatWidgetMessagesContainer.addContainerChild(new ChatMessageContainer(chatMessageModel), '.list');
        this.animateChatMessageCollectionAdd();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ChatWidgetContainer).with(
    autowired().properties([
        property("chatMessageManagerModule").ref("chatMessageManagerModule"),
        property("commandModule").ref("commandModule"),
        property("currentUserManagerModule").ref("currentUserManagerModule"),
        property("userManagerModule").ref("userManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatWidgetContainer", ChatWidgetContainer);
