//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ContactListItemView')

//@Require('Class')
//@Require('ListItemView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ContactListItemView = Class.extend(ListItemView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="list-item clickable-box">' +
                    '<span id="contact-status-indicator-{{cid}}" class="user-status-indicator user-status-indicator-{{status}}"></span>' +
                    '<span id="contact-name-{{cid}}" class="list-item-text contact-name">{{firstName}} {{lastName}}</span>' +
                '</div>'
});
