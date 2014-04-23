//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ChatMessageTinkerButtonContainer')

//@Require('Class')
//@Require('airbug.ButtonContainer')
//@Require('airbug.ButtonView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CommandModule')
//@Require('airbug.TextView')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var ButtonContainer         = bugpack.require('airbug.ButtonContainer');
    var ButtonView              = bugpack.require('airbug.ButtonView');
    var ButtonViewEvent         = bugpack.require('airbug.ButtonViewEvent');
    var CommandModule           = bugpack.require('airbug.CommandModule');
    var TextView                = bugpack.require('airbug.TextView');
    var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
    var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired               = AutowiredAnnotation.autowired;
    var bugmeta                 = BugMeta.context();
    var CommandType             = CommandModule.CommandType;
    var property                = PropertyAnnotation.property;
    var view                    = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ButtonContainer}
     */
    var ChatMessageTinkerButtonContainer = Class.extend(ButtonContainer, {

        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super("ChatMessageTinkerButton");


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ButtonView}
             */
            this.buttonView         = null;


            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CommandModule}
             */
            this.commandModule      = null;
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

            view(ButtonView)
                .name("buttonView")
                .attributes({type: "link", align: "right"})
                .children([
                    view(TextView)
                        .attributes({text: "tinker"})
                        .appendTo("#button-{{cid}}")
                ])
                .build(this);


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.buttonView);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(ChatMessageTinkerButtonContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ChatMessageTinkerButtonContainer", ChatMessageTinkerButtonContainer);
});
