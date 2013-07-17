//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatWidgetInputFormContainer')

//@Require('Class')
//@Require('airbug.ButtonView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.FormViewEvent')
//@Require('airbug.ChatWidgetInputFormView')
//@Require('airbug.TextView')
//@Require('airbug.TwoColumnView')
//@Require('annotate.Annotate')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var ButtonView              = bugpack.require('airbug.ButtonView');
var ButtonViewEvent         = bugpack.require('airbug.ButtonViewEvent');
var ChatWidgetInputFormView = bugpack.require('airbug.ChatWidgetInputFormView');
var FormViewEvent           = bugpack.require('airbug.FormViewEvent');
var TextView                = bugpack.require('airbug.TextView');
var TwoColumnView           = bugpack.require('airbug.TwoColumnView');
var Annotate                = bugpack.require('annotate.Annotate');
var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var CarapaceContainer       = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate    = Annotate.annotate;
var autowired   = AutowiredAnnotation.autowired;
var property    = PropertyAnnotation.property;
var view        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatWidgetInputFormContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(conversationModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.conversationModel          = conversationModel;

        // Modules
        //-------------------------------------------------------------------------------


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {TwoColumnView}
         */
        this.twoColumnView              = null;

        /**
         * @private
         * @type {ChatWidgetInputFormView}
         */
        this.chatWidgetInputFormView    = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    activateContainer: function(routerArgs){
        this._super(routerArgs);
        this.twoColumnView.$el.find("textarea")[0].focus();
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Views
        //-------------------------------------------------------------------------------

        this.twoColumnView =
            view(TwoColumnView)
                .attributes({configuration: TwoColumnView.Configuration.EXTRA_THIN_RIGHT_SMALL})
                .id("chatWidgetInputRowContainer")
                .children([
                    view(ChatWidgetInputFormView)
                        .id("chatWidgetInputForm")
                        .appendTo(".column1of2"),
                    view(ButtonView)
                        .appendTo(".column2of2")
                        .children([
                            view(TextView)
                                .attributes({text: "Send"})
                                .appendTo('*[id|="button"]'),
                        ])
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.twoColumnView);

        this.chatWidgetInputFormView = this.findViewById("chatWidgetInputForm");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.twoColumnView.addEventListener(FormViewEvent.EventType.SUBMIT, this.handleFormSubmittedEvent, this);
        this.twoColumnView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.handleButtonClickedEvent, this);

    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {FormViewEvent} event
     */
    handleFormSubmittedEvent: function(event) {
        // See ChatWidgetContainer
    },

    handleButtonClickedEvent: function(event) {
        this.chatWidgetInputFormView.submitForm();
        // this.$el.find('#submit-button-' + this.cid).on('click', function(event){
        //     _this.handleSubmit(event);
        //     event.preventDefault();
        //     event.stopPropagation();
        //     return false;
        // });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatWidgetInputFormContainer", ChatWidgetInputFormContainer);
