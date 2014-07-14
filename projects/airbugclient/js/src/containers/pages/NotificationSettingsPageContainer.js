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

//@Export('airbug.NotificationSettingsPageContainer')

//@Require('Class')
//@Require('ClearChange')
//@Require('Exception')
//@Require('RemovePropertyChange')
//@Require('SetPropertyChange')
//@Require('airbug.SettingsPageContainer')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
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
var AutowiredTag                 = bugpack.require('bugioc.AutowiredTag');
var PropertyTag                  = bugpack.require('bugioc.PropertyTag');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');
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
var NotificationSettingsPageContainer = Class.extend(SettingsPageContainer, {

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
        this.getNotificationListItemView().setAttribute("active", true);
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

bugmeta.tag(NotificationSettingsPageContainer).with(
    autowired().properties([

    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.NotificationSettingsPageContainer", NotificationSettingsPageContainer);
