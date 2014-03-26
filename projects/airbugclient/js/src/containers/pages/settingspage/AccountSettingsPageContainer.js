//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AccountSettingsPageContainer')

//@Require('Class')
//@Require('ClearChange')
//@Require('Exception')
//@Require('RemovePropertyChange')
//@Require('SetPropertyChange')
//@Require('airbug.ChangePasswordFormContainer')
//@Require('airbug.PanelWithHeaderView')
//@Require('airbug.SettingsPageContainer')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
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
var ChangePasswordFormContainer         = bugpack.require('airbug.ChangePasswordFormContainer');
var PanelWithHeaderView                 = bugpack.require('airbug.PanelWithHeaderView');
var SettingsPageContainer               = bugpack.require('airbug.SettingsPageContainer');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation                 = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation                  = bugpack.require('bugioc.PropertyAnnotation');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                           = AutowiredAnnotation.autowired;
var bugmeta                             = BugMeta.context();
var property                            = PropertyAnnotation.property;
var view                                = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {SettingsPageContainer}
 */
var AccountSettingsPageContainer = Class.extend(SettingsPageContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChangePasswordFormContainer}
         */
        this.changePasswordFormContainer   = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {PanelWithHeaderView}
         */
        this.panelWithHeaderView            = null;
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
        this.getAccountListItemView().setAttribute("active", true);
    },

    /**
     * @protected
     */
    createContainer: function(routingArgs) {
        this._super(routingArgs);

        // Create Views
        //-------------------------------------------------------------------------------

        view(PanelWithHeaderView)
            .name("panelWithHeaderView")
            .attributes({
                headerTitle: "Change Password"
            })
            .build(this);


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.getTwoColumnView().addViewChild(this.panelWithHeaderView, "#column2of2-{{cid}}");
    },

    /**
     * @protected
     */
    createContainerChildren: function(routingArgs) {
        this._super(routingArgs);
        this.changePasswordFormContainer    = new ChangePasswordFormContainer(this.getCurrentUserModel());
        this.addContainerChild(this.changePasswordFormContainer, "#panel-body-" + this.panelWithHeaderView.getCid());
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(AccountSettingsPageContainer).with(
    autowired().properties([

    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AccountSettingsPageContainer", AccountSettingsPageContainer);
