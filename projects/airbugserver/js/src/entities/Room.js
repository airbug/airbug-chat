//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('Room')

//@Require('Class')
//@require('Set')
//@Require('airbugserver.Entity')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Set             = bugpack.require('Set');
var Entity          = bugpack.require('airbugserver.Entity');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Room = Class.extend(Entity, {

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
        this.conversation       = undefined;

        /**
         * @private
         * @type {Set.<RoomMember>}
         */
        this.roomMemberSet      = new Set();
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
     * @return {string}
     */
    getName: function() {
        return this.deltaObject.getProperty("name");
    },

    /**
     * @param {string} name
     */
    setName: function(name) {
        this.deltaObject.setProperty("name", name);
    },

    /**
     * @return {Set.<string>}
     */
    getRoomMemberIdSet: function() {
        return this.deltaObject.getProperty("roomMemberIdSet");
    },

    /**
     * @param {Set.<string>} roomMemberIdSet
     */
    setRoomMemberIdSet: function(roomMemberIdSet) {
        this.deltaObject.setProperty("roomMemberIdSet", roomMemberIdSet);
    },

    /**
     * @return {Set.<RoomMember>}
     */
    getRoomMemberSet: function() {
        return this.roomMemberSet;
    },

    /**
     * @param {Set.<RoomMember>} roomMemberSet
     */
    setRoomMemberSet: function(roomMemberSet) {
        this.roomMemberSet = roomMemberSet;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {RoomMember} roomMember
     */
    addRoomMember: function(roomMember) {
        //TODO BRN:
    },

    /**
     * @param {RoomMember} roomMember
     */
    removeRoomMember: function(roomMember) {
        //TODO BRN:
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Room', Room);
