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

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var MustacheView    = bugpack.require('airbug.MustacheView');
var ViewBuilder     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view        = ViewBuilder.view;

//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var NotificationView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div id="notification-container" class="notification-container {{attributes.classes}}">' +
                '</div>',

    /**
     * @param (string) message
     */
    flashError: function(message){
        console.log("NotificationView#flashError");
        this.flash(
            '<div id="notification-message" class="notification-message error-notification">' +
            message +
            '</div>');
    },

    /**
     * @param (string) html
     */
    flash: function(html){
        console.log("NotificationView#flash");
        var _this = this;
        var notificationContainer = $(this.$el[0]);
        notificationContainer.append(html).show();
        setTimeout(function(){
            notificationContainer.fadeOut(500, function(){
                notificationContainer.children("div").remove();
            });
        }, 3000);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.NotificationView", NotificationView);
