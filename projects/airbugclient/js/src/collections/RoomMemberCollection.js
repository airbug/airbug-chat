//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomMemberCollection')

//@Require('Class')
//@Require('airbug.RoomMemberModel')
//@Require('carapace.CarapaceCollection')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var RoomMemberModel     = bugpack.require('airbug.RoomMemberModel');
var CarapaceCollection  = bugpack.require('carapace.CarapaceCollection');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomMemberCollection = Class.extend(CarapaceCollection, {

    model: RoomMemberModel

    //-------------------------------------------------------------------------------
    // CarapaceCollection Implementation
    //-------------------------------------------------------------------------------

});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomMemberCollection", RoomMemberCollection);
