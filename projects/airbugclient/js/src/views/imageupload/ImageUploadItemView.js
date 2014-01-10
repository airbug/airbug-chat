//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ImageUploadItemView')

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

var ImageUploadItemView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:       '<div id="{{id}}" class="image-upload-item file-upload-item">\
            <div class="preview">\
            </div>\
            <div class="filename">\
                <span class="">{{filename}}</span>\
            </div>\
            <div class="success-indicator pull-right" style="display: none">\
                <i class="icon-ok"></i>\
            </div>\
            <div class="cancel-button pull-right">\
                <button class="btn btn-warning"><i class="icon-ban-circle icon-white"></i></button>\
            </div>\
            <div class="progress progress-striped active">\
                <div class="bar" style="width: 10%">\
                </div>\
            </div>\
    <div>',

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data    = this._super();
        data.id     = this.getId() || "image-upload-item-" + this.getCid();
        data.filename = this.attributes.filename;
        return data;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ImageUploadItemView", ImageUploadItemView);
