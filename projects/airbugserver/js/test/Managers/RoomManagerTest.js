//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('airbugserver.Conversation')
//@Require('airbugserver.ConversationManager')
//@Require('airbugserver.ConversationSchema')
//@Require('airbugserver.Room')
//@Require('airbugserver.RoomManager')
//@Require('airbugserver.RoomMember')
//@Require('airbugserver.RoomMemberManager')
//@Require('airbugserver.RoomMemberSchema')
//@Require('airbugserver.RoomSchema')
//@Require('airbugserver.User')
//@Require('airbugserver.UserManager')
//@Require('airbugserver.UserSchema')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();
var mongoose        = require('mongoose');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta             = bugpack.require('bugmeta.BugMeta');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');
var Conversation        = bugpack.require('airbugserver.Conversation');
var ConversationManager = bugpack.require('airbugserver.ConversationManager');
var ConversationSchema  = bugpack.require('airbugserver.ConversationSchema');
var Room                = bugpack.require('airbugserver.Room');
var RoomManager         = bugpack.require('airbugserver.RoomManager');
var RoomMember          = bugpack.require('airbugserver.RoomMember');
var RoomMemberManager   = bugpack.require('airbugserver.RoomMemberManager');
var RoomMemberSchema    = bugpack.require('airbugserver.RoomMemberSchema');
var RoomSchema          = bugpack.require('airbugserver.RoomSchema');
var User                = bugpack.require('airbugserver.User');
var UserManager         = bugpack.require('airbugserver.UserManager');
var UserSchema          = bugpack.require('airbugserver.UserSchema');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta = BugMeta.context();
var test    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

//NOTE BRN: As this test stands, it is more of an integration test than a unit test since it depends on DB access.
var addUserTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this               = this;

        //TODO BRN: We need some sort of setup for mongodb database for INTEGRATION tests
        mongoose.connect('mongodb://localhost/airbugtest');

        this.conversationManager    = new ConversationManager(Conversation, ConversationSchema);
        this.roomMemberManager      = new RoomMemberManager(RoomMember, RoomMemberSchema);
        this.roomManager            = new RoomManager(Room, RoomSchema, this.conversationManager, this.roomMemberManager);
        this.userManager            = new UserManager(User, UserSchema);
        this.testRoom               = {name: 'testRoom'};
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        this.userManager.createUser({
            firstName: "test",
            lastName: "test",
            email: makeEmail()
        }, function(error, user) {
            if (!error) {
                _this.roomManager.createRoom(_this.testRoom, function(error, room) {
                    _this.roomManager.addUserToRoom(user._id, room._id, function(error, returnedRoom) {
                        if (!error) {
                            test.assertEqual(_this.testRoom.name, returnedRoom.name,
                                "Assert user has been correctly added to the room");
                        } else {
                            test.error(error);
                        }
                        mongoose.connection.close();
                        test.complete();
                    });
                });
            } else {
                test.error(error);
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

bugmeta.annotate(addUserTest).with(
    test().name("RoomManager #addUser Test")
);