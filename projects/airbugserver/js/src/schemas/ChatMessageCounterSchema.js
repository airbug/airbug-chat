//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ChatMessageCounterSchema')
//@Autoload


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
var mongoose    = require('mongoose');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var Schema      = mongoose.Schema;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageCounterSchema = new Schema({
    createdAt:              {type: Date,   required: true, default: Date.now},
    conversationId:         {type: String, required: true, index: true},
    count:                  {type: Number, required: true, default: 0},
    updatedAt:              {type: Date,   required: true, default: Date.now}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageCounterSchema', ChatMessageCounterSchema);
