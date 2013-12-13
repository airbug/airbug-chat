//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('SelectView')

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

var SelectView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template: '<select id="{{id}}" class="{{inputClasses}}" name="{{inputName}}" {{multiple}}></select>"',

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data                = this._super();
        data.id                 = this.getId() || "input-" + this.getCid();
        data.inputClasses       = this.attributes.classes || "";
        data.inputName          = this.attributes.name;

        if (this.attributes.multiple === "multiple") {
            data.multiple = 'multiple="multiple"';
        }

        switch (this.attributes.size) {
            case SelectView.Size.XXLARGE:
                data.inputClasses += " input-xxlarge";
                break;
            case SelectView.Size.XLARGE:
                data.inputClasses += " input-xlarge";
                break;
            case SelectView.Size.LARGE:
                data.inputClasses += " input-large";
                break;
            case SelectView.Size.SMALL:
                data.inputClasses += " input-small";
                break;
            case SelectView.Size.MINI:
                data.inputClasses += " input-mini";
                break;
        }

        return data;
    }
});

SelectView.Size = {
    XXLARGE: 1,
    XLARGE: 2,
    LARGE: 3,
    NORMAL: 4,
    SMALL: 5,
    MINI: 6
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.SelectView", SelectView);
