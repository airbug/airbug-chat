//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.StartConversationButtonContainer')

//@Require('Class')
//@Require('airbug.ButtonContainer')
//@Require('airbug.ButtonGroupView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.NakedButtonView')
//@Require('airbug.IconView')
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
    var ButtonGroupView         = bugpack.require('airbug.ButtonGroupView');
    var ButtonViewEvent         = bugpack.require('airbug.ButtonViewEvent');
    var NakedButtonView         = bugpack.require('airbug.NakedButtonView');
    var IconView                = bugpack.require('airbug.IconView');
    var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
    var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired               = AutowiredAnnotation.autowired;
    var bugmeta                 = BugMeta.context();
    var property                = PropertyAnnotation.property;
    var view                    = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ButtonContainer}
     */
    var StartConversationButtonContainer = Class.extend(ButtonContainer, {

        _name: "airbug.StartConversationButtonContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super("StartConversationButton");


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ButtonGroupView}
             */
            this.buttonGroupView            = null;

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

            view(ButtonGroupView)
                .name("buttonGroupView")
                .attributes({
                    align: "right",
                    classes: "start-conversation-button-group"
                })
                .children([
                    view(NakedButtonView)
                        .name("buttonView")
                        .attributes({type: "primary", align: "left"})
                        .appendTo("#button-group-{{cid}}")
                        .children([
                            view(IconView)
                                .attributes({type: IconView.Type.PENCIL, color: IconView.Color.WHITE})
                                .appendTo("#button-{{cid}}")
                        ])
                ])
                .build(this);


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.buttonGroupView);
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.buttonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearStartConversationButtonClickedEvent, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.buttonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearStartConversationButtonClickedEvent, this);
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {ButtonViewEvent} event
         */
        hearStartConversationButtonClickedEvent: function(event) {
            this.navigationModule.navigate("home", {
                trigger: true
            });
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(StartConversationButtonContainer).with(
        autowired().properties([
            property("navigationModule").ref("navigationModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.StartConversationButtonContainer", StartConversationButtonContainer);
});
