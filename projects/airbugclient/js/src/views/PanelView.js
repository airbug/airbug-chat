//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('PanelView')

//@Require('Class')
//@Require('MustacheView')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PanelView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="panel-wrapper">' +
                    '<div id="panel-{{cid}}" class="panel">' +
                        '<div id="panel-body-{{cid}}" class="panel-body panel-body-no-header">' +
                        '</div>' +
                    '</div>' +
                '</div>'
});
