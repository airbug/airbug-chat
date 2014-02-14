//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('NakedSubmitButtonView')

//@Require('Class')
//@Require('airbug.NakedButtonView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var NakedButtonView = bugpack.require('airbug.NakedButtonView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var NakedSubmitButtonView = Class.extend(NakedButtonView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<button id="{{id}}" type="submit" class="btn summit-button {{buttonClasses}}">{{buttonName}}</button>',

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

bugpack.export("airbug.NakedSubmitButtonView", NakedSubmitButtonView);
