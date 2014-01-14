//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ImageUploadView')

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

var ImageUploadView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template: '<div id="{{id}}" class="box box-with-header">\
            <div class="box-header">\
            </div>\
            <div class="box-body">\
                <form id="file-upload-widget" class="form-horizontal" enctype="multipart/form-data">\
                    <div class="btn-toolbar">\
                        <div class="btn-group">\
                            <button class="btn btn-success fileinput-button">\
                                <i class="icon-plus icon-white"></i>\
                                <span>Add</span>\
                                <input id="file-upload-widget-input" type="file" name="files[]">\
                            </button>\
                        </div>\
                        <div class="btn-group">\
                            <button type="" class="btn btn-primary disabled">\
                                <i class="icon-upload icon-white"></i>\
                                <span>Upload</span>\
                            </button>\
                        </div>\
                        <div class="btn-group">\
                            <button type="" class="btn btn-warning">\
                                <i class="icon-ban-circle icon-white"></i>\
                                <span>Cancel</span>\
                            </button>\
                        </div>\
                    </div>\
                </form>\
                <div class="box image-upload-dropzone">\
                    <span>\
                        Drag and Drop\
                    </span>\
                </div>\
            </div>\
        </div>',

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data    = this._super();
        data.id     = this.getId() || "image-upload-" + this.cid;
        return data;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ImageUploadView", ImageUploadView);