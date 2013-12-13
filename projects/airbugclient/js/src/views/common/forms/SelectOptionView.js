//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('SelectOptionView')

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

var SelectOptionView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template: '<option id="{{id}}" {{optionValue}}>{{optionName}}</option>"',

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data                = this._super();
        data.id                 = this.getId() || "input-" + this.getCid();
        data.optionName         = this.attributes.name;
        if (this.attributes.value) {
            data.optionValue = 'value="' + this.attributes.value + '"';
        }
        
        return data;
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.SelectOptionView", SelectOptionView);
