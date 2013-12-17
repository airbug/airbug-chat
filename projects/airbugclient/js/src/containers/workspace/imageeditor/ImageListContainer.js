//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ImageListContainer')

//@Require('Class')
//@Require('airbug.BoxWithHeaderAndFooterView')
//@Require('airbug.ButtonGroupView')
//@Require('airbug.ButtonToolbarView')
//@Require('airbug.CommandModule')
//@Require('airbug.IconView')
//@Require('airbug.NakedButtonView')
//@Require('airbug.TextView')
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

var Class                               = bugpack.require('Class');
var BoxWithHeaderAndFooterView          = bugpack.require('airbug.BoxWithHeaderAndFooterView');
var ButtonGroupView                     = bugpack.require('airbug.ButtonGroupView');
var ButtonToolbarView                   = bugpack.require('airbug.ButtonToolbarView');
var CommandModule                       = bugpack.require('airbug.CommandModule');
var IconView                            = bugpack.require('airbug.IconView');
var NakedButtonView                     = bugpack.require('airbug.NakedButtonView');
var TextView                            = bugpack.require('airbug.TextView');
var AutowiredAnnotation                 = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation                  = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer                   = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var CommandType = CommandModule.CommandType;
var view        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ImageListContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
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
         * @type {BoxWithHeaderAndFooterView}
         */
        this.boxView                    = null;


        // Containers
        //-------------------------------------------------------------------------------


    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        this._super(routerArgs);

    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------


        // Create Views
        //-------------------------------------------------------------------------------

        this.boxView =
            view(BoxWithHeaderAndFooterView)
                .id("image-list-container")
                .children([
                    view(ButtonToolbarView)
                        .id("image-list-toolbar")
                        .appendTo(".box-header")
                        .children([
                            view(ButtonGroupView)
                                .appendTo('#image-list-toolbar')
                                .children([
                                    view(NakedButtonView)
                                        .attributes({
                                            size: NakedButtonView.Size.NORMAL,
                                            disabled: true,
                                            type: NakedButtonView.Type.INVERSE
                                        })
                                        .children([
                                            view(IconView)
                                                .attributes({
                                                    type: IconView.Type.PICTURE,
                                                    color: IconView.Color.WHITE
                                                })
                                                .appendTo('button[id|="button"]'),
                                            view(TextView)
                                                .attributes({
                                                    text: " Image List"
                                                })
                                                .appendTo('button[id|="button"]')
                                        ])
                                ]),
                            view(ButtonGroupView)
                                .children([
                                    view(NakedButtonView)
                                        .attributes({
                                            size: NakedButtonView.Size.SMALL
                                        })
                                        .children([
                                            view(IconView)
                                                .attributes({
                                                    type: IconView.Type.UPLOAD
                                                })
                                                .appendTo('button[id|="button"]'),
                                            view(TextView)
                                                .attributes({
                                                    text: "Upload"
                                                })
                                                .appendTo('button[id|="button"]')
                                        ]),
                                    view(NakedButtonView)
                                        .attributes({
                                            size: NakedButtonView.Size.SMALL
                                        })
                                        .children([
                                            view(IconView)
                                                .attributes({
                                                    type: IconView.Type.REMOVE
                                                })
                                                .appendTo('button[id|="button"]'),
                                            view(TextView)
                                                .attributes({
                                                    text: "Close"
                                                })
                                                .appendTo('button[id|="button"]')
                                        ])
                                ])
                                .appendTo('#image-list-toolbar')
                        ]),
                    view(ButtonGroupView)
                        .children([
                            view(NakedButtonView)
                                .attributes({
                                    size: NakedButtonView.Size.LARGE,
                                    type: NakedButtonView.Type.DANGER
                                })
                                .children([
                                    view(IconView)
                                        .attributes({
                                            type: IconView.Type.TRASH
                                        })
                                        .appendTo('button[id|="button"]')
                                ]),
                            view(NakedButtonView)
                                .attributes({
                                    size: NakedButtonView.Size.LARGE
                                })
                                .children([
                                    view(TextView)
                                        .attributes({text: "SEND"})
                                        .appendTo('button[id|="button"]')
                                ])
                        ])
                        .appendTo(".box-footer")
                ])
                .build();

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.boxView);
    },

    createContainerChildren: function() {
        this._super();
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.initializeCommandSubscriptions();
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.deinitializeCommandSubscriptions();
    },

    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initializeCommandSubscriptions: function() {

    },

    /**
     * @private
     */
    deinitializeCommandSubscriptions: function() {

    }

    //-------------------------------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------------------------------

});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ImageListContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ImageListContainer", ImageListContainer);
