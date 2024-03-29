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

//@Export('airbugserver.RoomMember')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityTag')
//@Require('bugentity.PropertyTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Bug             = bugpack.require('Bug');
    var Class           = bugpack.require('Class');
    var Entity          = bugpack.require('bugentity.Entity');
    var EntityTag       = bugpack.require('bugentity.EntityTag');
    var PropertyTag     = bugpack.require('bugentity.PropertyTag');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var entity          = EntityTag.entity;
    var property        = PropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Entity}
     */
    var RoomMember = Class.extend(Entity, {

        _name: "airbugserver.RoomMember",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param data
         */
        _constructor: function(data) {

            this._super(data);


            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Room}
             */
            this.room   = undefined;

            /**
             * @private
             * @type {User}
             */
            this.user   = undefined;


        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getMemberType: function() {
            return this.deltaDocument.getData().memberType;
        },

        /**
         * @param {string} memberType
         */
        setMemberType: function(memberType) {
            this.deltaDocument.getData().memberType = memberType;
        },

        /**
         * @return {string}
         */
        getRoomId: function() {
            return this.deltaDocument.getData().roomId;
        },

        /**
         * @param {string} roomId
         */
        setRoomId: function(roomId) {
            this.deltaDocument.getData().roomId = roomId;
        },

        /**
         * @return {string}
         */
        getUserId: function() {
            return this.deltaDocument.getData().userId;
        },

        /**
         * @param {string} userId
         */
        setUserId: function(userId) {
            this.deltaDocument.getData().userId = userId;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Room}
         */
        getRoom: function() {
            return this.room;
        },

        /**
         * @param {Room} room
         */
        setRoom: function(room) {
            if (room.getId()) {
                this.room = room;
                this.setRoomId(room.getId());
            } else {
                throw new Bug("IllegalState", {}, "room must have an id first");
            }
        },

        /**
         * @return {User}
         */
        getUser: function() {
            return this.user;
        },

        /**
         * @param {User} user
         */
        setUser: function(user) {
            if (user.getId()) {
                this.user = user;
                this.setUserId(user.getId());
            } else {
                throw new Bug("IllegalState", {}, "user must have an id first");
            }
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(RoomMember).with(
        entity("RoomMember").properties([
            property("createdAt")
                .type("date")
                .require(true)
                .default(Date.now),
            property("id")
                .type("string")
                .primaryId(),
            property("memberType")
                .type("string"),
            property("room")
                .type("Room")
                .populates(true)
                .store(false),
            property("roomId")
                .type("string")
                .require(true)
                .index(true)
                .id(),
            property("updatedAt")
                .type("date")
                .require(true)
                .default(Date.now),
            property("user")
                .type("User")
                .populates(true)
                .store(false),
            property("userId")
                .type("string")
                .require(true)
                .index(true)
                .id()
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.RoomMember', RoomMember);
});
