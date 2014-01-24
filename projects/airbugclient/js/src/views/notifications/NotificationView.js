//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('NotificationView')

//@Require('Class')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var MustacheView    = bugpack.require('airbug.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var NotificationView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div id="{{id}}" class="notification-container {{attributes.classes}}">' +
                '</div>',

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data    = this._super();
        data.id     = this.getId() || "notification-container";
        return data;
    },

    /**
     * @param {string} message
     * @param {number=} delay
     */
    flashErrorMessage: function(message, delay) {
        this.flash(
            '<div id="notification-message" class="notification-message error-notification alert alert-error">' +
                message +
            '</div>', delay);
    },

    /**
     * @param {string} message
     * @param {number=} delay
     */
    flashExceptionMessage: function(message, delay) {
        this.flash(
            '<div id="notification-message" class="notification-message error-notification alert alert-error">' +
                message +
            '</div>', delay);
    },

    /**
     * @param {string} message
     * @param {number=} delay
     */
    flashSuccessMessage: function(message, delay) {
        this.flash(
            '<div id="notification-message" class="notification-message alert alert-success">' +
                message +
            '</div>', delay);
    },

    /**
     * @param {string} message
     * @param {number=} delay
     */
    flashMessage: function(message, delay) {
        this.flash(
            '<div id="notification-message" class="notification-message alert alert-info">' +
                message +
                '</div>', delay);
    },

    /**
     * @private
     * @param {string} html
     * @param {number=} delay
     */
    flash: function(html, delay) {
        var delay = delay || 5000;
        var notificationContainer = $(this.$el[0]);
        notificationContainer.prepend(html).show();
        setTimeout(function() {
            notificationContainer.fadeOut(500, function() {
                notificationContainer.children("div").remove();
            });
        }, delay);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.NotificationView", NotificationView);
