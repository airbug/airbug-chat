//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('Room')

//@Require('Class')
//@require('List')
//@Require('airbugserver.Entity')
//@Require('bugdelta.DeltaObject')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var List            = bugpack.require('List');
var Entity          = bugpack.require('airbugserver.Entity');
var DeltaObject     = bugpack.require('bugdelta.DeltaObject');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Room = Class.extend(Entity, {

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
        this.conversation       = undefined;

        /**
         * @private
         * @type {List.<RoomMember>}
         */
        this.roomMemberList     = undefined;
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
     * @return {List.<string>}
     */
    getRoomMemberIdList: function() {
        return this.deltaObject.getProperty("roomMemberIdList");
    },

    /**
     * @param {List.<string>} roomMemberIdList
     */
    setRoomMemberIdList: function(roomMemberIdList) {
        this.deltaObject.setProperty("roomMemberIdList", roomMemberIdList);
    },

    /**
     * @return {List.<RoomMember>}
     */
    getRoomMemberList: function() {
        return this.roomMemberList;
    },

    /**
     * @param {List.<RoomMember>} roomMemberList
     */
    setRoomMemberList: function(roomMemberList) {
        this.roomMemberList = roomMemberList;
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
