//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.NakedButtonView')

//@Require('Class')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var ButtonViewEvent = bugpack.require('airbug.ButtonViewEvent');
    var MustacheView    = bugpack.require('airbug.MustacheView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var NakedButtonView = Class.extend(MustacheView, {

        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template: '<button id="{{id}}" class="btn {{buttonClasses}}"></button>',


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

            if (!this.id) {
                this.id = "button-" + this.cid;
            }
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {$}
         */
        getButtonElement: function() {
            return this.findElement("#button-{{cid}}");
        },


        //-------------------------------------------------------------------------------
        // CarapaceView Extensions
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        deinitializeView: function() {
            this._super();
            this.findElement('#' + this.getId()).off();
        },

        /**
         * @protected
         */
        initializeView: function() {
            this._super();
            var _this = this;
            this.findElement('#' + this.getId()).on('click', function(event) {
                _this.handleButtonClick(event);
            });
        },


        //-------------------------------------------------------------------------------
        // CarapaceView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {string} attributeName
         * @param {*} attributeValue
         */
        renderAttribute: function(attributeName, attributeValue) {
            switch (attributeName) {
                case "active":
                    if (attributeValue) {
                        this.getButtonElement().addClass("active");
                    } else {
                        this.getButtonElement().removeClass("active");
                    }
                    break;
                case "disabled":
                    if (attributeValue) {
                        this.getButtonElement().addClass("disabled");
                    } else {
                        this.getButtonElement().removeClass("disabled");
                    }
                    break;
            }
        },


        //-------------------------------------------------------------------------------
        // MustacheView Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data = this._super();
            data.buttonClasses = "";
            data.id = this.getId();
            switch (this.attributes.size) {
                case ButtonView.Size.LARGE:
                    data.buttonClasses += " btn-large";
                    break;
                case ButtonView.Size.SMALL:
                    data.buttonClasses += " btn-small";
                    break;
                case ButtonView.Size.MINI:
                    data.buttonClasses += " btn-mini";
                    break;
            }
            switch (this.attributes.type) {
                case "default":
                    break;
                case "primary":
                    data.buttonClasses += " btn-primary";
                    break;
                case "info":
                    data.buttonClasses += " btn-info";
                    break;
                case "success":
                    data.buttonClasses += " btn-success";
                    break;
                case "warning":
                    data.buttonClasses += " btn-warning";
                    break;
                case "danger":
                    data.buttonClasses += " btn-danger";
                    break;
                case "inverse":
                    data.buttonClasses += " btn-inverse";
                    break;
                case "link":
                    data.buttonClasses += " btn-link";
                    break;
            }
            switch (this.attributes.align) {
                case "right":
                    data.buttonClasses += " pull-right";
                    break;
            }
            switch (this.attributes.block) {
                case true:
                    data.buttonClasses += " btn-block";
                    break
            }
            switch (this.attributes.disabled) {
                case true:
                    data.buttonClasses += " disabled";
                    break
            }

            return data;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        disableButton: function() {
            this.setAttribute("disabled", true);
        },

        /**
         *
         */
        enableButton: function() {
            this.setAttribute("disabled", false);
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {jQuery.Event} event
         */
        handleButtonClick: function(event) {
            event.preventDefault();
            if (!this.getAttribute("disabled")) {
                this.dispatchEvent(new ButtonViewEvent(ButtonViewEvent.EventType.CLICKED, {}));
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {number}
     */
    NakedButtonView.Size = {
        LARGE: 1,
        NORMAL: 2,
        SMALL: 3,
        MINI: 4
    };

    /**
     * @static
     * @enum {string}
     */
    NakedButtonView.Type = {
        DEFAULT:    "default",
        PRIMARY:    "primary",
        INFO:       "info",
        SUCCESS:    "success",
        WARNING:    "warning",
        DANGER:     "danger",
        INVERSE:    "inverse",
        LINK:       "link"
    };

    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.NakedButtonView", NakedButtonView);
});
