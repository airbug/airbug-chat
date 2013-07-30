//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AddRoomMemberContainer')

//@Require('Class')
//@Require('airbug.BoxView')
//@Require('airbug.ButtonView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CopyToClipboardButtonView')
//@Require('airbug.DropdownItemView')
//@Require('airbug.FauxTextAreaView')
//@Require('airbug.IconView')
//@Require('airbug.ParagraphView')
//@Require('annotate.Annotate')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')
//@Require('zeroclipboard.ZeroClipboard')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var BoxView                     = bugpack.require('airbug.BoxView');
var ButtonView                  = bugpack.require('airbug.ButtonView');
var ButtonViewEvent             = bugpack.require('airbug.ButtonViewEvent');
var CopyToClipboardButtonView   = bugpack.require('airbug.CopyToClipboardButtonView');
var DropdownItemView            = bugpack.require('airbug.DropdownItemView');
var FauxTextAreaView            = bugpack.require('airbug.FauxTextAreaView');
var IconView                    = bugpack.require('airbug.IconView');
var ParagraphView               = bugpack.require('airbug.ParagraphView');
var Annotate                    = bugpack.require('annotate.Annotate');
var AutowiredAnnotation         = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
var CarapaceContainer           = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');
var ZeroClipboard               = bugpack.require('zeroclipboard.ZeroClipboard');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate    = Annotate.annotate;
var autowired   = AutowiredAnnotation.autowired;
var property    = PropertyAnnotation.property;
var view        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AddRoomMemberContainer = Class.extend(CarapaceContainer, {

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
         * @type {NavigationModule}
         */
        this.navigationModule   = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {DropdownItemView}
         */
        this.dropdownItemView   = null;

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
    createContainer: function() {
        this._super();

        // Create Views
        //-------------------------------------------------------------------------------

        this.dropdownItemView =
            view(DropdownItemView)
                .children([
                    view(BoxView)
                        .children([
                            view(ParagraphView)
                                .attributes({text: "Share room " + this.roomModel.get("name")}),
                            view(FauxTextAreaView)
                                .children([
                                    view(ParagraphView)
                                    .attributes({
                                        text: "http://airbug.com/app#room/" + this.roomModel.get("_id")
                                    })
                                ]),
                            view(CopyToClipboardButtonView)
                                .attributes({type: "primary", align: "right", size: ButtonView.Size.NORMAL})
                                .children([
                                    view(IconView)
                                        .attributes({type: IconView.Type.SHARE, color: IconView.Color.WHITE})
                                        .appendTo('*[id|="button"]'),
                                    view(TextView)
                                        .attributes({text: " Copy Link"})
                                        .appendTo('*[id|="button"]')
                                ])
                        ])
                ])
            .build();

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.dropdownItemView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        // NOTE: For future refactor (pull out zeroClipboard butons into its own container)
        // var button      = this.getViewTop().$el.find('.btn')[0];
        // var copyText    = "http://airbug.com/app#room/" + this.roomModel.get("_id");
        // var options     = {
        //       moviePath: "/zeroclipboard/ZeroClipboard.swf"
        // };
        // this.copyLinkButtonContainer = new CopyLinkButtonContainer(button, options, copyText);
        // this.addContainerChild(this.copyLinkButtonContainer, "??????")
    },

    /**
     * @private
     */
    createZeroClipboard: function(){
        var _this = this;
        var button      = this.getViewTop().$el.find('.btn')[0];
        var copyText    = "http://airbug.com/app#room/" + this.roomModel.get("_id");
        var options     = {
              moviePath: "/zeroclipboard/ZeroClipboard.swf"
        };

        this.clip        = new ZeroClipboard(button, options);
        var clip = this.clip;

        clip.on( 'dataRequested',   function(client, args) {
            clip.setText(copyText);
        });

        clip.on( 'load',            function(client, args) {
        });

        clip.on( 'complete',        function(client, args) {
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
        });

        clip.on( 'wrongflash',      function(client, args) {
        });

        // botton.on("resize", function(event){
        //     clip.reposition();
        // });
    },

    /**
     * @private
     */
    destroyZeroClipboard: function(){
        this.clip = null;
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.createZeroClipboard();
        this.dropdownItemView.addEventListener(DropdownViewEvent.EventType.DROPDOWN_SELECTED, this.hearDropdownItemClickedEvent, this);
    },

    activateContainer: function() {
        var _this = this;
        this._super();
        var fauxTextArea = this.dropdownItemView.$el.find(".faux-textarea p");
        fauxTextArea.on("click", function(){
            fauxTextArea.selectText();
        });
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.destroyZeroClipboard();
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {DropdownViewEvent} event
     */
    hearDropdownItemClickedEvent: function(event) {

    }
});

annotate(AddRoomMemberContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AddRoomMemberContainer", AddRoomMemberContainer);
