//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatMessageManagerModule')

//@Require('Class')
//@Require('Map')
//@Require('Obj')


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


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageManagerModule = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(airbugApi) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AirbugApi}
         */
        this.airbugApi  = airbugApi;

        /**
         * @private
         * @type {Map}
         */
        this.chatMessagesMap   = new Map();

        /**
         * @private
         * @type {Map}
         */
        this.conversationIdToChatMessagesMap = new Map();

    },

    clearCache: function(){
        this.chatMessagesMap.clear();
    },

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @param {string} id
     * @return {roomObj}
     */
    get: function(id){
        return this.chatMessagesMap.get(id);
    },

    getAll: function(){
        return this.chatMessagesMap.getValueArray();
    },

    /**
     * @param {string} id
     * @return {roomObj}
     */
    put: function(id, room){
        this.chatMessagesMap.put(id, room);
    },

    /**
     * @param {string} id
     * @return {roomObj}
     */
    remove: function(id){
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
        var chatMessageBody     = chatMessageObj.body;
        var conversationId      = chatMessageObj.conversationId;
        var conversationOwnerId = chatMessageObj.conversationOwnerId;
        var senderUserId        = this.currentUserManagerModule.currentUser._id; //TODO: Update this
        this.airbugApi.createChatMessage(chatMessageBody, senderUserId, conversationId, conversationOwnerId, callback);
    },

    retrieveChatMessage: function(chatMessageId, callback){

    },

    retrieveChatMessages: function(chatMessageIds, callback){

    },

    retrieveChatMessagesByConversationId: function(conversationId, callback){

        this.airbugApi.
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatMessageManagerModule", ChatMessageManagerModule);
