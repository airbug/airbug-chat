//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ImageUploadItemView')

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
    var MustacheView    = bugpack.require('airbug.MustacheView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var ImageUploadItemView = Class.extend(MustacheView, {

        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div id="image-upload-item-{{cid}}" class="image-upload-item file-upload-item">' +
                '<div class="filename">' +
                    '<span class="">{{model.name}}</span>' +
                '</div>' +
                '<div class="success-indicator pull-right" style="display: none">' +
                    '<i class="icon-ok"></i>' +
                '</div>' +
                '<div class="status-message">' +
                '</div>' +
                '<div class="progress progress-striped active">' +
                    '<div class="bar" style="width: 10%">' +
                    '</div>' +
                '</div>' +
            '<div>',

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data    = this._super();
            data.id     = this.getId() || "image-upload-item-" + this.getCid();
            return data;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ImageUploadItemView", ImageUploadItemView);
});
