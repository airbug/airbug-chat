//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RegistrationFormView')

//@Require('Class')
//@Require('PasswordUtil')
//@Require('airbug.FormViewEvent')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var PasswordUtil    = bugpack.require('PasswordUtil');
var FormViewEvent   = bugpack.require('airbug.FormViewEvent');
var MustacheView    = bugpack.require('airbug.MustacheView');

//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RegistrationFormView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:
                    '<div class="form-wrapper">' +
                        '<form class="form-horizontal">' +
                            '<div class="control-group">' +
                                '<input class="input-xxlarge" type="email" name="email" placeholder="Email (required)" required>' +
                            '</div>' +
                            '<div class="control-group">' +
                                '<input class="input-xxlarge" type="text" name="firstName" placeholder="First Name  (required)" required>' +
                            '</div>' +
                            '<div class="control-group">' +
                                '<input class="input-xxlarge" type="text" name="lastName" placeholder="Last Name  (required)" required>' +
                            '</div>' +
                            '<div class="control-group">' +
                                '<input class="input-xxlarge" type="password" name="password" id="password" placeholder="Password  (required)" required>' +
                            '</div>' +
                            '<div class="control-group control-group-space">' +
                                '<input class="input-xxlarge" type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password  (required)" required>' +
                            '</div>' +
                            '<div class="control-group">' +
                                '<button id="submit-button-{{cid}}" type="submit" class="btn">Create Account</button>' +
                                '<span class="help-inline">Already have an account? <a href="#login">login here</a></span>' +
                            '</div>' +
                            '<div class="terms-wrapper">' +
                                '<span class="help-block">By clicking "Create Account" you agree to our <a href="//airbug.com/terms">terms of service</a> and <a href="//airbug.com/privacy">privacy policy</a></span>' +
                            '</div>' +
                        '</form>' +
                    '</div>',

    //-------------------------------------------------------------------------------
    // CarapaceView Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    deinitializeView: function() {
        this._super();
        this.$el.find('#submit-button-' + this.cid).off();
        this.$el.find('form').off();
    },

    /**
     * @protected
     */
    initializeView: function() {
        this._super();
        var _this = this;

        this.addFormValidations();

        this.$el.find('form').on('keypress', function(event) {
            _this.handleKeypress(event);
        });

        this.$el.find('form').on('submit', function(event) {
            _this.handleSubmit(event);
            event.preventDefault();
            event.stopPropagation();
            return false;
        });

        this.$el.find('#submit-button-' + this.cid).on('click', function(event) {
            _this.handleSubmit(event);
            event.preventDefault();
            event.stopPropagation();
            return false;
        });
    },

    //-------------------------------------------------------------------------------
    // Private and Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    addFormValidations: function() {
        this.$el.find('form').validate({
            rules: {
                email: {
                    remote: {
                        url: "/api/user-availability-check-email",
                        type: "post"
                    }
                },
                password: "required",
                confirmPassword: {
                    equalTo: "#password"
                }
            },
            messages: {
                email: {
                    remote: "User already exists"
                }
            }
        });
        jQuery.validator.addMethod("password", function(value, element) {
            return PasswordUtil.isValid(value);
        }, PasswordUtil.requirementsString);
    },

    /**
     * @protected
     * @return {Object}
     */
    getFormData: function() {

        // TODO BRN: This won't work for multiple check boxes. Will need to improve this if we have a form with more than
        // one checkbox.

        var formData = {};
        var formInputs = this.$el.find("form").serializeArray();
        formInputs.forEach(function(formInput) {
            formData[formInput.name] = formInput.value;
        });
        return formData;
    },

    /**
     * @protected
     */
    submitForm: function() {
        var formData = this.getFormData();
        this.dispatchEvent(new FormViewEvent(FormViewEvent.EventType.SUBMIT, {
            formData: formData
        }));
    },

    //-------------------------------------------------------------------------------
    // View Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param event
     */
    handleSubmit: function(event) {
        if (this.$el.find('form').valid()) {
            this.submitForm();
        }
    },

    handleKeypress: function(event) {
        var formData = this.getFormData();
        this.dispatchEvent(new FormViewEvent(FormViewEvent.EventType.KEYPRESS, formData));
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbug.RegistrationFormView', RegistrationFormView);
