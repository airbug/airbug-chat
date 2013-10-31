//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

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

var Room                    = bugpack.require('airbugserver.Room');
var RoomManager             = bugpack.require('airbugserver.RoomManager');
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
/*var createRoomTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {

        //TODO BRN: We need some sort of setup for mongodb database for INTEGRATION tests

        mongoose.connect('mongodb://localhost/airbugtest');
        this.entityManagerStore     = new EntityManagerStore();
        this.mongoDataStore         = new MongoDataStore(mongoose);
        this.schemaManager          = new SchemaManager();
        this.roomManager            = new RoomManager(this .entityManagerStore, this.schemaManager, this.mongoDataStore);
        this.roomManager.setEntityType("Room");
        this.testRoom               = this.roomManager.generateRoom({name: 'testRoom'});
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
                _this.roomManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.roomManager.createRoom(_this.testRoom, function(throwable, room) {
                    if (!throwable) {
                        test.assertTrue(!!_this.testRoom.getId(),
                            "Assert created room has an id");
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


function makeEmail() {
    var email = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 20; i++ ) {
        email += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    email += "@email.com";
    return email;
}

bugmeta.annotate(createRoomTest).with(
    test().name("RoomManager #createRoom Test")
);  */
