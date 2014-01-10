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
//@Require('airbug.ImageUploadAddByUrlContainer')
//@Require('airbug.ImageUploadView')
//@Require('airbug.NakedButtonView')
//@Require('airbug.TextView')
//@Require('airbug.UploadView')
//@Require('airbug.WorkspaceCloseButtonContainer')
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
var ImageUploadAddByUrlContainer        = bugpack.require('airbug.ImageUploadAddByUrlContainer');
var ImageUploadView                     = bugpack.require('airbug.ImageUploadView');
var NakedButtonView                     = bugpack.require('airbug.NakedButtonView');
var TextView                            = bugpack.require('airbug.TextView');
var UploadView                          = bugpack.require('airbug.UploadView');
var WorkspaceCloseButtonContainer       = bugpack.require('airbug.WorkspaceCloseButtonContainer');
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
        //TODO SUNG Make sure deactivateContainer is called.
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
            url: 'app/uploadAsset',
            type: 'POST',
            singleFileUploads: true,
            sequentialUploads: true,
            dataType: 'json',
            dropzone: _this.viewTop.$el.find("#image-upload-container .box-body"),
            pastezone: _this.viewTop.$el.find("#image-upload-container .box-body"),
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 5000000, // 5 MB
            // Enable image resizing, except for Android and Opera,
            // which actually support image resizing, but fail to
            // send Blob objects via XHR requests:
            disableImageResize: /Android(?!.*Chrome)|Opera/
                .test(window.navigator.userAgent),
//            previewMaxWidth: 100,
//            previewMaxHeight: 100,
//            previewCrop: true,
//            autoupload: false,
//            formData: {script: true},
            progressInterval: 100,
            add: function (e, data) {
                console.log("file upload add");
                console.log("index:", data.index);
                console.log("data:", data);

                _this.viewTop.$el.find(".box-body .box>span").hide();
                var filename = data.files[0].name;
                console.log("filename:", filename);

                var uploadFileView = view(UploadView).attributes({filename: filename}).build();
                _this.imageUploadView.addViewChild(uploadFileView, "#image-upload-container .box-body .box");
                data.context = uploadFileView.$el;
                if (data.autoUpload || (data.autoUpload !== false &&
                    $(this).fileupload('option', 'autoUpload'))) {
                    data.process().done(function () {
                        data.submit();
                    });
                }
            },
            done: function (event, data) {
                console.log("event:", event, "data:", data);
                console.log("context:", data.context); //in the form of an array.
                if(data.result.files){
                    $.each(data.result.files, function (index, file) {
                        console.log("file upload done:", file.name);
                        $(data.context[index]).find(".success-indicator").attr("style", "");
                        $(data.context[index]).find(".progress").hide();
                    });
                }
            },
            process: function (e, data) {
                    console.log('Processing ' + data.files[data.index].name + '...');
            },
            progress: function (event, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10) + "%";
                data.context.find(".bar").attr("style", "width: " + progress);
                if(progress === "100%"){
                    data.context.find(".cancel-button").hide();
                }
            },
            progressall: function (event, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10) + "%";
                console.log("progressall:", progress);
            }
        }).on("fileuploadprocessalways", function (e, data) {
            var index = data.index,
                file = data.files[index],
                node = $(data.context.children()[index]);
            console.log("processalways:", "index:", index, "file:", file, "node:", node);
//                if (file.preview) {
//                    node
//                        .prepend('<br>')
//                        .prepend(file.preview);
//                }
//                if (file.error) {
//                    node
//                        .append('<br>')
//                        .append($('<span class="text-danger"/>').text(file.error));
//                }
//                if (index + 1 === data.files.length) {
//                    data.context.find('button')
//                        .text('Upload')
//                        .prop('disabled', !!data.files.error);
//                }
        });
//        $("#file-upload-widget .btn-toolbar:first-child .btn-primary").on('click', function(event){
//            var filesList = _this.viewTop.$el.find("form").serializeData();
//            console.log("files:", filesList);
//            $('#file-upload-widget').fileupload('send', {files: filesList});
//            event.stopPropagation();
//            event.preventDefault();
//        });
    },

    deinitializeUploadWidget: function() {
        $('#file-upload-widget-input').fileupload('destroy');
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
        var uploadFileView = data.uploadFileView;

        this.getViewTop().$el.find(".box-body .box>span").hide();
        this.imageUploadView.addViewChild(uploadFileView, "#image-upload-container .box-body .box");
    },

    handleAddByUrlCompletedEvent: function(event) {
        var data = event.getData();
        var url = data.url;
        var selector = '.file-upload-item:contains(' + url + ')';
        var node = $(selector);
        node.find(".bar").attr("style", "width: 100%");
        node.find(".cancel-button").hide();
        node.find(".success-indicator").attr("style", "");
        node.find(".progress").hide();
    },

    handleAddByUrlFailedEvent: function(event) {

    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ImageUploadContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule"),
        property("assetManagerModule").ref("assetManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ImageUploadContainer", ImageUploadContainer);
