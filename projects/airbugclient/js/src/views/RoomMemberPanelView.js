//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('RoomMemberPanelView')

//@Require('Class')
//@Require('RoomMemberPanelItemView')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomMemberPanelView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="panel-wrapper panel-wrapper-left">' +
                    '<div class="panel">' +
                        '<div class="panel-header">' +
                            '<span class="panel-header-title">Room Members</span>' +
                            '<span class="panel-header-nav pull-right">' +
                                '<button id="add-room-member-button" class="btn btn-small">+</button>' +
                            '</span>' +
                        '</div>' +
                        '<div id="room-member-panel-body" class="panel-body">' +
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
        this.collection.bind('add', function(roomMemberModel) {
            _this.handleCollectionAdd(roomMemberModel);
        });
    },


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @param {RoomMemberModel} roomMemberModel
     */
    handleCollectionAdd: function(roomMemberModel) {
        var roomMemberPanelItemView = new RoomMemberPanelItemView({
            model: roomMemberModel
        });
        this.addViewChild(roomMemberPanelItemView, "#room-member-panel-body");
    }
});
