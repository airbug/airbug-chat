//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ConversationCollection')

//@Require('Class')
//@Require('airbug.CarapaceCollection')
//@Require('airbug.ConversationModel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =                 bugpack.require('Class');
var CarapaceCollection =    bugpack.require('airbug.CarapaceCollection');
var ConversationModel =     bugpack.require('airbug.ConversationModel');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConversationCollection = Class.extend(CarapaceCollection, {

    model: ConversationModel

    //-------------------------------------------------------------------------------
    // CarapaceCollection Implementation
    //-------------------------------------------------------------------------------

});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ConversationCollection", ConversationCollection);
