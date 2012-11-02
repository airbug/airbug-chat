//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('LoginFormView')

//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var LoginFormView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="form-wrapper">' +
                    '<form class="form-horizontal">' +
                        '<div class="control-group">' +
                            '<input class="input-xxlarge" type="text" id="inputEmail" placeholder="Email">' +
                        '</div>' +
                        '<div class="control-group">' +
                            '<input class="input-xxlarge" type="password" id="inputPassword" placeholder="Password">' +
                        '</div>' +
                        '<div class="control-group">' +
                            '<button type="submit" class="btn">Login</button>' +
                        '</div>' +
                    '</form>' +
                '</div>'
});
