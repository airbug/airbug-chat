//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ImageUploadAddByUrlContainer')

//@Require('Class')
//@Require('Event')
//@Require('airbug.ButtonGroupView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.ButtonToolbarView')
//@Require('airbug.CommandModule')
//@Require('airbug.ControlsView')
//@Require('airbug.FormControlGroupView')
//@Require('airbug.IconView')
//@Require('airbug.ImageAssetModel')
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
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                               = bugpack.require('Class');
    var Event                               = bugpack.require('Event');
    var ButtonGroupView                     = bugpack.require('airbug.ButtonGroupView');
    var ButtonViewEvent                     = bugpack.require('airbug.ButtonViewEvent');
    var ButtonToolbarView                   = bugpack.require('airbug.ButtonToolbarView');
    var CommandModule                       = bugpack.require('airbug.CommandModule');
    var ControlsView                        = bugpack.require('airbug.ControlsView');
    var FormControlGroupView                = bugpack.require('airbug.FormControlGroupView');
    var IconView                            = bugpack.require('airbug.IconView');
    var ImageAssetModel                     = bugpack.require('airbug.ImageAssetModel');
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

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var ImageUploadAddByUrlContainer = Class.extend(CarapaceContainer, {

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
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createContainer: function() {
            this._super();

            // Create Views
            //-------------------------------------------------------------------------------

            view(ButtonToolbarView)
                .name("buttonToolbarView")
                .children([
                    view(ButtonGroupView)
                        .appendTo("#button-toolbar-{{cid}}")
                        .children([
                            view(FormControlGroupView)
                                .id("image-upload-add-by-url-container")
                                .appendTo("#button-group-{{cid}}")
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
                .build(this);

            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.buttonToolbarView);

            this.submitButtonView   = this.findViewById("image-upload-add-by-url-submit-button");
            this.inputView          = this.findViewById("image-upload-add-by-url-input");
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.submitButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.handleSubmitButtonClicked, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.submitButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.handleSubmitButtonClicked, this);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @returns {string}
         */
        getInputValue: function() {
            return this.inputView.$el[0].value;
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Event} event
         */
        handleSubmitButtonClicked: function(event) {
            var _this = this;
            var data = {};
            var url = this.getInputValue();
            var imageAssetModel = new ImageAssetModel({name: url});
            var imageUploadItemContainer = new ImageUploadItemContainer(imageAssetModel);
            event.getData().imageUploadItemContainer = new ImageUploadItemContainer(imageAssetModel);

            data.url = url;
            data.imageUploadItemContainer = imageUploadItemContainer;
            this.assetManagerModule.addAssetFromUrl(url, function(throwable, meldDocument){
                console.log("addAssetFromUrl callback");
                console.log("throwable:", throwable, "meldDocument:", meldDocument);
                if(!throwable && meldDocument) {
                    var assetId = meldDocument.getData().objectId;
                    data.id = assetId;
                    _this.getViewTop().dispatchEvent(new Event("AddByUrlCompleted", data));
                }
            });

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
});
