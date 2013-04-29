//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ConversationSchema')


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
var Mixed       = mongoose.Schema.Types.Mixed;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConversationSchema = new Schema({
    ownerId: ObjectId,
    messageIdList: [ObjectId],
    messageList: [Mixed], //type: ChatMessage
    createdAt: Date,
    updatedAt: Date
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ConversationSchema', ConversationSchema);
