//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.AddRoomMemberButtonContainer')

//@Require('Class')
//@Require('airbug.ButtonContainer')
//@Require('airbug.ButtonView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CommandModule')
//@Require('airbug.IconView')
//@Require('airbug.NakedButtonView')
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
    var IconView                = bugpack.require('airbug.IconView');
    var NakedButtonView         = bugpack.require('airbug.NakedButtonView');
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
    var AddRoomMemberButtonContainer = Class.extend(ButtonContainer, {

        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super("AddRoomMemberButton");


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

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
             * @type {ButtonView}
             */
            this.buttonView         = null;
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

            view(NakedButtonView)
                .name("buttonView")
                .attributes({
                    type: ButtonView.Type.LINK
                })
                .children([
                    view(IconView)
                        .attributes({
                            type: IconView.Type.PLUS
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
        createContainerChildren: function() {
            this._super();
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.buttonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearButtonClickedEvent, this);
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
         * @param {Event} event
         */
        hearButtonClickedEvent: function(event) {
            this.commandModule.relayCommand(CommandType.DISPLAY.SHARE_ROOM_OVERLAY, {});
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(AddRoomMemberButtonContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.AddRoomMemberButtonContainer", AddRoomMemberButtonContainer);
});
