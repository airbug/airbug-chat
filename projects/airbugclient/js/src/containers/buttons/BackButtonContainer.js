//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('BackButtonContainer')

//@Require('Class')
//@Require('airbug.ButtonContainer')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.IconView')
//@Require('airbug.TextView')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var ButtonContainer     = bugpack.require('airbug.ButtonContainer');
var ButtonViewEvent     = bugpack.require('airbug.ButtonViewEvent');
var IconView            = bugpack.require('airbug.IconView');
var TextView            = bugpack.require('airbug.TextView');
var AutowiredAnnotation = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation  = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var ViewBuilder         = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired   = AutowiredAnnotation.autowired;
var bugmeta     = BugMeta.context();
var property    = PropertyAnnotation.property;
var view        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BackButtonContainer = Class.extend(ButtonContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.buttonName         = "BackButton";


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule   = null;

        /**
         * @private
         * @type {PageStateModule}
         */
        this.pageStateModule    = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ButtonView}
         */
        this.buttonView         = null;

        /**
         * @private
         * @type {number}
         */
        this.goBackId           = null;
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
                        .attributes({type: IconView.Type.CHEVRON_LEFT, color: IconView.Color.WHITE})
                        .appendTo('*[id|="button"]'),
                    view(TextView)
                        .attributes({text: "Back"})
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
    deinitializeContainer: function() {
        this._super();
        this.pageStateModule.putState(BackButtonContainer.STATE_KEY, this.goBackId);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.buttonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearButtonClickedEvent, this);

        this.goBackId = this.pageStateModule.getState(BackButtonContainer.STATE_KEY);
        if (!this.goBackId) {
            this.goBackId = this.navigationModule.markPreviousGoBack();
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ButtonViewEvent} event
     */
    hearButtonClickedEvent: function(event) {
        this.navigationModule.goBack(this.goBackId, {
            trigger: true
        });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(BackButtonContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule"),
        property("pageStateModule").ref("pageStateModule")
    ])
);


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

BackButtonContainer.STATE_KEY = "BackButtonContainer:goBackId";


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.BackButtonContainer", BackButtonContainer);
