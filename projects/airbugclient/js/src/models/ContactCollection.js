//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ContactCollection')

//@Require('Class')
//@Require('airbug.CarapaceCollection')
//@Require('airbug.ContactModel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =                 bugpack.require('Class');
var CarapaceCollection =    bugpack.require('airbug.CarapaceCollection');
var ContactModel =          bugpack.require('airbug.ContactModel');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ContactCollection = Class.extend(CarapaceCollection, {

    model: ContactModel

    //-------------------------------------------------------------------------------
    // CarapaceCollection Implementation
    //-------------------------------------------------------------------------------

});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ContactCollection", ContactCollection);
