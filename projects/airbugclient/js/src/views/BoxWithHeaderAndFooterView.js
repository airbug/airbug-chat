//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('BoxWithHeaderAndFooterView')

//@Require('Class')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
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

var BoxWithHeaderAndFooterView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div id="{{id}}" class="box box-with-header box-with-footer {{attributes.classes}}">' +
                    '<div id="box-header-{{cid}}" class="box-header">' +
                    '</div>' +
                    '<div id="box-body-{{cid}}" class="box-body">' +
                    '</div>' +
                    '<div id="box-footer-{{cid}}" class="box-footer">' +
                    '</div>' +
                '</div>',

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data    = this._super();
        data.id     = this.getId() || "box-" + this.cid;
        return data;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.BoxWithHeaderAndFooterView", BoxWithHeaderAndFooterView);
