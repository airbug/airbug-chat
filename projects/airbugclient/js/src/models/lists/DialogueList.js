//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('DialogueList')

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

var DialogueList = Class.extend(CarapaceList, {});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.DialogueList", DialogueList);