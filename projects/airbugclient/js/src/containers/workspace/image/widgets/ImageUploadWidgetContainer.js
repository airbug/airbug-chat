//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ImageUploadWidgetContainer')

//@Require('Class')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.ButtonGroupView')
//@Require('airbug.ButtonToolbarView')
//@Require('airbug.CommandModule')
//@Require('airbug.ControlsView')
//@Require('airbug.FormControlGroupView')
//@Require('airbug.IconView')
//@Require('airbug.ImageAssetModel')
//@Require('airbug.ImagePreviewContainer')
//@Require('airbug.ImageUploadItemContainer')
//@Require('airbug.ImageUploadWidgetView')
//@Require('airbug.InputView')
//@Require('airbug.LabelView')
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
//@Require('carapace.ModelBuilder')
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
    var ButtonViewEvent                     = bugpack.require('airbug.ButtonViewEvent');
    var ButtonGroupView                     = bugpack.require('airbug.ButtonGroupView');
    var ButtonToolbarView                   = bugpack.require('airbug.ButtonToolbarView');
    var CommandModule                       = bugpack.require('airbug.CommandModule');
    var ControlsView                        = bugpack.require('airbug.ControlsView');
    var FormControlGroupView                = bugpack.require('airbug.FormControlGroupView');
    var IconView                            = bugpack.require('airbug.IconView');
    var ImageAssetModel                     = bugpack.require('airbug.ImageAssetModel');
    var ImagePreviewContainer               = bugpack.require('airbug.ImagePreviewContainer');
    var ImageUploadItemContainer            = bugpack.require('airbug.ImageUploadItemContainer');
    var ImageUploadWidgetView               = bugpack.require('airbug.ImageUploadWidgetView');
    var InputView                           = bugpack.require('airbug.InputView');
    var LabelView                           = bugpack.require('airbug.LabelView');
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
    var ModelBuilder                        = bugpack.require('carapace.ModelBuilder');
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
    var model                               = ModelBuilder.model;
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
             * @type {ButtonToolbarView}
             */
            this.uploadByUrlButtonToolbarView   = null;

            /**
             * @private
             * @type {InputView}
             */
            this.uploadByUrlInputView           = null;

            /**
             * @private
             * @type {NakedButtonView}
             */
            this.uploadByUrlSubmitButtonView    = null;

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
                        ]),
                    view(ButtonToolbarView)
                        .name("buttonToolbarView")
                        .appendTo("#image-upload-from-url-{{cid}}")
                        .children([
                            view(ButtonGroupView)
                                .appendTo("#button-toolbar-{{cid}}")
                                .children([

                                    //TODO BRN: Fix this shit up...

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
                                                        .name("uploadByUrlInputView")
                                                        .attributes({
                                                            type: "text",
                                                            name: "url"
                                                        }),
                                                    view(NakedButtonView)
                                                        .name("uploadByUrlSubmitButtonView")
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
                                                                .appendTo("#button-{{cid}}")
                                                        ])
                                                ])

                                        ])
                                ])
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
            this.addContainerChild(this.closeButtonContainer, "#button-group-" + this.widgetControlButtonGroupView.getCid())
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.imageListTabView.removeEventListener(TabViewEvent.EventType.CLICKED, this.handleUploadListLinkButtonClicked, this);
            this.uploadByUrlSubmitButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.handleAddByUrlButtonClicked, this);
            this.deinitializeUploadWidget();
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.imageListTabView.addEventListener(TabViewEvent.EventType.CLICKED, this.handleUploadListLinkButtonClicked, this);
            this.uploadByUrlSubmitButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.handleAddByUrlButtonClicked, this);
            this.initializeUploadWidget();
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        deinitializeUploadWidget: function() {
            this.imageUploadWidgetView.getFileUploadWidgetElement().fileupload('destroy');
        },

        /**
         * @private
         * @returns {string}
         */
        getInputValue: function() {
            return this.uploadByUrlInputView.$el[0].value;
        },

        /**
         * @private
         */
        initializeUploadWidget: function() {
            var _this = this;
            this.imageUploadWidgetView.getFileUploadWidgetElement().fileupload({
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

                    //TODO BRN: Clean up this shit..

                    //validate file type and size
                    var uploadErrors = [];
                    var acceptFileTypes = /(\.|\/)(gif|jpe?g|png)$/i;
                    var maxFileSize     = 5000000;
                    if (data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
                        uploadErrors.push('File is not of an accepted file type');
                    }
                    if (data.originalFiles[0]['size'].length && data.originalFiles[0]['size'] > maxFileSize) {
                        uploadErrors.push('File size of exceeds file size limit of ' + maxFileSize);
                    }

                    if (uploadErrors.length > 0) {
                        _this.commandModule.relayCommand(CommandType.FLASH.ERROR, {message: uploadErrors.join("\n")});
                    } else {

                        var file = data.files[0];
                        var filename = file.name;
                        var imageAssetModel =
                            model(ImageAssetModel)
                                .data({name: filename})
                                .build(_this);
                        var imageUploadItemContainer = new ImageUploadItemContainer(imageAssetModel);
                        _this.addContainerChild(imageUploadItemContainer, "#image-upload-list-" + _this.imageUploadWidgetView.getCid());

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
            var _this           = this;
            var url             = this.getInputValue();
            var imageAssetModel =
                model(ImageAssetModel)
                    .data({name: url})
                    .build();
            var imageUploadItemContainer = new ImageUploadItemContainer(imageAssetModel);
            this.getViewTop().$el.find(".box-body .box>span").hide();
            this.addContainerChild(imageUploadItemContainer, "#image-upload-list-" + this.imageUploadWidgetView.getCid());
            this.assetManagerModule.addAssetFromUrl(url, function(throwable, meldDocument) {
                if (!throwable) {
                    var data = {
                        id: meldDocument.getData().objectId
                    };
                    var selector = '.file-upload-item:contains(' + url + ')';
                    var node = $(selector);
                    node.find(".bar").attr("style", "width: 100%");
                    node.find(".cancel-button").hide();

                    var context = {
                        context: [selector],
                        originalFiles: [data]
                    };
                    _this.handleUploadDoneEvent(context, 0, data);
                }
            });

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

                    //TODO BRN: This is super hacky. Fix it!
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
         * @param {function(Throwable, string=)} callback
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
                        if (!throwable) {
                            var data = meldDocument.getData();
                            userAssetId = data.id;
                        }
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable){
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
});
