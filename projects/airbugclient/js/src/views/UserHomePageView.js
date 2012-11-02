//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('UserHomePageView')

//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserHomePageView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="row column">' +
                    '<div id="userhomepage-leftrow" class="span3 column"></div>' +
                    '<div id="userhomepage-centerrow" class="span6 column"></div>' +
                    '<div id="userhomepage-rightrow" class="span3 column"></div>' +
                '</div>'
});
