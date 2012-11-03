//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('PageThreeColumnView')

//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PageThreeColumnView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template:   '<div id="page-{{cid}}" class="page column">' +
                    '<div class="row column">' +
                        '<div id="page-leftrow" class="span3 column leftrow"></div>' +
                        '<div id="page-centerrow" class="span6 column centerrow"></div>' +
                        '<div id="page-rightrow" class="span3 column rightrow"></div>' +
                    '</div>' +
                '</div>'
});
