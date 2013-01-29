//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomMemberCollection')

//@Require('Class')
//@Require('airbug.CarapaceCollection')
//@Require('airbug.RoomMemberModel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =                 bugpack.require('Class');
var CarapaceCollection =    bugpack.require('airbug.CarapaceCollection');
var RoomMemberModel =       bugpack.require('airbug.RoomMemberModel');


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
