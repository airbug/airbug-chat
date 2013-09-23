//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('FourColumnView')

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

var FourColumnView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template:       '<div id={{id}} class="row column 3column-container">' +
                        '<div class="{{leftColumnSpan}}  {{leftHamburger}}  column   column1of4"></div>' +
                        '<div class="{{centerLeftColumnSpan}}               column   column2of4"></div>' +
                        '<div class="{{centerRightColumnSpan}}              column   column3of4"></div>' +
                        '<div class="{{rightColumnSpan}} {{rightHamburger}} column   column4of4"></div>' +
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
    HAMBURGER_LEFT_AND_RIGHT: 4
    THIN_RIGHT_HAMBURGER_LEFT_AND_RIGHT: 5,
    EXTRA_THIN_RIGHT_HAMBURGER_LEFT_AND_RIGHT: 6
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.FourColumnView", FourColumnView);
