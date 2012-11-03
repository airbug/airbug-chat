//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('HeaderView')

//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var HeaderView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div id="header-wrapper" class="navbar navbar-fixed-top">' +
                    '<div class="container">' +
                        '<div class="header">' +
                            '<div id="header-left">' +
                            '</div>' +
                            '<div id="header-center">' +
                                '<div id="logo" class="brand" align="center">' +
                                    'airbug' +
                                '</div>' +
                            '</div>' +
                            '<div id="header-right">' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>'
});
