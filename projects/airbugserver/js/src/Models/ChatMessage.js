//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('User')

//@Require('airbugserver.ChatMessageSchema')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();

var UserSchema = bugpack.require('airbugserver.ChatMessageSchema');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var User = mongoose.model("ChatMessage", ChatMessageSchema);

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessage', ChatMessage);
