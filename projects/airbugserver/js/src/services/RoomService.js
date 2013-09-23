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
     * @param {function(Error, User, Room)} callback
     */
    addUserToRoom: function(requestContext, userId, roomId, callback) {

        //TODO: change this into a "transaction"

        var _this           = this;
        var room            = undefined;
        var user            = undefined;
        var roomMember      = undefined;
        var currentUser     = requestContext.get("currentUser");

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    _this.databaseRetrieveAddUserToRoom(userId, roomId, function(error, returnedUser, returnedRoom) {
                        user = returnedUser;
                        room = returnedRoom;
                    });
                }),
                $task(function(flow) {
                    var roomMeldKey         = _this.meldService.generateMeldKey("Room", room.getId(), "basic");
                    var ownerUserMeldKey    = _this.meldService.generateMeldKey("User", user.getId(), "owner");
                    var basicUserMeldKey    = _this.meldService.generateMeldKey("User", user.getId(), "basic");
                    var roomMemberMeldKey   = _this.meldService.generateMeldKey("RoomMember", roomMember.getId(), "basic");
                    var currentUser         = requestContext.get("currentUser");
                    var meldManager         = _this.meldService.factoryManager();

                    meldManager.meldWithUser(currentUser, [
                        roomMeldKey,
                        ownerUserMeldKey,
                        roomMemberMeldKey
                    ]);
                    room.getRoomMembers().forEach(function(roomMember) {
                        room
                    });


                    // Find all CallManagers associated with the current user
                    //  * Each CallManager should already have a MeldMirror associated with it
                    //  * A MeldMirror should contain the list of meldKeys that the call manager is associated with
                    // map those callmanagers to the meldKeys in the MeldMirrorManager

                    // Ensure that the room is currently in the MeldStore, if not add it to the MeldStore. Get back the MeldObject for that me
                    // Ensure that the user is currently in the MeldStore, if not add it to the MeldStore so that a meldKey is generated for it
                    // Add the new RoomMember to the meldStore

                    // Each

                    // Take the Deltas of both the user and the room


                    // Generate a transaction for the MeldStore that changes the values in the MeldStore
                    // Transaction should contain...
                    // 1) Adding a new RoomMember and all of the property changes associated with the RoomMember
                    // 2) Adding the roommember id to the membersList of

                    //Send the room to the user who was just added to it..

                    meldManager.commitTransaction(function(error) {
                        flow.complete(error);
                    })
                })
            ]).execute(function(error){
                console.log("RoomService#addUserToRoom results: Error:", error, "user:", user, "room:", room);
                if (!error) {
                    callback(undefined, room, user);
                } else {
                    callback(error);
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
     * @param {function(Error, Room)} callback
     */
    createRoom: function(requestContext, roomData, callback) {
        var _this           = this;
        var room            = this.roomManager.generateRoom(roomData);
        var currentUser     = requestContext.get("currentUser");
        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    _this.roomManager.createRoom(room, function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this.databaseAddUserToRoom(currentUser, room, function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    var meldManager = _this.meldManagerFactory.factoryManager();
                    _this.meldUserWithRoom(meldManager, currentUser, room);
                    _this.meldService.meldEntity(meldManager, "Room", "basic", room);
                    meldManager.commitTransaction(function(error) {
                        flow.complete(error);
                    });
                })
            ]).execute(function(error) {
                    if (!error) {
                        callback(undefined, room);
                    } else {
                        callback(error);
                    }
                });
        } else {
            callback(new Exception("UnauthorizedAccess"));
        }
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} roomId
     * @param {function(Error, Room)} callback
     */
    joinRoom: function(requestContext, roomId, callback) {

        //TODO: change this into a "transaction"

        var _this           = this;
        var room            = undefined;
        var currentUser     = requestContext.get("currentUser");
        if (currentUser.isNotAnonymous()) {
            $series([
                $parallel([
                    $task(function(flow) {
                        _this.databaseRetrievePopulatedRoom(roomId, function(error, returnedRoom) {
                            if (!error) {
                                if (returnedRoom) {
                                    room = returnedRoom;
                                } else {
                                    error = new Exception("NotFound", {objectId: roomId});
                                }
                            }
                            flow.complete(error);
                        });
                    }),
                    $task(function(flow) {
                        _this.userManager.populateUser(currentUser, function(error) {
                            flow.complete(error);
                        });
                    })
                ]),
                $task(function(flow) {
                    if (!currentUser.containsRoom(room)) {
                        _this.databaseAddUserToRoom(currentUser, room, function(error) {
                            flow.complete(error);
                        });
                    } else {
                        flow.error(new Exception("UserAlreadyInRoom"));
                    }
                }),
                $task(function(flow) {
                    //TODO BRN: Meld the room with the user and meld the user to all people in the room
                })
            ]).execute(function(error){
                    console.log("RoomService#joinRoom results: Error:", error, "user:", currentUser, "room:", room);
                    if (!error) {
                        callback(undefined, room);
                    } else {
                        callback(error);
                    }
                });
        } else {
            callback(new Exception("UnauthorizedAccess"));
        }
    },

    /**
     * @param {string} userId
     * @param {string} roomId
     * @param {function(Error, room)} callback
     */
    removeUserFromRoom: function(userId, roomId, callback){
        var _this       = this;
        var room        = undefined;
        var user        = undefined;
        var roomMember  = undefined;
        $series([
            $parallel([
                $task(function(flow) {
                    _this.roomManager.retrieveRoom(roomId, function(error, returnedRoom) {
                        if (!error) {
                            room = returnedRoom;
                        }
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this.userManager.retrieveUser(userId, function(error, returnedUser) {
                        if (!error) {
                            user = returnedUser;
                        }
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this.roomMemberManager.retrieveRoomMemberByUserIdAndRoomId(userId, roomId, function(error, returnedRoomMember) {
                        if (!error) {
                            roomMember = returnedRoomMember;
                        }
                        flow.complete(error);
                    });
                })
            ]),
            $parallel([
                $series([
                    $task(function(flow){
                        _this.roomMemberManager.removeRoomMember(roomMember, function(error) {
                            flow.complete(error);
                        });
                    }),
                    $task(function(flow){
                        room.removeRoomMember(roomMember);
                        _this.roomManager.saveRoom(room, function(error) {
                            flow.complete(error);
                        });
                    })
                ]),
                $task(function(flow){
                    _this.userManager.removeRoomFromUser(roomId, userId, function(error, returnedUser) {
                        user = returnedUser;
                        flow.complete(error);
                    });
                })
            ]),
            $task(function(flow) {
                //TODO BRN: meld roomMembers of change
                flow.complete();
            })
        ]).execute(function(error){
            console.log("RoomService#removeUserFromRoom results: error:", error, " user:", user, " room:", room);
            callback(error, room, user);
        });
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} roomId
     * @param {function(Error, Room)} callback
     */
    retrieveRoom: function(requestContext, roomId, callback) {
        var _this       = this;
        var room        = undefined;
        $series([
            $task(function(flow) {
                _this.roomManager.retrieveRoom(roomId, function(error, returnedRoom) {
                    if (!error) {
                        if (returnedRoom) {
                            room = returnedRoom;
                        } else {
                            error = new Exception("NotFound", {objectId: roomId});
                        }
                    }
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                _this.roomManager.populateRoom(room, function(error) {
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                var currentUser     = requestContext.get("currentUser");
                var meldManager     = _this.meldManagerFactory.factoryManager();
                _this.meldUserWithRoom(meldManager, currentUser, room);
                meldManager.commitTransaction(function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(function(error) {
            if (!error) {
                callback(undefined, room);
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {Array.<string>} roomIds
     * @param {function(Error, List.<Room>)} callback
     */
    retrieveRooms: function(roomIds, callback) {
        var _this       = this;
        var roomList    = undefined;
        $series([
            $task(function(flow) {
                _this.roomManager.retrieveRooms(roomIds, function(error, returnedRoomList) {
                    if (!error) {
                        room = returnedRoom;
                        if (!room) {
                            error = new Exception("Could not find room by id '" + roomId + "'");
                        }
                    }
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                $iterableParallel(roomList, function(flow, room) {
                    _this.roomManager.populateRoom(room, function(error) {
                        flow.complete(error);
                    });
                }).execute(function(error) {
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                var currentUser         = requestContext.get("currentUser");
                var meldManager         = _this.meldManagerFactory.factoryManager();
                _this.meldUserWithRoom(meldManager, currentUser, room);
                meldManager.commitTransaction(function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(function(error) {
            if (!error) {
                callback(undefined, room);
            } else {
                callback(error);
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} userId
     * @param {string} roomId
     * @param {function(Error, User, Room)} callback
     */
    databaseRetrieveAddUserToRoom: function(userId, roomId, callback) {

        //TODO: change this into a "transaction"

        var _this           = this;
        var room            = undefined;
        var user            = undefined;

        $series([
            $parallel([
                $task(function(flow) {
                    _this.databaseRetrievePopulatedRoom(roomId, function(error, returnedRoom) {
                        if (!error) {
                            room = returnedRoom;
                        }
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this.userManager.retrieveUser(userId, function(error, returnedUser) {
                        if (!error) {
                            user = returnedUser;
                        }
                        flow.complete(error);
                    });
                })
            ]),
            $task(function(flow) {
                _this.databaseAddUserToRoom(user, room, function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(function(error){
            console.log("RoomService#addUserToRoom results: Error:", error, "user:", user, "room:", room);
            if (!error) {
                callback(undefined, room, user);
            } else {
                callback(error);
            }
        });
    },

    /**
     * @private
     * @param {User} user
     * @param {Room} room
     * @param {function(Error, User, Room)} callback
     */
    databaseAddUserToRoom: function(user, room, callback) {

        //TODO: change this into a "transaction"

        var _this           = this;
        var roomMember      = undefined;

        $parallel([
            $series([
                $task(function(flow) {
                    var roomMember = _this.roomMemberManager.generateRoomMember({
                        userId: user.getId(),
                        roomId: room.getId()
                    });
                    _this.roomMemberManager.createRoomMember(roomMember, function(error, returnedRoomMember) {
                        if (!error) {
                            roomMember = returnedRoomMember;
                        }
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    room.addRoomMember(roomMember);
                    _this.saveRoom(room, function(error) {
                        flow.complete(error);
                    })
                })
            ]),
            $task(function(flow) {
                user.addRoom(room);
                _this.userManager.saveUser(user, function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(function(error){
            if (!error) {
                callback(undefined, user, room);
            } else {
                callback(error);
            }
        });
    },

    /**
     * @private
     * @param {string} roomId
     * @param {function(Error, Room)} callback
     */
    databaseRetrievePopulatedRoom: function(roomId, callback) {
        var _this;
        var room = undefined;
        $series([
            $task(function(flow) {
                _this.roomManager.retrieveRoom(roomId, function(error, returnedRoom) {
                    if (!error) {
                        room = returnedRoom;
                    }
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                _this.roomManager.populateRoom(room, function(error) {
                    flow.complete(error);
                });
            }),
            $iterableParallel(room.getRoomMemberList(), function(flow, roomMember) {
                _this.roomMemberManager.populateRoomMember(roomMember, function(error) {
                    flow.complete(error);
                })
            })
        ]).execute(function(error) {
            if (!error) {
                callback(undefined, room);
            } else {
                callback(error);
            }
        });
    },

    /**
     * @private
     * @param {MeldManager} meldManager
     * @param {User} user
     * @param {Room} room
     */
    meldUserWithRoom: function(meldManager, user, room) {
        var _this = this;
        var roomMeldKey = this.meldService.generateMeldKey("Room", room.getId(), "basic");
        var meldKeys = [
            roomMeldKey
        ];
        room.getRoomMemberList().forEach(function(roomMember) {
            var roomMemberMeldKey = _this.generateMeldKey("RoomMember", roomMember.getId(), "basic");
            meldKeys.push(roomMemberMeldKey);
            if (roomMember.getUser()) {
                var userMeldKey = _this.generateMeldKey("User", roomMember.getUser().getId(), "basic");
                meldKeys.push(userMeldKey);
            }
        });
        this.meldService.meldUserWithKeys(user, meldKeys);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomService', RoomService);
