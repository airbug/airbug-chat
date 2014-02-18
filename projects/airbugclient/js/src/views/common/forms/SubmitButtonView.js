//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('SubmitButtonView')

//@Require('Class')
//@Require('airbug.ButtonView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var MustacheView    = bugpack.require('airbug.ButtonView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SubmitButtonView = Class.extend(ButtonView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:
        '<div id="{{id}}-wrapper"class="button-wrapper {{classes}}">' +
            '<button id="{{id}}" type="submit" class="btn summit-button {{buttonClasses}}">{{buttonName}}</button>' +
        '</div>',

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var id              = this.getId() || "submit-button-" + this.getCid();
        var data            = this._super();
        data.id             = id;
        data.buttonName     = this.attributes.buttonName;
        return data;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.SubmitButtonView", SubmitButtonView);
