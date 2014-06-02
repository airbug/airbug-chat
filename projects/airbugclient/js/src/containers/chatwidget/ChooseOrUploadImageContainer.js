//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ChooseOrUploadImageContainer')

//@Require('Class')
//@Require('airbug.BoxView')
//@Require('airbug.ButtonView')
//@Require('airbug.CommandModule')
//@Require('airbug.TextView')
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

    var Class                               = bugpack.require('Class');
    var BoxView                             = bugpack.require('airbug.BoxView');
    var ButtonView                          = bugpack.require('airbug.ButtonView');
    var CommandModule                       = bugpack.require('airbug.CommandModule');
    var TextView                            = bugpack.require('airbug.TextView');
    var AutowiredTag                 = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag                  = bugpack.require('bugioc.PropertyTag');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');
    var CarapaceContainer                   = bugpack.require('carapace.CarapaceContainer');
    var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                           = AutowiredTag.autowired;
    var bugmeta                             = BugMeta.context();
    var CommandType                         = CommandModule.CommandType;
    var property                            = PropertyTag.property;
    var view                                = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var ChooseOrUploadImageContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.ChooseOrUploadImageContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            // Models
            //-------------------------------------------------------------------------------


            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CommandModule}
             */
            this.commandModule              = null;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {BoxView}
             */
            this.boxView                    = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
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

            view(BoxView)
                .name("boxView")
                .attributes({})
                .children([
                    view(BoxView)
                        .appendTo("#box-body-{{cid}}")
                        .children([
                            view(ButtonView)
                                .appendTo("#box-body-{{cid}}")
                                .attributes({
                                    block: true,
                                    size: ButtonView.Size.LARGE
                                })
                                .children([
                                    view(TextView)
                                        .attributes({
                                            text: "CHOOSE"
                                        })
                                        .appendTo("#button-{{cid}}")
                                ])
                        ]),
                    view(BoxView)
                        .appendTo("#box-body-{{cid}}")
                        .children([
                            view(ButtonView)
                                .appendTo("#box-body-{{cid}}")
                                .attributes({
                                    block: true,
                                    size: ButtonView.Size.LARGE
                                })
                                .children([
                                    view(TextView)
                                        .attributes({
                                            text: "UPLOAD"
                                        })
                                        .appendTo("#button-{{cid}}")
                                ])
                        ])
                ])
                .build(this);


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.boxView);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(ChooseOrUploadImageContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ChooseOrUploadImageContainer", ChooseOrUploadImageContainer);
});
