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
         * @type {(Dialouge | Room)}
         */
        this.conversationOwner      = undefined;

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
     * @return {(User | )}
     */
    getConversationOwner: function() {
        return this.conversationOwner;
    },

    /**
     * @return {string}
     */
    getConversationOwnerId: function() {
        return this.deltaDocument.getCurrentData().conversationOwnerId;
    },

    /**
     * @param {string} conversationOwnerId
     */
    setConversationOwnerId: function(conversationOwnerId) {
        this.deltaDocument.getCurrentData().conversationOwnerId = conversationOwnerId;
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
     * @param {string} roomMemberId
     */
    addRoomMemberId: function(roomMemberId) {
        var roomMemberIdSet = this.getRoomMemberIdSet();
        if (!roomMemberIdSet) {
            roomMemberIdSet = new Set();
            this.setRoomMemberIdSet(roomMemberIdSet);
        }
        roomMemberIdSet.add(roomMemberId);
    },

    /**
     * @param {string} roomMemberId
     */
    removeRoomMemberId: function(roomMemberId) {
        var roomMemberIdSet = this.getRoomMemberIdSet();
        if (!roomMemberIdSet) {
            roomMemberIdSet = new Set();
            this.setRoomMemberIdSet(roomMemberIdSet);
        }
        roomMemberIdSet.remove(roomMemberId);
    },

    /**
     * @param {RoomMember} roomMember
     */
    addRoomMember: function(roomMember) {
        if (roomMember.getId()) {
            this.roomMemberSet.add(roomMember);
            this.addRoomMemberId(roomMember.getId());
        } else {
            throw new Error("RoomMember must have an id before it can be added");
        }
    },

    /**
     * @param {RoomMember} roomMember
     */
    removeRoomMember: function(roomMember) {
        if (roomMember.getId()) {
            this.roomMemberSet.remove(roomMember);
            this.removeRoomMemberId(roomMember.getId());
        } else {
            throw new Error("RoomMember must have an id before it can be removed");
        }
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
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessage', ChatMessage);
