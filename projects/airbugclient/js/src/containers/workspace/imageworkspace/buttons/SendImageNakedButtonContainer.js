//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('SendImageNakedButtonContainer')

//@Require('Class')
//@Require('Event')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.IconView')
//@Require('airbug.ImageViewEvent')
//@Require('airbug.NakedButtonView')
//@Require('airbug.TextView')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var ButtonViewEvent                     = bugpack.require('airbug.ButtonViewEvent');
var IconView                            = bugpack.require('airbug.IconView');
var ImageViewEvent                      = bugpack.require('airbug.ImageViewEvent');
var NakedButtonView                     = bugpack.require('airbug.NakedButtonView');
var TextView                            = bugpack.require('airbug.TextView');
var CarapaceContainer                   = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

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
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------


        // Create Views
        //-------------------------------------------------------------------------------

        this.buttonView =
            view(NakedButtonView)
                .attributes({
                    type: NakedButtonView.Type.PRIMARY
                })
                .children([
                    view(TextView)
                        .attributes({
                            text: " Send"
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
    initializeContainer: function() {
        this._super();
        this.initializeEventListeners();
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.deinitializeEventListeners();
    },

    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    initializeEventListeners: function() {
        this.buttonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearButtonClickedEvent, this);
    },

    deinitializeEventListeners: function() {
        this.buttonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearButtonClickedEvent, this);
    },

    hearButtonClickedEvent: function(event) {
        this.buttonView.dispatchEvent(new ImageViewEvent(ImageViewEvent.EventType.CLICKED_SEND, {}));
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.SendImageNakedButtonContainer", SendImageNakedButtonContainer);
