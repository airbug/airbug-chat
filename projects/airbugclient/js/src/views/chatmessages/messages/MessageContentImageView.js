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

    template:   '<div id="message-image-{{cid}}" class="message-image image-preview">' +
            '<a href="{{}}"> <img id="image-{{cid}}" src={{midsizeUrl}} /> </a>' +
        '</div>',

        //NOTE: SUNG Temporarily using an href for the full size image until we have implemented our own full size view.
    //-------------------------------------------------------------------------------
    // CarapaceView Extensions
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data = this._super();
        data.midsizeUrl     = data.model.midsizeUrl;
        data.thumbnailUrl   = data.model.thumbnailUrl;
        data.url            = data.model.url;
        return data;
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
                this.findElement('#image-' + this.getCid()).attr("src", propertyValue);
                break;
            case "url":
                this.findElement('#message-image-' + this.getCid() + ">a").attr("href", propertyValue);
                break;
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.MessageContentImageView", MessageContentImageView);
