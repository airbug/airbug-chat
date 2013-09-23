//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ChatMessageSchema')


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

var ChatMessageSchema = new Schema({
    body: {type: String, require: true},
    conversationId: {type: ObjectId, require: true},
    conversationOwnerId: {type: ObjectId, require: true},
    createdAt: Date,
    senderUserId: {type: ObjectId, require: true},
    sentAt: Date,
    updatedAt: Date
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageSchema', ChatMessageSchema);
