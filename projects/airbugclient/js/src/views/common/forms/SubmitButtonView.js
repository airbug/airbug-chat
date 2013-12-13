//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('SubmitButtonView')

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

var SubmitButtonView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="control-group">' +
        '<button id="submit-button-{{cid}}" type="submit" class="btn summit-button {{classes}}">{{name}}</button>' +
        '</div>',

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data        = this._super();
        data.id         = this.getId() || "submit-button-" + this.getCid();
        data.name       = this.attributes.name;
        data.classes    = this.attributes.classes;
        return data;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.SubmitButtonView", SubmitButtonView);
