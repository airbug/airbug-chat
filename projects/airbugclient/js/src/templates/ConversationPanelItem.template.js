var ConversationPanelItemTemplate =
    '<div id="conversation-{{id}}" class="panel-item panel-item-large clickable-box">' +
        '<div class="panel-item-left">' +
            '<span id="conversation-unread-message-count-{{uid}}" class="conversation-unread-message-count">{{unreadMessageCount}}</span>' +
        '</div>' +
        '<div class="panel-item-center">' +
            '<span id="conversation-name-{{uid}}" class="panel-item-text conversation-name">{{name}}</span>' +
            '<span id="conversation-unread-message-preview-{{uid}}" class="panel-item-text conversation-unread-message-preview">{{unreadMessagePreview}}</span>' +
        '</div>' +
    '</div>';