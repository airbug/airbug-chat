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

//@Export('airbugserver.User')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Set')
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
    var Set             = bugpack.require('Set');
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
    var User = Class.extend(Entity, {

        _name: "airbugserver.User",


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
             * @type {Set.<Room>}
             */
            this.roomSet        = new Set();

            /**
             * @private
             * @type {Set.<Session>}
             */
            this.sessionSet     = new Set();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        getAnonymous: function() {
            return this.getEntityData().anonymous;
        },

        /**
         * @param {boolean} anonymous
         */
        setAnonymous: function(anonymous) {
            this.getEntityData().anonymous = anonymous;
        },

        /**
         * @return {string}
         */
        getBetaKey: function() {
            return this.getEntityData().betaKey;
        },

        /**
         * @return {string}
         */
        getEmail: function() {
            return this.getEntityData().email;
        },

        /**
         * @param {string} email
         */
        setEmail: function(email) {
            this.getEntityData().email = email;
        },

        /**
         * @return {string}
         */
        getFirstName: function() {
            return this.getEntityData().firstName;
        },

        /**
         * @param {string} firstName
         */
        setFirstName: function(firstName) {
            this.getEntityData().firstName = firstName;
        },

        /**
         * @return {string}
         */
        getLastName: function() {
            return this.getEntityData().lastName;
        },

        /**
         * @param {string} lastName
         */
        setLastName: function(lastName) {
            this.getEntityData().lastName = lastName;
        },

        /**
         * @return {string|*}
         */
        getPasswordHash: function() {
            return this.getEntityData().passwordHash;
        },

        /**
         *
         * @param {string} passwordHash
         */
        setPasswordHash: function(passwordHash) {
            this.getEntityData().passwordHash = passwordHash;
        },

        /**
         * @return {Set.<string>}
         */
        getRoomIdSet: function() {
            return this.getEntityData().roomIdSet;
        },

        /**
         * @param {Set.<string>} roomIdSet
         */
        setRoomIdSet: function(roomIdSet) {
            this.getEntityData().roomIdSet = roomIdSet;
        },

        /**
         * @return {string}
         */
        getStatus: function() {
            return this.getEntityData().status;
        },

        /**
         * @param {string} status
         */
        setStatus: function(status) {
            this.getEntityData().status = status;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} roomId
         */
        addRoomId: function(roomId) {
            var roomIdSet = this.getRoomIdSet();
            if (!roomIdSet) {
                roomIdSet = new Set();
                this.setRoomIdSet(roomIdSet);
            }
            roomIdSet.add(roomId);
        },

        /**
         * @param {string} roomId
         */
        removeRoomId: function(roomId) {
            var roomIdSet = this.getRoomIdSet();
            if (!roomIdSet) {
                roomIdSet = new Set();
                this.setRoomIdSet(roomIdSet);
            }
            roomIdSet.remove(roomId);
        },

        /**
         * @param {Room} room
         */
        addRoom: function(room) {
            if (room.getId()) {
                this.roomSet.add(room);
                this.addRoomId(room.getId());
            } else {
                throw new Bug("IllegalState", {}, "room must have an id before it can be added");
            }
        },

        /**
         * @param {Room} room
         * @return {boolean}
         */
        containsRoom: function(room) {
            return this.roomIdSet.contains(room.getId());
        },

        /**
         * @return {Set.<Room>}
         */
        getRoomSet: function() {
            return this.roomSet;
        },

        /**
         * @param {Room} room
         */
        removeRoom: function(room) {
            if (room.getId()) {
                this.roomSet.remove(room);
                this.removeRoomId(room.getId());
            } else {
                throw new Bug("IllegalState", {}, "room must have an id before it can be removed");
            }
        },

        /**
         * @return {Set.<Session>}
         */
        getSessionSet: function() {
            return this.sessionSet;
        },

        /**
         * @param {Set.<Session>} sessionSet
         */
        setSessionSet: function(sessionSet) {
            this.sessionSet = sessionSet;
        },

        /**
         * @return {boolean}
         */
        isAnonymous: function() {
            return this.getAnonymous();
        },

        /**
         * @return {boolean}
         */
        isNotAnonymous: function() {
            return !this.getAnonymous();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(User).with(
        entity("User").properties([
            property("agreedToTermsDate")
                .type("date"),
            property("anonymous")
                .type("boolean")
                .require(true)
                .default(true),
            property("createdAt")
                .type("date")
                .require(true)
                .default(Date.now),

            // NOTE BRN: Cannot make email unique or require it since anonymous users have a 'null' value for their email and we can't have
            // more than one null. We'll have to validate uniqueness at the application level instead.
            // More info http://stackoverflow.com/questions/7955040/mongodb-mongoose-unique-if-not-null

            property("email")
                .type("string")
                .index(true),
            property("firstName")
                .type("string"),
            property("id")
                .type("string")
                .primaryId(),
            property("lastName")
                .type("string"),
            property("passwordHash")
                .type("string"),
            property("pseudo")
                .type("boolean")
                .require(true)
                .default(false),
            property("roomIdSet")
                .type("Set")
                .collectionOf("string")
                .id(),
            property("roomSet")
                .type("Set")
                .collectionOf("Room")
                .populates(true)
                .store(false),
            property("sessionSet")
                .type("Set")
                .collectionOf("Session")
                .populates(true)
                .store(false),
            property("status")
                .type("string"),
            property("updatedAt")
                .type("date")
                .require(true)
                .default(Date.now)
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.User', User);
});
