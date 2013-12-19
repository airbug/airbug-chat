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

    template: '<div id="{{id}}" class="box box-with-header box-with-footer">\
            <div class="box-header">\
            </div>\
            <div class="box-body">\
                <form id="file-upload-widget" class="form-horizontal" action="/imageupload" method="POST" enctype="multipart/form-data">\
                <!-- The fileinput-button span is used to style the file input field as button -->\
                    <span class="btn btn-success fileinput-button">\
                        <i class="icon-plus icon-white"></i>\
                        <span>Add</span>\
                        <!-- The file input field used as target for the file upload widget -->\
                        <input id="file-upload-widget-input" type="file" name="files[]" multiple>\
                    </span>\
                    <button type="" class="btn btn-primary">\
                        <i class="icon-upload icon-white"></i>\
                        <span>Upload</span>\
                    </button>\
                    <button type="" class="btn btn-warning">\
                        <i class="icon-ban-circle icon-white"></i>\
                        <span>Cancel</span>\
                    </button>\
                    <div class="control-group btn btn-inverse disabled">\
                        <label class="control-label" for="url">Add by URL:</label>\
                        <div class="controls">\
                        <input type="text" name="url">\
                        </div>\
                    </div>\
                    <div>\
                    </div>\
                </form>\
                <div class="box">\
                    <span>\
                        Drag and Drop\
                    </span>\
                </div>\
                <table role="presentation"><tbody class="files"></tbody></table>\
            </div>\
            <div class="box-footer">\
                <button type="" class="btn">\
                    <span>Send</span>\
                </button>\
                <button type="" class="btn">\
                    <span>Save and Send</span>\
                </button>\
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