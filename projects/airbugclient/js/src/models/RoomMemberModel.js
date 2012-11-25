//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('RoomMemberModel')

//@Require('CarapaceModel')
//@Require('Class')


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
        uuid: "",
        roomUuid: "",
        userUuid: "",
        conversationUuid: ""
    }
});
