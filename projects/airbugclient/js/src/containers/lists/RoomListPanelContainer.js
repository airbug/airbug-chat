//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomListPanelContainer')

//@Require('AddChange')
//@Require('Class')
//@Require('ClearChange')
//@Require('Exception')
//@Require('Map')
//@Require('RemoveChange')
//@Require('RemovePropertyChange')
//@Require('Set')
//@Require('SetPropertyChange')
//@Require('airbug.CommandModule')
//@Require('airbug.ListView')
//@Require('airbug.ListViewEvent')
//@Require('airbug.LoaderView')
//@Require('airbug.PanelWithHeaderView')
//@Require('airbug.RoomSummaryView')
//@Require('airbug.SelectableListItemView')
//@Require('airbug.StartConversationButtonContainer')
//@Require('airbug.TextView')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var AddChange                           = bugpack.require('AddChange');
var Class                               = bugpack.require('Class');
var ClearChange                         = bugpack.require('ClearChange');
var Exception                           = bugpack.require('Exception');
var Map                                 = bugpack.require('Map');
var RemoveChange                        = bugpack.require('RemoveChange');
var RemovePropertyChange                = bugpack.require('RemovePropertyChange');
var Set                                 = bugpack.require('Set');
var SetPropertyChange                   = bugpack.require('SetPropertyChange');
var CommandModule                       = bugpack.require('airbug.CommandModule');
var ListView                            = bugpack.require('airbug.ListView');
var ListViewEvent                       = bugpack.require('airbug.ListViewEvent');
var LoaderView                          = bugpack.require('airbug.LoaderView');
var PanelWithHeaderView                 = bugpack.require('airbug.PanelWithHeaderView');
var RoomSummaryView                     = bugpack.require('airbug.RoomSummaryView');
var SelectableListItemView              = bugpack.require('airbug.SelectableListItemView');
var StartConversationButtonContainer    = bugpack.require('airbug.StartConversationButtonContainer');
var TextView                            = bugpack.require('airbug.TextView');
var BugFlow                             = bugpack.require('bugflow.BugFlow');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation                 = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation                  = bugpack.require('bugioc.PropertyAnnotation');
var CarapaceContainer                   = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                             = BugMeta.context();
var autowired                           = AutowiredAnnotation.autowired;
var CommandType                         = CommandModule.CommandType;
var property                            = PropertyAnnotation.property;
var view                                = ViewBuilder.view;
var $series                             = BugFlow.$series;
var $task                               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomListPanelContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(currentRoomModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
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

        /**
         * @private
         * @type {RoomList}
         */
        this.roomList                               = null;


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

        this.currentUserModel   = this.currentUserManagerModule.generateCurrentUserModel();
        this.roomList           = this.roomManagerModule.generateRoomList();


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
    initializeContainer: function() {
        this._super();
        this.currentUserModel.observe(ClearChange.CHANGE_TYPE, "", this.observeCurrentUserModelClearChange, this);
        this.currentUserModel.observe(SetPropertyChange.CHANGE_TYPE, "roomIdSet", this.observeRoomIdSetSetPropertyChange, this);
        this.currentUserModel.observe(RemovePropertyChange.CHANGE_TYPE, "roomIdSet", this.observeRoomIdSetRemovePropertyChange, this)
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
        var roomModel = this.roomManagerModule.generateRoomModel(data, roomMeldDocument);
        this.roomIdToRoomModelMap.put(roomModel.getProperty("id"), roomModel);
        this.roomList.add(roomModel);
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
        this.roomList.clear();
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
     * @param {ClearChange} change
     */
    observeCurrentUserModelClearChange: function(change) {
        this.clearRoomList();
    },

    /**
     * @private
     * @param {SetPropertyChange} change
     */
    observeCurrentRoomIdSetPropertyChange: function(change) {
        this.refreshCurrentActiveListItem();
    },

    /**
     * @private
     * @param {RemovePropertyChange} change
     */
    observeCurrentRoomIdRemovePropertyChange: function(change) {
        this.clearCurrentActiveListItem();
    },

    /**
     * @private
     * @param {AddChange} change
     */
    observeRoomIdSetAddChange: function(change) {
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
     * @param {RemovePropertyChange} change
     */
    observeRoomIdSetRemovePropertyChange: function(change) {
        this.clearRoomList();
    },

    /**
     * @private
     * @param {SetPropertyChange} change
     */
    observeRoomIdSetSetPropertyChange: function(change) {
        this.clearRoomList();
        if (change.getPropertyValue()) {
            this.loadRoomList(change.getPropertyValue());
        }
    },

    // RoomList Observers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {AddChange} change
     */
    observeRoomListAdd: function(change) {
        var roomModel = change.getValue();
        this.buildRoomListItemView(roomModel);
    },

    /**
     * @private
     * @param {ClearChange} change
     */
     observeRoomListClear: function(change) {
        this.destroyAllListItemViews();
        this.roomModelToListItemViewMap.clear();
        this.processRoomList();
    },

    /**
     * @private
     * @param {RemoveChange} change
     */
    observeRoomListRemove: function(change) {
        var roomModel = change.getValue();
        this.destroyListItemView(roomModel);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(RoomListPanelContainer).with(
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
