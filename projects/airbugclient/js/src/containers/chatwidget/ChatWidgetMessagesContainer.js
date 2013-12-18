//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatWidgetMessagesContainer')

//@Require('AddChange')
//@Require('Class')
//@Require('ClearChange')
//@Require('Map')
//@Require('RemoveChange')
//@Require('airbug.ChatMessageCodeContainer')
//@Require('airbug.ChatMessageImageContainer')
//@Require('airbug.ChatMessageTextContainer')
//@Require('airbug.ListView')
//@Require('airbug.ListItemView')
//@Require('airbug.PanelView')
//TEMP
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//TEMP
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var AddChange                       = bugpack.require('AddChange');
var Class                           = bugpack.require('Class');
var ClearChange                     = bugpack.require('ClearChange');
var Map                             = bugpack.require('Map');
var RemoveChange                    = bugpack.require('RemoveChange');
var ChatMessageCodeContainer        = bugpack.require('airbug.ChatMessageCodeContainer');
var ChatMessageImageContainer       = bugpack.require('airbug.ChatMessageImageContainer');
var ChatMessageTextContainer        = bugpack.require('airbug.ChatMessageTextContainer');
var ListView                        = bugpack.require('airbug.ListView');
var ListItemView                    = bugpack.require('airbug.ListItemView');
var PanelView                       = bugpack.require('airbug.PanelView');
//TEMP
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
//TEMP
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var autowired                   = AutowiredAnnotation.autowired;
var property                    = PropertyAnnotation.property;
var view                            = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatWidgetMessagesContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {ChatMessageList} chatMessageList
     */
    _constructor: function(chatMessageList) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<ChatMessageModel, ChatMessageContainer>}
         */
        this.chatMessageModelToChatMessageContainerMap  = new Map();


        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatMessageList}
         */
        this.chatMessageList                            = chatMessageList;

        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {PanelView}
         */
        this.chatWidgetMessagesView                     = null;

        //TEMP
        this.currentUserManagerModule                   = null;

        this.currentUser                                = null;
        //TEMP

    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        var _this = this;
        this._super(routerArgs);
        //TEMP
        this.currentUserManagerModule.retrieveCurrentUser(function(throwable, currentUser){
            if(!throwable && currentUser) {
                _this.currentUser = currentUser.getFullName();
            }
        });
        //TEMP
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Views
        //-------------------------------------------------------------------------------

        this.chatWidgetMessagesView =
            view(PanelView)
                .children([
                    view(ListView)
                        .id("messageListView")
                        .appendTo('*[id|="panel-body"]')
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.chatWidgetMessagesView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.processChatMessageList();
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.chatMessageList.observe(AddChange.CHANGE_TYPE, "", this.observeChatMessageListAdd, this);
        this.chatMessageList.observe(ClearChange.CHANGE_TYPE, "", this.observeChatMessageListClear, this);
        this.chatMessageList.observe(RemoveChange.CHANGE_TYPE, "", this.observeChatMessageListRemove, this);
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    animateChatMessageCollectionAdd: function() {
        var panelBody = this.chatWidgetMessagesView.$el.find(".panel-body");
        panelBody.animate({scrollTop: panelBody.prop("scrollHeight")}, 600);
        //TODO:
        //make the transition time dynamic to fit the length of the message and the speed of incoming messages
        //NOTE: SUNG I think we should make automatic scrolling only occur while the user is active.
        // Forcing user scrolling for messages that were recieved while away would help us as well as the user to keep track of read and unread messages.
    },

    /**
     * @protected
     * @param {ChatMessageModel} chatMessageModel
     */
    createChatMessageContainer: function(chatMessageModel) {
        //TEMP
        var time = new Date().toString();
        chatMessageModel.setProperty("sentBy", this.currentUser);
        chatMessageModel.setProperty("createdAt", time.substring(16,24) + time.substring(33));
        //TEMP

        if (!this.chatMessageModelToChatMessageContainerMap.containsKey(chatMessageModel)) {
            var type = chatMessageModel.getProperty("type");
            /** @type {ChatMessageContainer} */
            var chatMessageContainer = undefined;
            switch (type) {
                case "text":
                    chatMessageContainer = new ChatMessageTextContainer(chatMessageModel);
                    break;
                case "code":
                    chatMessageContainer = new ChatMessageCodeContainer(chatMessageModel);
                    break;
                case "image":
                    chatMessageContainer = new ChatMessageImageContainer(chatMessageModel);
                    break;
                default:
                    throw new Error("Unrecognized message type '" + type + "'");
            }
            this.chatMessageModelToChatMessageContainerMap.put(chatMessageModel, chatMessageContainer);
            this.addContainerChild(chatMessageContainer, '.list');
        }
    },

    /**
     *
     */
    processChatMessageList: function() {
        var _this = this;
        this.chatMessageList.forEach(function(chatMessageModel) {
            _this.createChatMessageContainer(chatMessageModel);
        });
    },


    //-------------------------------------------------------------------------------
    // Model Observers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {AddAtChange} change
     */
    observeChatMessageListAdd: function(change) {
        var chatMessageModel = change.getValue();
        this.createChatMessageContainer(chatMessageModel);
        this.animateChatMessageCollectionAdd();
    },

    /**
     * @private
     * @param {ClearChange} change
     */
    observeChatMessageListClear: function(change) {
        this.removeAllContainerChildren(true);
        this.chatMessageModelToChatMessageContainerMap.clear();
        this.processChatMessageList();
    },

    /**
     * @private
     * @param {RemoveAtChange} change
     */
    observeChatMessageListRemove: function(change) {
        var chatMessageModel = change.getValue();
        var chatMessageContainer = this.chatMessageModelToChatMessageContainerMap.get(chatMessageModel);
        this.chatMessageModelToChatMessageContainerMap.remove(chatMessageModel);
        this.removeContainerChild(chatMessageContainer, true);
    }
});

//TEMP
//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ChatWidgetMessagesContainer).with(
    autowired().properties([
        property("currentUserManagerModule").ref("currentUserManagerModule"),
    ])
);
//TEMP

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatWidgetMessagesContainer", ChatWidgetMessagesContainer);
