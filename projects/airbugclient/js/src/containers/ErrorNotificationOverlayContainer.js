//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ErrorNotificationOverlayContainer')

//@Require('Class')
//@Require('carapace.BoxView')
//@Require('airbug.CommandModule')
//@Require('carapace.OverlayView')
//@Require('carapace.TextView')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var BoxView                 = bugpack.require('carapace.BoxView');
    var CommandModule           = bugpack.require('airbug.CommandModule');
    var OverlayView             = bugpack.require('carapace.OverlayView');
    var TextView                = bugpack.require('carapace.TextView');
    var AutowiredTag     = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag      = bugpack.require('bugioc.PropertyTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var CarapaceContainer       = bugpack.require('carapace.CarapaceContainer');
    var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired               = AutowiredTag.autowired;
    var bugmeta                 = BugMeta.context();
    var CommandType             = CommandModule.CommandType;
    var property                = PropertyTag.property;
    var view                    = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var ErrorNotificationOverlayContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.ErrorNotificationOverlayContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {{
         *      errorMessage: string,
         *      url: string,
         *      lineNumber: number
         * }} errorObject
         */
        _constructor: function(errorObject) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
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

            view(OverlayView)
                .name("overlayView")
                .attributes({
                    type: OverlayView.Type.APPLICATION,
                    size: OverlayView.Size.ONE_THIRD
                })
                .children([
                    view(BoxView)
                        .appendTo("#overlay-{{cid}}")
                        .children([
                            view(TextView)
                                .appendTo("#box-body-{{cid}}")
                                .attributes({text: "An uncaught error or timeout has occurred."}),
                            view(TextView)
                                .appendTo("#box-body-{{cid}}")
                                .attributes({text: "airbug is sorry for the inconvenience."}),
                            view(TextView)
                                .appendTo("#box-body-{{cid}}")
                                .attributes({text: "Please refresh your browser window."}),
                            view(TextView)
                                .appendTo("#box-body-{{cid}}")
                                .attributes({text: "Error Details:" + this.errorObject.errorMessage}),
                            view(TextView)
                                .appendTo("#box-body-{{cid}}")
                                .attributes({text: "Error Details:" + this.errorObject.url + "" + this.errorObject.lineNumber}),
                        ])
                ])
                .build(this);


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.overlayView);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(ErrorNotificationOverlayContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ErrorNotificationOverlayContainer", ErrorNotificationOverlayContainer);
});
