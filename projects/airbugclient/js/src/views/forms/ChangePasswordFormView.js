//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ChangePasswordFormView')

//@Require('Class')
//@Require('airbug.FormView')
//@Require('airbug.PasswordUtil')
//@Require('jquery.JQuery')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var FormView        = bugpack.require('airbug.FormView');
    var PasswordUtil    = bugpack.require('airbug.PasswordUtil');
    var JQuery          = bugpack.require('jquery.JQuery');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {FormView}
     */
    var ChangePasswordFormView = Class.extend(FormView, {

        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<form id="change-password-form-{{cid}}" class="{{classes}} settings-form change-password-form">' +
                '<fieldset>' +
                    '<label for="input-old-password-{{cid}}">Old Password</label>' +
                    '<input id="input-old-password-{{cid}}" class="input-xxlarge" type="password" name="oldPassword" placeholder="" value="" required>' +
                '</fieldset>' +
                '<fieldset>' +
                    '<label for="input-new-password-{{cid}}">New Password</label>' +
                    '<input id="input-new-password-{{cid}}" class="input-xxlarge" type="password" name="password" placeholder="" value="" required>' +
                '</fieldset>' +
                '<fieldset>' +
                    '<label for="input-confirm-new-password-{{cid}}">Confirm New Password</label>' +
                    '<input id="input-confirm-new-password-{{cid}}" class="input-xxlarge" type="password" name="confirmPassword" placeholder="" value="" required>' +
                '</fieldset>' +
                '<fieldset>' +
                    '<button id="update-button-{{cid}}" type="submit" class="btn submit-button">Update Password</button>' +
                '</fieldset>' +
            '</form>',


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        deinitializeView: function() {
            this._super();
            this.findElement("#change-password-form-{{cid}}").unbind();
        },

        /**
         * @protected
         */
        initializeView: function() {
            this._super();

            //TODO BRN: Do form validations need to be removed?
            this.addFormValidations();
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        addFormValidations: function() {
            this.findElement("#change-password-form-{{cid}}").validate({
                rules: {
                    oldPassword: "required",
                    password: "required",
                    confirmPassword: {
                        equalTo: "#input-new-password-" + this.getCid()
                    }
                }
            });
            JQuery.validator.addMethod("password", function(value, element) {
                return PasswordUtil.isValid(value);
            }, PasswordUtil.requirementsString);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ChangePasswordFormView", ChangePasswordFormView);
});
