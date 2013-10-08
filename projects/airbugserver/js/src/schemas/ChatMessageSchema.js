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
    conversationId: {type: ObjectId, index: true, required: true},
    createdAt: Date,
    senderUserId: {type: ObjectId, index: true, required: true},
    sentAt: Date,
    tryUuid: {type: String, index: true, required: true},
    type: {type: String, required: true},
    updatedAt: Date
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageSchema', ChatMessageSchema);
