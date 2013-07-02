//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatMessageCollection')

//@Require('Class')
//@Require('airbug.MessageModel')
//@Require('carapace.CarapaceCollection')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class 				= bugpack.require('Class');
var MessageModel 		= bugpack.require('airbug.MessageModel');
var CarapaceCollection 	= bugpack.require('carapace.CarapaceCollection');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageCollection = Class.extend(CarapaceCollection, {

    model: MessageModel

    //-------------------------------------------------------------------------------
    // CarapaceCollection Implementation
    //-------------------------------------------------------------------------------

});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatMessageCollection", ChatMessageCollection);
