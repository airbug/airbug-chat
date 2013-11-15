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
     */
    flashError: function(message) {
        console.log("NotificationView#flashError");
        this.flash(
            '<div id="notification-message" class="notification-message error-notification">' +
            message +
            '</div>');
    },

    /**
     * @param {string} html
     */
    flash: function(html) {
        console.log("NotificationView#flash");
        var _this = this;
        var notificationContainer = $(this.$el[0]);
        notificationContainer.prepend(html).show();
        setTimeout(function() {
            notificationContainer.fadeOut(500, function() {
                notificationContainer.children("div").remove();
            });
        }, 3000);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.NotificationView", NotificationView);
