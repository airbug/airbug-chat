//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ImageUploadWidgetView')

//@Require('Class')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var MustacheView    = bugpack.require('airbug.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ImageUploadWidgetView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:
        '<div id="image-upload-widget-{{cid}}" class="workspace-widget box-with-header image-upload-widget">' +
            '<div id="box-header-{{cid}}" class="workspace-widget-header box-header">' +
            '</div>' +
            '<div id="box-body-{{cid}}" class="workspace-widget-body box-body">' +
                '<div id="image-upload-dropzone-{{cid}}" class="box image-upload-dropzone">' +
                    '<div class="image-upload-border">' +
                        '<h4>Drag an image here</h4>' +
                        '<span>Or, you can...</span>' +
                        '<form id="file-upload-widget" class="form-horizontal" enctype="multipart/form-data">' +
                            '<div class="btn-toolbar">' +
                                '<div class="btn-group">' +
                                    '<button class="btn btn-success fileinput-button">' +
                                        '<i class="icon-plus icon-white"></i>' +
                                        '<span>Choose an image to upload</span>' +
                                        '<input id="file-upload-widget-input" type="file" name="files[]">' +
                                    '</button>' +
                                '</div>' +
                            '</div>' +
                        '</form>' +
                        '<span>Or, even upload an image with a url...</span>' +
                        '<div id="image-upload-from-url-{{cid}}"></div>' +
                        '<div id="image-upload-list-{{cid}}" class="box">' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>',


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {$}
     */
    getImageUploadDropzoneElement: function() {
        return this.findElement("#image-upload-dropzone-{{cid}}");
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ImageUploadWidgetView", ImageUploadWidgetView);