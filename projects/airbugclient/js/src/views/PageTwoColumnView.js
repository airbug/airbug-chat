//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('PageTwoColumnView')

//@Require('Class')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =         bugpack.require('Class');
var MustacheView =  bugpack.require('airbug.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PageTwoColumnView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template:   '<div id="page-{{cid}}" class="page column">' +
                    '<div class="row column">' +
                        '<div id="page-leftrow" class="{{leftColumnSpan}} column leftrow"></div>' +
                        '<div id="page-rightrow" class="{{rightColumnSpan}} column rightrow"></div>' +
                    '</div>' +
                '</div>',


    //-------------------------------------------------------------------------------
    // MustacheView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data = this._super();
        data.leftColumnSpan = "span6";
        data.rightColumnSpan = "span6";
        switch (this.attributes.configuration) {
            case PageTwoColumnView.Configuration.THIN_RIGHT:
                data.leftColumnSpan = "span9";
                data.rightColumnSpan = "span3";
                break;
        }
        return data;
    }
});

/**
 * @enum {number}
 */
PageTwoColumnView.Configuration = {
    DEFAULT: 1,
    THIN_RIGHT: 2
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.PageTwoColumnView", PageTwoColumnView);
