//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.MessageContentImageView')

//@Require('Class')
//@Require('airbug.MustacheView')
//@Require('airbug.ImageViewEvent')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var MustacheView    = bugpack.require('airbug.MustacheView');
var ImageViewEvent  = bugpack.require('airbug.ImageViewEvent');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MessageContentImageView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    //NOTE: SUNG Temporarily using an href for the full size image until we have implemented our own full size view.

    template:
        '<div id="message-image-{{cid}}" class="message-image image-preview">' +
            '<a id="image-link-{{cid}}" href="{{model.url}}" target="_blank"> ' +
                '<img id="image-{{cid}}" src={{model.midsizeUrl}} />' +
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
     * @return {$}
     */
    getImageElement: function() {
        return this.findElement("#image-{{cid}}");
    },

    /**
     * @return {$}
     */
    getImageLinkElement: function() {
        return this.findElement("#image-link-{{cid}}");
    },

    /**
     * @return {$}
     */
    getImageSaveButtonElement: function() {
        return this.findElement(".btn-toolbar > .btn-group:last-child > button:last-child");
    },

    /**
     * @return {$}
     */
    getMessageImageElement: function() {
        return this.findElement("message-image-{{cid}}");
    },


    //-------------------------------------------------------------------------------
    // CarapaceView Methods
    //-------------------------------------------------------------------------------

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
     */
    deinitializeView: function() {
        this._super();
        this.getImageSaveButtonElement().off();
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

    /**
     * @private
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

bugpack.export("airbug.MessageContentImageView", MessageContentImageView);
