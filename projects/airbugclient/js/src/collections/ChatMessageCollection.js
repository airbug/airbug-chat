//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatMessageCollection')

//@Require('Class')
//@Require('airbug.ChatMessageModel')
//@Require('carapace.CarapaceCollection')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var ChatMessageModel    = bugpack.require('airbug.ChatMessageModel');
var CarapaceCollection  = bugpack.require('carapace.CarapaceCollection');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageCollection = Class.extend(CarapaceCollection, {

    model: ChatMessageModel

    //-------------------------------------------------------------------------------
    // CarapaceCollection Implementation
    //-------------------------------------------------------------------------------

});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatMessageCollection", ChatMessageCollection);
