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

//@Export('airbug.MessagePartTextView')

//@Require('Class')
//@Require('HtmlUtil')
//@Require('IdGenerator')
//@Require('airbug.MessagePartView')
//@Require('jquery.JQuery')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var HtmlUtil            = bugpack.require('HtmlUtil');
    var IdGenerator         = bugpack.require('IdGenerator');
    var MessagePartView     = bugpack.require('airbug.MessagePartView');
    var JQuery              = bugpack.require('jquery.JQuery');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MessagePartView}
     */
    var MessagePartTextView = Class.extend(MessagePartView, {

        _name: "airbug.MessagePartTextView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div id="message-part-{{cid}}" class="message-part">' +
                '<p id="message-text-{{cid}}" class="message-text">{{{text}}}</p>' +
            '</div>',


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {jQuery}
         */
        getMessageText: function() {
            return this.findElement("#message-text-{{cid}}");
        },


        //-------------------------------------------------------------------------------
        // MustacheView Methods
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
                case "body":
                    this.getMessageText().html(this.renderText(propertyValue));
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
                    return '<br/><iframe id="ytplayer" type="text/html" width="100%" height="360" style="max-width: 640px" src="https://www.youtube.com/embed/' +
                        v + '" frameborder="0" allowfullscreen></iframe><br/>';
                } else if (url.getHost() === "gist.github.com" && !!url.getPath().match(/\/\w*\/[0-9]*/)) {

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
                } else if (url.getHost() === "open.spotify.com" && !!url.getPath().match(/\/track\/\w*/)) {
                    var trackId = url.getPath().match(/\/track\/(\w*)/)[1];
                    return '<br/><iframe src="https://embed.spotify.com/?uri=spotify:track:' + trackId + '" width="300" height="380" frameborder="0" allowtransparency="true"></iframe><br/>';
                } else if (url.getHost() === "open.spotify.com" && !!url.getPath().match(/\/user\/\w*\/playlist\/\w*/)) {
                    var matches = url.getPath().match(/\/user\/(\w*)\/playlist\/(\w*)/);
                    var userId = matches[1];
                    var playlistId = matches[2];
                    return '<br/><iframe src="https://embed.spotify.com/?uri=spotify:user:' + userId + ':playlist:' + playlistId + '" width="300" height="380" frameborder="0" allowtransparency="true"></iframe><br/>';
                }
                return '<a href="' + url.toString() + '" target="_blank">' + match + '</a>';
            });
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.MessagePartTextView", MessagePartTextView);
});
