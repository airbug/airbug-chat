//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomsHamburgerButtonContainer')

//@Require('Class')
//@Require('airbug.ButtonView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.IconView')
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
var IconView                = bugpack.require('airbug.IconView');
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

var RoomsHamburgerButtonContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------


        // Modules
        //-------------------------------------------------------------------------------


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ButtonView}
         */
        this.buttonView                 = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Views
        //-------------------------------------------------------------------------------

        this.buttonView =
            view(ButtonView)
                .attributes({type: "primary", align: "left"})
                .children([
                    view(IconView)
                    .attributes({type: IconView.Type.ALIGN_JUSTIFY, color: IconView.Color.WHITE})
                    .appendTo('*[id|="button"]')
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.buttonView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.buttonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearButtonClickedEvent, this);

    },

    activateContainer: function() {
        this._super();
    },

    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ButtonViewEvent} event
     */
    hearButtonClickedEvent: function(event) {
        console.log("Inside RoomsHamburgerButtonContainer#hearButtonClickedEvent");
        this.handleButtonClick();
    },

    //-------------------------------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------------------------------

    handleButtonClick: function(event) {
        console.log("RoomsHamburgerButtonContainer#handleButtonClick");
        var parentContainer         = this.getContainerParent();
        var parentView              = parentContainer.getViewTop();
        var grandparentContainer    = parentContainer.getContainerParent();
        var grandparentView         = grandparentContainer.getViewTop();
        var hamburgerPanel          = grandparentView.$el.find("#roomPageRowContainer>.column1of2");
        var roomChatBox             = grandparentView.$el.find("#roomPageRowContainer>.column2of2");
        var roomMemberList          = parentView.$el.find("#roomChatBoxRowContainer>.column1of2");
        var chatWidget              = parentView.$el.find("#roomChatBoxRowContainer>.column2of2");
        var chatInput               = parentView.$el.find("#chatWidgetInputRowContainer>.column1of2");
        var sendButton              = parentView.$el.find("#chatWidgetInputRowContainer>.column2of2");

        console.log("hamburgerPanel:",  hamburgerPanel);
        console.log("roomChatBox:",     roomChatBox);
        console.log("roomMemberList:",  roomMemberList);
        console.log("chatWidget:",      chatWidget);

        chatInput.toggleClass("span7").toggleClass("span5");
        sendButton.toggleClass("span2").toggleClass("span1");
        roomChatBox.toggleClass("span12").toggleClass("span9");
        chatWidget.toggleClass("span9").toggleClass("span6");
        hamburgerPanel.toggleClass("hamburger-panel-hidden");
    }

});



//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomsHamburgerButtonContainer", RoomsHamburgerButtonContainer);
