//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ImageUploadAddByUrlContainer')

//@Require('Class')
//@Require('Event')
//@Require('airbug.ButtonGroupView')
//@Require('airbug.ButtonToolbarView')
//@Require('airbug.CommandModule')
//@Require('airbug.ControlsView')
//@Require('airbug.FormControlGroupView')
//@Require('airbug.IconView')
//@Require('airbug.ImageUploadItemContainer')
//@Require('airbug.InputView')
//@Require('airbug.LabelView')
//@Require('airbug.NakedButtonView')
//@Require('airbug.TextView')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')
//@Require('jquery.JQuery')
//@Require('fileupload.FileUpload')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var Event                               = bugpack.require('Event');
var ButtonGroupView                     = bugpack.require('airbug.ButtonGroupView');
var ButtonToolbarView                   = bugpack.require('airbug.ButtonToolbarView');
var CommandModule                       = bugpack.require('airbug.CommandModule');
var ControlsView                        = bugpack.require('airbug.ControlsView');
var FormControlGroupView                = bugpack.require('airbug.FormControlGroupView');
var IconView                            = bugpack.require('airbug.IconView');
var ImageUploadItemContainer            = bugpack.require('airbug.ImageUploadItemContainer');
var InputView                           = bugpack.require('airbug.InputView');
var LabelView                           = bugpack.require('airbug.LabelView');
var NakedButtonView                     = bugpack.require('airbug.NakedButtonView');
var TextView                            = bugpack.require('airbug.TextView');
var AutowiredAnnotation                 = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation                  = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer                   = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');
var jQuery                              = bugpack.require('jquery.JQuery');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $                                   = jQuery;
var autowired                           = AutowiredAnnotation.autowired;
var bugmeta                             = BugMeta.context();
var CommandType                         = CommandModule.CommandType;
var property                            = PropertyAnnotation.property;
var view                                = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ImageUploadAddByUrlContainer = Class.extend(CarapaceContainer, {

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
         * @type {AssetManagerModule}
         */
        this.assetManagerModule         = null;

        /**
         * @private
         * @type {CommandModule}
         */
        this.commandModule              = null;

        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ButtonToolbarView}
         */
        this.buttonToolbarView          = null;

        /**
         * @private
         * @type {InputView}
         */
        this.inputView                  = null;

        /**
         * @private
         * @type {NakedButtonView}
         */
        this.submitButtonView           = null;

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

        this.buttonToolbarView =
            view(ButtonToolbarView)
                .children([
                    view(ButtonGroupView)
                        .appendTo(".btn-toolbar")
                        .children([
                            view(FormControlGroupView)
                                .id("image-upload-add-by-url-container")
                                .attributes({classes: "btn btn-large btn-inverse disabled"})
                                .children([
                                    view(LabelView)
                                        .attributes({
                                            text: "URL:",
                                            for: "url",
                                            classes: "control-label"
                                        }),
                                    view(ControlsView)
                                        .children([
                                            view(InputView)
                                                .id("image-upload-add-by-url-input")
                                                .attributes({
                                                    type: "text",
                                                    name: "url"
                                                }),
                                                view(NakedButtonView)
                                                    .id("image-upload-add-by-url-submit-button")
                                                    .attributes({
                                                        type: NakedButtonView.Type.SUCCESS,
                                                        size: NakedButtonView.Size.SMALL
                                                    })
                                                    .children([
                                                        view(IconView)
                                                            .attributes({
                                                                type: IconView.Type.PLUS,
                                                                color: IconView.Color.WHITE
                                                            })
                                                            .appendTo("#image-upload-add-by-url-submit-button")
                                                    ])
                                        ])

                                ])
                        ])
                ])
                .build();

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.buttonToolbarView);

        this.submitButtonView   = this.findViewById("image-upload-add-by-url-submit-button");
        this.inputView          = this.findViewById("image-upload-add-by-url-input");
    },

    createContainerChildren: function() {
        this._super();
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.initializeEventListeners();
        this.initializeCommandSubscriptions();
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.deinitializeEventListeners();
        this.deinitializeCommandSubscriptions();
    },

    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    initializeEventListeners: function() {
        this.submitButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.handleSubmitButtonClicked, this);
    },

    deinitializeEventListeners: function() {
        this.submitButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.handleSubmitButtonClicked, this);
    },

    /**
     * @private
     */
    initializeCommandSubscriptions: function() {

    },

    /**
     * @private
     */
    deinitializeCommandSubscriptions: function() {

    },

    //-------------------------------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------------------------------

    handleSubmitButtonClicked: function(event) {
        var _this = this;
        var url = this.getInputValue();

        this.assetManagerModule.addAssetFromUrl(url, function(throwable, meldDocument){
            console.log("addAssetFromUrl callback");
            console.log("throwable:", throwable, "meldDocument:", meldDocument);
            if(!throwable && meldDocument) {
                _this.getViewTop().dispatchEvent(new Event("AddByUrlCompleted", {url: url}));
            }
        });

        event.getData().imageUploadItemContainer = new ImageUploadItemContainer(url);
    },

    /**
     * @private
     * @returns {string}
     */
    getInputValue: function() {
        return this.inputView.$el[0].value;
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ImageUploadAddByUrlContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule"),
        property("assetManagerModule").ref("assetManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ImageUploadAddByUrlContainer", ImageUploadAddByUrlContainer);
