//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('PanelWithHeaderView')

//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PanelWithHeaderView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="panel-wrapper">' +
                    '<div id="panel-{{cid}}" class="panel">' +
                        '<div id="panel-header-{{cid}}" class="panel-header">' +
                            '<span class="panel-header-title text text-header">{{attributes.headerTitle}}</span>' +
                            '<span id="panel-header-nav-{{cid}}" class="panel-header-nav pull-right"></span>' +
                        '</div>' +
                        '<div id="panel-body-{{cid}}" class="panel-body">' +
                        '</div>' +
                    '</div>' +
                '</div>'
});
