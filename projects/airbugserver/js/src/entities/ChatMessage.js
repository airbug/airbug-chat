//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ChatMessage')

//@Require('Class')
//@Require('airbugserver.Entity')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Entity          = bugpack.require('airbugserver.Entity');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessage = Class.extend(Entity, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(data) {

        this._super(data);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Conversation}
         */
        this.conversation           = undefined;

        /**
         * @private
         * @type {User}
         */
        this.senderUser             = undefined;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getBody: function() {
        return this.deltaDocument.getCurrentData().body;
    },

    /**
     * @param {string} body
     */
    setBody: function(body) {
        this.deltaDocument.getCurrentData().body = body;
    },

    /**
     * @return {string}
     */
    getConversationId: function() {
        return this.deltaDocument.getCurrentData().conversationId;
    },

    /**
     * @param {string} conversationId
     */
    setConversationId: function(conversationId) {
        this.deltaDocument.getCurrentData().conversationId = conversationId;
    },

    /**
     * @return {string}
     */
    getSenderUserId: function() {
        return this.deltaDocument.getCurrentData().senderUserId;
    },

    /**
     * @param {string} senderUserId
     */
    setSenderUserId: function(senderUserId) {
        this.deltaDocument.getCurrentData().senderUserId = senderUserId;
    },

    /**
     * @return {Date}
     */
    getSentAt: function() {
        return this.deltaDocument.getCurrentData().sentAt;
    },

    /**
     * @param {Date} sentAt
     */
    setSentAt: function(sentAt) {
        this.deltaDocument.getCurrentData().sentAt = sentAt;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Conversation}
     */
    getConversation: function() {
        return this.conversation;
    },

    /**
     * @param {Conversation} conversation
     */
    setConversation: function(conversation) {
        if (conversation.getId()) {
            this.conversation = conversation;
            this.setConversationId(conversation.getId());
        } else {
            throw new Error("Conversation must have an id first");
        }
    },

    /**
     * @return {User}
     */
    getSenderUser: function() {
        return this.senderUser;
    },

    /**
     * @param {User} senderUser
     */
    setSenderUser: function(senderUser) {
        if (senderUser.getId()) {
            this.senderUser = senderUser;
            this.setSenderUserId(senderUser.getId());
        } else {
            throw new Error("senderUser must have an id first");
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessage', ChatMessage);
