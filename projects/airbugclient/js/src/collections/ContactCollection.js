//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ContactCollection')

//@Require('Class')
//@Require('airbug.ContactModel')
//@Require('carapace.CarapaceCollection')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class 				= bugpack.require('Class');
var ContactModel 		= bugpack.require('airbug.ContactModel');
var CarapaceCollection	= bugpack.require('carapace.CarapaceCollection');


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
