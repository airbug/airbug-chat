//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('TextChatMessageModel')

//@Require('Class')
//@Require('airbug.ChatMessageModel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var ChatMessageModel        = bugpack.require('airbug.ChatMessageModel');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var TextChatMessageModel    = Class.extend(ChatMessageModel, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(object, options) {
        this.defaults.body = "";
        this._super(object, options);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.TextChatMessageModel", TextChatMessageModel);
