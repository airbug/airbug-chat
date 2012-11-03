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
                        '<span id="chat-list-unread-message-count-{{uid}}" class="chat-unread-message-count">{{unreadMessageCount}}</span>' +
                    '</div>' +
                    '<div class="list-item-center">' +
                        '<span id="chat-name-{{uid}}" class="list-item-text chat-name">{{name}}</span>' +
                        '<span id="chat-unread-message-preview-{{uid}}" class="list-item-text chat-unread-message-preview">{{unreadMessagePreview}}</span>' +
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

        if (data.unreadMessageCount > 99) {
            data.unreadMessageCount = "99+";
        }
        return data;
    }
});
