//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('HomeButtonContainer')

//@Require('Class')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.IconView')
//@Require('airbug.TextView')
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

var Class =                 bugpack.require('Class');
var ButtonViewEvent =       bugpack.require('airbug.ButtonViewEvent');
var IconView =              bugpack.require('airbug.IconView');
var TextView =              bugpack.require('airbug.TextView');
var Annotate =              bugpack.require('annotate.Annotate');
var AutowiredAnnotation =   bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation =    bugpack.require('bugioc.PropertyAnnotation');
var CarapaceContainer =     bugpack.require('carapace.CarapaceContainer');
var ViewBuilder =           bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var autowired = AutowiredAnnotation.autowired;
var property = PropertyAnnotation.property;
var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var HomeButtonContainer = Class.extend(CarapaceContainer, {

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

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ButtonView}
         */
        this.buttonView = null;
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
                        .attributes({text: "Home"})
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
    initializeContainer: function() {
        this._super();
        this.buttonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearButtonClickedEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ButtonViewEvent} event
     */
    hearButtonClickedEvent: function(event) {
        this.navigationModule.navigate("home", {
            trigger: true
        });
    }
});
annotate(HomeButtonContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.HomeButtonContainer", HomeButtonContainer);
