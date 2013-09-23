//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('PanelView')

//@Require('Class')
//@Require('TypeUtil')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var TypeUtil        = bugpack.require('TypeUtil');
var MustacheView    = bugpack.require('airbug.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PanelView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="panel-wrapper">' +
                    '<div id="{{id}}" class="panel">' +
                        '<div id="panel-body-{{cid}}" class="panel-body panel-body-no-header">' +
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

bugpack.export("airbug.PanelView", PanelView);
