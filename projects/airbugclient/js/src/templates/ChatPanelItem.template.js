var ChatPanelItemTemplate =
    '<div id="chat-{{id}}" class="panel-item panel-item-large clickable-box">' +
        '<div class="panel-item-left">' +
            '<span id="chat-unread-message-count-{{uid}}" class="chat-unread-message-count">{{unreadMessageCount}}</span>' +
        '</div>' +
        '<div class="panel-item-center">' +
            '<span id="chat-name-{{uid}}" class="panel-item-text chat-name">{{name}}</span>' +
            '<span id="chat-unread-message-preview-{{uid}}" class="panel-item-text chat-unread-message-preview">{{unreadMessagePreview}}</span>' +
        '</div>' +
    '</div>';