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

//@Export('airbug.RoomListPanelContainer')

//@Require('AddChange')
//@Require('Class')
//@Require('ClearChange')
//@Require('Exception')
//@Require('Map')
//@Require('ObservableList')
//@Require('RemoveChange')
//@Require('RemovePropertyChange')
//@Require('Set')
//@Require('SetPropertyChange')
//@Require('airbug.CommandModule')
//@Require('airbug.CurrentUserModel')
//@Require('carapace.ListView')
//@Require('carapace.ListViewEvent')
//@Require('carapace.LoaderView')
//@Require('carapace.PanelWithHeaderView')
//@Require('airbug.RoomModel')
//@Require('airbug.RoomSummaryView')
//@Require('carapace.SelectableListItemView')
//@Require('airbug.StartConversationButtonContainer')
//@Require('carapace.TextView')
//@Require('Flows')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ModelBuilder')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var AddChange                           = bugpack.require('AddChange');
    var Class                               = bugpack.require('Class');
    var ClearChange                         = bugpack.require('ClearChange');
    var Exception                           = bugpack.require('Exception');
    var Map                                 = bugpack.require('Map');
    var ObservableList                      = bugpack.require('ObservableList');
    var RemoveChange                        = bugpack.require('RemoveChange');
    var RemovePropertyChange                = bugpack.require('RemovePropertyChange');
    var Set                                 = bugpack.require('Set');
    var SetPropertyChange                   = bugpack.require('SetPropertyChange');
    var CommandModule                       = bugpack.require('airbug.CommandModule');
    var CurrentUserModel                    = bugpack.require('airbug.CurrentUserModel');
    var ListView                            = bugpack.require('carapace.ListView');
    var ListViewEvent                       = bugpack.require('carapace.ListViewEvent');
    var LoaderView                          = bugpack.require('carapace.LoaderView');
    var PanelWithHeaderView                 = bugpack.require('carapace.PanelWithHeaderView');
    var RoomModel                           = bugpack.require('airbug.RoomModel');
    var RoomSummaryView                     = bugpack.require('airbug.RoomSummaryView');
    var SelectableListItemView              = bugpack.require('carapace.SelectableListItemView');
    var StartConversationButtonContainer    = bugpack.require('airbug.StartConversationButtonContainer');
    var TextView                            = bugpack.require('carapace.TextView');
    var Flows                             = bugpack.require('Flows');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');
    var AutowiredTag                 = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag                  = bugpack.require('bugioc.PropertyTag');
    var CarapaceContainer                   = bugpack.require('carapace.CarapaceContainer');
    var ModelBuilder                        = bugpack.require('carapace.ModelBuilder');
    var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                             = BugMeta.context();
    var autowired                           = AutowiredTag.autowired;
    var CommandType                         = CommandModule.CommandType;
    var model                               = ModelBuilder.model;
    var property                            = PropertyTag.property;
    var view                                = ViewBuilder.view;
    var $series                             = Flows.$series;
    var $task                               = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var RoomListPanelContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.RoomListPanelContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {RoomModel} currentRoomModel
         */
        _constructor: function(currentRoomModel) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ListItemView}
             */
            this.currentActiveListItem                  = null;

            /**
             * @private
             * @type {Map.<string, RoomModel>}
             */
            this.roomIdToRoomModelMap                   = new Map();

            /**
             * @private
             * @type {ObservableList.<RoomModel>}
             */
            this.roomList                               = new ObservableList();

            /**
             * @private
             * @type {Map.<RoomModel, SelectableListItemView>}
             */
            this.roomModelToListItemViewMap             = new Map();


            // Containers
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {StartConversationButtonContainer}
             */
            this.startConversationButtonContainer       = null;


            // Models
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {RoomModel}
             */
            this.currentRoomModel                       = currentRoomModel;

            /**
             * @private
             * @type {CurrentUserModel}
             */
            this.currentUserModel                       = null;


            // Modules
            //-------------------------------------------------------------------------------

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
             * @type {NavigationModule}
             */
            this.navigationModule                       = null;

            /**
             * @private
             * @type {RoomManagerModule}
             */
            this.roomManagerModule                      = null;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ListView}
             */
            this.listView                               = null;

            /**
             * @private
             * @type {LoaderView}
             */
            this.loaderView                             = null;

            /**
             * @private
             * @type {PanelView}
             */
            this.panelView                              = null;
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
            this.loadCurrentUser();
        },

        /**
         * @protected
         */
        createContainer: function() {
            this._super();


            // Create Models
            //-------------------------------------------------------------------------------

            model(CurrentUserModel)
                .name("currentUserModel")
                .build(this);


            // Create Views
            //-------------------------------------------------------------------------------

            view(PanelWithHeaderView)
                .name("panelView")
                .attributes({headerTitle: "Conversations"})
                .children([
                    view(ListView)
                        .name("listView")
                        .attributes({
                            placeholder: "You have no conversations"
                        })
                        .appendTo("#panel-body-{{cid}}")
                        .children([
                            view(LoaderView)
                                .name("loaderView")
                                .attributes({
                                    size: LoaderView.Size.SMALL
                                })
                                .appendTo("#list-{{cid}}")
                        ])
                ])
                .build(this);


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.panelView);

            if (this.currentRoomModel) {
                this.addModel(this.currentRoomModel);
            }
        },

        /**
         * @protected
         */
        createContainerChildren: function() {
            this._super();
            this.startConversationButtonContainer = new StartConversationButtonContainer();
            this.addContainerChild(this.startConversationButtonContainer, "#panel-header-nav-right-" + this.panelView.getCid());
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.currentUserModel.unobserve(ClearChange.CHANGE_TYPE, "", this.observeCurrentUserModelClearChange, this);
            this.currentUserModel.unobserve(SetPropertyChange.CHANGE_TYPE, "roomIdSet", this.observeRoomIdSetSetPropertyChange, this);
            this.currentUserModel.unobserve(RemovePropertyChange.CHANGE_TYPE, "roomIdSet", this.observeRoomIdSetRemovePropertyChange, this);
            this.currentUserModel.unobserve(AddChange.CHANGE_TYPE, "roomIdSet", this.observeRoomIdSetAddChange, this);
            this.currentUserModel.unobserve(RemoveChange.CHANGE_TYPE, "roomIdSet", this.observeRoomIdSetRemoveChange, this);

            if (this.currentRoomModel) {
                this.currentRoomModel.unobserve(SetPropertyChange.CHANGE_TYPE, "id", this.observeCurrentRoomIdSetPropertyChange, this);
                this.currentRoomModel.unobserve(RemovePropertyChange.CHANGE_TYPE, "id", this.observeCurrentRoomIdRemovePropertyChange, this);
            }

            this.roomList.unobserve(AddChange.CHANGE_TYPE, "", this.observeRoomListAdd, this);
            this.roomList.unobserve(ClearChange.CHANGE_TYPE, "", this.observeRoomListClear, this);
            this.roomList.unobserve(RemoveChange.CHANGE_TYPE, "", this.observeRoomListRemove, this);

            this.listView.removeEventListener(ListViewEvent.EventType.ITEM_SELECTED, this.hearListViewItemSelectedEvent, this);
        },

        /**
         * @protected
         */
        destroyContainer: function() {
            this._super();
            this.clearRoomList();
            this.destroyAllListItemViews();
            this.currentActiveListItem = null;
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.currentUserModel.observe(ClearChange.CHANGE_TYPE, "", this.observeCurrentUserModelClearChange, this);
            this.currentUserModel.observe(SetPropertyChange.CHANGE_TYPE, "roomIdSet", this.observeRoomIdSetSetPropertyChange, this);
            this.currentUserModel.observe(RemovePropertyChange.CHANGE_TYPE, "roomIdSet", this.observeRoomIdSetRemovePropertyChange, this);
            this.currentUserModel.observe(AddChange.CHANGE_TYPE, "roomIdSet", this.observeRoomIdSetAddChange, this);
            this.currentUserModel.observe(RemoveChange.CHANGE_TYPE, "roomIdSet", this.observeRoomIdSetRemoveChange, this);

            if (this.currentRoomModel) {
                this.currentRoomModel.observe(SetPropertyChange.CHANGE_TYPE, "id", this.observeCurrentRoomIdSetPropertyChange, this);
                this.currentRoomModel.observe(RemovePropertyChange.CHANGE_TYPE, "id", this.observeCurrentRoomIdRemovePropertyChange, this);
            }

            this.roomList.observe(AddChange.CHANGE_TYPE, "", this.observeRoomListAdd, this);
            this.roomList.observe(ClearChange.CHANGE_TYPE, "", this.observeRoomListClear, this);
            this.roomList.observe(RemoveChange.CHANGE_TYPE, "", this.observeRoomListRemove, this);

            this.listView.addEventListener(ListViewEvent.EventType.ITEM_SELECTED, this.hearListViewItemSelectedEvent, this);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Object} data
         * @param {MeldDocument} roomMeldDocument
         */
        buildRoomModel: function(data, roomMeldDocument) {
            var roomModel = model(RoomModel)
                .args([
                    data,
                    roomMeldDocument
                ])
                .build();
            this.roomIdToRoomModelMap.put(roomModel.getProperty("id"), roomModel);
            this.roomList.add(roomModel);
            this.addModel(roomModel);
            this.listView.hidePlaceholder();
        },

        /**
         * @private
         * @param {RoomModel} roomModel
         */
        buildRoomListItemView: function(roomModel) {

            //TEST
            roomModel.setProperty("numberUnreadMessages", 1);
            roomModel.setProperty("lastMessagePreview", "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
            roomModel.setProperty("lastMessageSentAt", new Date());
            roomModel.setProperty("lastMessageSentBy", "Brian Neisler");

            var selectableListItemView =
                view(SelectableListItemView)
                    .model(roomModel)
                    .attributes({
                        size: "large"
                    })
                    .children([
                        view(RoomSummaryView)
                            .model(roomModel)
                            .appendTo("#list-item-{{cid}}")
                    ])
                    .build();

            this.listView.addViewChild(selectableListItemView);
            this.roomModelToListItemViewMap.put(roomModel, selectableListItemView);
            if (this.currentRoomModel && this.currentRoomModel.getProperty("id") === roomModel.getProperty("id")) {
                this.updateCurrentActiveListItem(selectableListItemView);
            }
        },

        /**
         * @private
         */
        clearCurrentActiveListItem: function() {
            if (this.currentActiveListItem) {
                this.currentActiveListItem.deactivateItem();
                this.currentActiveListItem = null;
            }
        },

        /**
         * @private
         */
        clearRoomList: function() {
            var _this = this;
            this.roomList.forEach(function(roomModel) {
                _this.removeModel(roomModel);
            });
            this.roomList.clear();
            this.roomIdToRoomModelMap.clear();
        },

        /**
         * @private
         */
        destroyAllListItemViews: function() {
            var _this = this;
            this.roomModelToListItemViewMap.forEach(function(listItemView) {
                _this.listView.removeViewChild(listItemView);
                listItemView.destroy();
            });
            this.roomModelToListItemViewMap.clear();
        },

        /**
         * @private
         * @param {RoomModel} roomModel
         */
        destroyListItemView: function(roomModel) {
            var listItemView = this.roomModelToListItemViewMap.remove(roomModel);
            if (listItemView) {
                this.listView.removeViewChild(listItemView);
                listItemView.destroy();
            }
        },

        /**
         * @private
         */
        loadCurrentUser: function() {
            var _this = this;
            this.currentUserManagerModule.retrieveCurrentUser(function(throwable, currentUser) {
                if (!throwable) {
                    _this.currentUserModel.setCurrentUserMeldDocument(currentUser.getMeldDocument());
                } else {
                    if (Class.doesExtend(throwable, Exception)) {
                        _this.commandModule.relayCommand(CommandType.FLASH.EXCEPTION, {message: throwable.getMessage()});
                    } else {
                        _this.commandModule.relayCommand(CommandType.FLASH.ERROR, {message: "Sorry an error has occurred" + throwable});
                    }
                }
            });
        },

        /**
         * @private
         * @param {string} roomId
         */
        loadRoom: function(roomId) {
            var _this                       = this;
            var roomMeldDocument            = undefined;
            $series([
                $task(function(flow) {
                    _this.roomManagerModule.retrieveRoom(roomId, function(throwable, retrievedRoomMeldDocument) {
                        if (!throwable) {
                            roomMeldDocument        = retrievedRoomMeldDocument;
                        }
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    _this.buildRoomModel({}, roomMeldDocument);
                }
            });
        },

        /**
         * @private
         * @param {Set.<string>} roomIdSet
         */
        loadRoomList: function(roomIdSet) {
            var _this                       = this;
            var roomMeldDocumentSet         = new Set();
            $series([
                $task(function(flow) {
                    _this.roomManagerModule.retrieveRooms(roomIdSet.toArray(), function(throwable, retrievedRoomMeldDocumentMap) {
                        if (!throwable) {
                            retrievedRoomMeldDocumentMap.forEach(function(roomMeldDocument, id) {
                                if (roomMeldDocument) {
                                    roomMeldDocumentSet.add(roomMeldDocument);
                                } else {
                                    //TODO BRN: Couldn't find this meld. Make a repeat call for it. If we can't find it again, log it to the server so we know there's a problem.
                                }
                            });
                        }
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    _this.loaderView.hide();
                    if (roomMeldDocumentSet.getCount() > 0) {
                        roomMeldDocumentSet.forEach(function(roomMeldDocument) {
                            _this.buildRoomModel({}, roomMeldDocument);
                        });
                    } else {
                        _this.listView.showPlaceholder();
                    }
                } else {
                    //TODO Error handling
                    //TODO Error tracking
                    //TODO BRN: If we have a partial response, we should add the room models to the collection that
                    // successfully came back and then figure out what to do with the ones that failed

                    //TODO BRN: Need to introduce some sort of error handling system that can take any error and figure out what to do with it and what to show the user

                    if (Class.doesExtend(throwable, Exception)) {
                        _this.commandModule.relayCommand(CommandType.FLASH.EXCEPTION, {message: throwable.getMessage()});
                    } else {
                        _this.commandModule.relayCommand(CommandType.FLASH.ERROR, {message: "Sorry an error has occurred" + throwable});
                    }
                }
            });
        },

        /**
         * @private
         */
        processRoomList: function() {
            //TODO
        },

        /**
         * @private
         */
        refreshCurrentActiveListItem: function() {
            this.clearCurrentActiveListItem();
            if (this.currentRoomModel) {
                var currentRoomId = this.currentRoomModel.getProperty("id");
                if (currentRoomId) {
                    var roomModel = this.roomIdToRoomModelMap.get(currentRoomId);
                    if (roomModel) {
                        var listItem = this.roomModelToListItemViewMap.get(roomModel);
                        this.updateCurrentActiveListItem(listItem);
                    }
                }
            }
        },

        /**
         * @private
         * @param {string} roomId
         */
        removeRoom: function(roomId) {
            var roomModel = this.roomIdToRoomModelMap.get(roomId);
            if (roomModel) {
                this.roomIdToRoomModelMap.remove(roomId);
                this.roomList.remove(roomModel);
                this.removeModel(roomModel);
            }
        },

        /**
         * @private
         * @param {ListItemView} listItemView
         */
        updateCurrentActiveListItem: function(listItemView) {
            this.clearCurrentActiveListItem();
            this.currentActiveListItem = listItemView;
            this.currentActiveListItem.activateItem();
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {ListViewEvent} event
         */
        hearListViewItemSelectedEvent: function(event) {
            var room    = event.getData();
            var roomId  = room.id;
            this.navigationModule.navigate("conversation/" + roomId, {
                trigger: true
            });
        },


        //-------------------------------------------------------------------------------
        // Model Observers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Observation} observation
         */
        observeCurrentUserModelClearChange: function(observation) {
            this.clearRoomList();
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeCurrentRoomIdSetPropertyChange: function(observation) {
            this.refreshCurrentActiveListItem();
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeCurrentRoomIdRemovePropertyChange: function(observation) {
            this.clearCurrentActiveListItem();
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeRoomIdSetAddChange: function(observation) {
            var change = /** @type {AddChange} */(observation.getChange());
            this.loadRoom(change.getValue());
        },

        /**
         * @private
         * @param {RemoveChange} change
         */
        observeRoomIdSetRemoveChange: function(change) {
            this.removeRoom(change.getValue());
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeRoomIdSetRemovePropertyChange: function(observation) {
            this.clearRoomList();
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeRoomIdSetSetPropertyChange: function(observation) {
            var change = /** @type {SetPropertyChange} */(observation.getChange());
            this.clearRoomList();
            if (change.getPropertyValue()) {
                this.loadRoomList(change.getPropertyValue());
            }
        },

        // RoomList Observers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Observation} observation
         */
        observeRoomListAdd: function(observation) {
            var change = /** @type {AddChange} */(observation.getChange());
            var roomModel = change.getValue();
            this.buildRoomListItemView(roomModel);
        },

        /**
         * @private
         * @param {Observation} observation
         */
         observeRoomListClear: function(observation) {
            this.destroyAllListItemViews();
            this.roomModelToListItemViewMap.clear();
            this.processRoomList();
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeRoomListRemove: function(observation) {
            var change      = /** @type {RemoveChange} */(observation.getChange());
            var roomModel   = change.getValue();
            this.destroyListItemView(roomModel);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(RoomListPanelContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule"),
            property("currentUserManagerModule").ref("currentUserManagerModule"),
            property("navigationModule").ref("navigationModule"),
            property("roomManagerModule").ref("roomManagerModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.RoomListPanelContainer", RoomListPanelContainer);
});
