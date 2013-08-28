//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatWidgetContainer')

//@Require('Class')
//@Require('airbug.ChatMessageCollection')
//@Require('airbug.ChatMessageModel')
//@Require('airbug.ChatWidgetInputFormContainer')
//@Require('airbug.ChatWidgetMessagesContainer')
//@Require('airbug.ChatMessageContainer')
//@Require('airbug.ChatWidgetView')
//@Require('airbug.ListView')
//@Require('airbug.ListItemView')
//@Require('airbug.MessageView')
//@Require('airbug.PanelView')
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
var ChatMessageCollection           = bugpack.require('airbug.ChatMessageCollection');
var ChatMessageModel                = bugpack.require('airbug.ChatMessageModel');
var ChatWidgetInputFormContainer    = bugpack.require('airbug.ChatWidgetInputFormContainer');
var ChatWidgetMessagesContainer     = bugpack.require('airbug.ChatWidgetMessagesContainer');
var ChatMessageContainer            = bugpack.require('airbug.ChatMessageContainer');
var ChatWidgetView                  = bugpack.require('airbug.ChatWidgetView');
var ListView                        = bugpack.require('airbug.ListView');
var ListItemView                    = bugpack.require('airbug.ListItemView');
var MessageView                     = bugpack.require('airbug.MessageView');
var PanelView                       = bugpack.require('airbug.PanelView');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta = BugMeta.context();
var view    = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatWidgetContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

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
        this.conversationModel      = conversationModel;

        /**
         * @private
         * @type {ChatMessageCollection}
         */
        this.chatMessageCollection  = null;


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

        /**
         * @private
         * @type {ListView}
         */
        this.messageListView                = null;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatMessageManagerModule}
         */
        this.chatMessageManagerModule       = null;

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
        this.loadChatMessageCollection(this.conversationModel.get("_id"));
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Models
        //-------------------------------------------------------------------------------

        this.chatMessageCollection = new ChatMessageCollection([], "chatMessageCollection");
        this.addCollection(this.chatMessageCollection);


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
        this.conversationModel.bind('change:_id', this.handleConversationModelChangeId, this);
        this.chatMessageCollection.bind('add', this.handleChatMessageCollectionAdd, this);

        this.chatWidgetInputFormContainer.getViewTop().addEventListener(FormViewEvent.EventType.SUBMIT, this.handleInputFormSubmit, this);
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} conversationUuid
     */
    loadChatMessageCollection: function(conversationId) {
        // TODO BRN: This is where we make an api call and send both the conversationUuid and the messageCollection.
        // The api call would then be responsible for adding ChatMessageModels to the chatMessageCollection.
        var _this = this;
        this.chatMessageManagerModule.retrieveChatMessagesByConversationId(conversationId, function(error, chatMessageObjs){
            if(!error && chatMessageObjs.length > 0){
                chatMessageObjs.forEach(function(chatMessageObj){
                    chatMessageObj.pending  = false;
                    chatMessageObj.failed   = false;
                    _this.chatMessageCollection.add(new ChatMessageModel(chatMessageObj, chatMessageObj._id));
                });
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    /**
     */
    handleInputFormSubmit: function(event){
        console.log("Inside ChatWidgetContainer#handleInputFormSubmit");
        var _this = this;
        var chatMessage = event.getData();
        chatMessage.conversationId      = this.conversationModel.get("_id");
        chatMessage.conversationOwnerId = this.conversationModel.get("ownerId");
        chatMessage.sentAt              = new Date().toJSON();

        var newChatMessageModel = new ChatMessageModel(chatMessage, null);
        this.chatMessageCollection.add(newChatMessageModel);

        this.chatMessageManagerModule.createChatMessage(chatMessage, function(error, chatMessageObj){
            console.log("Inside ChatWidgetContainer#handleInputFormSubmit callback");
            console.log("error:", error, "chatMessageObj:", chatMessageObj);
            if(!error && chatMessageObj){
                var sender              = _this.userManagerModule.get(chatMessageObj.senderUserId);
                chatMessageObj.sentBy   = sender.firstName + sender.lastName;
                chatMessageObj.pending  = false;
                // chatMessageObj.failed   = false;

                newChatMessageModel.set(chatMessageObj);
            } else if (error && !chatMessageObj){
                //TEST This
                chatMessageObj = {failed: true};
                newChatMessageModel.set(chatMessageObj);
            }
        });
    },

    /**
     * @private
     */
    handleConversationModelChangeId: function() {
        this.loadChatMessageCollection(this.conversationModel.get('_id'));
    },

    /**
     * @private
     * @param {ChatMessageModel} chatMessageModel
     */
    handleChatMessageCollectionAdd: function(chatMessageModel) {
        this.chatWidgetMessagesContainer.addContainerChild(new ChatMessageContainer(chatMessageModel), '.list');
        this.animateChatMessageCollectionAdd();
    },

    /**
     * @private
     */
    animateChatMessageCollectionAdd: function(){
        var panelBody = this.chatWidgetView.$el.find(".panel-body");
        panelBody.animate({scrollTop: panelBody.prop("scrollHeight")}, 600);
        //TODO:
        //make the transition time dynamic to fit the length of the message and the speed of incoming messages
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ChatWidgetContainer).with(
    autowired().properties([
        property("chatMessageManagerModule").ref("chatMessageManagerModule"),
        property("currentUserManagerModule").ref("currentUserManagerModule"),
        property("userManagerModule").ref("userManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatWidgetContainer", ChatWidgetContainer);
