//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.InputView')

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

var InputView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template: '<input id="{{id}}" class="{{classes}}" type="{{inputType}}" name="{{inputName}}" placeholder="{{inputPlaceholder}}">',


    //-------------------------------------------------------------------------------
    // BugView Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @return {Object}
     */
    generateTemplateData: function() {
        var data                = this._super();
        data.id                 = this.getId() || "input-" + this.getCid();
        data.inputType          = this.attributes.type || "text";
        data.inputName          = this.attributes.name;
        data.inputPlaceholder   = this.attributes.placeholder;

        switch (this.attributes.size) {
            case InputView.Size.XXLARGE:
                data.classes += " input-xxlarge";
                break;
            case InputView.Size.XLARGE:
                data.classes += " input-xlarge";
                break;
            case InputView.Size.LARGE:
                data.classes += " input-large";
                break;
            case InputView.Size.SMALL:
                data.classes += " input-small";
                break;
            case InputView.Size.MINI:
                data.classes += " input-mini";
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
InputView.Size = {
    XXLARGE: 1,
    XLARGE: 2,
    LARGE: 3,
    NORMAL: 4,
    SMALL: 5,
    MINI: 6
};

/**
 * @static
 * @enum {string}
 */
InputView.Type = {
    CHECKBOX: "checkbox",
    TEXT: "text"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.InputView", InputView);
