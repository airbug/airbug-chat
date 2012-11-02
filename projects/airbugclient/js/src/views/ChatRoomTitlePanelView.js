//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ChatRoomTitlePanelView')

//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatRoomTitlePanelView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="panel-wrapper panel-wrapper-left">' +
                    '<div class="panel">' +
                        '<div id="chat-room-title-panel-body" class="panel-body panel-body-no-header">' +
                            '<div class="panel-header">' +
                                '<span id="chat-room-title-name" class="panel-header-title chat-room-title-name">{{name}}</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>',


    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    /**
     *
     */
    initializeView: function() {
        var _this = this;
        //TODO BRN: Add listeners to the model for updates to the RoomModel (such as the name of the room)
    }


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

});
