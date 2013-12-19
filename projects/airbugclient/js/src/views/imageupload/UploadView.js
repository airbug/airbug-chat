//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('UploadView')

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

var UploadView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:       '<tr class="template-upload fade">\
        <td>\
            <span class="preview"></span>\
        </td>\
        <td>\
            <p class="name">{{fileName}}</p>\
            <strong class="error"></strong>\
        </td>\
        <td>\
            <p class="size">Processing...</p>\
            <div class="progress"></div>\
        </td>\
        <td>\
            <button class="start">Start</button>\
            <button class="cancel">Cancel</button>\
        </td>\
    </tr>',

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data    = this._super();
        data.id     = this.getId() || "upload-" + this.getCid();
        return data;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.UploadView", UploadView);
