//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('HomeButtonView')

//@Require('ButtonView')
//@Require('Class')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var HomeButtonView = Class.extend(ButtonView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="button-wrapper">' +
                    '<button id="button-{{cid}}" class="btn btn-primary"><i class="icon-chevron-left icon-white"></i>Home</button>' +
                '</div>'
});
