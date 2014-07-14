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

//@Export('airbug.ChangePasswordFormContainer')

//@Require('Class')
//@Require('Exception')
//@Require('airbug.ChangePasswordFormView')
//@Require('airbug.CommandModule')
//@Require('airbug.RoomModel')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.FormViewEvent')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Exception                       = bugpack.require('Exception');
var ChangePasswordFormView          = bugpack.require('airbug.ChangePasswordFormView');
var CommandModule                   = bugpack.require('airbug.CommandModule');
var RoomModel                       = bugpack.require('airbug.RoomModel');
var AutowiredTag             = bugpack.require('bugioc.AutowiredTag');
var PropertyTag              = bugpack.require('bugioc.PropertyTag');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var FormViewEvent                   = bugpack.require('carapace.FormViewEvent');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                         = BugMeta.context();
var autowired                       = AutowiredTag.autowired;
var CommandType                     = CommandModule.CommandType;
var property                        = PropertyTag.property;
var view                            = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {CarapaceContainer}
 */
var ChangePasswordFormContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(currentUserModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CurrentUserModel}
         */
        this.currentUserModel           = currentUserModel;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CommandModule}
         */
        this.commandModule              = null;

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule           = null;

        /**
         * @private
         * @type {UserManagerModule}
         */
        this.userManagerModule          = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChangePasswordFormView}
         */
        this.changePasswordFormView     = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    activateContainer: function() {
        this._super();
        this.changePasswordFormView.$el.find("input")[0].focus();
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Views
        //-------------------------------------------------------------------------------

        view(ChangePasswordFormView)
            .name("changePasswordFormView")
            .model(this.currentUserModel)
            .build(this);


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.changePasswordFormView);
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.changePasswordFormView.removeEventListener(FormViewEvent.EventType.SUBMIT, this.hearFormSubmittedEvent, this);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.changePasswordFormView.addEventListener(FormViewEvent.EventType.SUBMIT, this.hearFormSubmittedEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ButtonViewEvent} event
     */
    hearFormSubmittedEvent: function(event) {
        var _this       = this;
        var formData    = event.getData().formData;
        this.userManagerModule.updateUserPassword(this.currentUserModel.getProperty("id"), formData, function(throwable, currentUser) {
            if (!throwable) {
                _this.changePasswordFormView.clearForm();
                _this.commandModule.relayCommand(CommandType.FLASH.SUCCESS, {message: "Password was successfully changed"});
            } else {
                if (Class.doesExtend(throwable, Exception)) {
                    _this.commandModule.relayCommand(CommandType.FLASH.EXCEPTION, {message: throwable.getMessage()});
                } else {
                    _this.commandModule.relayCommand(CommandType.FLASH.ERROR, {message: "Sorry an error has occurred" + throwable});
                }
            }
        });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(ChangePasswordFormContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule"),
        property("navigationModule").ref("navigationModule"),
        property("userManagerModule").ref("userManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChangePasswordFormContainer", ChangePasswordFormContainer);
