//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatMessageView')

//@Require('Class')
//@Require('DateUtil')
//@Require('StringUtil')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var DateUtil        = bugpack.require('DateUtil');
var StringUtil      = bugpack.require('StringUtil');
var MustacheView    = bugpack.require('airbug.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div id="chat-message-{{cid}}" class="message-wrapper">' +
                    '<div id="message-sent-by-{{cid}}"      class="message-sent-by">{{model.sentBy}}</div>' +
                    '<div id="message-pending-{{cid}}"      class="message-pending-{{model.pending}}"><img src="/img/pending-dark-blue.gif"></div>' +
                    '<div id="message-failed-{{cid}}"       class="message-failed-{{model.failed}}"><button class="btn btn-warning btn-mini"><i class="icon-exclamation-sign"></i></button></div>' +
                    '<div id="message-created-at-{{cid}}"   class="message-created-at">{{model.createdAt}}</div>' +
                    '<div id="message-controls-{{cid}}"     class="message-controls"></div>' +
                    '<div id="message-content-{{cid}}"    class="message-content"></div>' +
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
            case "message":
                this.findElement('#message-message-' + this.cid).text(propertyValue);
                break;
            case "sentAt":
                this.findElement('#message-created-at-' + this.cid).text(this.renderSentAgo(propertyValue));
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
            data.sentAgo = this.renderSentAgo(data.model.sentAt);
        }
        return data;
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {number} timestampUTC
     * @return {string}
     */
    renderSentAgo: function(timestampUTC) {
        var nowDate = new Date();
        var nowUTC = nowDate.getTime();
        var yesterdayDate = new Date(nowUTC - (1000 * 60 * 60 * 24));
        var timestampDate = new Date(timestampUTC);
        var howLongAgo = "";

        // Did this message occur within the last minute?
        if (nowUTC < timestampUTC + (1000 * 60)) {
            howLongAgo += "a few seconds ago";
        }
        // Did this message occur within the last hour?
        else if (nowUTC < timestampUTC + (1000 * 60 * 60)) {
            var numberOfMinutesAgo = DateUtil.getNumberMinutesAgo(timestampDate, nowDate);
            howLongAgo += numberOfMinutesAgo + " minutes ago";
        }
        // Did this message occur on the same year?
        else if (nowDate.getFullYear() === timestampDate.getFullYear()) {

            // Did this message occur on the same day and month?
            if (nowDate.getDate() === timestampDate.getDate() && nowDate.getMonth() === timestampDate.getMonth()) {
                howLongAgo += DateUtil.getHour12HourClock(timestampDate) + ":" +
                    StringUtil.pad(timestampDate.getMinutes(), "0", 2) + " " + DateUtil.getAMPM(timestampDate);
            }
            // Did this message occur yesterday?
            else if (yesterdayDate.getDate() === timestampDate.getDate() && yesterdayDate.getMonth() === timestampDate.getMonth()) {
                howLongAgo += "yesterday " + DateUtil.getHour12HourClock(timestampDate) + ":" +
                    StringUtil.pad(timestampDate.getMinutes(), "0", 2) + " " + DateUtil.getAMPM(timestampDate);
            }
            else {
                howLongAgo += DateUtil.getMonthName(timestampDate) + " " + timestampDate.getDate() + ", " +
                    DateUtil.getHour12HourClock(timestampDate) + ":" + StringUtil.pad(timestampDate.getMinutes(), "0", 2) + " " +
                    DateUtil.getAMPM(timestampDate);
            }
        }
        // Fallback to a full timestamp
        else {
            howLongAgo += DateUtil.getMonthName(timestampDate) + " " + timestampDate.getDate() + ", " +
                timestampDate.getFullYear() + " " + DateUtil.getHour12HourClock(timestampDate) + ":" +
                StringUtil.pad(timestampDate.getMinutes(), "0", 2) + " " + DateUtil.getAMPM(timestampDate);
        }


        return howLongAgo;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatMessageView", ChatMessageView);