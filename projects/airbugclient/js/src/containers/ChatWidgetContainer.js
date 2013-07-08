//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatWidgetContainer')

//@Require('Class')
//@Require('airbug.ChatMessageCollection')
//@Require('airbug.ChatMessageModel')
//@Require('airbug.ChatWidgetInputFormContainer')
//@Require('airbug.ChatWidgetView')
//@Require('airbug.ListView')
//@Require('airbug.ListItemView')
//@Require('airbug.MessageView')
//@Require('airbug.PanelView')
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
var ChatWidgetView                  = bugpack.require('airbug.ChatWidgetView');
var ListView                        = bugpack.require('airbug.ListView');
var ListItemView                    = bugpack.require('airbug.ListItemView');
var MessageView                     = bugpack.require('airbug.MessageView');
var PanelView                       = bugpack.require('airbug.PanelView');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


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
         * @type {ListView}
         */
        this.messageListView                = null;


        // Modules
        //-------------------------------------------------------------------------------

        this.chatMessageManagerModule       = null;

        this.userManagerModule             = null;

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
        // this.textAreaView.focus();
        // this.loadChatMessageCollection(this.conversationModel.get("_id"));
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
                .children([
                    view(PanelView)
                        .appendTo('*[id|="chat-widget-messages"]')
                        .children([
                            view(ListView)
                                .id("messageListView")
                                .appendTo('*[id|="panel-body"]')
                        ])
                    //     ,
                    // view(TextAreaView)
                    //     .id("textAreaView")
                    //     .attributes({rows: 1})
                    //     .appendTo('*[id|="chat-widget-input"]')
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.chatWidgetView);
        this.messageListView    = this.findViewById("messageListView");
        // this.textAreaView       = this.findViewById("textAreaView");
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.chatWidgetInputFormContainer      = new ChatWidgetInputFormContainer();
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

        this.chatMessageManagerModule.retrieveChatMessagesByConversationId(conversationId, function(error, chatMessageObjs){
            if(!error && chatMessageObjs.length > 0){
                chatMessageObjs.forEach(function(chatMessageObj){
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

    handleInputFormSubmit: function(event){
        console.log("Inside ChatWidgetContainer#handleInputFormSubmit");
        var _this = this;
        var chatMessage = event.getData();
        console.log("event:", event);
        console.log("chatMessage:", chatMessage);
        chatMessage.conversationId = this.conversationModel.get("ownerId");
        chatMessage.conversationOwnerId = this.conversationModel.get("_id");
        // event.preventDefault();
        this.chatMessageManagerModule.createChatMessage(chatMessage, function(error, chatMessageObj){
            console.log("Inside ChatWidgetContainer#handleInputFormSubmit callback");
            console.log("error:", error, "chatMessageObj:", chatMessageObj);
            if(!error && chatMessageObj){
                var sender = _this.userManagerModule.get(chatMessageObj.senderUserId);
                chatMessageObj.sentBy = sender.firstName + sender.lastName;
                chatMessageObj.sentAt = chatMessageObj.createdAt;
                _this.chatMessageCollection.add(new ChatMessageModel(chatMessageObj, chatMessageObj._id));
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
        console.log("Inside ChatWidgetContainer#handleChatMessageCollectionAdd");
        console.log("chatMessageModel:", chatMessageModel);
        var listItemView =
            view(ListItemView)
                .model(chatMessageModel)
                .attributes({size: "flex"})
                .children([
                    view(MessageView)
                        .model(chatMessageModel)
                ])
                .build();

        this.messageListView.addViewChild(listItemView);
    }
});

annotate(ChatWidgetContainer).with(
    autowired().properties([
        property("chatMessageManagerModule").ref("chatMessageManagerModule"),
        property("userManagerModule").ref("userManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatWidgetContainer", ChatWidgetContainer);
