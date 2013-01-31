//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('PageThreeColumnView')

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

var PageThreeColumnView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template:   '<div id="page-{{cid}}" class="page column">' +
                    '<div class="row column">' +
                        '<div id="page-leftrow" class="{{leftColumnSpan}} column leftrow"></div>' +
                        '<div id="page-centerrow" class="{{centerColumnSpan}} column centerrow"></div>' +
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
        data.leftColumnSpan = "span2";
        data.centerColumnSpan = "span8";
        data.rightColumnSpan = "span2";
        switch (this.attributes.configuration) {
            case PageThreeColumnView.Configuration.THICK_RIGHT:
                data.rightColumnSpan = "span3";
                data.centerColumnSpan = "span7";
                break;
        }
        return data;
    }
});

/**
 * @enum {number}
 */
PageThreeColumnView.Configuration = {
    DEFAULT: 1,
    THICK_RIGHT: 2
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.PageThreeColumnView", PageThreeColumnView);
