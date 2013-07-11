//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomMemberModel')

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
varCarapaceModel    = bugpack.require('carapace.CarapaceModel');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

// TODO BRN: Should we really break this model out from the RoomModel? From the perspective of the DB we would save
// ourselves a query if all of the room members were contained within the RoomModel record so that we could load
// all of this info at once. Best to look in to how to do that in MongoDB.

var RoomMemberModel = Class.extend(CarapaceModel, {

    //-------------------------------------------------------------------------------
    // CarapaceModel Implementation
    //-------------------------------------------------------------------------------

    defaults: {
        _id: "",
        roomId: "",
        userId: ""
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomMemberModel", RoomMemberModel);
