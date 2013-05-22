//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ChatMessageApi')

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

var ChatMessageApi = Class.extend(Obj, {

    _constructor: function(model){

        this._super();

        this.model = model;

    },

    create: function(message, callback){
        var newChatMessage = this.model.create(message, callback);
        // RoomApi.sendMessage(newChatMessage);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageApi', ChatMessageApi);
