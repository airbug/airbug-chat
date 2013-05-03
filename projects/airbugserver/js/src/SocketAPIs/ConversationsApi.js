//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ConversationsApi')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Conversation    = bugpack.require('airbugserver.Conversation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConversationsApi = {

    create: function(){

    }

    update: function(){
        
    },

    destroy: function(){
        
    }
}


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ConversationsApi', ConversationsApi);
