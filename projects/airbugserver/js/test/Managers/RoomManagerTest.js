//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('annotate.Annotate')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('airbugserver.Room')
//@Require('airbugserver.RoomSchema')
//@Require('airbugserver.RoomMember')
//@Require('airbugserver.RoomMemberSchema')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack 		= require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Annotate 			= bugpack.require('annotate.Annotate');
var TestAnnotation 		= bugpack.require('bugunit-annotate.TestAnnotation');

var Room 				= bugpack.require('airbugserver.Room');
var RoomMember 			= bugpack.require('airbugserver.RoomMember');
var RoomMemberSchema 	= bugpack.require('airbugserver.RoomMemberSchema');
var RoomSchema 			= bugpack.require('airbugserver.RoomSchema');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate 		= Annotate.annotate;
var test 			= TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var addUserTest = {
    
    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------
    setup: function(){
    	var _this				= this;
        this.roomMemberManager	= new RoomMemberManager(RoomMember, RoomMemberSchema);
        this.roomManager    	= new RoomManager(Room, RoomSchema, roomMemberManager);
 		this.room 				= {name: 'testRoom'};
        this.roomId				= undefined;
        this.userId         	= undefined;
        this.callbackFunction   = function(error, room){
        	if(!error && room){
        		_this.returnedRoom = room;
        	}
        };
        this.returnedRoom		= null;

        this.roomManager.create(this.room, function(error, room){
        	_this.room = room;
        })
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------
    test: function(test){

        this.roomManager.addUser(this.roomId, this.userId, this.callbackFunction);
        test.assertEqual(this.testRoom.name, this.room.name,
            "Assert user has been correctly added to the room");
    }
};
annotate(addUserTest).with(
    test().name("RoomManager #addUser Test")
);