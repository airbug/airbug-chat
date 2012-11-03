//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('RoomMemberListItemView')

//@Require('Class')
//@Require('ListItemView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomMemberListItemView = Class.extend(ListItemView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="list-item clickable-box">' +
                    '<span id="room-member-status-indicator-{{uid}}" class="user-status-indicator user-status-indicator-{{status}}"></span>' +
                    '<span id="room-member-name-{{uid}}" class="list-item-text room-member-name">{{firstName}} {{lastName}}</span>' +
                '</div>'
});
