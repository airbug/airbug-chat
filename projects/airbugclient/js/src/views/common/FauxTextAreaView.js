//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.FauxTextAreaView')

//@Require('Class')
//@Require('TypeUtil')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var TypeUtil        = bugpack.require('TypeUtil');
var MustacheView    = bugpack.require('airbug.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var FauxTextAreaView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<textarea id="{{id}}" class="{{classes}}" rows="{{rows}}" cols="{{columns}}" readonly="readonly">{{value}}</textarea>',


    //-------------------------------------------------------------------------------
    // MustacheView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data = this._super();
        data.id = this.getId() || "faux-textarea-" + this.getCid();
        if (!TypeUtil.isNumber(data.attributes.rows)) {
            data.attributes.rows = 2;
        }
        data.columns    = this.attributes.columns;
        data.rows       = this.attributes.rows;
        data.value      = this.attributes.value;
        data.classes    = this.attributes.classes ? "faux-textarea" + this.attributes.classes : "faux-textarea";
        return data;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.FauxTextAreaView", FauxTextAreaView);
