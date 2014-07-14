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

//@Export('airbugserver.RoomManager')
//@Autoload

//@Require('Class')
//@Require('Set')
//@Require('TypeUtil')
//@Require('airbugserver.Room')
//@Require('bugentity.EntityManager')
//@Require('bugentity.EntityManagerTag')
//@Require('bugioc.ArgTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Set                 = bugpack.require('Set');
    var TypeUtil            = bugpack.require('TypeUtil');
    var Room                = bugpack.require('airbugserver.Room');
    var EntityManager       = bugpack.require('bugentity.EntityManager');
    var EntityManagerTag    = bugpack.require('bugentity.EntityManagerTag');
    var ArgTag              = bugpack.require('bugioc.ArgTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgTag.arg;
    var bugmeta             = BugMeta.context();
    var entityManager       = EntityManagerTag.entityManager;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EntityManager}
     */
    var RoomManager = Class.extend(EntityManager, {

        _name: "airbugserver.RoomManager",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Room} room
         * @param {(Array.<string> | function(Throwable, Room=))} dependencies
         * @param {function(Throwable, Room=)=} callback
         */
        createRoom: function(room, dependencies, callback) {
            if (TypeUtil.isFunction(dependencies)) {
                callback        = dependencies;
                dependencies    = [];
            }

            var options = {
                conversation: {
                    idSetter:   room.setConversationId,
                    setter:     room.setConversation,
                    referenceIdProperty: "ownerId", //Should this be ownerIdSetter? This would require requiring Conversation here.
                    referenceTypeProperty: "ownerType",
                    referenceProperty: "owner" //How should we handle many to many associations?
                }
            };
            this.create(room, options, dependencies, callback);
        },

        /**
         * @param {Room} room
         * @param {function(Throwable=)} callback
         */
        deleteRoom: function(room, callback) {
            this.delete(room, callback);
        },

        /**
         * @param {{
         *      conversationId: string,
         *      createdAt: Date,
         *      id: string,
         *      name: string,
         *      updatedAt: Date,
         *      roomMemberIdSet: (Array.<string> | Set.<string>)
         * }} data
         * @return {Room}
         */
        generateRoom: function(data) {
            data.roomMemberIdSet = new Set(data.roomMemberIdSet);
            var room =  new Room(data);
            this.generate(room);
            return room;
        },

        /**
         * @param {Room} room
         * @param {Array.<string>} properties
         * @param {function(Throwable, Room=)} callback
         */
        populateRoom: function(room, properties, callback) {
            var options = {
                roomMemberSet: {
                    idGetter:   room.getRoomMemberIdSet,
                    getter:     room.getRoomMemberSet,
                    setter:     room.setRoomMemberSet
                },
                conversation: {
                    idGetter:   room.getConversationId,
                    getter:     room.getConversation,
                    setter:     room.setConversation
                }
            };
            this.populate(room, options, properties, callback);
        },

        /**
         * @param {string} roomId
         * @param {function(Throwable, Room=)} callback
         */
        retrieveRoom: function(roomId, callback) {
            this.retrieve(roomId, callback);
        },

        /**
         * @param {Array.<string>} roomIds
         * @param {function(Throwable, Map.<string, Room>=)} callback
         */
        retrieveRooms: function(roomIds, callback) {
            this.retrieveEach(roomIds, callback);
        },

        /**
         * @param {Room} room
         * @param {function(Throwable, Room=)} callback
         */
        updateRoom: function(room, callback) {
            this.update(room, callback);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(RoomManager).with(
        entityManager("roomManager")
            .ofType("Room")
            .args([
                arg().ref("entityManagerStore"),
                arg().ref("schemaManager"),
                arg().ref("entityDeltaBuilder")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.RoomManager', RoomManager);
});
