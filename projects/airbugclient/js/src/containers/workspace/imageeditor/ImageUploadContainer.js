//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ImageUploadContainer')

//@Require('Class')
//@Require('airbug.ButtonGroupView')
//@Require('airbug.ButtonToolbarView')
//@Require('airbug.CommandModule')
//@Require('airbug.IconView')
//@Require('airbug.ImageUploadView')
//@Require('airbug.NakedButtonView')
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
var ButtonGroupView                     = bugpack.require('airbug.ButtonGroupView');
var ButtonToolbarView                   = bugpack.require('airbug.ButtonToolbarView');
var CommandModule                       = bugpack.require('airbug.CommandModule');
var IconView                            = bugpack.require('airbug.IconView');
var ImageUploadView                     = bugpack.require('airbug.ImageUploadView');
var NakedButtonView                     = bugpack.require('airbug.NakedButtonView');
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

var $           = jQuery;
var CommandType = CommandModule.CommandType;
var view        = ViewBuilder.view;


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
         * @type {CommandModule}
         */
        this.commandModule              = null;

        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ImageUploadView}
         */
        this.imageUploadView            = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {WorkspaceCloseButtonContainer}
         */
        this.closeButton                = null;
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
                                        .attributes({
                                            size: NakedButtonView.Size.SMALL
                                        })
                                        .children([
                                            view(IconView)
                                                .appendTo('button[id|="button"]')
                                                .attributes({
                                                    type: IconView.Type.PICTURE
                                                }),
                                            view(TextView)
                                                .appendTo('button[id|="button"]')
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
    },

    createContainerChildren: function() {
        this._super();
        this.closeButton = new WorkspaceCloseButtonContainer();
        this.addContainerChild(this.closeButton, ".btn-toolbar .btn-group:last-child")
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.initializeUploadWidget();
        this.initializeCommandSubscriptions();
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.deinitializeUploadWidget();
        this.deinitializeCommandSubscriptions();
    },

    initializeUploadWidget: function() {
        var _this = this;
        $('#file-upload-widget').fileupload({
            url: '/imageupload',
            type: "POST",
            dropzone: _this.viewTop.$el.find("#image-upload-container"),
            pastezone: _this.viewTop.$el.find("#image-upload-container .box-body"),
            autoupload: false,
            formData: {script: true},
            dataType: 'json'
        }).on('fileuploadadd', function (e, data) {
            console.log("data:", data);
            var uploadFileView = new UploadView();
            _this.imageUploadView.addViewChild(uploadFileView, "#image-upload-container table");
        });
    },

    deinitializeUploadWidget: function() {
        $('#file-upload-widget').fileupload('destroy');
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

bugmeta.annotate(ImageUploadContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ImageUploadContainer", ImageUploadContainer);
