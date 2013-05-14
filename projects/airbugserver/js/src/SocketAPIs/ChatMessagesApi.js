//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ChatMessagesApi')

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.ChatMessage')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var ChatMessage = bugpack.require('airbugserver.ChatMessage');
var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');

//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessagesApi = Class.extend(Obj, {

    create: function(message){
        var newChatMessage = ChatMessage.create(message, function(){});
        RoomApi.sendMessage(newChatMessage);
    },

    update: function(){
        
    },

    destroy: function(){
        
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessagesApi', ChatMessagesApi);
