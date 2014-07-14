//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('ISet')
//@Require('Obj')
//@Require('Set')
//@Require('airbugserver.Room')
//@Require('airbugserver.RoomManager')
//@Require('Flows')
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

    var Class                   = bugpack.require('Class');
    var ISet                    = bugpack.require('ISet');
    var Obj                     = bugpack.require('Obj');
    var Set                     = bugpack.require('Set');
    var Room                    = bugpack.require('airbugserver.Room');
    var RoomManager             = bugpack.require('airbugserver.RoomManager');
    var Flows                 = bugpack.require('Flows');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var TestTag          = bugpack.require('bugunit.TestTag');
    var BugYarn                 = bugpack.require('bugyarn.BugYarn');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var bugyarn                 = BugYarn.context();
    var test                    = TestTag.test;
    var $series                 = Flows.$series;
    var $task                   = Flows.$task;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWeaver("testRoom", function(yarn, args) {
        yarn.spin([
            "setupTestRoomManager"
        ]);
        var roomData = args[0] || {};
        var testRoomData = Obj.merge(roomData, {
            name: "testName"
        });
        return this.roomManager.generateRoom(testRoomData);
    });

    bugyarn.registerWinder("setupTestRoomManager", function(yarn) {
        yarn.spin([
            "setupTestEntityManagerStore",
            "setupTestSchemaManager",
            "setupDummyMongoDataStore",
            "setupTestEntityDeltaBuilder"
        ]);
        yarn.wind({
            roomManager: new RoomManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder)
        });
        this.roomManager.setEntityType("Room");
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var roomManagerInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupTestEntityManagerStore",
                "setupTestSchemaManager",
                "setupDummyMongoDataStore",
                "setupTestEntityDeltaBuilder"
            ]);
            this.testRoomManager   = new RoomManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testRoomManager, RoomManager),
                "Assert instance of RoomManager");
            test.assertEqual(this.testRoomManager.getEntityManagerStore(), this.entityManagerStore,
                "Assert .entityManagerStore was set correctly");
            test.assertEqual(this.testRoomManager.getEntityDataStore(), this.mongoDataStore,
                "Assert .entityDataStore was set correctly");
            test.assertEqual(this.testRoomManager.getSchemaManager(), this.schemaManager,
                "Assert .schemaManager was set correctly");
            test.assertEqual(this.testRoomManager.getEntityDeltaBuilder(), this.entityDeltaBuilder,
                "Assert .entityDeltaBuilder was set correctly");
        }
    };

    var roomManagerCreateRoomTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this                   = this;
            var yarn                    = bugyarn.yarn(this);
            yarn.spin([
                "setupTestRoomManager"
            ]);
            this.schemaManager.configureModule();
            this.mongoDataStore.configureModule();

            this.testRoomMemberId       = "testRoomMemberId";
            this.testRoomData           = {
                name: "testName",
                conversationId: "testConversationId",
                roomMemberIdSet: new Set([this.testRoomMemberId])
            };
            this.testRoom               = yarn.weave("testRoom", [this.testRoomData]);
            $series([
                $task(function(flow) {
                    _this.roomManager.initializeModule(function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
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
            $task(function(flow) {
                _this.roomManager.createRoom(_this.testRoom, function(throwable, room) {
                    if (!throwable) {
                        test.assertEqual(room, _this.testRoom,
                            "Assert room sent in to createRoom is the same room returned");
                        var id = room.getId();
                        test.assertTrue(!!id,
                            "Assert created room has an id. id = " + id);
                        test.assertEqual(room.getName(), _this.testRoomData.name,
                            "Assert that Room.name has not changed");
                        test.assertEqual(room.getConversationId(), _this.testRoomData.conversationId,
                            "Assert that Room.conversationId has not changed");
                        test.assertTrue(Class.doesImplement(room.getRoomMemberIdSet(), ISet),
                            "Assert that Room.roomMemberSet is still a Set");
                        test.assertTrue(room.getRoomMemberIdSet().contains(_this.testRoomMemberId),
                            "Assert that Room.roomMemberSet contains the testRoomMemberId");
                        test.assertTrue((room.getCreatedAt() instanceof Date),
                            "Assert createdAt was set to a Date");
                        test.assertTrue((room.getUpdatedAt() instanceof Date),
                            "Assert updatedAt was set to a Date");
                    }
                    flow.complete(throwable);
                });
            }).execute(function(throwable) {
                if (!throwable) {
                    test.completeTest();
                } else {
                    test.error(throwable);
                }
            });
        }
    };


    var roomManagerUpdateRoomTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this                   = this;
            var yarn                    = bugyarn.yarn(this);
            yarn.spin([
                "setupTestRoomManager"
            ]);
            this.schemaManager.configureModule();
            this.mongoDataStore.configureModule();

            this.testRoomData           = {
                name: "testName"
            };
            this.testNameUpdate         = "testNameUpdate";
            this.testRoom               = yarn.weave("testRoom", [this.testRoomData]);
            $series([
                $task(function(flow) {
                    _this.roomManager.initializeModule(function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
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
                    _this.roomManager.createRoom(_this.testRoom, function(throwable, room) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.roomManager.retrieveRoom(_this.testRoom.getId(), function(throwable, returnedRoom) {
                        if (!throwable) {
                            test.assertEqual(_this.testRoom.getId(), returnedRoom.getId(),
                                "Assert Room returned is the same Room sent in");
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.testRoom.setName(_this.testNameUpdate);
                    _this.roomManager.updateRoom(_this.testRoom, function(throwable, returnedRoom) {
                        if (!throwable) {
                            test.assertEqual(_this.testRoom, returnedRoom,
                                "Assert that the Room instance returned is the same as the one sent in");
                            test.assertEqual(returnedRoom.getName(), _this.testNameUpdate,
                                "Assert that the Room.name is set to the new value");
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.roomManager.retrieveRoom(_this.testRoom.getId(), function(throwable, returnedRoom) {
                        if (!throwable) {
                            test.assertEqual(returnedRoom.getName(), _this.testNameUpdate,
                                "Assert that the Room.name is set to the new value");
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

    bugmeta.tag(roomManagerInstantiationTest).with(
        test().name("RoomManager - instantiation test")
    );

    bugmeta.tag(roomManagerCreateRoomTest).with(
        test().name("RoomManager - #createRoom Test")
    );

    bugmeta.tag(roomManagerUpdateRoomTest).with(
        test().name("RoomManager - #updateRoom Test")
    );
});
