//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomSchema')

//@Require('airbugserver.RoomMemberSchema')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
var mongoose    = require('mongoose');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var Schema      = mongoose.Schema;
var ObjectId    = mongoose.Schema.Types.ObjectId;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomSchema = new Schema({
    name: String,
    conversationId: ObjectId,
    membersList: [ObjectId],
    createdAt: Date,
    updatedAt: Date
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomSchema', RoomSchema);