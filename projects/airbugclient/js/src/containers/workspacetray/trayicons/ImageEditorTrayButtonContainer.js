//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ImageEditorTrayButtonContainer')

//@Require('Class')
//@Require('airbug.ButtonContainer')
//@Require('carapace.ButtonView')
//@Require('carapace.ButtonViewEvent')
//@Require('airbug.CommandModule')
//@Require('carapace.IconView')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var ButtonContainer             = bugpack.require('airbug.ButtonContainer');
    var ButtonView                  = bugpack.require('carapace.ButtonView');
    var ButtonViewEvent             = bugpack.require('carapace.ButtonViewEvent');
    var CommandModule               = bugpack.require('airbug.CommandModule');
    var IconView                    = bugpack.require('carapace.IconView');
    var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var CommandType                 = CommandModule.CommandType;
    var view                        = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ButtonContainer}
     */
    var ImageEditorTrayButtonContainer = Class.extend(ButtonContainer, {

        _name: "airbug.ImageEditorTrayButtonContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super("ImageEditorTrayButton");


            //-------------------------------------------------------------------------------
            // Private Properties
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
        // CarapaceContainer Methods
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
                .attributes({
                    size: ButtonView.Size.LARGE,
                    type: "primary",
                    align: "center",
                    block: true
                })
                .children([
                    view(IconView)
                        .attributes({
                            type: IconView.Type.PICTURE,
                            color: IconView.Color.WHITE
                        })
                        .appendTo("#button-{{cid}}")
                ])
                .build(this);


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.buttonView);
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.buttonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearImageEditorTrayButtonClickedEvent, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.buttonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearImageEditorTrayButtonClickedEvent, this);
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {ButtonViewEvent} event
         */
        hearImageEditorTrayButtonClickedEvent: function(event) {
            this.getCommandModule().relayCommand(CommandType.TOGGLE.IMAGE_WORKSPACE, {});
        }

    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ImageEditorTrayButtonContainer", ImageEditorTrayButtonContainer);
});
