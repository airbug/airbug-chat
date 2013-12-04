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
//@Require('airbug.DropdownViewEvent')
//@Require('airbug.FauxTextAreaView')
//@Require('airbug.IconView')
//@Require('airbug.ParagraphView')
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
var DropdownViewEvent           = bugpack.require('airbug.DropdownViewEvent');
var FauxTextAreaView            = bugpack.require('airbug.FauxTextAreaView');
var IconView                    = bugpack.require('airbug.IconView');
var ParagraphView               = bugpack.require('airbug.ParagraphView');
var TextView                    = bugpack.require('airbug.TextView');
var AutowiredAnnotation         = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer           = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');
var ZeroClipboard               = bugpack.require('zeroclipboard.ZeroClipboard');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired   = AutowiredAnnotation.autowired;
var bugmeta     = BugMeta.context();
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
         * @type {zeroclipboard.ZeroClipboard}
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
                    //TODO BRN: This needs to be encapsulated in it's own view so that it can react to model changes
                    view(BoxView)
                        .children([
                            view(ParagraphView)
                                .attributes({text: "Share room " + this.roomModel.getProperty("name")}),
                            view(FauxTextAreaView)
                                .children([
                                    view(ParagraphView)
                                    .attributes({
                                        text: "http://airbug.com/app#room/" + this.roomModel.getProperty("id")
                                    })
                                ]),
                            view(CopyToClipboardButtonView)
                                .attributes({type: "primary", align: "right", size: ButtonView.Size.NORMAL})
                                .children([
                                    view(TextView)
                                        .attributes({text: " Copy Link"})
                                        .appendTo('*[id|="button"]'),
                                    view(IconView)
                                        .attributes({
                                            type: IconView.Type.PAPERCLIP,
                                            color: IconView.Color.WHITE})
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
        //TODO
    },

    /**
     * @private
     */
    createZeroClipboard: function() {
        var button      = this.getViewTop().$el.find('.btn')[0];
        var copyText    = "http://airbug.com/app#room/" + this.roomModel.getProperty("id");
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
    destroyZeroClipboard: function() {
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
        this._super();
        var fauxTextArea = this.dropdownItemView.$el.find(".faux-textarea p");
        fauxTextArea.on("click", function() {
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


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(AddRoomMemberContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AddRoomMemberContainer", AddRoomMemberContainer);
