//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ChatMessagesApi')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var ChatMessage = bugpack.require('airbugserver.ChatMessage');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessagesApi = {

    create: function(message){
        var newChatMessage = ChatMessage.create(message, function(){});
        RoomApi.sendMessage(newChatMessage);
    }

    update: function(){
        
    },

    destroy: function(){
        
    }
}


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessagesApi', ChatMessagesApi);
