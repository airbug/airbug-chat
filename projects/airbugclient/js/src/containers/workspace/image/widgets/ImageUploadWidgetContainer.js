//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ImageUploadWidgetContainer')

//@Require('Class')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.ButtonGroupView')
//@Require('airbug.ButtonToolbarView')
//@Require('airbug.CommandModule')
//@Require('airbug.IconView')
//@Require('airbug.ImagePreviewContainer')
//@Require('airbug.ImageUploadAddByUrlContainer')
//@Require('airbug.ImageUploadItemContainer')
//@Require('airbug.ImageUploadWidgetView')
//@Require('airbug.NakedButtonView')
//@Require('airbug.TabsView')
//@Require('airbug.TabView')
//@Require('airbug.TabViewEvent')
//@Require('airbug.TextView')
//@Require('airbug.WorkspaceCloseButtonContainer')
//@Require('airbug.WorkspaceWidgetContainer')
//@Require('bugflow.BugFlow')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ViewBuilder')
//@Require('jquery.JQuery')
//@Require('fileupload.FileUpload')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


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
var ImageUploadWidgetView               = bugpack.require('airbug.ImageUploadWidgetView');
var NakedButtonView                     = bugpack.require('airbug.NakedButtonView');
var TabsView                            = bugpack.require('airbug.TabsView');
var TabView                             = bugpack.require('airbug.TabView');
var TabViewEvent                        = bugpack.require('airbug.TabViewEvent');
var TextView                            = bugpack.require('airbug.TextView');
var WorkspaceCloseButtonContainer       = bugpack.require('airbug.WorkspaceCloseButtonContainer');
var WorkspaceWidgetContainer            = bugpack.require('airbug.WorkspaceWidgetContainer');
var BugFlow                             = bugpack.require('bugflow.BugFlow');
var AutowiredAnnotation                 = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation                  = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');
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

/**
 * @class
 * @extends {WorkspaceWidgetContainer}
 */
