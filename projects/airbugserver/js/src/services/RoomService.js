//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.RoomService')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('MappedThrowable')
//@Require('Obj')
//@Require('Set')
//@Require('airbugserver.EntityService')
//@Require('airbugserver.User')
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
var MappedThrowable         = bugpack.require('MappedThrowable');
var Obj                     = bugpack.require('Obj');
var Set                     = bugpack.require('Set');
var EntityService           = bugpack.require('airbugserver.EntityService');
var User                    = bugpack.require('airbugserver.User');
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
var $parallel               = BugFlow.$parallel;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;
var $iterableParallel       = BugFlow.$iterableParallel;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomService = Class.extend(EntityService, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(logger, roomManager, userManager, roomMemberManager, chatMessageStreamManager, roomPusher, userPusher, roomMemberPusher) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatMessageStreamManager}
         */
        this.chatMessageStreamManager       = chatMessageStreamManager;

        /**
         * @private
         * @type {Logger}
         */
        this.logger                         = logger;

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
         * @type {RoomPusher}
         */
        this.roomPusher                     = roomPusher;

        /**
         * @private
         * @type {UserManager}
         */
        this.userManager                    = userManager;

        /**
         * @private
         * @type {UserPusher}
         */
        this.userPusher                     = userPusher;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {ChatMessageStreamManager}
     */
    getChatMessageStreamManager: function() {
        return this.chatMessageStreamManager;
    },

    /**
     * @return {Logger}
     */
    getLogger: function() {
        return this.logger;
    },

    /**
     * @return {RoomManager}
     */
    getRoomManager: function() {
        return this.roomManager;
    },

    /**
     * @return {RoomMemberManager}
     */
    getRoomMemberManager: function() {
        return this.roomMemberManager;
    },

    /**
     * @return {RoomMemberPusher}
     */
    getRoomMemberPusher: function() {
        return this.roomMemberPusher;
    },

    /**
     * @return {RoomPusher}
     */
    getRoomPusher: function() {
        return this.roomPusher;
    },

    /**
     * @return {UserManager}
     */
    getUserManager: function() {
        return this.userManager;
    },

    /**
     * @return {UserPusher}
     */
    getUserPusher: function() {
        return this.userPusher;
    },


    //-------------------------------------------------------------------------------
    // Service Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {RequestContext} requestContext
     * @param {(User | string)} userOrUserId
     * @param {string} roomId
     * @param {function(Throwable, User=, Room=)} callback
     */
    addUserToRoom: function(requestContext, userOrUserId, roomId, callback) {
        var _this           = this;
        var call     = requestContext.get("call");
        var currentUser     = requestContext.get('currentUser');

        /** @type {Room} */
        var room            = null;
        /** @type {User} */
        var user            = null;
        /** @type {RoomMember} */
        var roomMember      = null;

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    if (Class.doesExtend(userOrUserId, User)) {
                        user = userOrUserId;
                        _this.dbRetrievePopulatedRoom(roomId, function(throwable, returnedRoom) {
                            if (!throwable) {
                                room = returnedRoom;
                            }
                            flow.complete(throwable);
                        });
                    } else {
                        _this.dbRetrieveUserAndRoom(userOrUserId, roomId, function(throwable, returnedUser, returnedRoom) {
                            if (!throwable) {
                                room = returnedRoom;
                                user = returnedUser;
                            }
                            flow.complete(throwable);
                        });
                    }
                }),
                $task(function(flow) {
                    _this.dbAddUserToRoom(user, room, function(throwable, user, room, roomMember) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.userPusher.pushUser(user, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.roomPusher.pushRoom(room, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, user, room);
                } else {
                    callback(throwable);
                }
            });
        } else {
            callback(new Exception('UnauthorizedAccess'));
        }
    },

    /**
     * @param {RequestContext} requestContext
     * @param {{
     *      name: string
     * }} roomData
     * @param {function(Throwable, Room=)} callback
     */
    createRoom: function(requestContext, roomData, callback) {
        var _this           = this;
        var room            = this.roomManager.generateRoom(roomData);
        var currentUser     = requestContext.get('currentUser');
        var call     = requestContext.get("call");

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    _this.roomManager.createRoom(room, ['conversation'], function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.dbAddUserToRoom(currentUser, room, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.dbPopulateRoomAndRoomMembers(room, function(throwable, returnedRoom) {
                        room = returnedRoom;
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.roomPusher.meldCallWithRoom(call.getCallUuid(), room, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.roomPusher.pushRoom(room, [call.getCallUuid()], function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.userPusher.pushUser(currentUser, [call.getCallUuid()], function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, room);
                } else {
                    callback(throwable);
                }
            });
        } else {
            callback(new Exception("UnauthorizedAccess", {}, "Anonymous users cannot create Rooms"));
        }
    },

    /*
     * @param {RequestContext} requestContext
     * @param {string} roomId
     * @param {function(Throwable, Room=)} callback
     */
    deleteRoom: function(requestContext, roomId, callback) {
        //TODO BRN: Implement
        callback(new Exception('UnauthorizedAccess'));
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} roomId
     * @param {function(Throwable, User=, Room=)} callback
     */
    joinRoom: function(requestContext, roomId, callback) {
        /** @type {User} */
        var currentUser = requestContext.get('currentUser');
        this.addUserToRoom(requestContext, currentUser, roomId, callback);
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} roomId
     * @param {function(Throwable, Room=)} callback
     */
    leaveRoom: function(requestContext, roomId, callback) {
        /** @type {User}*/
        var currentUser = requestContext.get('currentUser');
        this.removeUserFromRoom(requestContext, currentUser, roomId, callback);
    },

    /**
     * @param {RequestContext} requestContext
     * @param {User | string} userOrUserId
     * @param {string} roomId
     * @param {function(Throwable, Room=, User=)} callback
     */
    removeUserFromRoom: function(requestContext, userOrUserId, roomId, callback) {
        var _this               = this;
        var call         = requestContext.get("call");
        var currentUser         = requestContext.get('currentUser');

        /** @type {Room} */
        var room                = null;
        /** @type {User} */
        var user                = null;
        /** @type {RoomMember} */
        var roomMember          = null;

        if (currentUser.isNotAnonymous()) {
            $series([
                //retrieves
                $task(function(flow) {
                    if (Class.doesExtend(userOrUserId, User)) {
                        user = userOrUserId;
                        _this.dbRetrieveRoomAndRoomMember(user.getId(), roomId, function(throwable, returnedRoom, returnedRoomMember) {
                            if (!throwable) {
                                room        = returnedRoom;
                                roomMember  = returnedRoomMember;
                            }
                            flow.complete(throwable);
                        });
                    } else {
                        _this.dbRetrieveUserRoomAndRoomMember(userOrUserId, roomId, function(throwable, returnedUser, returnedRoom, returnedRoomMember) {
                            if (!throwable) {
                                room        = returnedRoom;
                                roomMember  = returnedRoomMember;
                                user        = returnedUser;
                            }
                            flow.complete(throwable);
                        });
                    }
                }),
                //deletes and removes
                $task(function(flow) {
                    _this.dbRemoveUserFromRoom(user, room, roomMember, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.userPusher.pushUser(user, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.roomPusher.pushRoom(room, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.roomMemberPusher.pushRemoveRoomMember(roomMember, function(throwable) {
                        flow.complete(throwable);
                    });
                }),

                //TODO BRN: In the future we will want to perform a security check here that determines if the room is allowed to be viewed by anon users.
                // If so, we don't want to unmeld the user from that room and other affiliated entities

                $task(function(flow) {
                    var chatMessageStream = _this.chatMessageStreamManager.generateChatMessageStream({
                        id: room.getConversation().getId()
                    });
                    _this.roomPusher.unmeldUserWithEntities(user, [room, room.getConversation(), chatMessageStream], function(throwable) {
                        flow.complete(throwable);
                    });
                })
                //TODO BRN: Need a simple way of unmelding a user with all of the chat messages that a user is melded with in a specific room
            ]).execute(function(throwable) {
                callback(throwable, room, user);
            });
        } else {
            callback(new Exception("UnauthorizedAccess", {}, "Anonymous users cannot access Rooms"));
        }
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} roomId
     * @param {function(Throwable, Room=)} callback
     */
    retrieveRoom: function(requestContext, roomId, callback) {
        var _this           = this;
        var call            = requestContext.get("call");
        var currentUser     = requestContext.get('currentUser');

        /** @type {Room} */
        var room            = null;

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    _this.dbRetrievePopulatedRoom(roomId, function(throwable, returnedRoom) {
                        if (!throwable) {
                            if (returnedRoom) {
                                room = returnedRoom;
                                flow.complete(throwable);
                            } else {
                                flow.error(new Exception('NotFound'));
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    _this.roomPusher.meldCallWithRoom(call.getCallUuid(), room, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.roomPusher.pushRoomToCall(room, call.getCallUuid(), function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, room);
                } else {
                    callback(throwable);
                }
            });
        } else {
            callback(new Exception("UnauthorizedAccess", {}, "Anonymous users cannot access Rooms"));
        }
    },

    /**
     * @param {RequestContext} requestContext
     * @param {Array.<string>} roomIds
     * @param {function(Throwable, Map.<string, Room>=)} callback
     */
    retrieveRooms: function(requestContext, roomIds, callback) {
        var _this               = this;
        /** @type {Map.<string, Room>} */
        var roomMap             = null;
        var currentUser         = requestContext.get('currentUser');
        var call         = requestContext.get("call");
        var roomManager         = this.roomManager;
        var mappedException     = null;

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    roomManager.retrieveRooms(roomIds, function(throwable, returnedRoomMap) {
                        if (!throwable) {
                            if (!returnedRoomMap) {
                                throwable = new Exception(""); //TODO
                            } else {
                                roomMap = returnedRoomMap.clone();
                                returnedRoomMap.forEach(function(room, key) {
                                    if (room === null) {
                                        roomMap.remove(key);
                                        if (!mappedException) {
                                            mappedException = new MappedThrowable(MappedThrowable.MAPPED);
                                        }
                                        mappedException.putThrowable(key, new Exception("NotFound", {objectId: key}, "Could not find room by the id '" + key + "'"));
                                    }
                                });
                            }
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.roomPusher.meldCallWithRooms(call.getCallUuid(), roomMap.getValueArray(), function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.roomPusher.pushRoomsToCall(roomMap.getValueArray(), call.getCallUuid(), function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(mappedException, roomMap);
                } else {
                    callback(throwable);
                }
            });
        } else {
            callback(new Exception("UnauthorizedAccess", {}, "Anonymous users cannot access Rooms"));
        }
    },

    /**
     * @param {RequestContext} requestContext
     * @param {{
     *      name: string,
     *      participantEmails,
     *      chatMessage: {
     *          body: {
     *              parts: Array.<*>
     *          }
     *      }
     * }} startRoomObject
     * @param {function(Throwable, Room=)} callback
     */
    startRoom: function(requestContext, startRoomObject, callback) {
        var _this           = this;
        var roomData        = {
            name: startRoomObject.name
        };
        var room            = this.roomManager.generateRoom(roomData);
        var currentUser     = requestContext.get('currentUser');
        var call     = requestContext.get("call");

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    _this.roomManager.createRoom(room, ['conversation'], function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.dbAddUserToRoom(currentUser, room, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.dbPopulateRoomAndRoomMembers(room, function(throwable, returnedRoom) {
                        room = returnedRoom;
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.roomPusher.meldCallWithRoom(call.getCallUuid(), room, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.roomPusher.pushRoom(room, [call.getCallUuid()], function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.userPusher.pushUser(currentUser, [call.getCallUuid()], function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                    if (!throwable) {
                        callback(null, room);
                    } else {
                        callback(throwable);
                    }
                });
        } else {
            callback(new Exception("UnauthorizedAccess", {}, "Anonymous users cannot create Rooms"));
        }
    },

    /*
     * @param {RequestContext} requestContext
     * @param {string} roomId
     * @param {{*}} updates
     * @param {function(Throwable)} callback
     */
    updateRoom: function(requestContext, roomId, updates, callback) {
        //TODO BRN: Implement
        callback(new Exception('UnauthorizedAccess'));
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    // Convenience Retrieve Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Room} room
     * @param {function(Throwable, Room=)} callback
     */
    dbPopulateRoomAndRoomMembers: function(room, callback) {
        console.log('RoomService#dbPopulateRoomAndRoomMembers');
        var _this = this;
        $series([
            $task(function(flow) {
                _this.roomManager.populateRoom(room, ['roomMemberSet', "conversation"], function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                $iterableParallel(room.getRoomMemberSet(), function(flow, roomMember) {
                    _this.roomMemberManager.populateRoomMember(roomMember, ['user'], function(throwable) {
                        if (!throwable) {
                            if (roomMember.getRoomId() === room.getId()) {
                                roomMember.setRoom(room);
                                flow.complete();
                            } else {
                                flow.error(new Exception('RoomMember does not belong in this room'));
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }).execute(function(throwable) {
                        flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(null, room);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {string} roomId
     * @param {function(Throwable, Room=)} callback
     */
    dbRetrievePopulatedRoom: function(roomId, callback) {
        console.log('RoomService#dbRetrievePopulatedRoom');
        var _this       = this;
        var room        = null;
        var roomManager = this.roomManager;
        $series([
            $task(function(flow) {
                roomManager.retrieveRoom(roomId, function(throwable, returnedRoom) {
                    if (!throwable) {
                        if (returnedRoom) {
                            room = returnedRoom;
                        } else {
                            throwable = new Exception('NotFound', {objectId: roomId});
                        }
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.dbPopulateRoomAndRoomMembers(room, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(null, room);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @private
     * @param {string} userId
     * @param {string} roomId
     * @param {function(Throwable, Room, RoomMember)} callback
     */
    dbRetrieveRoomAndRoomMember: function(userId, roomId, callback) {
        var _this           = this;
        var room            = undefined;
        var roomMember      = undefined;

        $parallel([
            $task(function(flow) {
                _this.roomMemberManager.retrieveRoomMemberByUserIdAndRoomId(userId, roomId, function(throwable, returnedRoomMember) {
                    if (!throwable) {
                        roomMember = returnedRoomMember;
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.dbRetrievePopulatedRoom(roomId, function(throwable, returnedRoom) {
                    if (!throwable) {
                        room = returnedRoom;
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(undefined, room, roomMember);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @private
     * @param {string} userId
     * @param {string} roomId
     * @param {function(Throwable, User=, Room=)} callback
     */
    dbRetrieveUserAndRoom: function(userId, roomId, callback) {
        console.log('RoomService#dbRetrieveUserAndRoom');
        var _this           = this;
        var room            = null;
        var user            = null;

        $parallel([
            $task(function(flow) {
                _this.dbRetrievePopulatedRoom(roomId, function(throwable, returnedRoom) {
                    if (!throwable) {
                        room = returnedRoom;
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.userManager.retrieveUser(userId, function(throwable, returnedUser) {
                    if (!throwable) {
                        user = returnedUser;
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(null, user, room);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @private
     * @param {string} userId
     * @param {string} roomId
     * @param {function(Throwable, User=, Room=, RoomMember=)} callback
     */
    dbRetrieveUserRoomAndRoomMember: function(userId, roomId, callback) {
        console.log('RoomService#dbRetrieveUserRoomAndRoomMember');
        var _this           = this;
        var room            = null;
        var roomMember      = null;
        var user            = null;

        $parallel([
            $task(function(flow) {
                _this.roomMemberManager.retrieveRoomMemberByUserIdAndRoomId(userId, roomId, function(throwable, returnedRoomMember) {
                    if (!throwable) {
                        roomMember = returnedRoomMember;
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.dbRetrievePopulatedRoom(roomId, function(throwable, returnedRoom) {
                    if (!throwable) {
                        room = returnedRoom;
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.userManager.retrieveUser(userId, function(throwable, returnedUser) {
                    if (!throwable) {
                        user = returnedUser;
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(null, user, room, roomMember);
            } else {
                callback(throwable);
            }
        });
    },


    // Convenience And and Remove Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {User} user
     * @param {Room} room
     * @param {function(Throwable, User=, Room=, RoomMember=)} callback
     */
    dbAddUserToRoom: function(user, room, callback) {
        var _this           = this;
        /** @type {RoomMember} */
        var roomMember      = null;
        var roomId          = room.getId();
        var userId          = user.getId();
        $parallel([
            $series([
                $task(function(flow) {
                    _this.roomMemberManager.retrieveRoomMemberByUserIdAndRoomId(userId, roomId, function(throwable, returnedRoomMember) {
                        roomMember = returnedRoomMember;
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    if (!roomMember) {
                        roomMember = _this.roomMemberManager.generateRoomMember({
                            userId: userId,
                            roomId: roomId
                        });
                        _this.roomMemberManager.createRoomMember(roomMember, function(throwable, returnedRoomMember) {
                            if (!throwable) {
                                roomMember = returnedRoomMember;
                            }
                            flow.complete(throwable);
                        });
                    } else {
                        flow.complete();
                    }
                }),
                $task(function(flow) {
                    room.addRoomMember(roomMember);
                    _this.roomManager.updateRoom(room, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]),
            $task(function(flow) {
                if (user.getRoomSet().contains(room)) {
                    flow.complete();
                } else {
                    user.addRoom(room);
                    _this.userManager.updateUser(user, function(throwable) {
                        flow.complete(throwable);
                    });
                }
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(null, user, room, roomMember);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @private
     * @param {User} user
     * @param {Room} room
     * @param {RoomMember} roomMember
     * @param {function(Throwable, User, Room)} callback
     */
    dbRemoveUserFromRoom: function(user, room, roomMember, callback) {
        var roomManager         = this.roomManager;
        var userManager         = this.userManager;
        var roomMemberManager   = this.roomMemberManager;

        $parallel([
            $series([
                $task(function(flow) {
                    roomMemberManager.deleteRoomMember(roomMember, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    room.removeRoomMember(roomMember);
                    roomManager.updateRoom(room, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]),
            $task(function(flow) {
                user.removeRoom(room);
                userManager.updateUser(user, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            callback(throwable, user, room);
        });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(RoomService).with(
    module("roomService")
        .args([
            arg().ref("logger"),
            arg().ref("roomManager"),
            arg().ref("userManager"),
            arg().ref("roomMemberManager"),
            arg().ref("chatMessageStreamManager"),
            arg().ref("roomPusher"),
            arg().ref("userPusher"),
            arg().ref("roomMemberPusher")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomService', RoomService);
