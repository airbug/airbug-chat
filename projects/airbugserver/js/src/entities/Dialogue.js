//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('Dialogue')

//@Require('Class')
//@Require('Pair')
//@Require('airbugserver.Entity')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Pair            = bugpack.require('Pair');
var Entity          = bugpack.require('airbugserver.Entity');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Dialogue = Class.extend(Entity, {

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
         * @type {Conversation}
         */
        this.conversation   = undefined;

        /**
         * @private
         * @type {Pair.<User, User>}
         */
        this.userPair       = undefined;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
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
        //TODO BRN
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
     * @return {Pair.<string, string>}
     */
    getUserIdPair: function() {
        return this.deltaObject.getProperty("userIdPair");
    },

    /**
     * @param {Pair.<string, string>} userIdPair
     */
    setUserIdPair: function(userIdPair) {
        this.deltaObject.setProperty("userIdPair", userIdPair);
    },

    /**
     * @return {Pair.<User, User>}
     */
    getUserPair: function() {
        return this.userPair;
    },

    /**
     * @param {Pair.<User, User>} userPair
     */
    setUserPair: function(userPair) {
        this.userPair = userPair;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Dialogue', Dialogue);
