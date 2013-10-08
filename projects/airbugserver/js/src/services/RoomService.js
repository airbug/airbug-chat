//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomService')

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Exception   = bugpack.require('Exception');
var Obj         = bugpack.require('Obj');
var BugFlow     = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $parallel           = BugFlow.$parallel;
var $series             = BugFlow.$series;
var $task               = BugFlow.$task;
var $iterableParallel   = BugFlow.$iterableParallel;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(roomManager, userManager, roomMemberManager, meldService) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MeldService}
         */
        this.meldService            = meldService;

        /**
         * @private
         * @type {RoomManager}
         */
        this.roomManager            = roomManager;

        /**
         * @private
         * @type {RoomMemberManager}
         */
        this.roomMemberManager      = roomMemberManager;

        /**
         * @private
         * @type {UserManager}
         */
        this.userManager            = userManager;
    },


    //-------------------------------------------------------------------------------
    // Service Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {RequestContext} requestContext
     * @param {string} userId
     * @param {string} roomId
     * @param {function(Throwable, User, Room)} callback
     */
    addUserToRoom: function(requestContext, userId, roomId, callback) {
        var _this           = this;
        var currentUser     = requestContext.get("currentUser");
        var meldManager     = this.meldService.factoryManager();
        var room            = undefined;
        var roomMember      = undefined;
        var user            = undefined;

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow){
                    _this.dbRetrieveUserAndRoom(userId, roomId, function(throwable, returnedUser, returnedRoom){
                        if(!throwable){
                            room        = returnedRoom;
                            user        = returnedUser;
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.dbAddUserToRoom(user, room, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.meldUserWithRoom(meldManager, user, room);
                    _this.meldRoom(meldManager, room);
                    meldManager.commitTransaction(function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                console.log("RoomService#addUserToRoom results: Throwable:", throwable, "user:", user, "room:", room);
                if (!throwable) {
                    callback(undefined, room, user);
                } else {
                    callback(throwable);
                }
            });
        } else {
            callback(new Exception("UnauthorizedAccess"));
        }
    },

    /**
     * @param {RequestContext} requestContext
     * @param {{
     *
     * }} roomData
     * @param {function(Throwable, Room)} callback
     */
    createRoom: function(requestContext, roomData, callback) {
        var _this           = this;
        var room            = this.roomManager.generateRoom(roomData);
        var currentUser     = requestContext.get("currentUser");
        var meldManager     = this.meldService.factoryManager();
        var meldService     = this.meldService;
        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    _this.roomManager.createRoom(room, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.dbAddUserToRoom(currentUser, room, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.meldUserWithRoom(meldManager, currentUser, room);
                    _this.meldRoom(meldManager, room);
                    meldManager.commitTransaction(function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                    if (!throwable) {
                        callback(undefined, room);
                    } else {
                        callback(throwable);
                    }
                });
        } else {
            callback(new Exception("UnauthorizedAccess"));
        }
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} roomId
     * @param {function(Throwable, Room)} callback
     */
    joinRoom: function(requestContext, roomId, callback) {
        var currentUser     = requestContext.get("currentUser");
        this.addUserToRoom(requestContext, currentUser.getId(), roomId, callback);
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} roomId
     * @param {function(Throwable, Room)} callback
     */
    leaveRoom: function(requestContext, roomId, callback){
        var currentUser     = requestContext.get("currentUser");
        this.removeUserFromRoom(requestContext, currentUser.getId(), roomId, callback);
    },

    /**
     * @param {string} userId
     * @param {string} roomId
     * @param {function(Throwable, room)} callback
     */
    removeUserFromRoom: function(requestContext, userId, roomId, callback){
        var _this               = this;
        var meldManager         = this.meldService.factoryManager();
        var meldService         = this.meldService;
        var room                = undefined;
        var user                = undefined;
        var roomMember          = undefined;

        $series([
            //retrieves
            $task(function(flow) {
                _this.dbRetrieveUserRoomAndRoomMember(userId, roomId, function(throwable, returnedUser, returnedRoom, returnedRoomMember){
                    if (!throwable) {
                        room        = returnedRoom;
                        roomMember  = returnedRoomMember;
                        user        = returnedUser;
                    }
                    flow.complete(throwable);
                });
            }),
            //deletes and removes
            $task(function(flow){
                _this.dbRemoveUserFromRoom(user, room, function(throwable){
                    flow.complete(throwable);
                });
            }),
            //melds
            $task(function(flow) {
                meldService.unmeldEntity(meldManager, "RoomMember", "basic", roomMember);
                meldManager.commitTransaction(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow){
                _this.meldRoom(meldManager, room);
                flow.complete();
            })
        ]).execute(function(throwable) {
            console.log("RoomService#removeUserFromRoom results: throwable:", throwable, " user:", user, " room:", room);
            callback(throwable, room, user);
        });
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} roomId
     * @param {function(Throwable, Room)} callback
     */
    retrieveRoom: function(requestContext, roomId, callback) {
        var _this       = this;
        var currentUser = requestContext.get("currentUser");
        var meldManager = this.meldService.factoryManager();
        var room        = undefined;
        var roomManager = this.roomManager;

        $series([
            $task(function(flow){
                _this.dbRetrievePopulatedRoom(roomId, function(throwable, returnedRoom){
                    room = returnedRoom;
                });
            }),
            $task(function(flow) {
                _this.meldUserWithRoom(meldManager, currentUser, room);
                _this.meldRoom(meldManager, room);
                meldManager.commitTransaction(function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(undefined, room);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {Array.<string>} roomIds
     * @param {function(Throwable, Map.<string, Room>)} callback
     */
    retrieveRooms: function(requestContext, roomIds, callback) {
        var _this       = this;
        /** @type {Map.<string, Room>} */
        var roomMap     = undefined;
        var currentUser = requestContext.get("currentUser");
        var meldManager = this.meldService.factoryManager();
        var roomManager = this.roomManager;

        $series([
            $task(function(flow) {
                roomManager.retrieveRooms(roomIds, function(throwable, returnedRoomMap) {
                    if (!throwable) {
                        roomMap = returnedRoomMap;
                        if (!roomMap) {
                            throwable = new Exception(""); //TODO
                        }
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                $iterableParallel(roomMap.getValueCollection(), function(flow, room) {
                    $series([
                        $task(function(flow){
                            roomManager.populateRoom(room, function(throwable) {
                                flow.complete(throwable);
                            });
                        }),
                        $task(function(flow){
                            _this.meldUserWithRoom(meldManager, currentUser, room);
                            _this.meldRoom(meldManager, room);
                            meldManager.commitTransaction(function(throwable) {
                                flow.complete(throwable);
                            });
                        })
                    ]).execute(function(throwable){
                        flow.complete(throwable);
                    });
                }).execute(function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(undefined, roomMap);
            } else {
                callback(throwable);
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    // Convenience Retrieve Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} roomId
     * @param {function(Throwable, Room)} callback
     */
    dbRetrievePopulatedRoom: function(roomId, callback) {
        var _this;
        var room        = undefined;
        var roomManager = this.roomManager;
        $series([
            $task(function(flow) {
                roomManager.retrieveRoom(roomId, function(throwable, returnedRoom) {
                    if (!throwable) {
                        if (returnedRoom) {
                            room = returnedRoom;
                        } else {
                            throwable = new Exception("NotFound", {objectId: roomId});
                        }
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                roomManager.populateRoom(room, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $iterableParallel(room.getRoomMemberSet(), function(flow, roomMember) {
                _this.roomMemberManager.populateRoomMember(roomMember, function(throwable) {
                    flow.complete(throwable);
                })
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(undefined, room);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @private
     * @param {string} userId
     * @param {string} roomId
     * @param {function(Throwable, User, Room)} callback
     */
    dbRetrieveUserAndRoom: function(userId, roomId, callback){
        var _this           = this;
        var room            = undefined;
        var user            = undefined;

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
        ]).execute(function(throwable){
            console.log("RoomService#dbRetrieveUserRoomAndRoomMember results: Throwable:", throwable, "user:", user, "room:", room, "roomMember:", roomMember);
            if (!throwable) {
                callback(undefined, user, room, roomMember);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @private
     * @param {string} userId
     * @param {string} roomId
     * @param {function(Throwable, User, Room, RoomMember)} callback
     */
    dbRetrieveUserRoomAndRoomMember: function(userId, roomId, callback){
        var _this           = this;
        var room            = undefined;
        var roomMember      = undefined;
        var user            = undefined;

        $parallel([
            $task(function(flow) {
                _this.roomManager.retrieveRoomMemberByUserIdAndRoomId(userId, roomId, function(throwable, returnedRoomMember) {
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
        ]).execute(function(throwable){
            console.log("RoomService#dbRetrieveUserRoomAndRoomMember results: Throwable:", throwable, "user:", user, "room:", room, "roomMember:", roomMember);
            if (!throwable) {
                callback(undefined, user, room, roomMember);
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
     * @param {function(Throwable, User, Room)} callback
     */
    dbAddUserToRoom: function(user, room, callback) {
        var _this           = this;
        var roomMember      = undefined;

        $parallel([
            $series([
                $task(function(flow) {
                    var roomMember = _this.roomMemberManager.generateRoomMember({
                        userId: user.getId(),
                        roomId: room.getId()
                    });
                    _this.roomMemberManager.createRoomMember(roomMember, function(throwable, returnedRoomMember) {
                        if (!throwable) {
                            roomMember = returnedRoomMember;
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    room.addRoomMember(roomMember);
                    _this.roomManager.updateRoom(room, function(throwable) {
                        flow.complete(throwable);
                    })
                })
            ]),
            $task(function(flow) {
                user.addRoom(room);
                _this.userManager.updateUser(user, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable){
            if (!throwable) {
                callback(undefined, user, room);
            } else {
                callback(throwable, user, room);
            }
        });
    },

    /**
     * @private
     * @param {User} user
     * @param {Room} room
     * @param {function(Throwable, User, Room)} callback
     */
    dbRemoveUserFromRoom: function(user, room, callback) {
        var roomManager         = this.roomManager;
        var userManager         = this.userManager;
        var roomMemberManager   = this.roomMemberManager;

        $parallel([
            $series([
                $task(function(flow){
                    roomMemberManager.deleteRoomMember(roomMember, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow){
                    room.removeRoomMember(roomMember);
                    roomManager.updateRoom(room, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]),
            $task(function(flow){
                user.removeRoom(room);
                userManager.updateUser(user, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable){
            callback(throwable, user, room);
        });
    },


    // Convenience Meld Methods
    //-------------------------------------------------------------------------------

    meldRoom: function(meldManager, room) {
        var _this                   = this;
        var meldService             = this.meldService;
        var roomMeldKey             = this.meldService.generateMeldKey("Room", room.getId(), "basic");
        var roomMemberSet           = room.getRoomMemberSet();

        meldService.meldEntity(meldManager, "Room", "basic", room);
        roomMemberSet.forEach(function(roomMember){
            var user = roomMember.getUser();
            meldService.meldEntity(meldManager, "RoomMember", "basic", roomMember);
            if(user) meldService.meldEntity(meldManager, "User", "basic", user);
        });
    },

    /**
     * @private
     * @param {MeldManager} meldManager
     * @param {User} user
     * @param {Room} room
     */
    meldUserWithRoom: function(meldManager, user, room) {
        var _this                           = this;
        var meldKeys                        = [roomMeldKey];
        var meldManager                     = this.meldManagerFactory.factoryManager();
        var meldUserWithRoomMembersSwitch   = false;
        var meldService                     = this.meldService;
        var reason                          = room.getId();
        var roomMeldKey                     = this.meldService.generateMeldKey("Room", room.getId(), "basic");
        var selfUserMeldKey                 = this.meldService.generateMeldKey("User", user.getId(), "basic");
        var selfRoomMemberMeldKey           = undefined;

        $series([
            $task(function(flow){
                _this.roomMemberManager.retrieveRoomMemberByUserIdAndRoomId(user.getId(), room.getId(), function(throwable, roomMember){
                    if(!throwable && roomMember){
                        meldUserWithRoomMembersSwitch   = true;
                        selfRoomMemberMeldKey           = meldService.generateMeldKey("RoomMember", roomMember.getId(), "basic");
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow){
                room.getRoomMemberSet().forEach(function(roomMember) {
                    var roomMemberMeldKey   = meldService.generateMeldKey("RoomMember", roomMember.getId(), "basic");
                    var roomMemberUser      = roomMember.getUser();
                    meldKeys.push(roomMemberMeldKey);
                    if (roomMemberUser) {
                        var userMeldKey = meldService.generateMeldKey("User", user.getId(), "basic");
                        meldKeys.push(userMeldKey);
                        if(meldUserWithRoomMembersSwitch) meldService.meldUserWithKeysAndReason(roomMemberUser, [selfUserMeldKey, selfRoomMemberMeldKey], reason);
                    }
                });
                flow.complete();
            })
        ]).execute(function(throwable){
            if(!throwable) {
                meldService.meldUserWithKeysAndReason(meldManager, user, meldKeys, reason);
            } else {
                throw throwable;
            }
        });
    },

    /**
     * @private
     * @param {MeldManager} meldManager
     * @param {User} user
     * @param {Room} room
     */
    unmeldUserWithRoom: function(meldManager, user, room){
        var meldService = this.meldService;
        var meldKeys    = [roomMeldKey];
        var reason      = room.getId();
        var roomMeldKey = meldService.generateMeldKey("Room", room.getId(), "basic");

        room.getRoomMemberSet().forEach(function(roomMember) {
            var roomMemberMeldKey   = meldService.generateMeldKey("RoomMember", roomMember.getId(), "basic");
            var roomMemberUser      = roomMember.getUser();
            meldKeys.push(roomMemberMeldKey);
            if (roomMemberUser) {
                var userMeldKey = meldService.generateMeldKey("User", user.getId(), "basic");
                meldKeys.push(userMeldKey);
            }
        });
        this.meldService.unmeldUserWithKeysAndReason(user, meldKeys, reason);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomService', RoomService);
