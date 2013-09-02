//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatMessageManagerModule')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('Set')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Map         = bugpack.require('Map');
var Obj         = bugpack.require('Obj');
var Set         = bugpack.require('Set');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageManagerModule = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(airbugApi, currentUserManagerModule) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AirbugApi}
         */
        this.airbugApi                          = airbugApi;

        /**
         * @private
         * @type {Map}
         */
        this.chatMessagesMap                    = new Map();

        /**
         * @private
         * @type {Map} // Maps string ids to Sets of ChatMessages
         */
        this.conversationIdToChatMessagesMap    = new Map();

        /**
         * @private
         * @type {CurrentUserManagerModule}
         */
        this.currentUserManagerModule           = currentUserManagerModule;

    },

    clearCache: function(){
        this.chatMessagesMap.clear();
    },

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @param {string} id
     * @return {ChatMessageObj}
     */
    get: function(id){
        console.log("Inside ChatMessageManangerModule#get");
        return this.chatMessagesMap.get(id);
    },

    /**
     * @param {string} conversationId
     */
    getAllByConversationId: function(conversationId){
        console.log("Inside ChatMessageManangerModule#getAllByConversationId");
        return this.conversationIdToChatMessagesMap.get(conversationId);
    },

    /**
     * @param {string} conversationId
     * @param {ChatMessageObj} chatMessage
     */
    putByConversationId: function(conversationId, chatMessage){
        console.log("Inside ChatMessageManangerModule#putByConversationId");
        var storedMessages = this.conversationIdToChatMessagesMap.get(conversationId);
        if (storedMessages){
            storedMessages.add(chatMessage);
        } else {
            storedMessages = new Set([chatMessage]);
            this.conversationIdToChatMessagesMap.put(conversationId, storedMessages);
        }
    },

    /**
     * @param {string} conversationId
     * @param {Array.<ChatMessageObj>} chatMessages
     */
    putAllByConversationId: function(conversationId, chatMessages){
        console.log("Inside ChatMessageManangerModule#putAllByConversationId");
        var storedMessages = this.conversationIdToChatMessagesMap.get(conversationId);
        if(storedMessages){
            storedMessages.addAll(chatMessages);
        } else {
            storedMessages = new Set(chatMessages);
            this.conversationIdToChatMessagesMap.put(conversationId, storedMessages);
        }
    },

    /**
     * @param {string} conversationId
     */
    removeAllByConversationId: function(conversationId){
        console.log("Inside ChatMessageManangerModule#removeAllByConversationId");
        this.conversationIdToChatMessagesMap.remove(conversationId);
    },

    /**
     * @param {string} id
     * @return {ChatMessageObj}
     */
    put: function(id, chatMessage){
        console.log("Inside ChatMessageManangerModule#put");
        this.chatMessagesMap.put(id, chatMessage);
    },

    /**
     * @param {Array.<ChatMessageObj>} chatMessages
     */
    putAll: function(chatMessages){
        var _this = this;
        chatMessages.forEach(function(chatMessage){
            _this.put(chatMessage._id, chatMessage);
        });
    },

    /**
     * @param {string} id
     * @return {ChatMessageObj}
     */
    remove: function(id){
        console.log("Inside ChatMessageManangerModule#remove");
        this.chatMessagesMap.remove(id);
    },

    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {{
     *      conversationOwnerId: {string},
     *      conversationId: {string},
     *      senderUserId: {string},
     *      messageBody: {string}
     * }} chatMessageObj
     * @param {function(error, chatMessageObj)} callback
     */
    createChatMessage: function(chatMessageObj, callback){
        var _this = this;
        console.log("Inside ChatMessageManangerModule#creatChatMessage");
        console.log("chatMessageObj:", chatMessageObj);
        var chatMessageBody     = chatMessageObj.body;
        var conversationId      = chatMessageObj.conversationId;
        var conversationOwnerId = chatMessageObj.conversationOwnerId;
        var senderUserId        = this.currentUserManagerModule.currentUser._id; //TODO: Update this
        this.airbugApi.createChatMessage(chatMessageBody, senderUserId, conversationId, conversationOwnerId, function(error, chatMessage){
            if(!error && chatMessage){
                _this.putByConversationId(conversationId, chatMessage)
                _this.put(chatMessage._id, chatMessage);
            }
            callback(error, chatMessage);
        });
    },

    retrieveChatMessage: function(chatMessageId, callback){
        //TODO
    },

    retrieveChatMessages: function(chatMessageIds, callback){
        //TODO
    },

    /**
     * @param {string} conversationId
     * @param {function(Error, Array.<chatMessageObj>)} callback
     */
    retrieveChatMessagesByConversationId: function(conversationId, callback){
        var _this = this;
        this.airbugApi.retrieveChatMessagesByConversationId(conversationId, function(error, chatMessageObjs){
            if(!error && chatMessageObjs.length > 0){
                _this.putAllByConversationId(conversationId, chatMessageObjs);
                _this.putAll(chatMessageObjs);
            }
            callback(error, chatMessageObjs);
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatMessageManagerModule", ChatMessageManagerModule);
