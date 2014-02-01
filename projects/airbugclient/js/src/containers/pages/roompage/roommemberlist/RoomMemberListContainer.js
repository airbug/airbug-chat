//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomMemberListContainer')

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
//@Require('airbug.RoomMemberListItemContainer')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var AddChange                       = bugpack.require('AddChange');
var Class                           = bugpack.require('Class');
var ClearChange                     = bugpack.require('ClearChange');
var Exception                       = bugpack.require('Exception');
var Map                             = bugpack.require('Map');
var RemoveChange                    = bugpack.require('RemoveChange');
var RemovePropertyChange            = bugpack.require('RemovePropertyChange');
var Set                             = bugpack.require('Set');
var SetPropertyChange               = bugpack.require('SetPropertyChange');
var CommandModule                   = bugpack.require('airbug.CommandModule');
var ListView                        = bugpack.require('airbug.ListView');
var ListViewEvent                   = bugpack.require('airbug.ListViewEvent');
var RoomMemberListItemContainer     = bugpack.require('airbug.RoomMemberListItemContainer');
var BugFlow                         = bugpack.require('bugflow.BugFlow');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                         = BugMeta.context();
var autowired                       = AutowiredAnnotation.autowired;
var CommandType                     = CommandModule.CommandType;
var property                        = PropertyAnnotation.property;
var view                            = ViewBuilder.view;
var $series                         = BugFlow.$series;
var $task                           = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomMemberListContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(roomModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<string, RoomMemberModel>}
         */
        this.roomMemberIdToRoomMemberModelMap   = new Map();

        /**
         * @private
         * @type {Map.<RoomModel, RoomMemberListItemContainer>}
         */
        this.roomMemberModelToListItemMap       = new Map();


        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RoomMemberList}
         */
        this.roomMemberList                     = null;

        /**
         * @private
         * @type {RoomModel}
         */
        this.roomModel                          = roomModel;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CommandModule}
         */
        this.commandModule                          = null;

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule                   = null;

        /**
         * @private
         * @type {RoomMemberManagerModule}
         */
        this.roomMemberManagerModule            = null;

        /**
         * @private
         * @type {UserManagerModule}
         */
        this.userManagerModule                 = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ListView}
         */
        this.listView                           = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routingArgs
     */
    activateContainer: function(routingArgs) {
        this._super(routingArgs);
        if (this.roomModel.getProperty("roomMemberIdSet")) {
            this.loadRoomMemberList(this.roomModel.getProperty("roomMemberIdSet"));
        }
    },

    /**
     * @protected
     * @param {Array<*>} routingArgs
     */
    createContainer: function(routingArgs) {
        this._super(routingArgs);


        // Create Models
        //-------------------------------------------------------------------------------

        this.roomMemberList     = this.roomMemberManagerModule.generateRoomMemberList();


        // Create Views
        //-------------------------------------------------------------------------------

        this.listView           = view(ListView)
                                    .attributes({trackingId: "roomMemberListContainer", trackingClasses: ["list"]})
                                    .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.listView);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();

        this.roomModel.observe(ClearChange.CHANGE_TYPE, "", this.observeRoomModelClearChange, this);
        this.roomModel.observe(SetPropertyChange.CHANGE_TYPE, "roomMemberIdSet", this.observeRoomMemberIdSetSetPropertyChange, this);
        this.roomModel.observe(RemovePropertyChange.CHANGE_TYPE, "roomMemberIdSet", this.observeRoomMemberIdSetRemovePropertyChange, this)
        this.roomModel.observe(AddChange.CHANGE_TYPE, "roomMemberIdSet", this.observeRoomMemberIdSetAddChange, this);
        this.roomModel.observe(RemoveChange.CHANGE_TYPE, "roomMemberIdSet", this.observeRoomMemberIdSetRemoveChange, this);

        this.roomMemberList.observe(AddChange.CHANGE_TYPE, "", this.observeRoomMemberListAdd, this);
        this.roomMemberList.observe(ClearChange.CHANGE_TYPE, "", this.observeRoomMemberListClear, this);
        this.roomMemberList.observe(RemoveChange.CHANGE_TYPE, "", this.observeRoomMemberListRemove, this);

        this.listView.addEventListener(ListViewEvent.EventType.ITEM_SELECTED, this.hearListViewItemSelectedEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Object} dataObject
     * @param {MeldDocument} roomMemberMeldDocument
     * @param {MeldDocument} userMeldDocument
     */
    buildRoomMemberModel: function(dataObject, roomMemberMeldDocument, userMeldDocument) {
        var roomMemberModel = this.roomMemberManagerModule.generateRoomMemberModel(dataObject, roomMemberMeldDocument, userMeldDocument);
        var roomMemberId    = roomMemberModel.getProperty("id");
        if (!this.roomMemberIdToRoomMemberModelMap.containsKey(roomMemberId)) {
            this.roomMemberIdToRoomMemberModelMap.put(roomMemberModel.getProperty("id"), roomMemberModel);
            this.roomMemberList.add(roomMemberModel);
        }
    },

    /**
     * @protected
     * @param {RoomMemberModel} roomMemberModel
     */
    buildRoomMemberListItem: function(roomMemberModel) {
        if (!this.roomMemberModelToListItemMap.containsKey(roomMemberModel)) {
            var roomMemberListItemContainer = new RoomMemberListItemContainer(roomMemberModel);
            this.addContainerChild(roomMemberListItemContainer, "#list-" + this.listView.getCid());
            this.roomMemberModelToListItemMap.put(roomMemberModel, roomMemberListItemContainer);
        }
    },

    /**
     * @private
     */
    clearRoomMemberList: function() {
        this.roomMemberList.clear();
    },

    /**
     * @private
     */
    destroyAllListItems: function() {
        var _this = this;
        this.roomMemberModelToListItemMap.forEach(function(listItemContainer) {
            _this.removeContainerChild(listItemContainer, true);
        });
    },

    /**
     * @private
     * @param {RoomMemberModel} roomMemberModel
     */
    destroyListItem: function(roomMemberModel) {
        var listItemContainer = this.roomMemberModelToListItemMap.remove(roomMemberModel);
        if (listItemContainer) {
            this.removeContainerChild(listItemContainer, true);
        }
    },

    /**
     * @private
     * @param {string} id
     */
    loadRoomMember: function(id) {
        var _this                       = this;
        /** @type {MeldDocument} */
        var roomMemberMeldDocument      = null;
        /** @type {MeldDocument} */
        var userMeldDocument            = null;
        /** @type {string} */
        var userId                      = null;

        $series([
            $task(function(flow) {
                _this.roomMemberManagerModule.retrieveRoomMember(id, function(throwable, retrievedMeldDocument) {
                    if (!throwable) {
                        roomMemberMeldDocument      =  /** @type {MeldDocument} */( retrievedMeldDocument);
                        userId                      = roomMemberMeldDocument.getData().userId;
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.userManagerModule.retrieveUser(userId, function(throwable, retrievedUserMeldDocument) {
                    if (!throwable) {
                        userMeldDocument = /** @type {MeldDocument} */(retrievedUserMeldDocument);
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                _this.buildRoomMemberModel({}, roomMemberMeldDocument, userMeldDocument);
            }
        });

    },

    /**
     * @protected
     * @param {Set.<string>} idSet
     */
    loadRoomMemberList: function(idSet) {
        console.log("RoomMemberListContainer#loadRoomMemberList");
        var _this               = this;
        var roomMemberMeldDocumentSet   = new Set();
        var userMeldDocumentMap         = new Map();
        var userIdSet                   = new Set();
        $series([
            $task(function(flow) {
                _this.roomMemberManagerModule.retrieveRoomMembers(idSet.toArray(), function(throwable, retrievedMeldDocumentMap) {
                    if (!throwable) {
                        retrievedMeldDocumentMap.forEach(function(meldDocument, id) {
                            if (meldDocument) {
                                roomMemberMeldDocumentSet.add(meldDocument);
                                userIdSet.add(meldDocument.getData().userId);
                            } else {
                                //TODO BRN: Couldn't find this meld. Make a repeat call for it. If we can't find it again, log it to the server so we know there's a problem.
                            }
                        });
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                console.log("retrieveUsers. ids:", userIdSet.toArray());
                _this.userManagerModule.retrieveUsers(userIdSet.toArray(), function(throwable, meldDocumentMap) {
                    if (!throwable) {
                        meldDocumentMap.forEach(function(meldDocument, id) {
                            if (meldDocument) {
                                userMeldDocumentMap.put(id, meldDocument);
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
                roomMemberMeldDocumentSet.forEach(function(roomMemberMeldDocument) {
                    var userMeldDocument = userMeldDocumentMap.get(roomMemberMeldDocument.getData().userId);
                    _this.buildRoomMemberModel({}, roomMemberMeldDocument, userMeldDocument);
                });
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
    processRoomMemberList: function() {
        //TODO
    },

    /**
     * @private
     * @param {string} id
     */
    removeRoomMember: function(id) {
        var model = this.roomMemberIdToRoomMemberModelMap.get(id);
        if (model) {
            this.roomMemberIdToRoomMemberModelMap.remove(id);
            this.roomMemberList.remove(model);
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ListViewEvent} event
     */
    hearListViewItemSelectedEvent: function(event) {
        var roomMember = event.getData();
        this.navigationModule.navigate("user/" + roomMember.userId, {
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
    observeRoomModelClearChange: function(change) {
        this.clearRoomMemberList();
    },

    /**
     * @private
     * @param {AddChange} change
     */
    observeRoomMemberIdSetAddChange: function(change) {
        this.loadRoomMember(change.getValue());
    },

    /**
     * @private
     * @param {RemoveChange} change
     */
    observeRoomMemberIdSetRemoveChange: function(change) {
        this.removeRoomMember(change.getValue());
    },

    /**
     * @private
     * @param {RemovePropertyChange} change
     */
    observeRoomMemberIdSetRemovePropertyChange: function(change) {
        this.clearRoomMemberList();
    },

    /**
     * @private
     * @param {SetPropertyChange} change
     */
    observeRoomMemberIdSetSetPropertyChange: function(change) {
        this.clearRoomMemberList();
        if (change.getPropertyValue()) {
            this.loadRoomMemberList(change.getPropertyValue());
        }
    },

    // RoomList Observers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {AddChange} change
     */
    observeRoomMemberListAdd: function(change) {
        var roomMemberModel = change.getValue();
        this.buildRoomMemberListItem(roomMemberModel);
    },

    /**
     * @private
     * @param {ClearChange} change
     */
    observeRoomMemberListClear: function(change) {
        this.destroyAllListItems();
        this.roomMemberModelToListItemMap.clear();
        this.processRoomMemberList();
    },

    /**
     * @private
     * @param {RemoveChange} change
     */
    observeRoomMemberListRemove: function(change) {
        var roomMemberModel = change.getValue();
        this.destroyListItem(roomMemberModel);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(RoomMemberListContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule"),
        property("navigationModule").ref("navigationModule"),
        property("roomMemberManagerModule").ref("roomMemberManagerModule"),
        property("userManagerModule").ref("userManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomMemberListContainer", RoomMemberListContainer);
