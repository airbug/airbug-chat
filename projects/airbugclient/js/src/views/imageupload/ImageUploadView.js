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

//@Export('airbug.ImageUploadView')

//@Require('Class')
//@Require('carapace.BoxView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var BoxView     = bugpack.require('carapace.BoxView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {BoxView}
     */
    var ImageUploadView = Class.extend(BoxView, {

        _name: "airbug.ImageUploadView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div id="image-upload-{{cid}}" class="box image-upload image-upload-dropzone {{classes}}">' +
                '<div class="image-upload-border image-upload-spacing">' +
                    '<h4>Drag an image here</h4>' +
                    '<span>Or, you can...</span>' +
                    '<div id="image-upload-from-computer-{{cid}}"></div>' +
                    '<span>Or, even...</span>' +
                    '<div id="image-upload-from-url-{{cid}}"></div>' +
                    '<div id="image-upload-list-{{cid}}" class="image-upload-list">' +
                    '</div>' +
                '</div>' +
            '</div>',


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {jQuery}
         */
        getImageUploadElement: function() {
            return this.findElement("#image-upload-{{cid}}");
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ImageUploadView", ImageUploadView);
});
