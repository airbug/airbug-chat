//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.LoginFormView')

//@Require('Class')
//@Require('airbug.FormViewEvent')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var FormViewEvent   = bugpack.require('airbug.FormViewEvent');
    var MustacheView    = bugpack.require('airbug.MustacheView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var LoginFormView = Class.extend(MustacheView, {

        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:   '<div class="form-wrapper">' +
                        '<form class="form-horizontal">' +
                            '<div class="control-group">' +
                                '<input class="input-xxlarge" type="email" name="email" placeholder="Email">' +
                            '</div>' +
                            '<div class="control-group">' +
                                '<input class="input-xxlarge" type="password" name="password" placeholder="Password">' +
                            '</div>' +
                            '<div class="control-group">' +
                                '<button id="login-button-{{cid}}" type="submit" class="btn ">Login</button>' +
                                '<span class="help-inline">Not a member yet? <a href="#signup">signup here</a></span>' +
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

    bugpack.export("airbug.LoginFormView", LoginFormView);
});
