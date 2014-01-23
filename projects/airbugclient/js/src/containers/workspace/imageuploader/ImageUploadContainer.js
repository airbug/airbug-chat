//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ImageUploadContainer')

//@Require('Class')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.ButtonGroupView')
//@Require('airbug.ButtonToolbarView')
//@Require('airbug.CommandModule')
//@Require('airbug.IconView')
//@Require('airbug.ImagePreviewContainer')
//@Require('airbug.ImageUploadAddByUrlContainer')
//@Require('airbug.ImageUploadItemContainer')
//@Require('airbug.ImageUploadView')
//@Require('airbug.NakedButtonView')
//@Require('airbug.TextView')
//@Require('airbug.WorkspaceCloseButtonContainer')
//@Require('bugflow.BugFlow')
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
var ButtonViewEvent                     = bugpack.require('airbug.ButtonViewEvent');
var ButtonGroupView                     = bugpack.require('airbug.ButtonGroupView');
var ButtonToolbarView                   = bugpack.require('airbug.ButtonToolbarView');
var CommandModule                       = bugpack.require('airbug.CommandModule');
var IconView                            = bugpack.require('airbug.IconView');
var ImagePreviewContainer               = bugpack.require('airbug.ImagePreviewContainer');
var ImageUploadAddByUrlContainer        = bugpack.require('airbug.ImageUploadAddByUrlContainer');
var ImageUploadItemContainer            = bugpack.require('airbug.ImageUploadItemContainer');
var ImageUploadView                     = bugpack.require('airbug.ImageUploadView');
var NakedButtonView                     = bugpack.require('airbug.NakedButtonView');
var TextView                            = bugpack.require('airbug.TextView');
var WorkspaceCloseButtonContainer       = bugpack.require('airbug.WorkspaceCloseButtonContainer');
var BugFlow                             = bugpack.require('bugflow.BugFlow');
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
var $series                             = BugFlow.$series;
var $task                               = BugFlow.$task;
var autowired                           = AutowiredAnnotation.autowired;
var bugmeta                             = BugMeta.context();
var CommandType                         = CommandModule.CommandType;
var property                            = PropertyAnnotation.property;
var view                                = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ImageUploadContainer = Class.extend(CarapaceContainer, {

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
        this.assetManagerModule             = null;

        /**
         * @private
         * @type {CommandModule}
         */
        this.commandModule                  = null;

        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ImageUploadView}
         */
        this.imageUploadView                = null;

        /**
         * @private
         * @type {NakedButtonView}
         */
        this.imageListLinkButtonView        = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ImageUploadAddByUrlContainer}
         */
        this.imageUploadAddByUrlContainer   = null;

        /**
         * @private
         * @type {WorkspaceCloseButtonContainer}
         */
        this.closeButton                    = null;
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
        this.initializeUploadWidget();
    },

    deactivateContainer: function() {
        this._super();
        this.deinitializeUploadWidget();
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

        this.imageUploadView =
            view(ImageUploadView)
                .id("image-upload-container")
                .children([
                    view(ButtonToolbarView)
                        .appendTo(".box-header")
                        .children([
                            view(ButtonGroupView)
                                .appendTo(".btn-toolbar")
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
                                                    type: IconView.Type.UPLOAD,
                                                    color: IconView.Color.WHITE
                                                })
                                                .appendTo('button[id|="button"]'),
                                            view(TextView)
                                                .attributes({
                                                    text: " Upload"
                                                })
                                                .appendTo('button[id|="button"]')
                                        ])
                                ]),
                            view(ButtonGroupView)
                                .appendTo(".btn-toolbar")
                                .children([
                                    view(NakedButtonView)
                                        .id("image-list-link-button")
                                        .attributes({
                                            size: NakedButtonView.Size.SMALL
                                        })
                                        .children([
                                            view(IconView)
                                                .appendTo('#image-list-link-button')
                                                .attributes({
                                                    type: IconView.Type.PICTURE
                                                }),
                                            view(TextView)
                                                .appendTo('#image-list-link-button')
                                                .attributes({
                                                    text: "Image List"
                                                })
                                        ])
                                ])
                        ])
                ])
                .build();

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.imageUploadView);

        this.imageListLinkButtonView    = this.findViewById("image-list-link-button");
    },

    createContainerChildren: function() {
        this._super();
        this.closeButton = new WorkspaceCloseButtonContainer();
        this.imageUploadAddByUrlContainer = new ImageUploadAddByUrlContainer();
        this.addContainerChild(this.imageUploadAddByUrlContainer, "#file-upload-widget");
        this.addContainerChild(this.closeButton, ".box-header .btn-toolbar .btn-group:last-child")
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

    initializeUploadWidget: function() {
        var _this = this;
        $('#file-upload-widget').fileupload({
            url: 'api/uploadAsset',
            type: 'POST',
            singleFileUploads: true,
            sequentialUploads: true,
            dataType: 'json',
            dropzone: $(".image-upload-dropzone"),
            pastezone: _this.viewTop.$el.find("#image-upload-container .box-body"),
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 5000000, // 5 MB
            // Enable image resizing, except for Android and Opera,
            // which actually support image resizing, but fail to
            // send Blob objects via XHR requests:
            disableImageResize: /Android(?!.*Chrome)|Opera/
                .test(window.navigator.userAgent),
            previewMaxWidth: 100,
            previewMaxHeight: 100,
            previewCrop: true,
//            autoupload: false, //default true
//            formData: {script: true},
            progressInterval: 100,
            progress: function (event, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10) + "%";
                data.context.find(".bar").attr("style", "width: " + progress);
                if(progress === "100%"){
                    data.context.find(".cancel-button").hide();
                }
            },
            progressall: function (event, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10) + "%";
            },
            // callbacks in chronological order
            drop: function(event, data){
                data.files[0].autoSend = !!$(event.originalEvent.delegatedEvent.target).parents(".chat-widget-messages.image-upload-dropzone")[0];
            },
            add: function (event, data) {
                _this.hideDragAndDropText();

                var file = data.files[0];
                var filename = file.name;

                var imageAssetModel = _this.assetManagerModule.generateImageAssetModel({name: filename});
                var imageUploadItemContainer = new ImageUploadItemContainer(imageAssetModel);
                _this.addContainerChild(imageUploadItemContainer, "#image-upload-container>.box-body>.box")

                //hide send button if this is a drop from the chat messages div
                data.context = imageUploadItemContainer.getViewTop().$el;
                data.originalFiles[0].imageUploadItemContainer = imageUploadItemContainer;

                if (data.autoUpload || (data.autoUpload !== false &&
                    $(this).fileupload('option', 'autoUpload'))) {
                    data.process().done(function () {
                        /** @type {{files: Array}} data, @type {string} status, @type {{}} jqXHR **/
                        data.submit().done(function(data, status, jqXHR) {

                        });
                    });
                }
            },
            start: function(event) {
                console.log("processing started");
                console.log("event:", event);
            },
            send: function(event, data) {
                console.log("sending");
                console.log("event:", event);
                console.log("data:", data);
            },
            fail: function(event, data) {
                console.log("upload failed");
                console.log("event:", event);
                console.log("data:", data);
//                                $(data.context[index]).find(".failed-indicator").attr("style", "");
            },
            always: function(event, data) {
                console.log("always");
                console.log("event:", event);
                console.log("data:", data);
            },
            done: function (event, data) {
                if(data.result.files){
                    $.each(data.result.files, function (index, file) {
                        _this.handleUploadDoneEvent(data, index, file);
                    });
                }
            }
        });
    },

    deinitializeUploadWidget: function() {
        $('#file-upload-widget').fileupload('destroy');
    },

    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    initializeEventListeners: function() {
        this.imageListLinkButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.handleUploadListLinkButtonClicked, this);
        this.imageUploadAddByUrlContainer.getViewTop().addEventListener(ButtonViewEvent.EventType.CLICKED, this.handleAddByUrlButtonClicked, this);
        this.imageUploadAddByUrlContainer.getViewTop().addEventListener("AddByUrlCompleted", this.handleAddByUrlCompletedEvent, this);
    },

    deinitializeEventListeners: function() {
        this.imageListLinkButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.handleUploadListLinkButtonClicked, this);
        this.imageUploadAddByUrlContainer.getViewTop().removeEventListener(ButtonViewEvent.EventType.CLICKED, this.handleAddByUrlButtonClicked, this);
        this.imageUploadAddByUrlContainer.getViewTop().removeEventListener("AddByUrlCompleted", this.handleAddByUrlCompletedEvent, this);
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

    handleUploadListLinkButtonClicked: function(event) {
        this.commandModule.relayCommand(CommandType.DISPLAY.IMAGE_LIST, {});
    },

    handleAddByUrlButtonClicked: function(event) {
        var data = event.getData();
        var imageUploadItemContainer = data.imageUploadItemContainer;

        this.getViewTop().$el.find(".box-body .box>span").hide();
        this.addContainerChild(imageUploadItemContainer, "#image-upload-container .box-body .box")
    },

    handleAddByUrlCompletedEvent: function(event) {
        var data = event.getData();
        var url = data.url;
        var selector = '.file-upload-item:contains(' + url + ')';
        var node = $(selector);
        node.find(".bar").attr("style", "width: 100%");
        node.find(".cancel-button").hide();

        var context = {
            context: [selector],
            originalFiles: [data]
        };
        this.handleUploadDoneEvent(context, 0, data);
    },

    handleUploadDoneEvent: function(data, index, file) {
        var _this = this;
        var assetId = file._id || file.id;
        var imageUploadItemContainer = data.originalFiles[index].imageUploadItemContainer;
        var imageAssetModel = imageUploadItemContainer.getImageAssetModel();

        console.log("assetId:", assetId);

        this.assetManagerModule.retrieveAsset(assetId, function(throwable, meldDocument){
                $(data.context[index]).find(".progress").hide();

                if(!throwable){
                    $(data.context[index]).find(".success-indicator").attr("style", "");

                    imageAssetModel.setAssetMeldDocument(meldDocument);
                    var imagePreviewContainer = new ImagePreviewContainer(imageAssetModel);
                    imageUploadItemContainer.prependContainerChildTo(imagePreviewContainer, "div.image-upload-item");
                    imageUploadItemContainer.addToolbarContainer();

                    if(data.originalFiles[index].autoSend){
                        imageUploadItemContainer.sendImageChatMessage();
                    }

                    _this.createUserAssetAndUserAssetModel(assetId, imageAssetModel, function(throwable, userAssetId, imageAssetModel){
                        if(!throwable){
                            console.log("user asset created");
                        }
                    });
                } else {
//                                $(data.context[index]).find(".failed-indicator").attr("style", "");
                }
        });
    },


    createUserAssetAndUserAssetModel: function(assetId, imageAssetModel, callback){
        var currentUserManagerModule    = this.currentUserManagerModule;
        var userAssetManagerModule      = this.userAssetManagerModule;
        var userAssetData = {
            assetId: assetId
        };
        var userAssetId = null;

        $series([
            $task(function(flow){
                currentUserManagerModule.retrieveCurrentUser(function(throwable, currentUser){
                    if(!throwable){
                        userAssetData.userId = currentUser.getId();
                    }

                    flow.complete(throwable);
                });
            }),
            $task(function(flow){
                console.log("userAssetData:", userAssetData);
                userAssetManagerModule.createUserAsset(userAssetData, function(throwable, meldDocument){
                    var data = meldDocument.getData();

                    if(!throwable){
                        userAssetId = data.id;
                    }

                    flow.complete(throwable);
                });
            })
        ])
        .execute(function(throwable){
                console.log("throwable:", throwable, "userAssetId:", userAssetId, "imageAssetModel:", imageAssetModel);
            callback(throwable, userAssetId, imageAssetModel);
        });
    },

    handleAddByUrlFailedEvent: function(event) {
        //TODO: SUNG
    },

    hideDragAndDropText: function() {
        this.viewTop.$el.find(".box-body .box>span").hide();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ImageUploadContainer).with(
    autowired().properties([
        property("assetManagerModule").ref("assetManagerModule"),
        property("commandModule").ref("commandModule"),
        property("currentUserManagerModule").ref("currentUserManagerModule"),
        property("userAssetManagerModule").ref("userAssetManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ImageUploadContainer", ImageUploadContainer);
