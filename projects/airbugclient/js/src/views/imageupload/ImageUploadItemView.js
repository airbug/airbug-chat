/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ImageUploadItemView')

//@Require('Class')
//@Require('carapace.MustacheView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var MustacheView    = bugpack.require('carapace.MustacheView');


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
