/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.Room')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@require('Set')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityAnnotation')
//@Require('bugentity.PropertyAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Bug                     = bugpack.require('Bug');
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

    /**
     * @class
     * @extends {Entity}
     */
    var Room = Class.extend(Entity, {

        _name: "airbugserver.Room",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {{
         *      conversationId: string,
         *      name: string,
         *      roomMemberIdSet: Array.<string>
         * }} data
         */
        _constructor: function(data) {

            this._super(data);


            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Conversation}
             */
            this.conversation       = null;

            /**
             * @private
             * @type {ISet.<RoomMember>}
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
            return this.getEntityData().conversationId;
        },

        /**
         * @param {string} conversationId
         */
        setConversationId: function(conversationId) {
            this.getEntityData().conversationId = conversationId;
        },

        /**
         * @return {string}
         */
        getName: function() {
            return this.getEntityData().name;
        },

        /**
         * @param {string} name
         */
        setName: function(name) {
            this.getEntityData().name = name;
        },

        /**
         * @return {Set.<string>}
         */
        getRoomMemberIdSet: function() {
            return this.getEntityData().roomMemberIdSet;
        },

        /**
         * @param {Set.<string>} roomMemberIdSet
         */
        setRoomMemberIdSet: function(roomMemberIdSet) {
            this.getEntityData().roomMemberIdSet = roomMemberIdSet;
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
                throw new Bug("IllegalState", {}, "Attempt to add non-existant room member");
            }
            if (roomMember.getId()) {
                this.roomMemberSet.add(roomMember);
                this.addRoomMemberId(roomMember.getId());
            } else {
                throw new Bug("IllegalState", {}, "RoomMember must have an id before it can be added");
            }
        },

        /**
         * @return {Set.<RoomMember>}
         */
        getRoomMemberSet: function() {
            return this.roomMemberSet;
        },

        /**
         * @param {ISet.<RoomMember>} roomMemberSet
         */
        setRoomMemberSet: function(roomMemberSet) {
            this.roomMemberSet = roomMemberSet;
        },

        /**
         * @param {RoomMember} roomMember
         */
        removeRoomMember: function(roomMember) {
            if (roomMember.getId()) {
                this.roomMemberSet.remove(roomMember);
                this.removeRoomMemberId(roomMember.getId());
            } else {
                throw new Bug( "IllegalState", {}, "RoomMember must have an id before it can be removed");
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
                throw new Bug("IllegalState", {}, "Conversation must have an id first");
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
                .populates(true)
                .store(false),
            property("conversationId")
                .type("string")
                .index(true)
                .id(),
            property("createdAt")
                .type("date")
                .require(true)
                .default(Date.now),
            property("id")
                .type("string")
                .primaryId(),
            property("name")
                .type("string")
                .require(true),
            property("roomMemberIdSet")
                .type("Set")
                .collectionOf("string")
                .id(),
            property("roomMemberSet")
                .type("Set")
                .collectionOf("RoomMember")
                .populates(true)
                .store(false),
            property("updatedAt")
                .type("date")
                .require(true)
                .default(Date.now)
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.Room', Room);
});
