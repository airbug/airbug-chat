//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.EmailSettingsPageContainer')

//@Require('Class')
//@Require('ClearChange')
//@Require('Exception')
//@Require('RemovePropertyChange')
//@Require('SetPropertyChange')
//@Require('airbug.SettingsPageContainer')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var ClearChange                         = bugpack.require('ClearChange');
var Exception                           = bugpack.require('Exception');
var RemovePropertyChange                = bugpack.require('RemovePropertyChange');
var SetPropertyChange                   = bugpack.require('SetPropertyChange');
var SettingsPageContainer               = bugpack.require('airbug.SettingsPageContainer');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');
var AutowiredTag                 = bugpack.require('bugioc.AutowiredTag');
var PropertyTag                  = bugpack.require('bugioc.PropertyTag');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                           = AutowiredTag.autowired;
var bugmeta                             = BugMeta.context();
var property                            = PropertyTag.property;
var view                                = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {SettingsPageContainer}
 */
var EmailSettingsPageContainer = Class.extend(SettingsPageContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();

    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array.<*>} routingArgs
     */
    activateContainer: function(routingArgs) {
        this._super(routingArgs);
        this.getEmailListItemView().setAttribute("active", true);
    },

    /**
     * @protected
     */
    createContainer: function(routingArgs) {
        this._super(routingArgs);


    },

    /**
     * @protected
     */
    createContainerChildren: function(routingArgs) {
        this._super(routingArgs);

    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();

    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();

    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(EmailSettingsPageContainer).with(
    autowired().properties([

    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.EmailSettingsPageContainer", EmailSettingsPageContainer);
