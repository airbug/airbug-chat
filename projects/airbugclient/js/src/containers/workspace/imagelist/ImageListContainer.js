//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ImageListContainer')

//@Require('AddChange')
//@Require('Class')
//@Require('ClearChange')
//@Require('ISet')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('RemoveChange')
//@Require('RemovePropertyChange')
//@Require('Set')
//@Require('SetPropertyChange')
//@Require('airbug.BoxWithHeaderAndFooterView')
//@Require('airbug.ButtonGroupView')
//@Require('airbug.ButtonToolbarView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CommandModule')
//@Require('airbug.IconView')
//@Require('airbug.ImageAssetModel')
//@Require('airbug.NakedButtonView')
//@Require('airbug.TextView')
//@Require('airbug.UserImageAssetContainer')
//@Require('airbug.UserImageAssetList')
//@Require('airbug.WorkspaceCloseButtonContainer')
//@Require('bugflow.BugFlow')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var AddChange                           = bugpack.require('AddChange');
var Class                               = bugpack.require('Class');
var ClearChange                         = bugpack.require('ClearChange');
var ISet                                = bugpack.require('ISet');
var Map                                 = bugpack.require('Map');
var Obj                                 = bugpack.require('Obj');
var RemoveChange                        = bugpack.require('RemoveChange');
var RemovePropertyChange                = bugpack.require('RemovePropertyChange');
var Set                                 = bugpack.require('Set');
var SetPropertyChange                   = bugpack.require('SetPropertyChange');
var BoxWithHeaderAndFooterView          = bugpack.require('airbug.BoxWithHeaderAndFooterView');
var ButtonGroupView                     = bugpack.require('airbug.ButtonGroupView');
var ButtonToolbarView                   = bugpack.require('airbug.ButtonToolbarView');
var ButtonViewEvent                     = bugpack.require('airbug.ButtonViewEvent');
var CommandModule                       = bugpack.require('airbug.CommandModule');
var IconView                            = bugpack.require('airbug.IconView');
var ImageAssetModel                     = bugpack.require('airbug.ImageAssetModel');
var NakedButtonView                     = bugpack.require('airbug.NakedButtonView');
var TextView                            = bugpack.require('airbug.TextView');
var UserImageAssetContainer             = bugpack.require('airbug.UserImageAssetContainer');
var UserImageAssetList                  = bugpack.require('airbug.UserImageAssetList');
var WorkspaceCloseButtonContainer       = bugpack.require('airbug.WorkspaceCloseButtonContainer');
var BugFlow                             = bugpack.require('bugflow.BugFlow');
var AutowiredAnnotation                 = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation                  = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer                   = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var CommandType                         = CommandModule.CommandType;
var view                                = ViewBuilder.view;
var $series                             = BugFlow.$series;
var $task                               = BugFlow.$task;

