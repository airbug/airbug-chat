//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ChatMessageView')

//@Require('Class')
//@Require('DateUtil')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var DateUtil                = bugpack.require('DateUtil');
var MustacheView            = bugpack.require('airbug.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div id="chat-message-{{cid}}" class="message-wrapper">' +
                    '<div id="message-header-{{cid}}" class="message-header">' +
                        '<div id="message-header-left-{{cid}}"    class="subheader-left">' +
                            '<div id="message-sent-by-{{cid}}"    class="message-sent-by">{{model.sentBy}}</div>' +
                        '</div>' +
                        '<div id="message-header-center-{{cid}}"  class="subheader-center">' +
                        '</div>' +
                        '<div id="message-header-right-{{cid}}"   class="subheader-right">' +
                            '<div id="message-created-at-{{cid}}" class="message-created-at">{{sentAgo}}</div>' +
                        '</div>' +
                    '</div>' +
                    '<div id="message-controls-{{cid}}" class="message-controls"></div>' +
                    '<div id="message-body-{{cid}}"     class="message-body"></div>' +
                    '<div id="message-footer-{{cid}} "  class="message-footer">' +
                        '<div class="subheader-left">' +
                        '</div>' +
                        '<div class="subheader-center">' +
                        '</div>' +
                        '<div class="subheader-right">' +
                            '<div id="message-pending-{{cid}}" class="{{messagePendingClass}}"><img src="{{{staticUrl}}}/img/pending-dark-blue.gif"></div>' +
                            '<div id="message-failed-{{cid}}"  class="{{messageFailedClass}}"><button class="btn btn-danger btn-mini"><i class="icon-exclamation-sign"></i></button></div>' +
                        '</div>' +
                    '</div>' +
                '</div>',

    //-------------------------------------------------------------------------------
    // CarapaceView Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} propertyName
     * @param {*} propertyValue
     */
    renderModelProperty: function(propertyName, propertyValue) {
        this._super(propertyName, propertyValue);
        switch (propertyName) {
            case "sentAt":
                this.findElement('#message-created-at-' + this.cid).text(DateUtil.renderSentAgo(propertyValue));
                break;
            case "sentBy":
                this.findElement('#message-sent-by-' + this.cid).text(propertyValue);
                break;
            case "pending":
                this.findElement('#message-pending-' + this.cid).removeClass("message-pending-false, message-pending-true").addClass("message-pending-" + propertyValue);
                break;
            case "failed":
                this.findElement('#message-failed-'  + this.cid).removeClass("message-failed-false, message-failed-true").addClass("message-failed-" + propertyValue);
                break;
        }
    },


    //-------------------------------------------------------------------------------
    // MustacheView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data = this._super();

        //TODO BRN: This is a good unit test candidate.

        if (data.model.sentAt) {
            data.sentAgo = DateUtil.renderSentAgo(data.model.sentAt);
        }
        if (data.model.pending) {
            data.messagePendingClass = "message-pending-true";
        } else {
            data.messagePendingClass = "message-pending-false";
        }
        if (data.model.failed) {
            data.messageFailedClass = "message-failed-true";
        } else {
            data.messageFailedClass = "message-failed-false";
        }
        return data;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatMessageView", ChatMessageView);
