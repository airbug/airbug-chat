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

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getBody: function() {
        return this.deltaObject.getProperty("body");
    },

    /**
     * @param {string} body
     */
    setBody: function(body) {
        this.deltaObject.setProperty("body", body);
    },

    /**
     * @return {string}
     */
    getConversationId: function() {
        return this.deltaObject.getProperty("conversationId");
    },

    /**
     * @param {string} conversationId
     */
    setConversationId: function(conversationId) {
        this.deltaObject.setProperty("conversationId", conversationId);
    },

    /**
     * @return {string}
     */
    getConversationOwnerId: function() {
        return this.deltaObject.getProperty("conversationOwnerId");
    },

    /**
     * @param {string} conversationOwnerId
     */
    setConversationOwnerId: function(conversationOwnerId) {
        this.deltaObject.setProperty("conversationOwnerId", conversationOwnerId);
    },

    /**
     * @return {string}
     */
    getSenderUserId: function() {
        return this.deltaObject.getProperty("senderUserId");
    },

    /**
     * @param {string} senderUserId
     */
    setSenderUserId: function(senderUserId) {
        this.deltaObject.setProperty("senderUserId", senderUserId);
    },

    /**
     * @return {Date}
     */
    getSentAt: function() {
        return this.deltaObject.getProperty("sentAt");
    },

    /**
     * @param {Date} sentAt
     */
    setSentAt: function(sentAt) {
        this.deltaObject.setProperty("sentAt", sentAt);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessage', ChatMessage);
