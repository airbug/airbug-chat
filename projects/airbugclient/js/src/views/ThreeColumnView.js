//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ThreeColumnView')

//@Require('Class')
//@Require('airbug.MultiColumnView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var MultiColumnView     = bugpack.require('airbug.MultiColumnView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ThreeColumnView = Class.extend(MultiColumnView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template:       '<div id={{id}} class="{{rowStyle}} column 3column-container">' +
                        '<div class="{{leftColumnSpan}}  {{leftHamburger}}  column   column1of3"></div>' +
                        '<div class="{{centerColumnSpan}}                   column   column2of3"></div>' +
                        '<div class="{{rightColumnSpan}} {{rightHamburger}} column   column3of3"></div>' +
                    '</div>',


    //-------------------------------------------------------------------------------
    // MustacheView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data    = this._super();
        data.id     = this.getId() || "three-column-row-container-" + this.cid;
        data.leftColumnSpan = "span4";
        data.centerColumnSpan = "span4";
        data.rightColumnSpan = "span4";
        switch (this.attributes.configuration) {
            case TwoColumnView.Configuration.HAMBURGER_LEFT:
                data.leftHamburger = "hamburger-panel-left hamburger-panel-hidden";
                data.leftColumnSpan = "span3";
                data.centerColumnSpan = "span6";
                data.rightColumnSpan = "span6";
                break;
            case TwoColumnView.Configuration.HAMBURGER_RIGHT:
                data.leftHamburger = "";
                data.rightHamburger = "hamburger-panel-right hamburger-panel-hidden";
                data.leftColumnSpan = "span6";
                data.centerColumnSpan = "span6";
                data.rightColumnSpan = "span3";
                break;
            case TwoColumnView.Configuration.HAMBURGER_LEFT_AND_RIGHT:
                data.leftHamburger = "hamburger-panel-left hamburger-panel-hidden";
                data.rightHamburger = "hamburger-panel-right hamburger-panel-hidden";
                data.leftColumnSpan = "span3";
                data.centerColumnSpan = "span12";
                data.rightColumnSpan = "span3";
                break;
            case TwoColumnView.Configuration.CHAT_WIDGET_INPUT_CONTAINER:
                data.leftColumnSpan = "span9";
                data.centerColumnSpan = "span1";
                data.rightColumnSpan = "span2";
                break;
        }
        return data;
    }
});

/**
 * @enum {number}
 */
ThreeColumnView.Configuration = {
    DEFAULT: 1,
    HAMBURGER_LEFT: 2,
    HAMBURGER_RIGHT: 3,
    HAMBURGER_LEFT_AND_RIGHT: 4,
    CHAT_WIDGET_INPUT_CONTAINER: 5
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ThreeColumnView", ThreeColumnView);
