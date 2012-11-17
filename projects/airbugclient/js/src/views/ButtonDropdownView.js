//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ButtonDropdownView')

//@Require('ButtonView')
//@Require('Class')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ButtonDropdownView = Class.extend(ButtonView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="button-wrapper {{buttonWrapperClasses}}">' +
                    '<div class="btn-group">' +
                        '<a id="button-{{cid}}" class="btn dropdown-toggle {{buttonClasses}}" data-toggle="dropdown" href="#">' +
                        '</a>' +
                        '<ul id="dropdown-list-{{cid}}" class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                        '</ul>' +
                    '</div>' +
                '</div>'
});
