//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('UserList')

//@Require('Class')
//@Require('carapace.CarapaceList')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var CarapaceList        = bugpack.require('carapace.CarapaceList');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserList = Class.extend(CarapaceList, {});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.UserList", UserList);
