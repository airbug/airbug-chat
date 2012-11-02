//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('RoomMemberPanelItemView')

//@Require('Class')
//@Require('RoomMemberPanelEvent')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomMemberPanelItemView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div id="room-member-{{uid}}" class="panel-item clickable-box">' +
                    '<span id="room-member-status-indicator-{{uid}}" class="user-status-indicator user-status-indicator-{{status}}"></span>' +
                    '<span id="room-member-name-{{uid}}" class="panel-item-text room-member-name">{{firstName}} {{lastName}}</span>' +
                '</div>',


    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    initializeView: function() {
        this._super();
        var _this = this;
        this.$el.bind("click", function(event) {
            _this.handleRoomMemberClick(event);
        });
    },


    //-------------------------------------------------------------------------------
    // View Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param event
     */
    handleRoomMemberClick: function(event) {
        event.preventDefault();
        this.dispatchEvent(new RoomMemberPanelEvent(RoomMemberPanelEvent.EventTypes.ROOM_MEMBER_SELECTED, this.model.toJSON()));
    }
});
