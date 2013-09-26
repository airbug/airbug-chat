//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatMessageCollection')

//@Require('Class')
//@Require('airbug.CodeChatMessageModel')
//@Require('airbug.ImageChatMessageModel')
//@Require('airbug.TextChatMessageModel')
//@Require('carapace.CarapaceCollection')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var CodeChatMessageModel    = bugpack.require('airbug.CodeChatMessageModel');
var ImageChatMessageModel   = bugpack.require('airbug.ImageChatMessageModel');
var TextChatMessageModel    = bugpack.require('airbug.TextChatMessageModel');
var CarapaceCollection      = bugpack.require('carapace.CarapaceCollection');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageCollection = Class.extend(CarapaceCollection, {

    model: function(attributes, options){
        switch(attributes.type) {
            case "text": 
                return new TextChatMessageModel(attributes, options); 
                break;
            case "code":
                return new CodeChatMessageModel(attributes,options);
                break;
            case "image":
                return new ImageChatMessageModel(attributes,options);
                break;
        }
    }

    //-------------------------------------------------------------------------------
    // CarapaceCollection Implementation
    //-------------------------------------------------------------------------------

});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatMessageCollection", ChatMessageCollection);