var ImageUploadWidgetContainer = Class.extend(WorkspaceWidgetContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

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
         * @type {ImageUploadWidgetView}
         */
        this.imageUploadWidgetView          = null;

        /**
         * @private
         * @type {TabView}
         */
        this.imageListTabView               = null;

        /**
         * @private
         * @type {ButtonGroupView}
         */
        this.widgetControlButtonGroupView   = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {WorkspaceCloseButtonContainer}
         */
        this.closeButtonContainer           = null;

        /**
         * @private
         * @type {ImageUploadAddByUrlContainer}
         */
        this.imageUploadAddByUrlContainer   = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        this._super(routerArgs);
        this.initializeUploadWidget();
    },

    /**
     * @protected
     */
    deactivateContainer: function() {
        this._super();
        this.deinitializeUploadWidget();
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Views
        //-------------------------------------------------------------------------------

        view(ImageUploadWidgetView)
            .name("imageUploadWidgetView")
            .children([
                view(TabsView)
                    .name("tabsView")
                    .appendTo("#box-header-{{cid}}")
                    .children([
                        view(TabView)
                            .name("imageListTabView")
                            .children([
                                view(IconView)
                                    .appendTo('a')
                                    .attributes({
                                        type: IconView.Type.PICTURE
                                    }),
                                view(TextView)
                                    .appendTo('a')
                                    .attributes({
                                        text: "Image List"
                                    })
                            ]),
                        view(TabView)
                            .name("imageUploadTabView")
                            .attributes({
                                classes: "disabled active"
                            })
                            .children([
                                view(IconView)
                                    .attributes({
                                        type: IconView.Type.UPLOAD
                                    })
                                    .appendTo('a'),
                                view(TextView)
                                    .attributes({
                                        text: " Upload"
                                    })
                                    .appendTo('a')
                            ])
                        ]),
                view(ButtonToolbarView)
                    .appendTo("#box-header-{{cid}}")
                    .children([
                        view(ButtonGroupView)
                            .name("widgetControlButtonGroupView")
                            .appendTo("#button-toolbar-{{cid}}")
                    ])
            ])
            .build(this);

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.imageUploadWidgetView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.closeButtonContainer = new WorkspaceCloseButtonContainer();
        this.imageUploadAddByUrlContainer = new ImageUploadAddByUrlContainer();
        this.addContainerChild(this.imageUploadAddByUrlContainer, "#image-upload-from-url-" + this.imageUploadWidgetView.getCid());
        this.addContainerChild(this.closeButtonContainer, "#button-group-" + this.widgetControlButtonGroupView.getCid())
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.imageListTabView.removeEventListener(TabViewEvent.EventType.CLICKED, this.handleUploadListLinkButtonClicked, this);
        this.imageUploadAddByUrlContainer.getViewTop().removeEventListener(ButtonViewEvent.EventType.CLICKED, this.handleAddByUrlButtonClicked, this);
        this.imageUploadAddByUrlContainer.getViewTop().removeEventListener("AddByUrlCompleted", this.handleAddByUrlCompletedEvent, this);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();

        this.imageListTabView.addEventListener(TabViewEvent.EventType.CLICKED, this.handleUploadListLinkButtonClicked, this);
        this.imageUploadAddByUrlContainer.getViewTop().addEventListener(ButtonViewEvent.EventType.CLICKED, this.handleAddByUrlButtonClicked, this);
        this.imageUploadAddByUrlContainer.getViewTop().addEventListener("AddByUrlCompleted", this.handleAddByUrlCompletedEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    deinitializeUploadWidget: function() {
        $('#file-upload-widget').fileupload('destroy');
    },

    /**
     * @private
     */
    initializeUploadWidget: function() {
        var _this = this;
        $('#file-upload-widget').fileupload({
            url: 'api/uploadAsset',
            type: 'POST',
            singleFileUploads: true,
            sequentialUploads: true,
            dataType: 'json',
            dropzone: this.imageUploadWidgetView.getImageUploadDropzoneElement(),
            pastezone: this.imageUploadWidgetView.getImageUploadDropzoneElement(),
//            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i, //does not work without jquery ui components
//            maxFileSize: 5000000, // 5 MB //does not work without jquery ui components
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

                //validate file type and size
                var uploadErrors = [];
                var acceptFileTypes = /(\.|\/)(gif|jpe?g|png)$/i;
                var maxFileSize     = 5000000;
                if(data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
                    uploadErrors.push('File is not of an accepted file type');
                }
                if(data.originalFiles[0]['size'].length && data.originalFiles[0]['size'] > maxFileSize) {
                    uploadErrors.push('File size of exceeds file size limit of ' + maxFileSize);
                }

                if(uploadErrors.length > 0) {
                    _this.commandModule.relayCommand(CommandType.FLASH.ERROR, {message: uploadErrors.join("\n")});
                } else {

                    var file = data.files[0];
                    var filename = file.name;
                    var imageAssetModel = _this.assetManagerModule.generateImageAssetModel({name: filename});
                    var imageUploadItemContainer = new ImageUploadItemContainer(imageAssetModel);
                    _this.addContainerChild(imageUploadItemContainer, "#image-upload-list-" + _this.imageUploadWidgetView.getCid())

                    //hide send button if this is a drop from the chat messages div
                    data.context = imageUploadItemContainer.getViewTop().$el;
                    data.originalFiles[0].imageUploadItemContainer = imageUploadItemContainer;

                    if (data.autoUpload || (data.autoUpload !== false && $(this).fileupload('option', 'autoUpload'))) {
                        data.process().done(function () {

                            imageUploadItemContainer.getViewTop().$el.find(".status-message").text("uploading...");
                            /** @type {{files: Array}} data, @type {string} status, @type {{}} jqXHR **/
                            data.submit().done(function(data, status, jqXHR) {

                            });
                        });
                    }

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



    //-------------------------------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    handleUploadListLinkButtonClicked: function(event) {
        this.commandModule.relayCommand(CommandType.DISPLAY.IMAGE_LIST, {});
    },

    /**
     * @private
     * @param {Event} event
     */
    handleAddByUrlButtonClicked: function(event) {
        var data = event.getData();
        var imageUploadItemContainer = data.imageUploadItemContainer;

        this.getViewTop().$el.find(".box-body .box>span").hide();
        this.addContainerChild(imageUploadItemContainer, "#image-upload-list-" + this.imageUploadWidgetView.getCid())
    },

    /**
     * @private
     * @param {Event} event
     */
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

    /**
     * @private
     * @param {} data
     * @param {} index
     * @param {} file
     */
    handleUploadDoneEvent: function(data, index, file) {
        var _this                       = this;
        var assetId                     = file._id || file.id;
        var imageUploadItemContainer    = data.originalFiles[index].imageUploadItemContainer;
        var imageAssetModel             = imageUploadItemContainer.getImageAssetModel();
        var statusMessage               = imageUploadItemContainer.getViewTop().$el.find(".status-message");

        console.log("assetId:", assetId);

        this.assetManagerModule.retrieveAsset(assetId, function(throwable, meldDocument){
            $(data.context[index]).find(".progress").hide();
            statusMessage.text("adding to your image list...");


            if(!throwable){
                $(data.context[index]).find(".success-indicator").attr("style", "");

                imageAssetModel.setAssetMeldDocument(meldDocument);
                var imagePreviewContainer = new ImagePreviewContainer(imageAssetModel);
                imageUploadItemContainer.prependContainerChildTo(imagePreviewContainer, "div.image-upload-item");
                imageUploadItemContainer.showToolbarContainer();

                if(data.originalFiles[index].autoSend){
                    imageUploadItemContainer.sendImageChatMessage();
                }

                _this.createUserAsset(assetId, function(throwable){
                    if(!throwable){
                        setTimeout(function() {
                            statusMessage.text("completed");
                            statusMessage.fadeOut(3000, function() {
                                statusMessage.remove();
                            });
                        },2000);
                    } else {
                        _this.commandModule.relayCommand(CommandType.FLASH.ERROR, {message: throwable.getMessage()});
                    }
                });
            } else {
                statusMessage.text("upload failed!");
//                                $(data.context[index]).find(".failed-indicator").attr("style", "");
            }
        });
    },

    /**
     * @param {string} assetId
     * @param {function(Throwable, string)} callback
     */
    createUserAsset: function(assetId, callback) {
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
                callback(throwable, userAssetId);
            });
    },

    /**
     * @private
     */
    handleAddByUrlFailedEvent: function(event) {
        //TODO: SUNG
    },

    /**
     * @private
     */
    hideDragAndDropText: function() {
        this.viewTop.$el.find(".box-body .box>span").hide();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ImageUploadWidgetContainer).with(
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

bugpack.export("airbug.ImageUploadWidgetContainer", ImageUploadWidgetContainer);
