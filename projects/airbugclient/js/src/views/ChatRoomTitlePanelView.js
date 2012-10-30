//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ChatRoomTitlePanelView')

//@Require('ChatRoomTitlePanelTemplate')
//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatRoomTitlePanelView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template: ChatRoomTitlePanelTemplate,

    /**
     *
     */
    initialize: function() {
        var _this = this;
        //TODO BRN: Add listeners to the model for updates to the RoomModel (such as the name of the room)
    }


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

});
