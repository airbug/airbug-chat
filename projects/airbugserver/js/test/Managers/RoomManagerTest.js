//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('mongo.MongoDataStore')
//@Require('airbugserver.ChatMessageManager')
//@Require('airbugserver.ConversationManager')
//@Require('airbugserver.RoomManager')
//@Require('airbugserver.RoomMemberManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var mongoose                = require('mongoose');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var MongoDataStore          = bugpack.require('mongo.MongoDataStore');
var ChatMessageManager      = bugpack.require('airbugserver.ChatMessageManager');
var ConversationManager     = bugpack.require('airbugserver.ConversationManager');
var RoomManager             = bugpack.require('airbugserver.RoomManager');
var RoomMemberManager       = bugpack.require('airbugserver.RoomMemberManager');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

//NOTE BRN: As this test stands, it is more of an integration test than a unit test since it depends on DB access.
var createRoomTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this               = this;

        //TODO BRN: We need some sort of setup for mongodb database for INTEGRATION tests
        mongoose.connect('mongodb://localhost/airbugtest');

        this.mongoDataStore         = new MongoDataStore(mongoose);
        this.chatMessageManager     = new ChatMessageManager
        this.conversationManager    = new ConversationManager();
        this.roomMemberManager      = new RoomMemberManager(RoomMember, RoomMemberSchema);
        this.roomManager            = new RoomManager(Room, RoomSchema, this.conversationManager, this.roomMemberManager);
        this.testRoom               = this.roomManager.generateRoom({name: 'testRoom'});
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;

        _this.roomManager.createRoom(_this.testRoom, function(error, room) {
            if (!error) {
                test.assertTrue(!!_this.testRoom.getId(),
                    "Assert created room has an id");
            } else {
                test.error(error);
            }
            mongoose.connection.close();
            test.complete();
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
);
