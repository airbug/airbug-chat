//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('RoomMemberPanelView')

//@Require('Class')
//@Require('RoomMemberPanelItemView')
//@Require('RoomMemberPanelTemplate')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomMemberPanelView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template: RoomMemberPanelTemplate,

    /**
     *
     */
    initialize: function() {
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
