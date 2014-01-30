//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ShareRoomContainer')

//@Require('Class')
//@Require('airbug.BoxWithHeaderView')
//@Require('airbug.ButtonView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CloseShareRoomOverlayButtonContainer')
//@Require('airbug.CopyToClipboardButtonView')
//@Require('airbug.IconView')
//@Require('airbug.OverlayView')
//@Require('airbug.RoomLinkFauxTextFieldView')
//@Require('airbug.ShareRoomTextView')
//@Require('airbug.TextView')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')
//@Require('zeroclipboard.ZeroClipboard')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                                   = bugpack.require('Class');
var BoxWithHeaderView                       = bugpack.require('airbug.BoxWithHeaderView');
var ButtonView                              = bugpack.require('airbug.ButtonView');
var ButtonViewEvent                         = bugpack.require('airbug.ButtonViewEvent');
var CloseShareRoomOverlayButtonContainer    = bugpack.require('airbug.CloseShareRoomOverlayButtonContainer');
var CopyToClipboardButtonView               = bugpack.require('airbug.CopyToClipboardButtonView');
var IconView                                = bugpack.require('airbug.IconView');
var OverlayView                             = bugpack.require('airbug.OverlayView');
var RoomLinkFauxTextFieldView               = bugpack.require('airbug.RoomLinkFauxTextFieldView');
var ShareRoomTextView                       = bugpack.require('airbug.ShareRoomTextView');
var TextView                                = bugpack.require('airbug.TextView');
var AutowiredAnnotation                     = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation                      = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                                 = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer                       = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                             = bugpack.require('carapace.ViewBuilder');
var ZeroClipboard                           = bugpack.require('zeroclipboard.ZeroClipboard');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                               = AutowiredAnnotation.autowired;
var bugmeta                                 = BugMeta.context();
var property                                = PropertyAnnotation.property;
var view                                    = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ShareRoomContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(roomModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RoomModel}
         */
        this.roomModel          = roomModel;

        /**
         * @private
         * @type {ZeroClipboard}
         */
        this.clip               = null;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AirbugClientConfig}
         */
        this.airbugClientConfig = null;

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule   = null;

        /**
         * @private
         * @type {WindowUtil}
         */
        this.windowUtil         = null;



        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {OverlayView}
         */
        this.overlayView        = null;

        /**
         * @pruvate
         * @type {BoxWithHeaderView}
         */
        this.shareRoomBoxView   = null;

        /**
         * @private
         * @type {ButtonView}
         */
        this.copyLinkButton     = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    activateContainer: function() {
        this._super();
        this.createZeroClipboard();
        var fauxTextArea = this.overlayView.$el.find("input");
        fauxTextArea.on("click", function() {
            fauxTextArea.select();
        });
    },

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
                    classes: "share-room-overlay",
                    size: OverlayView.Size.ONE_THIRD,
                    type: OverlayView.Type.PAGE
                })
                .children([
                    view(BoxWithHeaderView)
                        .id("shareRoomBox")
                        .children([
                            view(ShareRoomTextView)
                                .model(this.roomModel)
                                .appendTo('.box-body'),
                            view(RoomLinkFauxTextFieldView)
                                .model(this.roomModel)
                                .appendTo('.box-body'),
                            view(CopyToClipboardButtonView)
                                .attributes({type: "primary", align: "right", size: ButtonView.Size.NORMAL})
                                .children([
                                    view(TextView)
                                        .attributes({text: "Copy Link"})
                                        .appendTo('*[id|="button"]'),
                                    view(IconView)
                                        .attributes({
                                            type: IconView.Type.PAPERCLIP,
                                            color: IconView.Color.WHITE})
                                        .appendTo('*[id|="button"]')
                                ])
                                .appendTo('.box-body')
                        ])
                        .appendTo(".overlay-body")
                ])
                .build();

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.overlayView);
        this.shareRoomBoxView = this.findViewById("shareRoomBox");
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.closeShareRoomOverlayButtonContainer = new CloseShareRoomOverlayButtonContainer();

        this.addContainerChild(this.closeShareRoomOverlayButtonContainer, ".box-header");
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.destroyZeroClipboard();
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    createZeroClipboard: function() {
        var _this       = this;
        var button      = this.getViewTop().$el.find('.btn.copy-to-clipboard')[0];
        var currentUrl  = this.windowUtil.getUrl();
        var copyText    = currentUrl + "#room/" + this.roomModel.getProperty("id");

        this.clip       = new ZeroClipboard(button);
        var clip        = this.clip;

        clip.on( 'load',            function(client, args) {
            clip.on( 'dataRequested',   function(client, args) {
                clip.setText(copyText);
            });

            clip.on( 'complete',        function(client, args) {
                _this.showCopiedNotification();
            });

            clip.on( 'mouseover',       function(client, args) {
            });

            clip.on( 'mouseout',        function(client, args) {
            });

            clip.on( 'mousedown',       function(client, args) {
            });

            clip.on( 'mouseup',         function(client, args) {
            });

            clip.on( 'noflash',         function(client, args) {
                console.warn("NO flash version");
                //TODO BRN: Hide copy link button
            });

            clip.on( 'wrongflash',      function(client, args) {
                console.warn("Unsupported flash version");
            });
        });

        // botton.on("resize", function(event){
        //     clip.reposition();
        // });
    },

    /**
     * @private
     */
    destroyZeroClipboard: function() {
        this.clip = null;
    },

    /**
     * @private
     */
    showCopiedNotification: function() {
        var parentContainer         = this.getContainerParent();
        var notificationView        = parentContainer.getNotificationView();
        notificationView.flashMessage("Room url copied to clipboard.", 1000);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ShareRoomContainer).with(
    autowired().properties([
        property("airbugClientConfig").ref("airbugClientConfig"),
        property("navigationModule").ref("navigationModule"),
        property("windowUtil").ref("windowUtil")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ShareRoomContainer", ShareRoomContainer);
