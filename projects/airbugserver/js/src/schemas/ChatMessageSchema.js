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
    body: {type: String, require: false},
    code: {type: String},
    codeLanguage: {type: String},
    conversationId: {type: ObjectId, require: true},
    createdAt: Date,
    senderUserId: {type: ObjectId, require: true},
    sentAt: Date,
    type: {type: String},
    updatedAt: Date
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageSchema', ChatMessageSchema);
