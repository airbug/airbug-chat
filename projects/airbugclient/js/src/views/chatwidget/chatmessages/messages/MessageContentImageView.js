//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('MessageContentImageView')

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

var MessageContentImageView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    //NOTE: SUNG Temporarily using an href for the full size image until we have implemented our own full size view.

    template:
        '<div id="message-content-{{cid}}" class="message-image image-preview">' +
            '<a id="image-link-{{cid}}" href="{{model.url}}"  target="_blank"> ' +
                '<img id="image-{{cid}}" src={{model.midsizeUrl}} />' +
            '</a>' +
        '</div>',


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

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
    getMessageContentElement: function() {
        return this.findElement("#message-content-{{cid}}");
    },


    //-------------------------------------------------------------------------------
    // CarapaceView Methods
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
            case "url":
                this.getImageLinkElement().attr("href", propertyValue);
                break;
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.MessageContentImageView", MessageContentImageView);
