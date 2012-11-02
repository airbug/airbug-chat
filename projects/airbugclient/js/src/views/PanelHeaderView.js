//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('PanelHeaderView')

//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PanelHeaderView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div id="panel-header-{{cid}}" class="panel-header">' +
                    '<span class="panel-header-title">{{headerTitle}}</span>' +
                    '<span id="panel-header-nav-{{cid}}" class="panel-header-nav pull-right"></span>' +
                '</div>'
});
