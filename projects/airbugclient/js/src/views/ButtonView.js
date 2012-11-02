//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ButtonView')

//@Require('ButtonViewEvent')
//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ButtonView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="button-wrapper {{buttonWrapperClasses}}">' +
                    '<button id="button-{{cid}}" class="btn {{buttonClasses}}">{{buttonText}}</button>' +
                '</div>',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(options) {
        this._super(options);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {?string}
         */
        this.align = options.align;

        /**
         * @private
         * @type {?string}
         */
        this.size = options.size;

        /**
         * @private
         * @type {string}
         */
        this.text = options.text;

        /**
         * @private
         * @type {?string}
         */
        this.type = options.type;
    },


    //-------------------------------------------------------------------------------
    // CarapaceView Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    deinitializeView: function() {
        this._super();
        this.$el.find('button-' + this.cid).unbind();
    },

    /**
     * @protected
     */
    initializeView: function() {
        this._super();
        var _this = this;
        this.$el.find('#button-' + this.cid).bind('click', function(event) {
            _this.handleButtonClick(event);
        });
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
        switch (this.size) {
            case "large":
                data.buttonClasses += " btn-large";
                break;
            case "small":
                data.buttonClasses += " btn-small";
                break;
            case "mini":
                data.buttonClasses += " btn-mini";
                break;
        }
        switch (this.type) {
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
            case "link":
                data.buttonClasses += " btn-link";
                break;
        }

        data.buttonWrapperClasses = "";
        switch (this.align) {
            case "right":
                data.buttonWrapperClasses += "pull-right";
                break;
        }

        data.buttonText = this.text;
        return data;
    },


    //-------------------------------------------------------------------------------
    // View Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param event
     */
    handleButtonClick: function(event) {
        event.preventDefault();
        this.dispatchEvent(new ButtonViewEvent(ButtonViewEvent.EventTypes.CLICKED));
    }
});
