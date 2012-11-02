//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('PanelBodyView')

//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PanelBodyView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div id="panel-body-{{cid}}" class="panel-body {{panelBodyClasses}}">' +
                '</div>'
});

