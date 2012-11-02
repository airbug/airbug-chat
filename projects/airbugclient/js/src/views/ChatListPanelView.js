//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ChatListPanelView')

//@Require('ChatListPanelItemView')
//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatListPanelView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="panel-wrapper panel-wrapper-center">' +
                    '<div class="panel">' +
                        '<div id="chat-panel-body" class="panel-body panel-body-no-header">' +
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
        this.collection.bind('add', function(chatModel) {
            _this.handleCollectionAdd(chatModel);
        });
    },


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @param {ChatModel} chatModel
     */
    handleCollectionAdd: function(chatModel) {
        var chatPanelItemView = new ChatListPanelItemView({
            model: chatModel
        });
        this.addViewChild(chatPanelItemView, "#chat-panel-body");
    }
});
