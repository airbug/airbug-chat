//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.RoomMember')
//@Require('airbugserver.RoomMemberManager')
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
    var Obj                     = bugpack.require('Obj');
    var RoomMember              = bugpack.require('airbugserver.RoomMember');
    var RoomMemberManager       = bugpack.require('airbugserver.RoomMemberManager');
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

    bugyarn.registerWeaver("testRoomMember", function(yarn, args) {
        yarn.spin([
            "setupTestRoomMemberManager"
        ]);

        var roomMemberData     = args[0] || {};
        var testRoomMemberData = Obj.merge(roomMemberData, {
            createdAt: new Date(Date.now()),
            memberType: "testMemberType",
            roomId: "testRoomId",
            updatedAt: new Date(Date.now()),
            userId: "testUserId"
        });
        return this.roomMemberManager.generateRoomMember(testRoomMemberData);
    });

    bugyarn.registerWinder("setupTestRoomMemberManager", function(yarn) {
        yarn.spin([
            "setupTestEntityManagerStore",
            "setupTestSchemaManager",
            "setupDummyMongoDataStore",
            "setupTestEntityDeltaBuilder"
        ]);
        yarn.wind({
            roomMemberManager: new RoomMemberManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder)
        });
        this.roomMemberManager.setEntityType("RoomMember");
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var roomMemberManagerInstantiationTest = {

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
            this.testRoomMemberManager   = new RoomMemberManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testRoomMemberManager, RoomMemberManager),
                "Assert instance of RoomMemberManager");
            test.assertEqual(this.testRoomMemberManager.getEntityManagerStore(), this.entityManagerStore,
                "Assert .entityManagerStore was set correctly");
            test.assertEqual(this.testRoomMemberManager.getEntityDataStore(), this.mongoDataStore,
                "Assert .entityDataStore was set correctly");
            test.assertEqual(this.testRoomMemberManager.getSchemaManager(), this.schemaManager,
                "Assert .schemaManager was set correctly");
            test.assertEqual(this.testRoomMemberManager.getEntityDeltaBuilder(), this.entityDeltaBuilder,
                "Assert .entityDeltaBuilder was set correctly");
        }
    };

    var roomMemberManagerCreateRoomMemberTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this                   = this;
            var yarn                    = bugyarn.yarn(this);
            yarn.spin([
                "setupTestRoomMemberManager"
            ]);
            this.schemaManager.configureModule();
            this.mongoDataStore.configureModule();
            this.testRoomMemberData = {
                createdAt: new Date(Date.now()),
                memberType: "testMemberType",
                roomId: "testRoomId",
                updatedAt: new Date(Date.now()),
                userId: "testUserId"
            };
            this.testRoomMember     = yarn.weave("testRoomMember", [this.testRoomMemberData]);
            $series([
                $task(function(flow) {
                    _this.roomMemberManager.initializeModule(function(throwable) {
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
                _this.roomMemberManager.createRoomMember(_this.testRoomMember, function(throwable, roomMember) {
                    if (!throwable) {
                        test.assertEqual(roomMember, _this.testRoomMember,
                            "Assert RoomMember sent in to createRoomMember is the same RoomMember returned");
                        test.assertTrue(!!roomMember.getId(),
                            "Assert created room has an id");
                        test.assertEqual(roomMember.getCreatedAt(), _this.testRoomMemberData.createdAt,
                            "Assert that RoomMember.createdAt has not changed");
                        test.assertEqual(roomMember.getMemberType(), _this.testRoomMemberData.memberType,
                            "Assert that RoomMember.memberType has not changed");
                        test.assertEqual(roomMember.getRoomId(), _this.testRoomMemberData.roomId,
                            "Assert that RoomMember.roomId has not changed");
                        test.assertEqual(roomMember.getUpdatedAt(), _this.testRoomMemberData.updatedAt,
                            "Assert that RoomMember.updatedAt has not changed");
                        test.assertEqual(roomMember.getUserId(), _this.testRoomMemberData.userId,
                            "Assert that RoomMember.userId has not changed");
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

    var roomMemberManagerRetrieveRoomMemberByUserIdAndRoomIdTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this                   = this;
            var yarn                    = bugyarn.yarn(this);
            yarn.spin([
                "setupTestRoomMemberManager"
            ]);
            this.schemaManager.configureModule();
            this.mongoDataStore.configureModule();

            this.testUserId     = "testUserId";
            this.testRoomId     = "testRoomId";
            this.testRoomMemberData = {
                createdAt: new Date(Date.now()),
                memberType: "testMemberType",
                roomId: this.testRoomId,
                updatedAt: new Date(Date.now()),
                userId: this.testUserId
            };
            this.testRoomMember     = yarn.weave("testRoomMember", [this.testRoomMemberData]);
            $series([
                $task(function(flow) {
                    _this.roomMemberManager.initializeModule(function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.roomMemberManager.createRoomMember(_this.testRoomMember, function(throwable, roomMember) {
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
                _this.roomMemberManager.retrieveRoomMemberByUserIdAndRoomId(_this.testUserId, _this.testRoomId, function(throwable, roomMember) {
                    if (!throwable) {
                        test.assertEqual(_this.testRoomMember.getId(), roomMember.getId(),
                            "Assert that the retrieved RoomMember is the testRoomMember");
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


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(roomMemberManagerInstantiationTest).with(
        test().name("RoomMemberManager - instantiation test")
    );

    bugmeta.tag(roomMemberManagerCreateRoomMemberTest).with(
        test().name("RoomMemberManager - #createRoom Test")
    );

    bugmeta.tag(roomMemberManagerRetrieveRoomMemberByUserIdAndRoomIdTest).with(
        test().name("RoomMemberManager - #retrieveRoomMemberByUserIdAndRoomId Test")
    );
});
