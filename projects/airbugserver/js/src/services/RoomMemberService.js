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

//@Export('airbugserver.RoomMemberService')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Flows')
//@Require('Map')
//@Require('MappedThrowable')
//@Require('Obj')
//@Require('airbugserver.EntityService')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Exception           = bugpack.require('Exception');
    var Flows               = bugpack.require('Flows');
    var Map                 = bugpack.require('Map');
    var MappedThrowable     = bugpack.require('MappedThrowable');
    var Obj                 = bugpack.require('Obj');
    var EntityService       = bugpack.require('airbugserver.EntityService');
    var ArgTag              = bugpack.require('bugioc.ArgTag');
    var ModuleTag           = bugpack.require('bugioc.ModuleTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgTag.arg;
    var bugmeta             = BugMeta.context();
    var module              = ModuleTag.module;
    var $series             = Flows.$series;
    var $task               = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EntityService}
     */
    var RoomMemberService = Class.extend(EntityService, {

        _name: "airbugserver.RoomMemberService",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {RoomMemberManager} roomMemberManager
         * @param {RoomManager} roomManager
         * @param {UserManager} userManager
         * @param {RoomMemberPusher} roomMemberPusher
         */
        _constructor: function(roomMemberManager, roomManager, userManager, roomMemberPusher) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {RoomManager}
             */
            this.roomManager                    = roomManager;

            /**
             * @private
             * @type {RoomMemberManager}
             */
            this.roomMemberManager              = roomMemberManager;

            /**
             * @private
             * @type {RoomMemberPusher}
             */
            this.roomMemberPusher               = roomMemberPusher;

            /**
             * @private
             * @type {UserManager}
             */
            this.userManager                    = userManager;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {RequestContext} requestContext
         * @param {{
         *      memberType: string,
         *      userId: string,
         *      roomId: string
         * }} roomMemberObject
         * @param {function(Throwable, RoomMember=)} callback
         */
        createRoomMember: function(requestContext, roomMemberObject, callback) {
            //TODO BRN: Implement
            callback(new Exception("UnauthorizedAccess"));
        },

        /*
         * @param {RequestContext} requestContext
         * @param {string} roomMemberId
         * @param {function(Throwable} callback
         */
        deleteRoomMember: function(requestContext, roomMemberId, callback) {
            //TODO BRN: Implement
            callback(new Exception("UnauthorizedAccess"));
        },

        /*
         * @param {RequestContext} requestContext
         * @param {string} roomMemberId
         * @param {function(Throwable, RoomMember=} callback
         */
        retrieveRoomMember: function(requestContext, roomMemberId, callback) {
            var _this               = this;
            var currentUser         = requestContext.get("currentUser");
            var call         = requestContext.get("call");
            /** @type {RoomMember} */
            var roomMember          = null;
            var roomMemberManager   = this.roomMemberManager;

            if (currentUser.isNotAnonymous()) {
                $series([
                    $task(function(flow){
                        roomMemberManager.retrieveRoomMember(roomMemberId, function(throwable, returnedRoomMember) {
                            roomMember = returnedRoomMember;
                            if (!throwable) {
                                if (!roomMember) {
                                    flow.error(new Exception("RoomMember does not exist"));
                                } else {
                                    flow.complete();
                                }
                            } else {
                                flow.error(throwable);
                            }
                        });
                    }),
                    $task(function(flow) {
                        _this.roomMemberPusher.meldCallWithRoomMember(call.getCallUuid(), roomMember, function(throwable) {
                            flow.complete(throwable);
                        });
                    }),
                    $task(function(flow) {
                        _this.roomMemberPusher.pushRoomMemberToCall(roomMember, call.getCallUuid(), function(throwable) {
                            flow.complete(throwable);
                        });
                    })
                ]).execute(function(throwable) {
                        if (!throwable) {
                            callback(null, roomMember);
                        } else {
                            callback(throwable);
                        }
                    });
            } else {
                callback(new Exception("UnauthorizedAccess"));
            }
        },

        /*
         * @param {RequestContext} requestContext
         * @param {string} roomMemberIds
         * @param {function(Throwable, Map.<string, RoomMember>} callback
         */
        retrieveRoomMembers: function(requestContext, roomMemberIds, callback) {
            var _this               = this;
            /** @type {Map.<string, RoomMember>} */
            var roomMemberMap      = null;
            var currentUser         = requestContext.get("currentUser");
            var call         = requestContext.get("call");
            var roomMemberManager  = this.roomMemberManager;
            var mappedException     = null;

            if (currentUser.isNotAnonymous()) {
                $series([
                    $task(function(flow) {
                        roomMemberManager.retrieveRoomMembers(roomMemberIds, function(throwable, returnedRoomMemberMap) {
                            if (!throwable) {
                                roomMemberMap = returnedRoomMemberMap.clone();
                                if (!roomMemberMap) {
                                    throwable = new Exception(""); //TODO
                                }
                                returnedRoomMemberMap.forEach(function(roomMember, key) {
                                    if (roomMember === null) {
                                        roomMemberMap.remove(key);
                                        if (!mappedException) {
                                            mappedException = new MappedThrowable(MappedThrowable.MAPPED);
                                        }
                                        mappedException.putCause(key, new Exception("NotFound", {objectId: key}));
                                    }
                                });
                            }
                            flow.complete(throwable);
                        });
                    }),
                    $task(function(flow) {
                        _this.roomMemberPusher.meldCallWithRoomMembers(call.getCallUuid(), roomMemberMap.toValueArray(), function(throwable) {
                            flow.complete(throwable);
                        });
                    }),
                    $task(function(flow) {
                        _this.roomMemberPusher.pushRoomMembersToCall(roomMemberMap.toValueArray(), call.getCallUuid(), function(throwable) {
                            flow.complete(throwable);
                        });
                    })
                ]).execute(function(throwable) {
                        if (!throwable) {
                            callback(undefined, roomMemberMap);
                        } else {
                            callback(throwable);
                        }
                    });
            } else {
                callback(new Exception("UnauthorizedAccess"));
            }
        },

        /*
         * @param {RequestContext} requestContext
         * @param {string} roomMemberId
         * @param {{*}} updates
         * @param {function(Throwable, RoomMember} callback
         */
        updateRoomMember: function(requestContext, roomMemberId, updates, callback) {
            //TODO BRN: Implement
            callback(new Exception("UnauthorizedAccess"));
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(RoomMemberService).with(
        module("roomMemberService")
            .args([
                arg().ref("roomMemberManager"),
                arg().ref("roomManager"),
                arg().ref("userManager"),
                arg().ref("roomMemberPusher")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.RoomMemberService', RoomMemberService);
});
