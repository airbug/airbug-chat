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
         * @type {List.<ChatMessage>}
         */
        this.chatMessageList    = undefined;

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
     * @return {string}
     */
    getChatMessageIdList: function() {
        return this.deltaObject.getProperty("chatMessageIdList");
    },

    /**
     * @param {string} chatMessageIdList
     */
    setChatMessageIdList: function(chatMessageIdList) {
        this.deltaObject.setProperty("chatMessageIdList", chatMessageIdList);
    },

    /**
     * @return {List.<ChatMessage>}
     */
    getChatMessageList: function() {
        return this.chatMessageList;
    },

    /**
     * @param {List.<ChatMessage>} chatMessageList
     */
    setChatMessageList: function(chatMessageList) {
        this.chatMessageList = chatMessageList;
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
        //TODO BRN
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
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Conversation', Conversation);
