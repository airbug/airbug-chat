//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('Conversation')

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

var Conversation = Class.extend(Entity, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Set.<ChatMessage>}
         */
        this.chatMessageSet     = undefined;

        /**
         * @private
         * @type {(Dialogue | Room)}
         */
        this.owner              = undefined;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Set.<string>}
     */
    getChatMessageIdSet: function() {
        return this.deltaObject.getProperty("chatMessageIdSet");
    },

    /**
     * @param {Set.<string>} chatMessageIdSet
     */
    setChatMessageIdSet: function(chatMessageIdSet) {
        this.deltaObject.setProperty("chatMessageIdSet", chatMessageIdSet);
    },

    /**
     * @return {Set.<ChatMessage>}
     */
    getChatMessageSet: function() {
        return this.chatMessageSet;
    },

    /**
     * @param {Set.<ChatMessage>} chatMessageSet
     */
    setChatMessageSet: function(chatMessageSet) {
        this.chatMessageSet = chatMessageSet;
    },

    /**
     * @return {(Dialogue | Room)}
     */
    getOwner: function() {
        return this.owner;
    },

    /**
     * @param {(Dialogue | Room)} owner
     */
    setOwner: function(owner) {
        this.owner = owner;
       // this.
    },

    /**
     * @return {string}
     */
    getOwnerId: function() {
        return this.deltaObject.getProperty("ownerId");
    },

    /**
     * @param {string} ownerId
     */
    setOwnerId: function(ownerId) {
        this.deltaObject.setProperty("ownerId", ownerId);
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {ChatMessage} chatMessage
     */
    addChatMessage: function(chatMessage) {

    },

    /**
     * @param {ChatMessage} chatMessage
     */
    removeChatMessage: function(chatMessage) {

    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Conversation', Conversation);
