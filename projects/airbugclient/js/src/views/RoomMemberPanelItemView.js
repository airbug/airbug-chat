//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('RoomMemberPanelItemView')

//@Require('Class')
//@Require('RoomMemberPanelItemTemplate')
//@Require('RoomMemberPanelEvent')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomMemberPanelItemView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template: RoomMemberPanelItemTemplate,

    /**
     * @protected
     */
    initialize: function() {
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
