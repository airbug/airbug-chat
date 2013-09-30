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
    conversationId: {type: ObjectId, index: true},
    createdAt: Date,
    name: String,
    roomMemberIdSet: [{ type: ObjectId, ref: 'RoomMember'}],
    updatedAt: Date
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomSchema', RoomSchema);