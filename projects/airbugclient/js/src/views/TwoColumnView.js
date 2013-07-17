//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('TwoColumnView')

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

var TwoColumnView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template:       '<div id={{id}} class="row column 2column-container">' +
                        '<div class="{{leftColumnSpan}} {{leftHamburger}} column leftrow column1of2"></div>' +
                        '<div class="{{rightColumnSpan}} {{rightHamburger}} column rightrow column2of2"></div>' +
                    '</div>',


    //-------------------------------------------------------------------------------
    // MustacheView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data    = this._super();
        data.id     = this.getId();
        data.leftColumnSpan = "span6";
        data.rightColumnSpan = "span6";
        switch (this.attributes.configuration) {
            case TwoColumnView.Configuration.THIN_RIGHT:
                data.leftColumnSpan = "span9";
                data.rightColumnSpan = "span3";
                break;
            case TwoColumnView.Configuration.THICK_RIGHT:
                data.leftColumnSpan = "span3";
                data.rightColumnSpan = "span9";
                break;
            case TwoColumnView.Configuration.THIN_RIGHT_SMALL:
                data.leftColumnSpan = "span6";
                data.rightColumnSpan = "span3";
                break;
            case TwoColumnView.Configuration.THICK_RIGHT_SMALL:
                data.leftColumnSpan = "span3";
                data.rightColumnSpan = "span6";
                break;
            case TwoColumnView.Configuration.EXTRA_THIN_RIGHT_SMALL:
                data.leftColumnSpan = "span7";
                data.rightColumnSpan = "span2";
                break;
            case TwoColumnView.Configuration.EXTRA_THICK_RIGHT_SMALL:
                data.leftColumnSpan = "span2";
                data.rightColumnSpan = "span7";
                break;
            case TwoColumnView.Configuration.HAMBURGER_LEFT:
                data.leftHamburger = "hamburger-panel-left hamburger-panel-hidden";
                data.rightHamburger = "";
                data.leftColumnSpan = "span3";
                data.rightColumnSpan = "span12";
                break;
            case TwoColumnView.Configuration.HAMBURGER_RIGHT:
                data.leftHamburger = "";
                data.rightHamburger = "hamburger-panel-right hamburger-panel-hidden";
                data.leftColumnSpan = "span12";
                data.rightColumnSpan = "span3";
                break;
        }
        return data;
    }
});

/**
 * @enum {number}
 */
TwoColumnView.Configuration = {
    DEFAULT: 1,
    THIN_RIGHT: 2,
    THICK_RIGHT: 3,
    THIN_LEFT: 3,
    THICK_LEFT: 2,
    HAMBURGER_LEFT: 4,
    HAMBURGER_RIGHT: 5,
    THIN_RIGHT_SMALL: 6,
    THICK_RIGHT_SMALL: 7
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.TwoColumnView", TwoColumnView);
