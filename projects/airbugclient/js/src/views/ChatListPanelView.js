//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ChatListPanelView')

//@Require('ChatListPanelItemView')
//@Require('ChatListPanelTemplate')
//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatListPanelView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template: ChatListPanelTemplate,

    /**
     *
     */
    initialize: function() {
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
