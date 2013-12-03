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
//@Require('airbug.ListView')
//@Require('airbug.ListViewEvent')
//@Require('airbug.RoomMemberListItemContainer')
//@Require('airbug.TextView')
//@Require('airbug.UserNameView')
//@Require('airbug.UserStatusIndicatorView')
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
var ListView                        = bugpack.require('airbug.ListView');
var ListViewEvent                   = bugpack.require('airbug.ListViewEvent');
var RoomMemberListItemContainer     = bugpack.require('airbug.RoomMemberListItemContainer');
var TextView                        = bugpack.require('airbug.TextView');
var UserNameView                    = bugpack.require('airbug.UserNameView');
var UserStatusIndicatorView         = bugpack.require('airbug.UserStatusIndicatorView');
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
         * @type {NavigationModule}
         */
        this.navigationModule                   = null;

        /**
         * @private
         * @type {RoomManagerModule}
         */
        this.roomManagerModule                  = null;

        /**
         * @private
         * @type {RoomMemberManagerModule}
         */
        this.roomMemberManagerModule            = null;


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
     * @param {MeldDocument} meldDocument
     */
    buildRoomMemberModel: function(dataObject, meldDocument) {
        var roomMemberModel = this.roomMemberManagerModule.generateRoomMemberModel(dataObject, meldDocument);
        this.roomMemberIdToRoomMemberModelMap.put(roomMemberModel.getProperty("id"), roomMemberModel);

        //TEST
        console.log("Adding roomMemberModel - ", roomMemberModel);

        this.roomMemberList.add(roomMemberModel);
    },

    /**
     * @protected
     * @param {RoomMemberModel} roomMemberModel
     */
    buildRoomMemberListItemContainer: function(roomMemberModel) {
        var roomMemberListItemContainer = new RoomMemberListItemContainer(roomMemberModel);
        this.addContainerChild(roomMemberListItemContainer, "#list-" + this.listView.cid);
        this.roomMemberModelToListItemMap.put(roomMemberModel, roomMemberListItemContainer);
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
    destroyAllListItemViews: function() {
        var _this = this;
        this.roomMemberModelToListItemMap.forEach(function(listItemContainer) {
            _this.removeContainerChild(listItemContainer, true);
        });
    },

    /**
     * @private
     * @param {RoomMemberModel} roomMemberModel
     */
    destroyListItemView: function(roomMemberModel) {
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
        var _this               = this;
        var meldDocument         = undefined;
        $series([
            $task(function(flow) {
                _this.roomMemberManagerModule.retrieveRoomMember(id, function(throwable, retrievedMeldDocument) {
                    if (!throwable) {
                        meldDocument        = retrievedMeldDocument;
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                _this.buildRoomMemberModel({}, meldDocument);
            }
        });
    },

    /**
     * @protected
     * @param {Set.<string>} roomMemberIdSet
     */
    loadRoomMemberList: function(idSet) {
        var _this               = this;
        var meldDocumentSet     = new Set();
        $series([
            $task(function(flow) {
                _this.roomMemberManagerModule.retrieveRoomMembers(idSet.toArray(), function(throwable, retrievedMeldDocumentMap) {
                    if (!throwable) {
                        retrievedMeldDocumentMap.forEach(function(meldDocument, id) {
                            if (meldDocument) {
                                meldDocumentSet.add(meldDocument);
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
                meldDocumentSet.forEach(function(meldDocument) {
                    _this.buildRoomMemberModel({}, meldDocument);
                });
            } else {
                //TODO Error handling
                //TODO Error tracking
                //TODO BRN: If we have a partial response, we should add the room models to the collection that
                // successfully came back and then figure out what to do with the ones that failed

                //TODO BRN: Need to introduce some sort of error handling system that can take any error and figure out what to do with it and what to show the user

                var parentContainer     = _this.getContainerParent();
                var notificationView    = parentContainer.getNotificationView();
                if (Class.doesExtend(throwable, Exception)) {
                    notificationView.flashExceptionMessage(throwable.getMessage());
                } else {
                    notificationView.flashErrorMessage("Sorry an error has occurred");
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
        this.navigationModule.navigate("room-member/" + roomMember.uuid, {
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
        var roomModel = change.getValue();
        this.buildRoomMemberListItemContainer(roomModel);
    },

    /**
     * @private
     * @param {ClearChange} change
     */
    observeRoomMemberListClear: function(change) {
        this.destroyAllListItemViews();
        this.roomMemberModelToListItemMap.clear();
        this.processRoomMemberList();
    },

    /**
     * @private
     * @param {RemoveChange} change
     */
    observeRoomMemberListRemove: function(change) {
        var roomModel = change.getValue();
        this.destroyListItemView(roomModel);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(RoomMemberListContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule"),
        property("roomManagerModule").ref("roomManagerModule"),
        property("roomMemberManagerModule").ref("roomMemberManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomMemberListContainer", RoomMemberListContainer);
