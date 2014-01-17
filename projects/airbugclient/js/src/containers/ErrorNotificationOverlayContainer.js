//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ErrorNotificationOverlayContainer')

//@Require('Class')
//@Require('airbug.CommandModule')
//@Require('airbug.NakedButtonView')
//@Require('airbug.OverlayView')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
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
var CommandModule           = bugpack.require('airbug.CommandModule');
var NakedButtonView         = bugpack.require('airbug.NakedButtonView');
var OverlayView             = bugpack.require('airbug.OverlayView');
var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer       = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired   = AutowiredAnnotation.autowired;
var bugmeta     = BugMeta.context();
var CommandType = CommandModule.CommandType;
var property    = PropertyAnnotation.property;
var view        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ErrorNotificationOverlayContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(errorObject) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         *
         * @type {{
         *      errorMessage: string,
         *      url: string,
         *      lineNumber: number
         * }}
         */
        this.errorObject        = errorObject;

        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CommandModule}
         */
        this.commandModule      = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {OverlayView}
         */
        this.overlayView         = null;
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

        this.overlayView =
            view(OverlayView)
                .attributes({
                    type: OverlayView.Type.APPLICATION,
                    size: OverlayView.Size.ONE_THIRD
                })
                .children([
                    view(BoxView)
                        .appendTo('*[id|="overlay"]')
                        .children([
                            view(TextView)
                                .attributes({text: "An uncaught error or timeout has occurred."}),
                            view(TextView)
                                .attributes({text: "airbug is sorry for the inconvenience."}),
                            view(TextView)
                                .attributes({text: "Please refresh your browser window."}),
                            view(TextView)
                                .attributes({text: "Error Details:" + this.errorObject.errorMessage}),
                            view(TextView)
                                .attributes({text: "Error Details:" + this.errorObject.url + "" + this.errorObject.lineNumber}),
                        ])
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.overlayView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ErrorNotificationOverlayContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ErrorNotificationOverlayContainer", ErrorNotificationOverlayContainer);
