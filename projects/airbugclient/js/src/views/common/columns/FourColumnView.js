//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('FourColumnView')

//@Require('Class')
//@Require('airbug.MultiColumnView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var MultiColumnView     = bugpack.require('airbug.MultiColumnView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var FourColumnView = Class.extend(MultiColumnView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template:       '<div id={{id}} class="{{rowStyle}} column 3column-container {{classes}}">' +
                        '<div class="column column1of4 leftrow {{leftColumnSpan}} {{leftHamburger}}"></div>' +
                        '<div class="column column2of4 {{centerLeftColumnSpan}}"></div>' +
                        '<div class="column column3of4 {{centerRightColumnSpan}} "></div>' +
                        '<div class="column column4of4 rightrow {{rightColumnSpan}} {{rightHamburger}}"></div>' +
                    '</div>',


    //-------------------------------------------------------------------------------
    // MustacheView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data                    = this._super();
        data.id                     = this.getId() || "four-column-row-container-" + this.cid;
        data.leftColumnSpan         = "span3";
        data.centerLeftColumnSpan   = "span3";
        data.centerRightColumnSpan  = "span3";
        data.rightColumnSpan        = "span3";
        switch (this.attributes.configuration) {
            case FourColumnView.Configuration.HAMBURGER_LEFT:
                data.leftHamburger      = "hamburger-panel-left hamburger-panel-hidden";
                data.rightHamburger     = "";
                data.leftColumnSpan         = "span3";
                data.centerLeftColumnSpan   = "span4";
                data.centerRightColumnSpan  = "span4";
                data.rightColumnSpan        = "span4";
                break;
            case FourColumnView.Configuration.HAMBURGER_RIGHT:
                data.leftHamburger = "";
                data.rightHamburger = "hamburger-panel-right hamburger-panel-hidden";
                data.leftColumnSpan         = "span4";
                data.centerLeftColumnSpan   = "span4";
                data.centerRightColumnSpan  = "span4";
                data.rightColumnSpan        = "span3";
                break;
            case FourColumnView.Configuration.HAMBURGER_LEFT_AND_RIGHT:
                data.leftHamburger = "hamburger-panel-left hamburger-panel-hidden";
                data.rightHamburger = "hamburger-panel-right hamburger-panel-hidden";
                data.leftColumnSpan         = "span3";
                data.centerLeftColumnSpan   = "span6";
                data.centerRightColumnSpan  = "span6";
                data.rightColumnSpan        = "span3";
                break;
            case FourColumnView.Configuration.THIN_RIGHT_HAMBURGER_LEFT_AND_RIGHT:
                data.leftHamburger = "hamburger-panel-left hamburger-panel-hidden";
                data.rightHamburger = "hamburger-panel-right hamburger-panel-hidden";
                data.leftColumnSpan         = "span3";
                data.centerLeftColumnSpan   = "span9";
                data.centerRightColumnSpan  = "span3";
                data.rightColumnSpan        = "span3";
                break;
            case FourColumnView.Configuration.EXTRA_THIN_RIGHT_HAMBURGER_LEFT_AND_RIGHT:
                data.leftHamburger = "hamburger-panel-left hamburger-panel-hidden";
                data.rightHamburger = "hamburger-panel-right hamburger-panel-hidden";
                data.leftColumnSpan         = "span3";
                data.centerLeftColumnSpan   = "span10";
                data.centerRightColumnSpan  = "span2";
                data.rightColumnSpan        = "span3";
                break;
            case FourColumnView.Configuration.ULTRA_THIN_RIGHT_HAMBURGER_LEFT_AND_RIGHT:
                data.leftHamburger = "hamburger-panel-left hamburger-panel-hidden";
                data.rightHamburger = "hamburger-panel-right hamburger-panel-hidden";
                data.leftColumnSpan         = "span2";
                data.centerLeftColumnSpan   = "span11";
                data.centerRightColumnSpan  = "span1";
                data.rightColumnSpan        = "span3";
                break;
            case FourColumnView.Configuration.ULTRA_THIN_RIGHT_HAMBURGER_LEFT:
                data.leftHamburger = "hamburger-panel-left hamburger-panel-hidden";
                data.rightHamburger = "";
                data.leftColumnSpan         = "span2";
                data.centerLeftColumnSpan   = "span11";
                data.centerRightColumnSpan  = "span3";
                data.rightColumnSpan        = "span1";
                break;
        }
        return data;
    }
});

/**
 * @enum {number}
 */
FourColumnView.Configuration = {
    DEFAULT: 1,
    HAMBURGER_LEFT: 2,
    HAMBURGER_RIGHT: 3,
    HAMBURGER_LEFT_AND_RIGHT: 4,
    THIN_RIGHT_HAMBURGER_LEFT_AND_RIGHT: 5,
    EXTRA_THIN_RIGHT_HAMBURGER_LEFT_AND_RIGHT: 6,
    ULTRA_THIN_RIGHT_HAMBURGER_LEFT_AND_RIGHT: 7,
    ULTRA_THIN_RIGHT_HAMBURGER_LEFT: 8
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.FourColumnView", FourColumnView);