//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ImageListContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map}
         */
        this.userImageAssetIdToContainerMap     = new Map();

        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {UserImageAssetStreamModel}
         */
        this.userImageAssetStreamModel          = null;

        /**
         * @private
         * @type {UserImageAssetList}
         */
        this.userImageAssetList                 = null;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AssetManagerModule}
         */
        this.assetManagerModule                 = null;

        /**
         * @private
         * @type {CommandModule}
         */
        this.commandModule                      = null;

        /**
         * @private
         * @type {CurrentUserManagerModule}
         */
        this.currentUserManagerModule           = null;

        /**
         * @private
         * @type {UserAssetManagerModule}
         */
        this.userAssetManagerModule             = null;

        /**
         * @private
         * @type {UserImageAssetStreamManagerModule}
         */
        this.userImageAssetStreamManagerModule  = null;

        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BoxWithHeaderAndFooterView}
         */
        this.boxView                            = null;

        /**
         * @private
         * @type {NakedButtonView}
         */
        this.imageUploadLinkButtonView          = null;

        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {WorkspaceCloseButtonContainer}
         */
        this.closeButton                        = null;
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
        this.loadAndProcessUserImageAssetList();
        this.loadUserImageAssetStream();
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------

        this.userImageAssetStreamModel  = this.userImageAssetStreamManagerModule.generateUserImageAssetStreamModel({});
        this.userImageAssetList         = this.userAssetManagerModule.generateUserImageAssetList();

        // Create Views
        //-------------------------------------------------------------------------------

        this.boxView =
            view(BoxWithHeaderAndFooterView)
                .id("image-list-container")
                .children([
                    view(ButtonToolbarView)
                        .id("image-list-toolbar")
                        .appendTo(".box-header")
                        .children([
                            view(ButtonGroupView)
                                .appendTo('#image-list-toolbar')
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
                                                    type: IconView.Type.PICTURE,
                                                    color: IconView.Color.WHITE
                                                })
                                                .appendTo('button[id|="button"]'),
                                            view(TextView)
                                                .attributes({
                                                    text: " Image List"
                                                })
                                                .appendTo('button[id|="button"]')
                                        ])
                                ]),
                            view(ButtonGroupView)
                                .children([
                                    view(NakedButtonView)
                                        .id("image-upload-link-button")
                                        .attributes({
                                            size: NakedButtonView.Size.SMALL
                                        })
                                        .children([
                                            view(IconView)
                                                .attributes({
                                                    type: IconView.Type.UPLOAD
                                                })
                                                .appendTo('#image-upload-link-button'),
                                            view(TextView)
                                                .attributes({
                                                    text: "Upload"
                                                })
                                                .appendTo('#image-upload-link-button')
                                        ])
                                ])
                                .appendTo('#image-list-toolbar')
                        ])
