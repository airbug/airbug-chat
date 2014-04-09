//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.SubheaderView')

//@Require('Class')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var MustacheView    = bugpack.require('airbug.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SubheaderView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:
        '<div id="subheader-wrapper-{{cid}}" class="subheader-wrapper {{classes}">' +
            '<div id="subheader-{{cid}}" class="subheader">' +
                '<div id="subheader-left-{{cid}}" class="subheader-left">' +
                '</div>' +
                '<div id="subheader-center-{{cid}}" class="subheader-center">' +
                '</div>' +
                '<div id="subheader-right-{{cid}}" class="subheader-right">' +
                '</div>' +
            '</div>' +
        '</div>',

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data    = this._super();
        data.id     = this.getId() || "subheader-" + this.getCid();
        return data;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.SubheaderView", SubheaderView);
