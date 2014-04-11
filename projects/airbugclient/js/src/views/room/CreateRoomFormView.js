//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.CreateRoomFormView')

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
    var CreateRoomFormView = Class.extend(MustacheView, {

        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div class="form-wrapper-naked">' +
                '<form class="form-horizontal create-conversation-form">' +
                    '<legend>Start a conversation</legend>' +
                    '<div class="control-group">' +
                        '<label>Topic</label>' +
                        '<input class="input-xxlarge" type="text" name="name" placeholder="What is the difference between input and textarea?">' +
                    '</div>' +
                    '<div class="control-group">' +
                        '<label>Add Participants</label>' +
                        '<input class="input-xxlarge" type="text" name="participantEmails" placeholder="jill@JillAndJack.com, jack@JillAndJack.com">' +
                        '<span class="help-block">Add conversation participants by email. (Separated by commas)</span>' +
                    '</div>' +
                    '<div class="control-group">' +
                        '<label>Message</label>' +
                        '<textarea rows="5" name="chatMessage"/>' +
                    '</div>' +
                    '<div class="control-group">' +
                        '<button id="submit-button-{{cid}}" type="button" class="btn">Start a conversation</button>' +
                    '</div>' +
                '</form>' +
            '</div>',


        //-------------------------------------------------------------------------------
        // CarapaceView Methods
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
         * @param {jquery.Event} event
         */
        handleSubmit: function(event) {
            this.submitForm();
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbug.CreateRoomFormView', CreateRoomFormView);
});
