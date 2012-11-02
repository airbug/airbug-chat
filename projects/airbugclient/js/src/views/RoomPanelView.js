//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('RoomPanelView')

//@Require('Class')
//@Require('MustacheView')
//@Require('RoomPanelItemView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomPanelView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="panel-wrapper panel-wrapper-right">' +
                    '<div class="panel">' +
                        '<div class="panel-header">' +
                            '<span class="panel-header-title">Rooms</span>' +
                            '<span class="panel-header-nav pull-right">' +
                                '<button id="add-room-button" class="btn btn-small">+</button>' +
                            '</span>' +
                        '</div>' +
                        '<div id="room-panel-body" class="panel-body">' +
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
        this.collection.bind('add', function(roomModel) {
            _this.handleCollectionAdd(roomModel);
        });
    },


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @param {ContactModel} roomModel
     */
    handleCollectionAdd: function(roomModel) {
        var roomPanelItemView = new RoomPanelItemView({
            model: roomModel
        });
        this.addViewChild(roomPanelItemView, "#room-panel-body");
    }
});
