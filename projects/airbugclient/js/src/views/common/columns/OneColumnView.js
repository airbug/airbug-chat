//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('OneColumnView')

//@Require('Class')
//@Require('airbug.MultiColumnView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var MultiColumnView     = bugpack.require('airbug.MultiColumnView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var OneColumnView = Class.extend(MultiColumnView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template:
        '<div id=column-{{cid}} class="{{rowStyle}} column 1column-container {{classes}}">' +
            '<div id="column1of1-{{cid}}" class="{{columnSpan}} column column1of1"></div>' +
        '</div>',


    //-------------------------------------------------------------------------------
    // MustacheView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data            = this._super();
        data.columnSpan     = "span6";
        switch (this.getAttribute("configuration")) {
            case OneColumnView.Configuration.HIDE:
                data.clumnSpan = "span0";
                break;
            case OneColumnView.Configuration.THIN:
                data.columnSpan = "span3";
                break;
            case OneColumnView.Configuration.THICK:
                data.columnSpan = "span9";
                break;
            case OneColumnView.Configuration.EXTRA_THICK:
                data.columnSpan = "span11";
                break;
            case OneColumnView.Configuration.FULL:
                data.columnSpan = "span12";
                break;
        }
        return data;
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @enum {number}
 */
OneColumnView.Configuration = {
    DEFAULT: 1,
    THIN: 2,
    THICK: 3,
    EXTRA_THICK: 4,
    FULL: 5,
    HIDE: 6
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.OneColumnView", OneColumnView);
