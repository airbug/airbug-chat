//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('MessageView')

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

var MessageView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="message-wrapper">' +
                    '<div id="message-sent-by-{{cid}}" class="message-sent-by">{{model.sentBy}}</div>' +
                    '<div id="message-sent-at-{{cid}}" class="message-sent-at">{{model.sentAt}}</div>' +
                    '<div id="message-message-{{cid}}" class="message-body">{{model.body}}</div>' +
                '</div>',


    //-------------------------------------------------------------------------------
    // CarapaceView Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} attributeName
     * @param {string} attributeValue
     */
    renderModelAttribute: function(attributeName, attributeValue) {
        this._super(attributeName, attributeValue);
        switch(attributeName) {
            case "message":
                this.findElement('#message-message-' + this.cid).text(attributeValue);
                break;
            case "sentAtUtc":
                this.findElement('#message-sent-at-' + this.cid).text(this.renderSentAgo(attributeValue));
                break;
            case "sentBy":
                this.findElement('#message-sent-by-' + this.cid).text(attributeValue);
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

        if (data.model.sentAtUtc) {
            data.sentAgo = this.renderSentAgo(data.model.sentAtUtc);
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

bugpack.export("airbug.MessageView", MessageView);
