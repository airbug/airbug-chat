//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('TextInputView')

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

var TextInputView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<input id="{{id}}" type="text" placeholder="{{attributes.placeholder}}">',

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data    = this._super();
        data.id     = this.getId() || "text-input-" + this.cid;
        return data;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.TextInputView", TextInputView);