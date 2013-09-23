//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('PanelWithHeaderView')

//@Require('Class')
//@Require('airbug.MustacheView')


// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var MustacheView    = bugpack.require('airbug.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PanelWithHeaderView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="panel-wrapper">' +
                    '<div id="{{id}}" class="panel">' +
                        '<div id="panel-header-{{cid}}" class="panel-header">' +
                            '<span class="panel-header-title text text-header">{{attributes.headerTitle}}</span>' +
                            '<span id="panel-header-nav-{{cid}}" class="panel-header-nav pull-right"></span>' +
                        '</div>' +
                        '<div id="panel-body-{{cid}}" class="panel-body">' +
                        '</div>' +
                    '</div>' +
                '</div>',

    generateTemplateData: function() {
        var data    = this._super();
        data.id     = this.getId() || "panel-" + this.cid;
        return data;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.PanelWithHeaderView", PanelWithHeaderView);