//                    ,
//                    view(ButtonGroupView)
//                        .children([
//                            view(NakedButtonView)
//                                .attributes({
//                                    size: NakedButtonView.Size.LARGE,
//                                    type: NakedButtonView.Type.DANGER
//                                })
//                                .children([
//                                    view(IconView)
//                                        .attributes({
//                                            type: IconView.Type.TRASH
//                                        })
//                                        .appendTo('button[id|="button"]')
//                                ]),
//                            view(NakedButtonView)
//                                .attributes({
//                                    size: NakedButtonView.Size.LARGE
//                                })
//                                .children([
//                                    view(TextView)
//                                        .attributes({text: "SEND"})
//                                        .appendTo('button[id|="button"]')
//                                ])
//                        ])
//                        .appendTo(".box-footer")
                ])
                .build();

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.boxView);

        this.imageUploadLinkButtonView = this.findViewById("image-upload-link-button")
    },

    createContainerChildren: function() {
        this._super();
        this.closeButton = new WorkspaceCloseButtonContainer();
        this.addContainerChild(this.closeButton, "#image-list-toolbar .btn-group:last-child")
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
        this.imageUploadLinkButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.handleUploadImageLinkButtonClicked, this);
        this.userImageAssetStreamModel.observe(AddChange.CHANGE_TYPE,           "userImageAssetIdSet", this.observeUserImageAssetIdSetAddChange, this);
        this.userImageAssetStreamModel.observe(RemoveChange.CHANGE_TYPE,        "userImageAssetIdSet", this.observeUserImageAssetIdSetRemoveChange, this);
        this.userImageAssetStreamModel.observe(SetPropertyChange.CHANGE_TYPE,   "userImageAssetIdSet", this.observeUserImageAssetIdSetPropertyChange, this);
    },

    deinitializeEventListeners: function() {
        this.imageUploadLinkButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.handleUploadImageLinkButtonClicked, this);
        this.userImageAssetStreamModel.unobserve(AddChange.CHANGE_TYPE,         "userImageAssetIdSet", this.observeUserImageAssetIdSetAddChange, this);
        this.userImageAssetStreamModel.unobserve(RemoveChange.CHANGE_TYPE,      "userImageAssetIdSet", this.observeUserImageAssetIdSetRemoveChange, this);
        this.userImageAssetStreamModel.unobserve(SetPropertyChange.CHANGE_TYPE, "userImageAssetIdSet", this.observeUserImageAssetIdSetPropertyChange, this);
    },

    /**
     * @private
     */
    initializeCommandSubscriptions: function() {
        this.commandModule.subscribe(CommandType.ADD.USER_IMAGE_ASSET, this.handleAddUserImageAsset, this);
    },

    /**
     * @private
     */
    deinitializeCommandSubscriptions: function() {
        this.commandModule.unsubscribe(CommandType.ADD.USER_IMAGE_ASSET, this.handleAddUserImageAsset, this);
    },

    //-------------------------------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------------------------------

    handleAddUserImageAsset: function(message){
        var _this = this;
        var data = message.getData();
        var userAssetManagerModule = this.userAssetManagerModule;
        var userAssetId = data.userAssetId;
        var imageAssetModel = data.imageAssetModel;

        userAssetManagerModule.retrieveUserAsset(userAssetId, function(throwable, meldDocument){
            if(!throwable){
                var userImageAssetModel = userAssetManagerModule.generateUserImageAssetModel({}, meldDocument);
                _this.assetManagerModule.retrieveAsset(userImageAssetModel.getProperty("assetId"), function(throwable, assetMeldDocument){
                    var imageAssetModel = new ImageAssetModel({}, assetMeldDocument);
                    var userImageAssetContainer = _this.initializeUserImageAssetContainer(userImageAssetModel, imageAssetModel);
                    _this.addContainerChild(userImageAssetContainer, ".box-body");
                });
            }
        });
    },

    handleUploadImageLinkButtonClicked: function(event) {
        this.commandModule.relayCommand(CommandType.DISPLAY.IMAGE_UPLOAD, {});
    },

    //-------------------------------------------------------------------------------
    // UserImageAsset
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {UserImageAssetModel} userImageAssetModel
     */
    deinitializeUserImageAsset: function(userImageAssetModel) {
        this.userImageAssetList.remove(userImageAssetModel);
    },

    /**
     * @private
     * @param {UserImageAssetContainer} userImageAssetContainer
     */
    destroyUserImageAssetContainer: function(userImageAssetContainer) {
        userImageAssetContainer.deactivateContainer();
        userImageAssetContainer.deinitializeContainer();
        userImageAssetContainer.destroyContainer();
    },

    /**
     * @private
     * @param {Object} data
     * @param {Meld} userAssetMeldDocument
     * @return {UserImageAssetModel}
     */
    generateUserImageAssetModel: function(data, userAssetMeldDocument) {
        return this.userAssetManagerModule.generateUserImageAssetModel(data, userAssetMeldDocument);
    },

    /**
     * @private
     * @return {UserImageAssetContainer}
     */
    initializeUserImageAssetContainer: function(userImageAssetModel, imageAssetModel) {
        var userImageAssetId = userImageAssetModel.getProperty("id");
        var userImageAssetContainer = new UserImageAssetContainer(userImageAssetModel, imageAssetModel);
        this.userImageAssetIdToContainerMap.put(userImageAssetId, userImageAssetContainer);
        return userImageAssetContainer;
    },

    /**
     * @param {string} userImageAssetId
     */
    loadUserImageAsset: function(userImageAssetId) {
        var _this = this;
        this.userAssetManagerModule.retrieveUserAsset(userImageAssetId, function(throwable, retrievedUserImageAssetMeldDocument) {
            if (!throwable) {
                var userImageAssetModel = _this.generateUserImageAssetModel({}, retrievedUserImageAssetMeldDocument);
                _this.userImageAssetList.add(userImageAssetModel);
                _this.processUserImageAsset(userImageAssetModel);
            }
        });
    },

    /**
     *
     * @param {UserImageAssetModel} userImageAssetModel
     */
    processUserImageAsset: function(userImageAssetModel) {
        var _this = this;
        this.assetManagerModule.retrieveAsset(userImageAssetModel.getProperty("assetId"), function(throwable, assetMeldDocument){
            var imageAssetModel = new ImageAssetModel({}, assetMeldDocument);
            var userImageAssetContainer = _this.initializeUserImageAssetContainer(userImageAssetModel, imageAssetModel);
            _this.addContainerChild(userImageAssetContainer, ".box-body");
        });
    },

    /**
     *
     */
    removeUserImageAsset: function(userImageAssetId) {
        var userImageAssetContainer = this.userImageAssetIdToContainerMap.get(userImageAssetId);
        var userImageAssetModel = userImageAssetContainer.getUserImageAssetModel();
        this.deinitializeUserImageAsset(userImageAssetModel);
        this.destroyUserImageAssetContainer(userImageAssetContainer);
        this.userImageAssetIdToContainerMap.remove(userImageAssetId);
    },


    //-------------------------------------------------------------------------------
    // UserImageAssetList
    //-------------------------------------------------------------------------------

    /**
     *
     */
    loadAndProcessUserImageAssetList: function() {
        var _this = this;
        this.userAssetManagerModule.retrieveUserAssetsForCurrentUser(function(throwable, retrievedUserAssetMeldDocumentList) {
            if (!throwable) {
                _this.loadUserImageAssetList(retrievedUserAssetMeldDocumentList);
                _this.processUserImageAssetList();
            }
        });
    },

    /**
     *
     * @param {List.<Meld>=} userAssetMeldDocumentList
     */
    loadUserImageAssetList: function(userAssetMeldDocumentList) {
        var _this = this;
        userAssetMeldDocumentList.forEach(function(userAssetMeldDocument) {
            if (userAssetMeldDocument) {
                var userImageAssetModel = _this.generateUserImageAssetModel({}, userAssetMeldDocument);
                console.log("userImageAssetModel:", userImageAssetModel);
                _this.userImageAssetList.add(userImageAssetModel);
            } else {
                //TODO BRN: Couldn't find this meld. Make a repeat call for it. If we can't find it again, log it to the server so we know there's a problem.
            }
        });
    },

    /**
     *
     */
    processUserImageAssetList: function() {
        var _this = this;
        this.userImageAssetList.forEach(function(userImageAssetModel) {
            _this.processUserImageAsset(userImageAssetModel);
        });
    },


    //-------------------------------------------------------------------------------
    // UserImageAssetStream
    //-------------------------------------------------------------------------------

    /**
     *
     */
    loadUserImageAssetStream: function() {
        var _this = this;
        this.currentUserManagerModule.retrieveCurrentUser(function(throwable, currentUser){
            if(!throwable) {
                var userId = currentUser.getId();
                console.log("userId:", userId);
                _this.userImageAssetStreamManagerModule.retrieveUserImageAssetStream(userId, function(throwable, meldDocument){
                    console.log("retrieveUserImageAssetStream");
                    console.log("throwable:", throwable);
                    console.log("meldDocument:", meldDocument);

                    if(!throwable) {
                        _this.userImageAssetStreamModel.setUserImageAssetStreamMeldDocument(meldDocument);
                    }
                });
            } else {
                //TODO
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Model Observers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {AddChange} change
     */
    observeUserImageAssetIdSetAddChange: function(change) {
        console.log("ImageListContainer#observeUserImageAssetIdSetAddChange");
        this.loadUserImageAsset(change.getValue());
    },

    /**
     * @private
     * @param {RemoveChange} change
     */
    observeUserImageAssetIdSetRemoveChange: function(change) {
        console.log("ImageListContainer#observeUserImageAssetIdSetRemoveChange");
        this.removeUserImageAsset(change.getValue());
    },

    /**
     * @private
     * @param {SetPropertyChange} change
     */
    observeUserImageAssetIdSetPropertyChange: function(change) {
        console.log("ImageListContainer#observeUserImageAssetIdSetPropertyChange");
        var _this = this;
        if (Class.doesImplement(change.getPropertyValue(), ISet)) {
            change.getPropertyValue().forEach(function(userAssetId) {
                _this.loadUserImageAsset(userAssetId);
            });
        }
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ImageListContainer).with(
    autowired().properties([
        property("assetManagerModule").ref("assetManagerModule"),
        property("commandModule").ref("commandModule"),
        property("currentUserManagerModule").ref("currentUserManagerModule"),
        property("userAssetManagerModule").ref("userAssetManagerModule"),
        property("userImageAssetStreamManagerModule").ref("userImageAssetStreamManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ImageListContainer", ImageListContainer);
