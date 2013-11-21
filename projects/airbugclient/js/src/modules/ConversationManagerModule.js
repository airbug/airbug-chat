//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ConversationManagerModule')

//@Require('Class')
//@Require('airbug.ManagerModule')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var ManagerModule   = bugpack.require('airbug.ManagerModule');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConversationManagerModule = Class.extend(ManagerModule, {

    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} conversationId
     * @param {function(Throwable, Meld=)} callback
     */
    retrieveConversation: function(conversationId, callback) {
        this.retrieve("Conversation", conversationId, callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ConversationManagerModule", ConversationManagerModule);
