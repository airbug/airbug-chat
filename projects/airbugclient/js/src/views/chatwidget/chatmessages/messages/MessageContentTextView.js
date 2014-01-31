//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('MessageContentTextView')

//@Require('Class')
//@Require('HtmlUtil')
//@Require('IdGenerator')
//@Require('airbug.MustacheView')
//@Require('jquery.JQuery')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var HtmlUtil                = bugpack.require('HtmlUtil');
var IdGenerator             = bugpack.require('IdGenerator');
var MustacheView            = bugpack.require('airbug.MustacheView');
var JQuery                  = bugpack.require('jquery.JQuery');


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
            } else if (url.getHost() === "gist.github.com" && !!url.getPath().match(/\/\w.*\/[0-9].*/)) {

                var iframeId = "gistFrame-" + IdGenerator.generateId();

                // HOLY HACKS BATMAN!
                setTimeout(function() {
                    var gistFrame = JQuery("#" + iframeId)[0];
                    var gistFrameHTML = '<html>' +
                            '<body>' +
                                '<script type="text/javascript" src="' + match + '.js"></script>' +
                                '<script>' +
                                    'var newHeight = document.body.scrollHeight;' +
                                    'var i = parent.document.getElementById("' + iframeId + '");' +
                                    'i.style.height = parseInt(newHeight) + "px";' +
                                '</script>' +
                            '</body>' +
                        '</html>';
                    var gistFrameDoc = gistFrame.document;

                    if (gistFrame.contentDocument) {
                        gistFrameDoc = gistFrame.contentDocument;
                    } else if (gistFrame.contentWindow) {
                        gistFrameDoc = gistFrame.contentWindow.document;
                    }

                    gistFrameDoc.open();
                    gistFrameDoc.writeln(gistFrameHTML);
                    gistFrameDoc.close();
                }, 0);

                return '<br/><iframe id="' + iframeId + '" class="gist-embed" width="100%"></iframe><br/>';
                //return '<br/><iframe src="' + match + '.pibb?scroll=true"></iframe><br/>';
            }
            return '<a href="' + url.toString() + '">' + match + '</a>';
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.MessageContentTextView", MessageContentTextView);
