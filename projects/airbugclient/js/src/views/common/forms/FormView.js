//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('FormView')

//@Require('Class')
//@Require('airbug.FormViewEvent')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var FormViewEvent   = bugpack.require('airbug.FormViewEvent');
var MustacheView    = bugpack.require('airbug.MustacheView');

//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var FormView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:
        '<div class="form-wrapper">' +
            '<form class="{{classes}}">' +
            '</form>' +
        '</div>',
    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data    = this._super();
        data.id     = this.getId() || "input-" + this.getCid();
        data.inputClasses = this.attributes.classes || "";
        return data;
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbug.FormView', FormView);
