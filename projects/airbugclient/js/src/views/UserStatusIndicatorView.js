//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('UserStatusIndicatorView')

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


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserStatusIndicatorView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<span id="user-status-indicator-{{cid}}" class="user-status-indicator user-status-indicator-{{model.status}}"></span>',


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
            case "status":
                this.findElement('#user-status-indicator-' + this.getCid()).addClass("user-status-indicator user-status-indicator-" + propertyValue);
                break;
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.UserStatusIndicatorView", UserStatusIndicatorView);
