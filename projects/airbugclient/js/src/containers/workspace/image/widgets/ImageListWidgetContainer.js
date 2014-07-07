/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ImageListWidgetContainer')

//@Require('AddChange')
//@Require('Class')
//@Require('ISet')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('ObservableList')
//@Require('RemoveChange')
//@Require('RemovePropertyChange')
//@Require('Set')
//@Require('SetPropertyChange')
//@Require('carapace.ButtonGroupView')
//@Require('carapace.ButtonToolbarView')
//@Require('airbug.CommandModule')
//@Require('carapace.IconView')
//@Require('airbug.ImageAssetModel')
//@Require('airbug.ImageListContainer')
//@Require('carapace.TabsView')
//@Require('carapace.TabView')
//@Require('carapace.TabViewEvent')
//@Require('carapace.TextView')
//@Require('airbug.UserImageAssetModel')
//@Require('airbug.UserImageAssetStreamModel')
//@Require('airbug.WorkspaceBoxWithHeaderView')
//@Require('airbug.WorkspaceCloseButtonContainer')
//@Require('airbug.WorkspaceWidgetContainer')
//@Require('bugflow.BugFlow')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ModelBuilder')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var AddChange                           = bugpack.require('AddChange');
    var Class                               = bugpack.require('Class');
    var ISet                                = bugpack.require('ISet');
    var List                                = bugpack.require('List');
    var Map                                 = bugpack.require('Map');
    var Obj                                 = bugpack.require('Obj');
    var ObservableList                      = bugpack.require('ObservableList');
    var RemoveChange                        = bugpack.require('RemoveChange');
    var RemovePropertyChange                = bugpack.require('RemovePropertyChange');
    var Set                                 = bugpack.require('Set');
    var SetPropertyChange                   = bugpack.require('SetPropertyChange');
    var ButtonGroupView                     = bugpack.require('carapace.ButtonGroupView');
    var ButtonToolbarView                   = bugpack.require('carapace.ButtonToolbarView');
    var CommandModule                       = bugpack.require('airbug.CommandModule');
    var IconView                            = bugpack.require('carapace.IconView');
    var ImageAssetModel                     = bugpack.require('airbug.ImageAssetModel');
    var ImageListContainer                  = bugpack.require('airbug.ImageListContainer');
    var TabsView                            = bugpack.require('carapace.TabsView');
    var TabView                             = bugpack.require('carapace.TabView');
    var TabViewEvent                        = bugpack.require('carapace.TabViewEvent');
    var TextView                            = bugpack.require('carapace.TextView');
    var UserImageAssetModel                 = bugpack.require('airbug.UserImageAssetModel');
    var UserImageAssetStreamModel           = bugpack.require('airbug.UserImageAssetStreamModel');
    var WorkspaceBoxWithHeaderView          = bugpack.require('airbug.WorkspaceBoxWithHeaderView');
    var WorkspaceCloseButtonContainer       = bugpack.require('airbug.WorkspaceCloseButtonContainer');
    var WorkspaceWidgetContainer            = bugpack.require('airbug.WorkspaceWidgetContainer');
    var BugFlow                             = bugpack.require('bugflow.BugFlow');
    var AutowiredTag                 = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag                  = bugpack.require('bugioc.PropertyTag');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');
    var ModelBuilder                        = bugpack.require('carapace.ModelBuilder');
    var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                           = AutowiredTag.autowired;
    var bugmeta                             = BugMeta.context();
    var CommandType                         = CommandModule.CommandType;
    var model                               = ModelBuilder.model;
    var property                            = PropertyTag.property;
    var view                                = ViewBuilder.view;
    var $series                             = BugFlow.$series;
    var $task                               = BugFlow.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {WorkspaceWidgetContainer}
     */
    var ImageListWidgetContainer = Class.extend(WorkspaceWidgetContainer, {

        _name: "airbug.ImageListWidgetContainer",


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

            /**
             * @private
             * @type {Logger}
             */
            this.logger                                 = null;

            /**
             * @private
             * @type {ObservableList.<UserImageAssetModel>}
             */
            this.userImageAssetList                     = new ObservableList();

            /**
             * @private
             * @type {Map}
             */
            this.userAssetIdToUserImageAssetModelMap    = new Map();


            // Models
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {UserImageAssetStreamModel}
             */
            this.userImageAssetStreamModel              = null;


            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {AssetManagerModule}
             */
            this.assetManagerModule                     = null;

            /**
             * @private
             * @type {CommandModule}
             */
            this.commandModule                          = null;

            /**
             * @private
             * @type {CurrentUserManagerModule}
             */
            this.currentUserManagerModule               = null;

            /**
             * @private
             * @type {UserAssetManagerModule}
             */
            this.userAssetManagerModule                 = null;

            /**
             * @private
             * @type {UserImageAssetStreamManagerModule}
             */
            this.userImageAssetStreamManagerModule      = null;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {TabView}
             */
            this.imageListTabView                       = null;

            /**
             * @private
             * @type {TabView}
             */
            this.imageUploadTabView                     = null;

            /**
             * @private
             * @type {TabsView}
             */
            this.tabsView                               = null;

            /**
             * @private
             * @type {ButtonGroupView}
             */
            this.widgetControlButtonGroupView           = null;

            /**
             * @private
             * @type {WorkspaceBoxWithHeaderView}
             */
            this.workspaceBoxView                       = null;


            // Containers
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {WorkspaceCloseButtonContainer}
             */
            this.closeButtonContainer                   = null;

            /**
             * @private
             * @type {ImageListContainer}
             */
            this.imageListContainer                     = null;
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
            this.loadUserImageAssetList();
            this.loadUserImageAssetStream();
        },

        /**
         * @protected
         */
        createContainer: function() {
            this._super();


            // Create Models
            //-------------------------------------------------------------------------------

            model(UserImageAssetStreamModel)
                .name("userImageAssetStreamModel")
                .build(this);


            // Create Views
            //-------------------------------------------------------------------------------

            view(WorkspaceBoxWithHeaderView)
                .name("workspaceBoxView")
                .attributes({
                    classes: "image-list-container"
                })
                .children([
                    view(TabsView)
                        .name("tabsView")
                        .appendTo("#box-header-{{cid}}")
                        .children([
                            view(TabView)
                                .name("imageListTabView")
                                .attributes({
                                    classes: "disabled active"
                                })
                                .children([
                                    view(IconView)
                                        .attributes({
                                            type: IconView.Type.PICTURE
                                        })
                                        .appendTo('a'),
                                    view(TextView)
                                        .attributes({
                                            text: " Image List"
                                        })
                                        .appendTo('a')
                                ]),
                            view(TabView)
                                .name("imageUploadTabView")
                                .children([
                                    view(IconView)
                                        .attributes({
                                            type: IconView.Type.UPLOAD
                                        })
                                        .appendTo('a'),
                                    view(TextView)
                                        .attributes({
                                            text: "Upload"
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

            this.setViewTop(this.workspaceBoxView);
        },

        /**
         * @protected
         */
        createContainerChildren: function() {
            this._super();
            this.closeButtonContainer   = new WorkspaceCloseButtonContainer();
            this.addContainerChild(this.closeButtonContainer, "#button-group-" + this.widgetControlButtonGroupView.getCid());
            this.imageListContainer     = new ImageListContainer(this.userImageAssetList);
            this.addContainerChild(this.imageListContainer, "#box-body-" + this.workspaceBoxView.getCid());
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();

            this.imageUploadTabView.removeEventListener(TabViewEvent.EventType.CLICKED, this.hearUploadImageTabClicked, this);

            this.userImageAssetStreamModel.unobserve(AddChange.CHANGE_TYPE,         "userImageAssetIdSet", this.observeUserImageAssetIdSetAddChange, this);
            this.userImageAssetStreamModel.unobserve(RemoveChange.CHANGE_TYPE,      "userImageAssetIdSet", this.observeUserImageAssetIdSetRemoveChange, this);
            this.userImageAssetStreamModel.unobserve(SetPropertyChange.CHANGE_TYPE, "userImageAssetIdSet", this.observeUserImageAssetIdSetPropertyChange, this);

            this.commandModule.unsubscribe(CommandType.ADD.USER_IMAGE_ASSET, this.handleAddUserImageAsset, this);;
        },

        /**
         * @protected
         */
        destroyContainer: function() {
            this._super();
            this.clearUserImageAssetList();
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();

            this.imageUploadTabView.addEventListener(TabViewEvent.EventType.CLICKED, this.hearUploadImageTabClicked, this);

            this.userImageAssetStreamModel.observe(AddChange.CHANGE_TYPE,           "userImageAssetIdSet", this.observeUserImageAssetIdSetAddChange, this);
            this.userImageAssetStreamModel.observe(RemoveChange.CHANGE_TYPE,        "userImageAssetIdSet", this.observeUserImageAssetIdSetRemoveChange, this);
            this.userImageAssetStreamModel.observe(SetPropertyChange.CHANGE_TYPE,   "userImageAssetIdSet", this.observeUserImageAssetIdSetPropertyChange, this);

            this.commandModule.subscribe(CommandType.ADD.USER_IMAGE_ASSET, this.handleAddUserImageAsset, this);
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {UserImageAssetModel} userImageAssetModel
         */
        appendUserImageAssetModel: function(userImageAssetModel) {
            if (!this.userAssetIdToUserImageAssetModelMap.containsKey(userImageAssetModel.getProperty("id"))) {
                this.userAssetIdToUserImageAssetModelMap.put(userImageAssetModel.getProperty("id"), userImageAssetModel);
                this.userImageAssetList.add(userImageAssetModel);
                this.addModel(userImageAssetModel);
            }
        },

        /**
         * @protected
         * @param {Object} data
         * @param {MeldDocument} imageAssetMeldDocument
         * @param {MeldDocument} userAssetMeldDocument
         * @return {UserImageAssetModel}
         */
        buildUserImageAssetModel: function(data, imageAssetMeldDocument, userAssetMeldDocument) {
            return model(UserImageAssetModel)
                .args([
                    data,
                    imageAssetMeldDocument,
                    userAssetMeldDocument
                ])
                .build();
        },

        /**
         * @protected
         * @param {Object} data
         * @param {MeldDocument} imageAssetMeldDocument
         * @param {MeldDocument} userAssetMeldDocument
         */
        buildAndAppendUserImageAssetModel: function(data, imageAssetMeldDocument, userAssetMeldDocument) {
            var userImageAssetModel = this.buildUserImageAssetModel(data, imageAssetMeldDocument, userAssetMeldDocument);
            this.appendUserImageAssetModel(userImageAssetModel);
        },

        /**
         * @protected
         * @param {Object} data
         * @param {MeldDocument} imageAssetMeldDocument
         * @param {MeldDocument} userAssetMeldDocument
         */
        buildAndPrependUserImageAssetModel: function(data, imageAssetMeldDocument, userAssetMeldDocument) {
            var userImageAssetModel = this.buildUserImageAssetModel(data, imageAssetMeldDocument, userAssetMeldDocument);
            this.prependUserImageAssetModel(userImageAssetModel);
        },

        /**
         * @protected
         */
        clearUserImageAssetList: function() {
            var _this = this;
            this.userImageAssetList.forEach(function(roomModel) {
                _this.removeModel(roomModel);
            });
            this.userImageAssetList.clear();
            this.userAssetIdToUserImageAssetModelMap.clear();
        },

        /**
         * @protected
         * @param {string} userAssetId
         */
        loadUserImageAsset: function(userAssetId) {
            var _this                   = this;
            var userAssetMeldDocument   = null;
            var imageAssetMeldDocument  = null;
            var imageAssetId            = null;
            $series([
                $task(function(flow) {
                    _this.userAssetManagerModule.retrieveUserAsset(userAssetId, function(throwable, retrievedUserAssetMeldDocument) {
                        if (!throwable) {
                            userAssetMeldDocument   = retrievedUserAssetMeldDocument;
                            imageAssetId            = userAssetMeldDocument.getData().assetId;
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.assetManagerModule.retrieveAsset(imageAssetId, function(throwable, retrievedImageAssetMeldDocument) {
                        if (!throwable) {
                            imageAssetMeldDocument = retrievedImageAssetMeldDocument;
                        }
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    _this.buildAndPrependUserImageAssetModel({}, imageAssetMeldDocument, userAssetMeldDocument);
                }
            });
        },

        /**
         * @protected
         */
        loadUserImageAssetList: function() {
            var _this                       = this;
            var userAssetMeldDocumentList   = new List();
            var imageAssetMeldDocumentMap   = new Map();
            var imageAssetIdSet             = new Set();
            $series([
                $task(function(flow) {
                    _this.userAssetManagerModule.retrieveUserAssetsForCurrentUserSortByCreatedAt(function(throwable, retrievedUserAssetMeldDocumentList) {
                        if (!throwable) {
                            retrievedUserAssetMeldDocumentList.forEach(function(userAssetMeldDocument) {
                                if (userAssetMeldDocument) {
                                    userAssetMeldDocumentList.add(userAssetMeldDocument);
                                    imageAssetIdSet.add(userAssetMeldDocument.getData().assetId);
                                }
                            });
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.assetManagerModule.retrieveAssets(imageAssetIdSet.toArray(), function(throwable, assetMeldDocumentMap) {
                        if (!throwable) {
                            assetMeldDocumentMap.forEach(function(assetMeldDocument, id) {
                                if (assetMeldDocument) {
                                    imageAssetMeldDocumentMap.put(id, assetMeldDocument);
                                }
                            });
                        }
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    _this.imageListContainer.hideLoader();
                    if (userAssetMeldDocumentList.getCount() > 0) {
                        userAssetMeldDocumentList.forEach(function(userAssetMeldDocument) {
                            var imageAssetMeldDocument = imageAssetMeldDocumentMap.get(userAssetMeldDocument.getData().assetId);
                            if (imageAssetMeldDocument) {
                                _this.buildAndAppendUserImageAssetModel({}, imageAssetMeldDocument, userAssetMeldDocument);
                            }
                        });
                    } else {
                        _this.imageListContainer.showPlaceholder();
                    }
                }  else {
                    _this.logger.error(throwable);
                }
            });
        },

        /**
         * @protected
         */
        loadUserImageAssetStream: function() {
            var _this = this;
            this.currentUserManagerModule.retrieveCurrentUser(function(throwable, currentUser){
                if (!throwable) {
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

        /**
         * @private
         * @param {string} userAssetId
         */
        removeUserImageAsset: function(userAssetId) {
            var userImageAssetModel = this.userAssetIdToUserImageAssetModelMap.get(userAssetId);
            if (userImageAssetModel) {
                this.userAssetIdToUserImageAssetModelMap.remove(userAssetId);
                this.userImageAssetList.remove(userImageAssetModel);
                this.removeModel(userImageAssetModel);
            }
        },

        /**
         * @protected
         * @param {UserImageAssetModel} userImageAssetModel
         */
        prependUserImageAssetModel: function(userImageAssetModel) {
            if (!this.userAssetIdToUserImageAssetModelMap.containsKey(userImageAssetModel.getProperty("id"))) {
                this.userAssetIdToUserImageAssetModelMap.put(userImageAssetModel.getProperty("id"), userImageAssetModel);
                this.userImageAssetList.addAt(0, userImageAssetModel);
                this.addModel(userImageAssetModel);
            }
        },


        //-------------------------------------------------------------------------------
        // Model Observers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Observation} observation
         */
        observeUserImageAssetIdSetAddChange: function(observation) {
            var change  = /** @type {AddChange} */(observation.getChange());
            this.loadUserImageAsset(change.getValue());
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeUserImageAssetIdSetRemoveChange: function(observation) {
            var change  = /** @type {RemoveChange} */(observation.getChange());
            this.removeUserImageAsset(change.getValue());
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeUserImageAssetIdSetPropertyChange: function(observation) {
            var _this       = this;
            var change      = /** @type {SetPropertyChange} */(observation.getChange());
            if (Class.doesImplement(change.getPropertyValue(), ISet)) {
                change.getPropertyValue().forEach(function(userAssetId) {
                    _this.loadUserImageAsset(userAssetId);
                });
            }
        },


        //-------------------------------------------------------------------------------
        // Message Handlers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Message} message
         */
        handleAddUserImageAsset: function(message){
            var data                    = message.getData();
            this.loadUserImageAsset(data.userAssetId);
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Event} event
         */
        hearUploadImageTabClicked: function(event) {
            console.log("ImageListWidgetContainer#hearUploadImageTabClicked");
            this.commandModule.relayCommand(CommandType.DISPLAY.IMAGE_UPLOAD, {});
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(ImageListWidgetContainer).with(
        autowired().properties([
            property("assetManagerModule").ref("assetManagerModule"),
            property("commandModule").ref("commandModule"),
            property("currentUserManagerModule").ref("currentUserManagerModule"),
            property("logger").ref("logger"),
            property("userAssetManagerModule").ref("userAssetManagerModule"),
            property("userImageAssetStreamManagerModule").ref("userImageAssetStreamManagerModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ImageListWidgetContainer", ImageListWidgetContainer);
});
