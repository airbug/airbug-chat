//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ImageUploadWidgetView')

//@Require('Class')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var BoxView         = bugpack.require('airbug.BoxView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {BoxView}
     */
    var ImageUploadWidgetView = Class.extend(BoxView, {

        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            //TODO BRN: Remove this box crap and trim this down...

            '<div id="image-upload-widget-{{cid}}" class="workspace-widget box fill-box box-with-header image-upload-widget {{classes}}">' +
                '<div id="box-header-{{cid}}" class="workspace-widget-header box-header">' +
                '</div>' +
                '<div id="box-body-{{cid}}" class="workspace-widget-body box-body">' +
                    '<div id="image-upload-dropzone-{{cid}}" class="box fill-box image-upload-dropzone">' +
                        '<div class="image-upload-border image-upload-spacing">' +
                            '<h4>Drag an image here</h4>' +
                            '<span>Or, you can...</span>' +
                            '<form id="file-upload-widget-{{cid}}" class="file-upload-widget form-horizontal" enctype="multipart/form-data">' +
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
                            '<div id="image-upload-list-{{cid}}">' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>',


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {jQuery}
         */
        getFileUploadWidgetElement: function() {
            return this.findElement("#file-upload-widget-{{cid}}");
        },

        /**
         * @return {jQuery}
         */
        getImageUploadDropzoneElement: function() {
            return this.findElement("#image-upload-dropzone-{{cid}}");
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ImageUploadWidgetView", ImageUploadWidgetView);
});
