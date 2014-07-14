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

//@Export('airbugserver.RoomMemberManager')
//@Autoload

//@Require('ArgUtil')
//@Require('Class')
//@Require('airbugserver.RoomMember')
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

    var ArgUtil             = bugpack.require('ArgUtil');
    var Class               = bugpack.require('Class');
    var RoomMember          = bugpack.require('airbugserver.RoomMember');
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
    var RoomMemberManager = Class.extend(EntityManager, {

        _name: "airbugserver.RoomMemberManager",


        //-------------------------------------------------------------------------------
        // Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {RoomMember} roomMember
         * @param {(Array.<string> | function(Throwable, RoomMember))} dependencies
         * @param {function(Throwable, RoomMember=)} callback
         */
        createRoomMember: function(roomMember, dependencies, callback) {
            var args = ArgUtil.process(arguments, [
                {name: "roomMember", optional: false, type: "object"},
                {name: "dependencies", optional: true, type: "array"},
                {name: "callback", optional: false, type: "function"}
            ]);
            roomMember      = args.roomMember;
            dependencies    = args.dependencies;
            callback        = args.callback;

            var options         = {};
            this.create(roomMember, options, dependencies, callback);
        },

        /**
         * @param {RoomMember} roomMember
         * @param {function(Throwable)} callback
         */
        deleteRoomMember: function(roomMember, callback) {
            this.delete(roomMember, callback);
        },

        /**
         * @param {{
         *      createdAt: Date,
         *      memberType: string,
         *      roomId: string,
         *      updatedAt: Date,
         *      userId: string
         * }} data
         * @return {RoomMember}
         */
        generateRoomMember: function(data) {
            var roomMember = new RoomMember(data);
            this.generate(roomMember);
            return roomMember;
        },

        populateRoomMember: function(roomMember, properties, callback) {
            var options = {
                room: {
                    idGetter:   roomMember.getRoomId,
                    getter:     roomMember.getRoom,
                    setter:     roomMember.setRoom
                },
                user: {
                    idGetter:   roomMember.getUserId,
                    getter:     roomMember.getUser,
                    setter:     roomMember.setUser
                }
            };
            this.populate(roomMember, options, properties, callback);
        },

        /**
         * @param {string} roomMemberId
         * @param {function(Error, RoomMember)} callback
         */
        retrieveRoomMember: function(roomMemberId, callback) {
            this.retrieve(roomMemberId, callback);
        },

        /**
         * @param {Array.<string>} roomMemberIds
         * @param {function(Throwable, Map.<string, RoomMember>)} callback
         */
        retrieveRoomMembers: function(roomMemberIds, callback) {
            this.retrieveEach(roomMemberIds, callback);
        },

        /**
         * @param {string} userId
         * @param {string} roomId
         * @param {function(Error, RoomMember)} callback
         */
        retrieveRoomMemberByUserIdAndRoomId: function(userId, roomId, callback) {
            var _this = this;
            this.dataStore.findOne({roomId: roomId, userId: userId}).lean(true).exec(function(throwable, dbObject) {
                if (!throwable) {
                    var entityObject = null;
                    if (dbObject) {
                        entityObject = _this.convertDbObjectToEntity(dbObject);
                        entityObject.commitDelta();
                    }
                    callback(undefined, entityObject);
                } else {
                    callback(throwable);
                }
            });
        },

        /**
         * @param {RoomMember} roomMember
         * @param {function(Throwable, RoomMember)} callback
         */
        updateRoomMember: function(roomMember, callback) {
            this.update(roomMember, callback);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(RoomMemberManager).with(
        entityManager("roomMemberManager")
            .ofType("RoomMember")
            .args([
                arg().ref("entityManagerStore"),
                arg().ref("schemaManager"),
                arg().ref("entityDeltaBuilder")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.RoomMemberManager', RoomMemberManager);
});
