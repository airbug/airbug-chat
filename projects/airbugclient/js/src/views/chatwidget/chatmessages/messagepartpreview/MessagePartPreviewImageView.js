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

//@Export('airbug.MessagePartPreviewImageView')

//@Require('Class')
//@Require('airbug.MessagePartPreviewView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var MessagePartPreviewView  = bugpack.require('airbug.MessagePartPreviewView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MessagePartPreviewView}
     */
    var MessagePartPreviewImageView = Class.extend(MessagePartPreviewView, {

        _name: "airbug.MessagePartPreviewImageView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div id="message-part-preview-{{cid}}" class="message-part-preview message-part-preview-image">' +
                '<img id="image-{{cid}}" src="{{model.midsizeUrl}}" />' +
            '</div>',


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {jQuery}
         */
        getImageElement: function() {
            return this.findElement("#image-{{cid}}");
        },

        /**
         * @return {jQuery}
         */
        getMessagePartPreviewElement: function() {
            return this.findElement("message-part-preview-{{cid}}");
        },


        //-------------------------------------------------------------------------------
        // BugView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {string} propertyName
         * @param {string} propertyValue
         */
        renderModelProperty: function(propertyName, propertyValue) {
            this._super(propertyName, propertyValue);
            switch (propertyName) {
                case "midsizeUrl":
                    this.getImageElement().attr("src", propertyValue);
                    break;
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.MessagePartPreviewImageView", MessagePartPreviewImageView);
});
