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

//@Export('airbug.GithubLoginFormContainer')

//@Require('Class')
//@Require('Exception')
//@Require('airbug.CommandModule')
//@Require('airbug.GithubLoginFormView')
//@Require('airbug.RoomModel')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.BoxView')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.FormControlGroupView')
//@Require('carapace.FormViewEvent')
//@Require('carapace.FormViewWithWrapper')
//@Require('carapace.InputView')
//@Require('carapace.SelectOptionView')
//@Require('carapace.SelectView')
//@Require('carapace.SubmitButtonView')
//@Require('carapace.TextView')
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
    var GithubLoginFormView     = bugpack.require('airbug.GithubLoginFormView');
    var RoomModel               = bugpack.require('airbug.RoomModel');
    var AutowiredTag            = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag             = bugpack.require('bugioc.PropertyTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var BoxView                 = bugpack.require('carapace.BoxView');
    var CarapaceContainer       = bugpack.require('carapace.CarapaceContainer');
    var FormControlGroupView    = bugpack.require('carapace.FormControlGroupView');
    var FormViewEvent           = bugpack.require('carapace.FormViewEvent');
    var FormViewWithWrapper     = bugpack.require('carapace.FormViewWithWrapper');
    var InputView               = bugpack.require('carapace.InputView');
    var SelectOptionView        = bugpack.require('carapace.SelectOptionView');
    var SelectView              = bugpack.require('carapace.SelectView');
    var SubmitButtonView        = bugpack.require('carapace.SubmitButtonView');
    var TextView                = bugpack.require('carapace.TextView');
    var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var CommandType             = CommandModule.CommandType;
    var autowired               = AutowiredTag.autowired;
    var property                = PropertyTag.property;
    var view                    = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var GithubLoginFormContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.GithubLoginFormContainer",


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
             * @type {AirbugStaticConfig}
             */
            this.airbugStaticConfig         = null;

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
             * @type {GithubLoginFormView}
             */
            this.githubLoginFormView       = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Extensions
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        activateContainer: function() {
            this._super();
            this.githubLoginFormView.$el.find("input")[0].focus();
        },

        /**
         * @protected
         */
        createContainer: function() {
            this._super();

            // Create Views
            //-------------------------------------------------------------------------------

            // TODO - dkk - use the emails from the client config after testing
            //var emails = this.airbugStaticConfig.getGithubEmails();
            //var emails = ['email1@example.com', 'email2@example.com', 'email3@example.com'];
            var emails = ['email1@example.com'];

            if (emails === undefined) {
                var parentContainer     = this.getContainerParent();
                var notificationView    = parentContainer.getNotificationView();
                notificationView.flashErrorMessage("Sorry an error has occurred");
            }

            var passwordInputView =
                view(InputView)
                    .attributes({
                        name: "Password",
                        type: "password",
                        size: InputView.Size.XLARGE,
                        placeholder: "Password"
                    })
                    .build();

            var submitButtonView =
                view(SubmitButtonView)
                    .attributes({name: "Login"})
                    .build();

            this.githubLoginFormView =
                view(FormViewWithWrapper)
                    .attributes({classes: "form-horizontal", name: "Login"})
                    .build();

            if (emails.length === 1) {

                var singleEmailTextView =
                    view(TextView)
                        .attributes({
                            text: "We have matched your GitHub email address to an existing " +
                                "account in our system. Please log in below to continue."
                        })
                        .build();
                var emailBoxView =
                    view(BoxView).build();
                emailBoxView.addViewChild(singleEmailTextView);

                var emailView =
                    view(TextView)
                        .attributes({
                            text: emails[0]
                        })
                        .build();

                this.githubLoginFormView.addViewChild(emailBoxView, '*[id|=form]');
                this.githubLoginFormView.addViewChild(emailView, '*[id|=form]');
                this.githubLoginFormView.addViewChild(passwordInputView, '*[id|=form]');
                this.githubLoginFormView.addViewChild(submitButtonView, '*[id|=form]');

            } else {
                var selectView =
                    view(SelectView)
                        .attributes({id: "email-select-" + this.cid})
                        .build();
                var formControlGroupView =
                    view(FormControlGroupView).build();
                formControlGroupView.addViewChild(selectView);

                var multipleEmailstextView =
                    view(TextView)
                        .attributes({
                            text: "We have matched more than one email addresses from " +
                                "your GitHub account. Please log in below to continue."
                        })
                        .build();

                this.githubLoginFormView.addViewChild(multipleEmailstextView);
                this.githubLoginFormView.addViewChild(formControlGroupView, '*[id|=form]');
                this.githubLoginFormView.addViewChild(passwordInputView, '*[id|=form]');
                this.githubLoginFormView.addViewChild(submitButtonView, '*[id|=form]');

                for (var i = 0; i < emails.length; i++) {
                    var email = emails[i];
                    var selectOptionView =
                        view(SelectOptionView)
                            .attributes({name: email})
                            .build();
                    selectView.addViewChild(selectOptionView);
                }
            }

            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.githubLoginFormView);
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.githubLoginFormView.removeEventListener(FormViewEvent.EventType.SUBMIT, this.hearFormSubmittedEvent, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.githubLoginFormView.addEventListener(FormViewEvent.EventType.SUBMIT, this.hearFormSubmittedEvent, this);
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
            this.currentUserManagerModule.loginUser(formData.email, formData.password, function(throwable, currentUser) {
                console.log("Inside GithubLoginFormContainer currentUserManagerModule#loginUser callback");
                console.log("throwable:", throwable, " currentUser:", currentUser, " inside GithubLoginFormContainer");

                if (!throwable) {
                    var finalDestination = _this.navigationModule.getFinalDestination();
                    console.log("finalDestination:", finalDestination);
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
                    //TODO BRN: Need to introduce some sort of error handling system that can take any error and figure
                    // out what to do with it and what to show the user

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

    bugmeta.tag(GithubLoginFormContainer).with(
        autowired().properties([
            property("airbugStaticConfig").ref("airbugStaticConfig"),
            property("commandModule").ref("commandModule"),
            property("navigationModule").ref("navigationModule"),
            property("currentUserManagerModule").ref("currentUserManagerModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.GithubLoginFormContainer", GithubLoginFormContainer);
});
