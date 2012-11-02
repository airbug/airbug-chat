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
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div id="room-{{id}}" class="panel-item clickable-box">' +
                    '<span id="room-name-{{uid}}" class="panel-item-text room-name">{{name}}</span>' +
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
