//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('RoomPanelView')

//@Require('Class')
//@Require('RoomPanelItemView')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomPanelView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template: RoomPanelTemplate,

    /**
     *
     */
    initialize: function() {
        var _this = this;
        this.collection.bind('add', function(roomModel) {
            _this.processCollectionAdd(roomModel);
        });
    },

    /**
     * @param {ContactModel} roomModel
     */
    processCollectionAdd: function(roomModel) {
        var roomPanelItemView = new RoomPanelItemView({
            model: roomModel
        });
        this.addViewChild(roomPanelItemView, "#room-panel-body");
    }
});
