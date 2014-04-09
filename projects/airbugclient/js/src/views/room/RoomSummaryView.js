//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.RoomSummaryView')

//@Require('Class')
//@Require('DateUtil')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var DateUtil            = bugpack.require('DateUtil');
var MustacheView        = bugpack.require('airbug.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomSummaryView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   
        '<div id="room-summary-{{cid}}" class="room-summary {{classes}}">' +
            '<div id="room-last-message-sent-by-{{cid}}" class="room-summary-text room-last-message-sent-by">{{lastMessageSentBy}}</div>' +
            '<div id="room-topic-{{cid}}" class="room-summary-text room-topic">{{topic}}</div>' +
            '<div id="room-last-message-preview-{{cid}}" class="room-summary-text room-last-message-preview">{{lastMessagePreview}}</div>' +
            '<div id="room-last-message-sent-at-{{cid}}" class="room-summary-text room-last-message-sent-at">{{lastMessageSentAt}}</div>' +
            '<div class="room-number-unread-messages-wrapper">' +
                '<span id="room-number-unread-messages-{{cid}}" class="room-number-unread-messages">{{numberUnreadMessages}}</span>' +
            '</div>' +
        '</div>',


    //-------------------------------------------------------------------------------
    // Convenience Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {$}
     */
    getRoomLastMessagePreviewElement: function() {
        return this.findElement("#room-last-message-preview-{{cid}}");
    },

    /**
     * @return {$}
     */
    getRoomLastMessageSentAtElement: function() {
        return this.findElement("#room-last-message-sent-at-{{cid}}");
    },

    /**
     * @return {$}
     */
    getRoomLastMessageSentByElement: function() {
        return this.findElement("#room-last-message-sent-by-{{cid}}");
    },

    /**
     * @return {$}
     */
    getRoomTopicElement: function() {
        return this.findElement("#room-topic-{{cid}}");
    },

    /**
     * @return {$}
     */
    getRoomNumberUnreadMessagesElement: function() {
        return this.findElement("#room-number-unread-messages-{{cid}}");
    },


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
            case "lastMessagePreview":
                this.getRoomLastMessagePreviewElement().text(propertyValue);
                break;
            case "lastMessageSentAt":
                this.getRoomLastMessageSentAtElement().text(DateUtil.renderSentAgo(propertyValue));
                break;
            case "lastMessageSentBy":
                this.getRoomLastMessageSentByElement().text(propertyValue);
                break;
            case "name":
                this.getRoomTopicElement().text(propertyValue);
                break;
            case "numberUnreadMessages":
                if (propertyValue > 0) {
                    this.getRoomNumberUnreadMessagesElement().text(propertyValue);
                    this.getRoomNumberUnreadMessagesElement().addClass("visible");
                    this.getRoomNumberUnreadMessagesElement().removeClass("hidden");
                } else {
                    this.getRoomLastMessageSentByElement().text("");
                    this.getRoomNumberUnreadMessagesElement().addClass("hidden");
                    this.getRoomNumberUnreadMessagesElement().removeClass("visible");
                }
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
        if (data.model.lastMessagePreview) {
            data.lastMessagePreview = data.model.lastMessagePreview;
        }
        if (data.model.lastMessageSentAt) {
            data.lastMessageSentAt = DateUtil.renderShortTime(data.model.lastMessageSentAt);
        }
        if (data.model.lastMessageSentBy) {
            data.lastMessageSentBy = data.model.lastMessageSentBy;
        }
        if (data.model.name) {
            data.topic = data.model.name;
        }
        if (data.model.numberUnreadMessages) {
            if (data.model.numberUnreadMessages > 0) {
                data.numberUnreadMessages = data.model.numberUnreadMessages;
                data.classes += "visible";
            } else {
                data.numberUnreadMessages = "";
                data.classes += "hidden";
            }
        }
        return data;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomSummaryView", RoomSummaryView);
