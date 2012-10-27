//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('RoomPanelItemView')

//@Require('Class')
//@Require('MustacheView')
//@Require('RoomPanelEvent')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomPanelItemView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template: RoomPanelItemTemplate,

    /**
     * @protected
     */
    initialize: function() {
        this._super();
        var _this = this;
        this.$el.bind("click", function(event) {
            _this.handleRoomClick(event);
        });
    },


    //-------------------------------------------------------------------------------
    // View Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param event
     */
    handleRoomClick: function(event) {
        event.preventDefault();
        this.dispatchEvent(new RoomPanelEvent(RoomPanelEvent.EventTypes.ROOM_SELECTED, this.model.toJSON()));
    }
});
