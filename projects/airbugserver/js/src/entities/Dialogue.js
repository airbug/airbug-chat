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

    _constructor: function(data) {

        this._super(data);


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
     * @return {Pair.<string, string>}
     */
    getUserIdPair: function() {
        return this.deltaDocument.getCurrentData().userIdPair;
    },

    /**
     * @param {Pair.<string, string>} userIdPair
     */
    setUserIdPair: function(userIdPair) {
        this.deltaDocument.getCurrentData().userIdPair = userIdPair;
    },

    /**
     * @return {Pair.<User, User>}
     */
    getUserPair: function() {
        return this.userPair;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

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
     * @param {Pair.<User, User>} userPair
     */
    setUserPair: function(userPair) {
        this.userPair = userPair;
        //TODO BRN:
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Dialogue', Dialogue);
