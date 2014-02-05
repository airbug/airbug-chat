//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomMemberService')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Map')
//@Require('MappedThrowable')
//@Require('Obj')
//@Require('airbugserver.EntityService')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Exception               = bugpack.require('Exception');
var Map                     = bugpack.require('Map');
var MappedThrowable         = bugpack.require('MappedThrowable');
var Obj                     = bugpack.require('Obj');
var EntityService           = bugpack.require('airbugserver.EntityService');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var module                  = ModuleAnnotation.module;
var $iterableParallel       = BugFlow.$iterableParallel;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {EntityService}
 */
var RoomMemberService = Class.extend(EntityService, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(roomMemberManager, roomManager, userManager, roomMemberPusher) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
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
                                    mappedException.putThrowable(key, new Exception("NotFound", {objectId: key}));
                                }
                            });
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.roomMemberPusher.meldCallWithRoomMembers(call.getCallUuid(), roomMemberMap.getValueArray(), function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.roomMemberPusher.pushRoomMembersToCall(roomMemberMap.getValueArray(), call.getCallUuid(), function(throwable) {
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

bugmeta.annotate(RoomMemberService).with(
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
