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

//@Export('airbug.MessagePartImageView')

//@Require('Class')
//@Require('airbug.ImageViewEvent')
//@Require('airbug.MessagePartView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var ImageViewEvent      = bugpack.require('airbug.ImageViewEvent');
    var MessagePartView     = bugpack.require('airbug.MessagePartView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MessagePartView}
     */
    var MessagePartImageView = Class.extend(MessagePartView, {

        _name: "airbug.MessagePartImageView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        //NOTE: SUNG Temporarily using an href for the full size image until we have implemented our own full size view.

        template:
            '<div id="message-part-{{cid}}" class="message-image image-preview">' +
                '<a id="image-link-{{cid}}" href="{{model.url}}" target="_blank"> ' +
                    '<img id="image-{{cid}}" src="{{model.midsizeUrl}}" />' +
                '</a>' +
                '<div class="btn-toolbar">' +
                    '<div class="btn-group">' +
                        '<button class="btn btn-link"><span>Save to Image List</span></button>' +
                    '</div>' +
                '</div>' +
            '</div>',


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getImageAssetId: function() {
            return this.model.getProperty("assetId");
        },

        /**
         * @return {jQuery}
         */
        getImageElement: function() {
            return this.findElement("#image-{{cid}}");
        },

        /**
         * @return {jQuery}
         */
        getImageLinkElement: function() {
            return this.findElement("#image-link-{{cid}}");
        },

        /**
         * @return {jQuery}
         */
        getImageSaveButtonElement: function() {
            return this.findElement(".btn-toolbar > .btn-group:last-child > button:last-child");
        },

        /**
         * @return {jQuery}
         */
        getMessagePartElement: function() {
            return this.findElement("message-part-{{cid}}");
        },


        //-------------------------------------------------------------------------------
        // BugView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        deinitializeView: function() {
            this._super();
            this.getImageSaveButtonElement().off();
        },

        /**
         * @protected
         */
        initializeView: function() {
            var _this = this;
            this._super();
            this.getImageSaveButtonElement().on("click", function(event){
                _this.handleSaveButtonClick(event);
            });
        },

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
                case "url":
                    this.getImageLinkElement().attr("href", propertyValue);
                    break;
            }
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Event} event
         */
        handleSaveButtonClick: function(event) {
            event.preventDefault();
            event.stopPropagation();
            this.dispatchEvent(new ImageViewEvent(ImageViewEvent.EventType.CLICKED_SAVE, {assetId: this.getImageAssetId()}));
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.MessagePartImageView", MessagePartImageView);
});
