//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('UuidGenerator')
//@Require('airbugserver.Room')
//@Require('airbugserver.RoomManager')
//@Require('bugentity.EntityManagerStore')
//@Require('bugentity.SchemaManager')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('mongo.MongoDataStore')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var mongoose                = require('mongoose');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var UuidGenerator           = bugpack.require('UuidGenerator');
var Session                 = bugpack.require('airbugserver.Session');
var SessionManager          = bugpack.require('airbugserver.SessionManager');
var EntityManagerStore      = bugpack.require('bugentity.EntityManagerStore');
var SchemaManager           = bugpack.require('bugentity.SchemaManager');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var MongoDataStore          = bugpack.require('mongo.MongoDataStore');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

//NOTE BRN: As this test stands, it is more of an integration test than a unit test since it depends on DB access.
var sessionManagerTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {

        //TODO BRN: We need some sort of setup for mongodb database for INTEGRATION tests

        mongoose.connect('mongodb://localhost/airbugtest');
        this.testExpires            = new Date(Date.now() + 1000);
        this.entityManagerStore     = new EntityManagerStore();
        this.mongoDataStore         = new MongoDataStore(mongoose);
        this.schemaManager          = new SchemaManager();
        this.sessionManager         = new SessionManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore);
        this.sessionManager.setEntityType("Session");
        this.testSession            = this.sessionManager.generateSession({
            data: {
                key: "value"
            },
            sid: UuidGenerator.generateUuid(),
            cookie: {
                expires: this.testExpires
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
                _this.schemaManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.sessionManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.sessionManager.createSession(_this.testSession, function(throwable) {
                    if (!throwable) {
                        test.assertTrue(!!_this.testSession.getId(),
                            "Assert created Session has an id");
                        test.assertEqual(_this.testSession.getData().key, "value",
                            "Assert that key is equal to test value");
                        test.assertEqual(_this.testSession.getCookie().getExpires(), _this.testExpires,
                            "Assert that expires is equal to testExpires");
                    }
                    flow.complete(throwable);
                });

            }),
            $task(function(flow) {
                _this.sessionManager.retrieveSession(_this.testSession.getId(), function(throwable, retrievedSession) {
                    if (!throwable) {
                        test.assertEqual(retrievedSession.getData().key, "value",
                            "Assert retrieved session data is {key: 'value'}");
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.testSession.getData().key2 = "value2";
                _this.sessionManager.updateSession(_this.testSession, function(throwable) {
                    if (!throwable) {
                        test.assertTrue(!!_this.testSession.getId(),
                            "Assert updated Session has an id");
                        test.assertEqual(_this.testSession.getData().key, "value",
                            "Assert that 'key' is equal to test 'value'");
                        test.assertEqual(_this.testSession.getData().key2, "value2",
                            "Assert that key2 is equal to test value2");
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.sessionManager.retrieveSession(_this.testSession.getId(), function(throwable, retrievedSession) {
                    if (!throwable) {
                        test.assertEqual(retrievedSession.getData().key, "value",
                            "Assert retrieved session data is {key: 'value'}");
                        test.assertEqual(retrievedSession.getData().key2, "value2",
                            "Assert retrieved session data is {key2: 'value2'}");
                    }
                    flow.complete(throwable);
                });
            })

        ]).execute(function(throwable) {
            mongoose.connection.close();
            if (!throwable) {
                test.complete();
            } else {
                test.error(throwable);
            }
        });
    }
};
bugmeta.annotate(sessionManagerTest).with(
    test().name("SessionManager #createSession Test")
);
