//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CurrentUserModel')

//@Require('Class')
//@Require('carapace.CarapaceModel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var CarapaceModel   = bugpack.require('carapace.CarapaceModel');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CurrentUserModel = Class.extend(CarapaceModel, {

    //-------------------------------------------------------------------------------
    // CarapaceModel Implementation
    //-------------------------------------------------------------------------------

    defaults: {
        uuid: "",
        email: "",
        emailSet: [],
        firstName: "",
        lastName: "",
        status: ""
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CurrentUserModel", CurrentUserModel);
