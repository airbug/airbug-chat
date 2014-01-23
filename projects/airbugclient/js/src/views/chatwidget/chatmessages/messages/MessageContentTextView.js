//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('MessageContentTextView')

//@Require('Class')
//@Require('HtmlUtil')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var HtmlUtil        = bugpack.require('HtmlUtil');
var MustacheView    = bugpack.require('airbug.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MessageContentTextView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template: '<div id="message-text-{{cid}}" class="message-text">{{{text}}}</div>',


    //-------------------------------------------------------------------------------
    // MustacheView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data = this._super();
        data.text = this.renderText(data.model.text);
        return data;
    },


    //-------------------------------------------------------------------------------
    // CarapaceView Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} propertyName
     * @param {string} propertyValue
     */
    renderModelProperty: function(propertyName, propertyValue) {
        this._super(propertyName, propertyValue);
        switch (propertyName) {
            case "body":
                this.findElement('#message-text-' + this.getCid()).html(this.renderText(propertyValue));
                break;
        }
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} text
     * @returns {string}
     */
    renderText: function(text) {
        var html = HtmlUtil.stringToHtml(text);
        html = this.replaceUrls(html);
        return html;

        /*http://www.youtube.com/watch?v=9LUv3kbmNfg

        <iframe id="ytplayer" type="text/html" width="640" height="360"
        src="https://www.youtube.com/embed/M7lc1UVf-VE"
        frameborder="0" allowfullscreen>*/
    },

    /**
     * @private
     * @param {string} value
     * @return {string}
     */
    replaceUrls: function(value) {
        return HtmlUtil.replaceUrls(value, function(match, url) {
            if (url.getHost() === "www.youtube.com" && url.getPath() === "/watch" && url.hasUrlQuery("v")) {
                var v = url.getUrlQuery("v");
                return '<br/><iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/' +
                    v + '" frameborder="0" allowfullscreen></iframe><br/>';
            }
            return '<a href="' + url.toString() + '">' + match + '</a>';
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.MessageContentTextView", MessageContentTextView);
