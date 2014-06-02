//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.GithubLoginFormContainer')

//@Require('Class')
//@Require('Exception')
//@Require('airbug.BoxView')
//@Require('airbug.CommandModule')
//@Require('airbug.InputView')
//@Require('airbug.FormViewEvent')
//@Require('airbug.GithubLoginFormView')
//@Require('airbug.FormControlGroupView')
//@Require('airbug.FormViewWithWrapper')
//@Require('airbug.SelectOptionView')
//@Require('airbug.SelectView')
//@Require('airbug.SubmitButtonView')
//@Require('airbug.RoomModel')
//@Require('airbug.TextView')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var Exception                   = bugpack.require('Exception');
    var BoxView                     = bugpack.require('airbug.BoxView');
    var CommandModule               = bugpack.require('airbug.CommandModule');
    var InputView                   = bugpack.require('airbug.InputView');
    var GithubLoginFormView         = bugpack.require('airbug.GithubLoginFormView');
    var FormControlGroupView        = bugpack.require('airbug.FormControlGroupView');
    var FormViewWithWrapper         = bugpack.require('airbug.FormViewWithWrapper');
    var SelectOptionView            = bugpack.require('airbug.SelectOptionView');
    var SelectView                  = bugpack.require('airbug.SelectView');
    var SubmitButtonView            = bugpack.require('airbug.SubmitButtonView');
    var FormViewEvent               = bugpack.require('airbug.FormViewEvent');
    var RoomModel                   = bugpack.require('airbug.RoomModel');
    var TextView                    = bugpack.require('airbug.TextView');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');
    var AutowiredTag         = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag          = bugpack.require('bugioc.PropertyTag');
    var CarapaceContainer           = bugpack.require('carapace.CarapaceContainer');
    var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


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
