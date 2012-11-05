//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ConversationListItemView')

//@Require('Class')
//@Require('ListItemView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConversationListItemView = Class.extend(ListItemView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="list-item list-item-large clickable-box">' +
                    '<div class="list-item-left">' +
                        '<span id="chat-list-unread-message-count-{{cid}}" class="chat-unread-message-count">{{model.unreadMessageCount}}</span>' +
                    '</div>' +
                    '<div class="list-item-center">' +
                        '<span id="chat-name-{{cid}}" class="text chat-name">{{model.name}}</span>' +
                        '<span id="chat-unread-message-preview-{{cid}}" class="text chat-unread-message-preview">{{model.unreadMessagePreview}}</span>' +
                    '</div>' +
                '</div>',
    
    
    //-------------------------------------------------------------------------------
    // MustacheView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data = this._super();

        //TODO BRN: This is a good unit test candidate.

        if (data.model.unreadMessageCount > 99) {
            data.model.unreadMessageCount = "99+";
        }
        return data;
    }
});
