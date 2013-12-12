//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('InputView')

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

var BoxView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template: '<input id="{{id}}" class="{{inputClasses}}" type="{{inputType}}" name="{{inputName}}" placeholder="{{inputPlaceholder}}">',

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data    = this._super();
        data.id     = this.getId() || "input-" + this.getCid();
        data.inputClasses = this.attribute.classes || "";
        data.inputType = "";
        data.inputName = this.attributes.name;
        data.inputPlaceholder = this.attributes.placeholder;

        switch (this.attributes.size) {
            case InputView.Size.XXLARGE:
                data.inputClasses += " input-xxlarge";
                break;
            case InputView.Size.XLARGE:
                data.inputClasses += " input-xlarge";
                break;
            case InputView.Size.LARGE:
                data.inputClasses += " input-large";
                break;
            case InputView.Size.SMALL:
                data.inputClasses += " input-small";
                break;
            case InputView.Size.MINI:
                data.inputClasses += " input-mini";
                break;
        }
        switch (this.attributes.type) {
            case InputView.Type.TEXT:
                data.inputType += "text";
                break;
        }

        return data;
    }
});

InputView.Size = {
    XXLARGE: 1,
    XLARGE: 2,
    LARGE: 3,
    NORMAL: 4,
    SMALL: 5,
    MINI: 6
};

InputView.Type = {
    TEXT: "text"
};
//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.InputView", InputView);
