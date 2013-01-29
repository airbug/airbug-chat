//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('MessageCollection')

//@Require('Class')
//@Require('airbug.CarapaceCollection')
//@Require('airbug.MessageModel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =                 bugpack.require('Class');
var CarapaceCollection =    bugpack.require('airbug.CarapaceCollection');
var MessageModel =          bugpack.require('airbug.MessageModel');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MessageCollection = Class.extend(CarapaceCollection, {

    model: MessageModel

    //-------------------------------------------------------------------------------
    // CarapaceCollection Implementation
    //-------------------------------------------------------------------------------

});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.MessageCollection", MessageCollection);
