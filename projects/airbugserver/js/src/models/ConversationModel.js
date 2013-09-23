//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ConversationModel')

//@Require('airbugserver.ConversationSchema')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();
var mongoose            = require('mongoose');


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var ConversationSchema  = bugpack.require('airbugserver.ConversationSchema');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConversationModel = mongoose.model("Conversation", ConversationSchema);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ConversationModel', ConversationModel);
