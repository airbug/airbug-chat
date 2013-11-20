//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomService')

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('airbugserver.User')
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
var User        = bugpack.require('airbugserver.User');
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
     * @param {User | string} userOrUserId
     * @param {string} roomId
     * @param {function(Throwable, User, Room)} callback
     */
    addUserToRoom: function(requestContext, userOrUserId, roomId, callback) {
        var _this           = this;
        var currentUser     = requestContext.get("currentUser");
        var meldManager     = this.meldService.factoryManager();
        var room            = undefined;
        var user            = undefined;

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow){
                    if (Class.doesExtend(userOrUserId, User)) {
                        user = userOrUserId;
                        _this.dbRetrievePopulatedRoom(roomId, function(throwable, returnedRoom){
                            if(!throwable){
                                room = returnedRoom;
                            }
                            flow.complete(throwable);
                        })
                    } else {
                        _this.dbRetrieveUserAndRoom(userOrUserId, roomId, function(throwable, returnedUser, returnedRoom){
                            if(!throwable){
                                room        = returnedRoom;
                                user        = returnedUser;
                            }
                            flow.complete(throwable);
                        });
                    }
                }),
                $task(function(flow) {
                    _this.dbAddUserToRoom(user, room, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.meldUserWithRoom(meldManager, user, room);
                    _this.meldRoom(meldManager, room);
                    _this.meldService.meldEntity(meldManager, "User", "basic", user);
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
     * @param {function(Throwable, Room=)} callback
     */
    createRoom: function(requestContext, roomData, callback) {
        var _this           = this;
        var room            = this.roomManager.generateRoom(roomData);
        var currentUser     = requestContext.get("currentUser");
        var meldManager     = this.meldService.factoryManager();
        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    _this.roomManager.createRoom(room, ["conversation"], function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.dbAddUserToRoom(currentUser, room, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.dbPopulateRoomAndRoomMembers(room, function(throwable, returnedRoom){
                        room = returnedRoom;
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

    /*
     * @param {RequestContext} requestContext
     * @param {string} roomId
     * @param {function(Throwable, Room)} callback
     */
    deleteRoom: function(requestContext, roomId, callback) {
        //TODO
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} roomId
     * @param {function(Throwable, Room)} callback
     */
    joinRoom: function(requestContext, roomId, callback) {
        /* @type {airbugserver.User}*/
        var currentUser     = requestContext.get("currentUser");
        this.addUserToRoom(requestContext, currentUser, roomId, callback);
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} roomId
     * @param {function(Throwable, Room)} callback
     */
    leaveRoom: function(requestContext, roomId, callback){
        /* @type {airbugserver.User}*/
        var currentUser     = requestContext.get("currentUser");
        this.removeUserFromRoom(requestContext, currentUser, roomId, callback);
    },

    /**
     * @param {RequestContext} requestContext
     * @param {User | string} userOrUserId
     * @param {string} roomId
     * @param {function(Throwable, Room)} callback
     */
    removeUserFromRoom: function(requestContext, userOrUserId, roomId, callback) {
        var _this               = this;
        var currentUser         = requestContext.get("currentUser");
        var meldManager         = this.meldService.factoryManager();
        var meldService         = this.meldService;
        var room                = undefined;
        var user                = undefined;
        var roomMember          = undefined;

        if (currentUser.isNotAnonymous()) {
            $series([
                //retrieves
                $task(function(flow) {
                    if(Class.doesExtend(userOrUserId, User)){
                        user = userOrUserId;
                        _this.dbRetrieveRoomAndRoomMember(user.getId(), roomId, function(throwable, returnedRoom, returnedRoomMember){
                            if(!throwable){
                                room        = returnedRoom;
                                roomMember  = returnedRoomMember;
                            }
                            flow.complete(throwable);
                        });
                    } else {
                        _this.dbRetrieveUserRoomAndRoomMember(userOrUserId, roomId, function(throwable, returnedUser, returnedRoom, returnedRoomMember){
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
                $task(function(flow){
                    _this.dbRemoveUserFromRoom(user, room, function(throwable){
                        flow.complete(throwable);
                    });
                }),
                //melds
                $task(function(flow) {
                    meldService.unmeldEntity(meldManager, "RoomMember", "basic", roomMember);
                    _this.meldRoom(meldManager, room);
                    meldService.meldEntity(meldManager, "User", "basic", user);
                    meldManager.commitTransaction(function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                console.log("RoomService#removeUserFromRoom results: throwable:", throwable, " user:", user, " room:", room);
                callback(throwable, room, user);
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
    retrieveRoom: function(requestContext, roomId, callback) {
        var _this       = this;
        var currentUser = requestContext.get("currentUser");
        var meldManager = this.meldService.factoryManager();
        var room        = undefined;
        var roomManager = this.roomManager;

        if (currentUser.isNotAnonymous()) {
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
        } else {
            callback(new Exception("UnauthorizedAccess"));
        }
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

        if (currentUser.isNotAnonymous()) {
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
                        _this.dbPopulateRoomAndRoomMembers(room, function(throwable) {
                            _this.meldUserWithRoom(meldManager, currentUser, room);
                            _this.meldRoom(meldManager, room);
                            flow.complete(throwable);
                        });
                    }).execute(function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow){
                    meldManager.commitTransaction(function(throwable) {
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
        } else {
            callback(new Exception("UnauthorizedAccess"));
        }
    },

    /*
     * @param {RequestContext} requestContext
     * @param {string} roomId
     * @param {{*}} updates
     * @param {function(Throwable)} callback
     */
    updateRoom: function(requestContext, roomId, updates, callback) {
        //TODO
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    // Convenience Retrieve Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Room} room
     * @param {function(Throwable, Room)} callback
     */
    dbPopulateRoomAndRoomMembers: function(room, callback) {
        console.log("RoomService#dbPopulateRoomAndRoomMembers");
        var _this = this;
        $series([
            $task(function(flow) {
                _this.roomManager.populateRoom(room, ["roomMemberSet"], function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow){
                $iterableParallel(room.getRoomMemberSet(), function(flow, roomMember) {
                    _this.roomMemberManager.populateRoomMember(roomMember, ["user"], function(throwable) {
                        if(!throwable){
                            if(roomMember.getRoomId() === room.getId()){
                                roomMember.setRoom(room);
                                flow.complete();
                            } else {
                                flow.error(new Exception("RoomMember does not belong in this room"));
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }).execute(function(throwable){
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
     * @param {string} roomId
     * @param {function(Throwable, Room)} callback
     */
    dbRetrievePopulatedRoom: function(roomId, callback) {
        console.log("RoomService#dbRetrievePopulatedRoom");
        var _this       = this;
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
                _this.dbPopulateRoomAndRoomMembers(room, function(throwable) {
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
     * @private
     * @param {string} userId
     * @param {string} roomId
     * @param {function(Throwable, Room, RoomMember)} callback
     */
    dbRetrieveRoomAndRoomMember: function(userId, roomId, callback){
        console.log("RoomService#dbRetrieveRoomAndRoomMember");
        var _this           = this;
        var room            = undefined;
        var roomMember      = undefined;

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
            })
        ]).execute(function(throwable){
            console.log("RoomService#dbRetrieveRoomAndRoomMember results: Throwable:", throwable, "room:", room, "roomMember:", roomMember);
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
     * @param {function(Throwable, User, Room)} callback
     */
    dbRetrieveUserAndRoom: function(userId, roomId, callback){
        console.log("RoomService#dbRetrieveUserAndRoom");
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
        console.log("RoomService#dbRetrieveUserRoomAndRoomMember");
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
        console.log("RoomService#dbAddUserToRoom");
        var _this           = this;
        var roomMember      = undefined;
        var roomId          = room.getId();
        var userId          = user.getId();
        $parallel([
            $series([
                $task(function(flow){
                    _this.roomMemberManager.retrieveRoomMemberByUserIdAndRoomId(userId, roomId, function(throwable, returnedRoomMember){
                        roomMember = returnedRoomMember;
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    if(!roomMember){
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
                    })
                })
            ]),
            $task(function(flow) {
                if(user.getRoomSet().contains(room)){
                    flow.complete();
                } else {
                    user.addRoom(room);
                    _this.userManager.updateUser(user, function(throwable) {
                        flow.complete(throwable);
                    });
                }
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
        console.log("RoomService#dbRemoveUserFromRoom");
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

    /**
     * @param {MeldManager} meldManager
     * @param {Room} room
     */
    meldRoom: function(meldManager, room) {
        console.log("RoomService#meldRoom");
        var meldService             = this.meldService;
        var roomMemberSet           = room.getRoomMemberSet();

        meldService.meldEntity(meldManager, "Room", "basic", room);
        roomMemberSet.forEach(function(roomMember) {
            var user = roomMember.getUser();
            meldService.meldEntity(meldManager, "RoomMember", "basic", roomMember);
            meldService.meldEntity(meldManager, "User", "basic", user);
        });
    },

    /**
     * @param {MeldManager} meldManager
     * @param {User} user
     * @param {Room} room
     */
    meldUserWithRoom: function(meldManager, user, room) {
        console.log("RoomService#meldUserWithRoom");
        var meldUserWithRoomMembersSwitch   = false;
        var meldService                     = this.meldService;
        var reason                          = room.getId();
        var roomMeldKey                     = this.meldService.generateMeldKey("Room", room.getId(), "basic");
        var selfUserMeldKey                 = this.meldService.generateMeldKey("User", user.getId(), "basic");
        var selfRoomMemberMeldKey           = undefined;
        var userId                          = user.getId();
        var meldKeys                        = [roomMeldKey];

        console.log("roomMemberSet count:", room.getRoomMemberSet().getCount());

        room.getRoomMemberSet().forEach(function(roomMember) {
            console.log("roomMember:", roomMember);
            var roomMemberMeldKey       = meldService.generateMeldKey("RoomMember", roomMember.getId(), "basic");
            var roomMemberUser          = roomMember.getUser();
            console.log("roomMemberUser:", roomMemberUser);
            var roomMemberUserMeldKey   = meldService.generateMeldKey("User", roomMemberUser.getId(), "basic");

            meldKeys.push(roomMemberMeldKey);
            meldKeys.push(roomMemberUserMeldKey);

            if (!meldUserWithRoomMembersSwitch) {
                if (roomMember.getUserId() === userId) {
                    meldUserWithRoomMembersSwitch = true;
                    selfRoomMemberMeldKey = roomMemberMeldKey;
                }
            }
        });

        if(meldUserWithRoomMembersSwitch) {
            room.getRoomMemberSet().forEach(function(roomMember) {
                var roomMemberUser      = roomMember.getUser();
                meldService.meldUserWithKeysAndReason(meldManager, roomMemberUser, [selfUserMeldKey, selfRoomMemberMeldKey], reason);
            });
        }

        meldService.meldUserWithKeysAndReason(meldManager, user, meldKeys, reason);
    },

    /**
     * @param {MeldManager} meldManager
     * @param {User} user
     * @param {Room} room
     */
    unmeldUserWithRoom: function(meldManager, user, room){
        console.log("RoomService#unmeldUserWithRoom");
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
