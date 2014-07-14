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

//@Export('airbug.GithubLoginFormView')

//@Require('Class')
//@Require('carapace.MustacheView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var MustacheView    = bugpack.require('carapace.MustacheView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var GithubLoginFormView = Class.extend(MustacheView, {

        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div class="form-wrapper">' +
                '<form class="form-horizontal">' +
                    '<div class="control-group">' +
                        'We noticed that your GitHub email address ' +
                    '</div>' +
                    '<div class="control-group">' +
                        '<input class="input-xxlarge" type="text" name="email" placeholder="Email">' + // TODO - dkk - change this so it is radio buttons
                    '</div>' +
                    '<div class="control-group">' +
                        '<input class="input-xxlarge" type="password" name="password" placeholder="Password">' +
                    '</div>' +
                    '<div class="control-group">' +
                        '<button id="login-button-{{cid}}" type="submit" class="btn">Login</button>' +
                    '</div>' +
                '</form>' +
            '</div>',


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Object} options
         */
        _constructor: function(options) {

            this._super(options);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            var _this = this;

            /**
             * @private
             * @param {jQuery.Event} event
             */
            this.hearFormSubmit = function(event) {
                _this.handleSubmit(event);
                event.preventDefault();
                event.stopPropagation();
                return false;
            };

            /**
             * @private
             * @param {jQuery.Event} event
             */
            this.hearLoginButtonClick = function(event) {
                _this.handleSubmit(event);
                event.preventDefault();
                event.stopPropagation();
                return false;
            };
        },


        //-------------------------------------------------------------------------------
        // BugView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        deinitializeView: function() {
            this._super();
            this.findElement("form").off("submit", this.hearFormSubmit);
            this.findElement("#login-button-{{cid}}").off("click", this.hearLoginButtonClick);
        },

        /**
         * @protected
         */
        initializeView: function() {
            this._super();
            this.findElement("form").on("submit", this.hearFormSubmit);
            this.findElement("#login-button-{{cid}}").on("click", this.hearLoginButtonClick);
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

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
            console.log("formData:", formData);
            this.dispatchEvent(new FormViewEvent(FormViewEvent.EventType.SUBMIT, {
                formData: formData
            }));
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param event
         */
        handleSubmit: function(event) {
            this.submitForm();
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.GithubLoginFormView", GithubLoginFormView);
});
