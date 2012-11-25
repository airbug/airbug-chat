//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('SignupFormView')

//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SignupFormView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="form-wrapper">' +
                    '<form class="form-horizontal">' +
                        '<div class="control-group">' +
                            '<input class="input-xxlarge" type="text" id="inputFirstName" placeholder="First Name">' +
                        '</div>' +
                        '<div class="control-group">' +
                            '<input class="input-xxlarge" type="text" id="inputLastName" placeholder="Last Name">' +
                        '</div>' +
                        '<div class="control-group">' +
                            '<input class="input-xxlarge" type="text" id="inputEmail" placeholder="Email">' +
                        '</div>' +
                        '<div class="control-group">' +
                            '<input class="input-xxlarge" type="password" id="inputPassword" placeholder="Password">' +
                        '</div>' +
                        '<div class="control-group">' +
                            '<button id="signup-button-{{cid}}" type="button" class="btn">Signup</button>' +
                        '</div>' +
                    '</form>' +
                '</div>'
});
