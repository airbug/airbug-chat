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

//@TestFile

//@Require('Class')
//@Require('Flows')
//@Require('airbugserver.Room')
//@Require('airbugserver.RoomService')
//@Require('airbugserver.User')
//@Require('bugcall.Call')
//@Require('bugdelta.DeltaBuilder')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Flows           = bugpack.require('Flows');
    var Room            = bugpack.require('airbugserver.Room');
    var RoomService     = bugpack.require('airbugserver.RoomService');
    var User            = bugpack.require('airbugserver.User');
    var Call            = bugpack.require('bugcall.Call');
    var DeltaBuilder    = bugpack.require('bugdelta.DeltaBuilder');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestTag         = bugpack.require('bugunit.TestTag');
    var BugYarn         = bugpack.require('bugyarn.BugYarn');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var bugyarn         = BugYarn.context();
    var test            = TestTag.test;
    var $series         = Flows.$series;
    var $task           = Flows.$task;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWinder("setupTestRoomService", function(yarn) {
        yarn.spin([
            "setupMockSuccessPushTaskManager",
            "setupTestLogger",
            "setupTestRoomManager",
            "setupTestUserManager",
            "setupTestRoomMemberManager",
            "setupTestChatMessageStreamManager",
            "setupTestRoomPusher",
            "setupTestUserPusher",
            "setupTestRoomMemberPusher",
            "setupTestConversationManager"
        ]);
        yarn.wind({
            roomService: new RoomService(this.logger, this.roomManager, this.userManager, this.roomMemberManager, this.chatMessageStreamManager, this.roomPusher, this.userPusher, this.roomMemberPusher)
        });
    });


    //-------------------------------------------------------------------------------
    // Setup Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Yarn} yarn
     * @param {Object} setupObject
     * @param {Object} currentUserObject
     * @param {Object} sessionObject
     */
    var setupRoomService = function(yarn, setupObject, currentUserObject, sessionObject) {
        setupObject.marshRegistry.configureModule();
        setupObject.schemaManager.configureModule();
        setupObject.mongoDataStore.configureModule();
        setupObject.testCurrentUser     = yarn.weave("testNotAnonymousUser", [currentUserObject]);
        setupObject.testSession         = yarn.weave("testSession", [sessionObject]);
        setupObject.testCall            = new Call(setupObject.logger, sessionObject.testCallType, sessionObject.testCallUuid);
        setupObject.testRequestContext  = {
            get: function(key) {
                if (key === "currentUser") {
                    return setupObject.testCurrentUser;
                } else if (key === "session") {
                    return setupObject.testSession;
                } else if (key === "call") {
                    return setupObject.testCall;
                }
                return undefined;
            },
            set: function(key, value) {

            }
        };
    };

    var initializeRoomService = function(setupObject, callback) {
        $series([
            $task(function(flow) {
                setupObject.blockingRedisClient.connect(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.redisClient.connect(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.subscriberRedisClient.connect(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.redisPubSub.initialize(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.pubSub.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.roomManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.conversationManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.roomMemberManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.userManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.sessionManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
    };


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var roomServiceInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupTestLogger",
                "setupTestRoomManager",
                "setupTestUserManager",
                "setupTestRoomMemberManager",
                "setupTestChatMessageStreamManager",
                "setupTestRoomPusher",
                "setupTestUserPusher",
                "setupTestRoomMemberPusher"
            ]);
            this.testRoomService    = new RoomService(this.logger, this.roomManager, this.userManager, this.roomMemberManager, this.chatMessageStreamManager, this.roomPusher, this.userPusher, this.roomMemberPusher);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testRoomService, RoomService),
                "Assert instance of RoomService");
            test.assertEqual(this.testRoomService.getChatMessageStreamManager(), this.chatMessageStreamManager,
                "Assert .chatMessageStreamManager was set correctly");
            test.assertEqual(this.testRoomService.getLogger(), this.logger,
                "Assert .logger was set correctly");
            test.assertEqual(this.testRoomService.getRoomManager(), this.roomManager,
                "Assert .roomManager was set correctly");
            test.assertEqual(this.testRoomService.getRoomMemberManager(), this.roomMemberManager,
                "Assert .roomMemberManager was set correctly");
            test.assertEqual(this.testRoomService.getRoomMemberPusher(), this.roomMemberPusher,
                "Assert .roomMemberPusher was set correctly");
            test.assertEqual(this.testRoomService.getRoomPusher(), this.roomPusher,
                "Assert .roomPusher was set correctly");
            test.assertEqual(this.testRoomService.getUserManager(), this.userManager,
                "Assert .userManager was set correctly");
            test.assertEqual(this.testRoomService.getUserPusher(), this.userPusher,
                "Assert .userPusher was set correctly");
        }
    };

    var roomServiceCreateRoomTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupTestRoomService",
                "setupTestSessionManager"
            ]);
            this.testCurrentUserObject    = {
                firstName: "testFirstName",
                lstName: "testLastName"
            };
            this.testSessionObject        = {
                cookie: {
                    domain: "testDomain",
                    expires: new Date(Date.now()),
                    httpOnly: true,
                    originalMaxAge: 1000,
                    path: "testPath",
                    secure: false
                }
            };
            this.testCallUuid   = "abc123";
            this.testCallType   = "testCallType";
            this.testName       = "testName";
            this.testRoomData   = {
                name: this.testName
            };
            setupRoomService(yarn, this, this.testCurrentUserObject, this.testSessionObject);

            $task(function(flow) {
                initializeRoomService(_this, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(function(throwable) {
                if (!throwable) {
                    test.completeSetup();
                } else {
                    test.error(throwable);
                }
            });
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            $series([
                $task(function(flow) {
                    _this.userManager.createUser(_this.testCurrentUser, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.sessionManager.createSession(_this.testSession, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.roomService.createRoom(_this.testRequestContext, _this.testRoomData, function(throwable, room) {
                        if (!throwable) {
                            test.assertEqual(room.getName(), _this.testName,
                                "Assert that room#getName returns testName");
                            test.assertTrue(!!room.getId(),
                                "Assert that an id has been generated for the room");
                            test.assertEqual(room.getRoomMemberIdSet().getCount(), 1,
                                "Assert that the room has 1 room member");
                            var roomMember = room.getRoomMemberSet().toArray()[0];
                            test.assertTrue(room.getRoomMemberIdSet().contains(roomMember.getId()),
                                "Assert that the roomMemberIdSet contains the new roomMember's id");

                            var deltaBuilder    = new DeltaBuilder();
                            var testDelta       = deltaBuilder.buildDelta(room.getDeltaDocument(), room.getDeltaDocument().getPreviousDocument());
                            test.assertEqual(testDelta.getChangeCount(), 0,
                                "Assert that the Entity has been committed and there are no pending changes");
                        }
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    test.completeTest();
                } else {
                    test.error(throwable);
                }
            });
        }
    };

    var roomServiceAddUserToRoomTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupTestRoomService",
                "setupTestSessionManager"
            ]);
            this.testCurrentUserObject    = {
                firstName: "testFirstName",
                lstName: "testLastName"
            };
            this.testSessionObject        = {
                cookie: {
                    domain: "testDomain",
                    expires: new Date(Date.now()),
                    httpOnly: true,
                    originalMaxAge: 1000,
                    path: "testPath",
                    secure: false
                }
            };
            this.testCallUuid   = "abc123";
            this.testCallType   = "testCallType";
            this.testName       = "testName";
            this.testRoomData   = {
                name: this.testName
            };
            this.testOtherUserObject    = {
                firstName: "testOtherFirstName",
                lastName: "testOtherLastName"
            };
            setupRoomService(yarn, this, this.testCurrentUserObject, this.testSessionObject);
            this.testOtherUser = this.userManager.generateUser(this.testOtherUserObject);

            $task(function(flow) {
                initializeRoomService(_this, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(function(throwable) {
                if (!throwable) {
                    test.completeSetup();
                } else {
                    test.error(throwable);
                }
            });
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this       = this;
            var testRoom    = null;
            $series([
                $task(function(flow) {
                    _this.userManager.createUser(_this.testCurrentUser, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.userManager.createUser(_this.testOtherUser, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.sessionManager.createSession(_this.testSession, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.roomService.createRoom(_this.testRequestContext, _this.testRoomData, function(throwable, room) {
                        if (!throwable) {
                            testRoom = room;
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.roomService.addUserToRoom(_this.testRequestContext, _this.testOtherUser, testRoom.getId(), function(throwable, otherUser, room) {
                        if (!throwable) {
                            test.assertEqual(room.getRoomMemberIdSet().getCount(), 2,
                                "Assert that the room has 2 room members");
                            var roomMember = room.getRoomMemberSet().toArray()[1];
                            test.assertTrue(room.getRoomMemberIdSet().contains(roomMember.getId()),
                                "Assert that the roomMemberIdSet contains the new roomMember's id");
                            test.assertTrue(_this.testOtherUser.getRoomIdSet().contains(room.getId()),
                                "Assert that the user's room id set has the room id");
                            var deltaBuilder    = new DeltaBuilder();
                            var testDelta       = deltaBuilder.buildDelta(room.getDeltaDocument(), room.getDeltaDocument().getPreviousDocument());
                            test.assertEqual(testDelta.getChangeCount(), 0,
                                "Assert that the Entity has been committed and there are no pending changes");
                        }
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    test.completeTest();
                } else {
                    test.error(throwable);
                }
            });
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(roomServiceInstantiationTest).with(
        test().name("RoomService - instantiation test")
    );
    bugmeta.tag(roomServiceCreateRoomTest).with(
        test().name("RoomService - #createRoom Test")
    );
    bugmeta.tag(roomServiceAddUserToRoomTest).with(
        test().name("RoomService - #AddUserToRoom Test")
    );
});
