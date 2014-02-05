//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('UserStatusIndicatorView')

//@Require('Class')
//@Require('airbug.MustacheView')
//@Require('airbug.UserDefines')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var MustacheView    = bugpack.require('airbug.MustacheView');
var UserDefines     = bugpack.require('airbug.UserDefines');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserStatusIndicatorView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<span id="user-status-indicator-{{cid}}" class="user-status-indicator {{classes}}"></span>',


    //-------------------------------------------------------------------------------
    // CarapaceView Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} propertyName
     * @param {*} propertyValue
     */
    renderModelProperty: function(propertyName, propertyValue) {
        this._super(propertyName, propertyValue);
        switch (propertyName) {
            case "status":
                this.renderStatus(propertyValue);
                break;
        }
    },


    //-------------------------------------------------------------------------------
    // MustacheView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @return {Object}
     */
    generateTemplateData: function() {
        var data = this._super();
        data.classes += this.generateStatusClass(this.getModel().getProperty("status"));
        return data;
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} status
     * @return {string}
     */
    generateStatusClass: function(status) {
        switch (status) {
            case UserDefines.Status.ACTIVE:
            case UserDefines.Status.HEADSDOWN:
            case UserDefines.Status.OFFLINE:
                return "user-status-indicator-" + status;
        }
        return "";
    },

    /**
     * @private
     * @param {string} status
     */
    renderStatus: function(status) {
        var removeClasses = [
            this.generateStatusClass(UserDefines.Status.ACTIVE),
            this.generateStatusClass(UserDefines.Status.HEADSDOWN),
            this.generateStatusClass(UserDefines.Status.OFFLINE)
        ];
        this.findElement('#user-status-indicator-' + this.getCid())
            .removeClass(removeClasses.join(" "))
            .addClass(this.generateStatusClass(status));
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.UserStatusIndicatorView", UserStatusIndicatorView);
