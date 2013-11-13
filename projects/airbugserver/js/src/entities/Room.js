//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('Room')

//@Require('Class')
//@require('Set')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityAnnotation')
//@Require('bugentity.PropertyAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Set                     = bugpack.require('Set');
var Entity                  = bugpack.require('bugentity.Entity');
var EntityAnnotation        = bugpack.require('bugentity.EntityAnnotation');
var PropertyAnnotation      = bugpack.require('bugentity.PropertyAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var entity                  = EntityAnnotation.entity;
var property                = PropertyAnnotation.property;


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
     * @return {string}
     */
    getConversationId: function() {
        return this.deltaDocument.getData().conversationId;
    },

    /**
     * @param {string} conversationId
     */
    setConversationId: function(conversationId) {
        this.deltaDocument.getData().conversationId = conversationId;
    },

    /**
     * @return {string}
     */
    getName: function() {
        return this.deltaDocument.getData().name;
    },

    /**
     * @param {string} name
     */
    setName: function(name) {
        this.deltaDocument.getData().name = name;
    },

    /**
     * @return {Set.<string>}
     */
    getRoomMemberIdSet: function() {
        return this.deltaDocument.getData().roomMemberIdSet;
    },

    /**
     * @param {Set.<string>} roomMemberIdSet
     */
    setRoomMemberIdSet: function(roomMemberIdSet) {
        this.deltaDocument.getData().roomMemberIdSet = roomMemberIdSet;
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
        if (! roomMember) {
            throw new Error("Error. Attempt to add non-existant room member");
        }
        if (roomMember.getId()) {
            this.roomMemberSet.add(roomMember);
            this.addRoomMemberId(roomMember.getId());
        } else {
            throw new Error("RoomMember must have an id before it can be added");
        }
    },

    /**
     * @return {Set.<RoomMember>}
     */
    getRoomMemberSet: function() {
        return this.roomMemberSet;
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
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(Room).with(
    entity("Room").properties([
        property("conversation")
            .type("Conversation")
            .populates(true),
        property("conversationId")
            .type("string"),
        property("createdAt")
            .type("date"),
        property("name")
            .type("string"),
        property("roomMemberIdSet")
            .type("Set")
            .collectionOf("string"),
        property("roomMemberSet")
            .type("Set")
            .collectionOf("RoomMember")
            .populates(true),
        property("updatedAt")
            .type("date")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Room', Room);
