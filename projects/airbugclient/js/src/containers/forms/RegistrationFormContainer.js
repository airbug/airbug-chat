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

//@Export('airbug.RegistrationFormContainer')

//@Require('Class')
//@Require('Exception')
//@Require('airbug.CommandModule')
//@Require('airbug.RegistrationFormView')
//@Require('airbug.RoomModel')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.FormViewEvent')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Exception               = bugpack.require('Exception');
    var CommandModule           = bugpack.require('airbug.CommandModule');
    var RegistrationFormView    = bugpack.require('airbug.RegistrationFormView');
    var RoomModel               = bugpack.require('airbug.RoomModel');
    var AutowiredTag            = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag             = bugpack.require('bugioc.PropertyTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var CarapaceContainer       = bugpack.require('carapace.CarapaceContainer');
    var FormViewEvent           = bugpack.require('carapace.FormViewEvent');
    var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var autowired               = AutowiredTag.autowired;
    var CommandType             = CommandModule.CommandType;
    var property                = PropertyTag.property;
    var view                    = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var RegistrationFormContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.RegistrationFormContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CommandModule}
             */
            this.commandModule              = null;

            /**
             * @private
             * @type {CurrentUserManagerModule}
             */
            this.currentUserManagerModule   = null;

            /**
             * @private
             * @type {NavigationModule}
             */
            this.navigationModule           = null;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {RegistrationFormView}
             */
            this.registrationFormView       = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        activateContainer: function() {
            this._super();
            this.registrationFormView.$el.find("input[name='email']").focus();
        },

        /**
         * @protected
         */
        createContainer: function() {
            this._super();

            // Create Views
            //-------------------------------------------------------------------------------

            this.registrationFormView =
                view(RegistrationFormView)
                    .build();


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.registrationFormView);
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.registrationFormView.removeEventListener(FormViewEvent.EventType.SUBMIT, this.hearFormSubmittedEvent, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.registrationFormView.addEventListener(FormViewEvent.EventType.SUBMIT, this.hearFormSubmittedEvent, this);
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

            console.log("Inside RegistrationFormContainer#hearFormSubmittedEvent");

            this.currentUserManagerModule.registerUser(formData, function(throwable, currentUserMeldDocument) {
                if (!throwable) {
                    var finalDestination = _this.navigationModule.getFinalDestination();
                    if (finalDestination) {
                        _this.navigationModule.clearFinalDestination();
                        _this.navigationModule.navigate(finalDestination, {
                            trigger: true
                        });
                    } else {
                        _this.navigationModule.navigate("home", {
                            trigger: true
                        });
                    }
                } else {

                    //TODO BRN: Need to introduce some sort of error handling system that can take any error and figure out what to do with it and what to show the user

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

    bugmeta.tag(RegistrationFormContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule"),
            property("navigationModule").ref("navigationModule"),
            property("currentUserManagerModule").ref("currentUserManagerModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.RegistrationFormContainer", RegistrationFormContainer);
});
