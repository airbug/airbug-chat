//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.SendImageNakedButtonContainer')

//@Require('Class')
//@Require('Event')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.IconView')
//@Require('airbug.ImageViewEvent')
//@Require('airbug.MessageHandlerModule')
//@Require('airbug.NakedButtonView')
//@Require('airbug.TextView')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var ButtonViewEvent                     = bugpack.require('airbug.ButtonViewEvent');
var IconView                            = bugpack.require('airbug.IconView');
var ImageViewEvent                      = bugpack.require('airbug.ImageViewEvent');
var MessageHandlerModule                = bugpack.require('airbug.MessageHandlerModule');
var NakedButtonView                     = bugpack.require('airbug.NakedButtonView');
var TextView                            = bugpack.require('airbug.TextView');
var AutowiredAnnotation                 = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation                  = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer                   = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                           = AutowiredAnnotation.autowired;
var bugmeta                             = BugMeta.context();
var property                            = PropertyAnnotation.property;
var view                                = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SendImageNakedButtonContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {NakedButtonView}
         */
        this.buttonView        = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    activateContainer: function() {
        this._super();
        this.processMessageHandlerState();
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------


        // Create Views
        //-------------------------------------------------------------------------------

        this.buttonView =
            view(NakedButtonView)
                .attributes({
                    type: NakedButtonView.Type.DEFAULT
                })
                .children([
                    view(TextView)
                        .attributes({
                            text: " Send",
                            disabled: true
                        })
                ])
                .build();

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.buttonView);

    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.buttonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearButtonClickedEvent, this);
        this.messageHandlerModule.removeEventListener(MessageHandlerModule.EventTypes.STATE_CHANGED, this.hearMessageHandlerModuleStateChanged, this);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.buttonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearButtonClickedEvent, this);
        this.messageHandlerModule.addEventListener(MessageHandlerModule.EventTypes.STATE_CHANGED, this.hearMessageHandlerModuleStateChanged, this);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    processMessageHandlerState: function() {
        var handlerState = this.messageHandlerModule.getHandlerState();
        if (handlerState === MessageHandlerModule.HandlerState.EMBED_AND_SEND || handlerState === MessageHandlerModule.HandlerState.SEND_ONLY) {
            this.buttonView.enableButton();
        } else {
            this.buttonView.disableButton();
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearButtonClickedEvent: function(event) {
        this.buttonView.dispatchEvent(new ImageViewEvent(ImageViewEvent.EventType.CLICKED_SEND, {}));
    },

    /**
     * @private
     * @param {Event} event
     */
    hearMessageHandlerModuleStateChanged: function(event) {
        this.processMessageHandlerState();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(SendImageNakedButtonContainer).with(
    autowired().properties([
        property("messageHandlerModule").ref("messageHandlerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.SendImageNakedButtonContainer", SendImageNakedButtonContainer);
