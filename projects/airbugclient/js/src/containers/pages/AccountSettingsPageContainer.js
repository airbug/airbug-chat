/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.AccountSettingsPageContainer')

//@Require('Class')
//@Require('ClearChange')
//@Require('Exception')
//@Require('RemovePropertyChange')
//@Require('SetPropertyChange')
//@Require('airbug.ChangePasswordFormContainer')
//@Require('airbug.SettingsPageContainer')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.PanelWithHeaderView')
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
var SettingsPageContainer               = bugpack.require('airbug.SettingsPageContainer');
var AutowiredTag                 = bugpack.require('bugioc.AutowiredTag');
var PropertyTag                  = bugpack.require('bugioc.PropertyTag');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');
var PanelWithHeaderView                 = bugpack.require('carapace.PanelWithHeaderView');
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

bugmeta.tag(AccountSettingsPageContainer).with(
    autowired().properties([

    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AccountSettingsPageContainer", AccountSettingsPageContainer);
