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

//@Export('airbug.RoomMemberListContainer')

//@Require('AddChange')
//@Require('Class')
//@Require('ClearChange')
//@Require('Exception')
//@Require('Flows')
//@Require('Map')
//@Require('ObservableList')
//@Require('RemoveChange')
//@Require('RemovePropertyChange')
//@Require('Set')
//@Require('SetPropertyChange')
//@Require('airbug.CommandModule')
//@Require('airbug.RoomMemberListItemContainer')
//@Require('airbug.RoomMemberModel')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ListView')
//@Require('carapace.ListViewEvent')
//@Require('carapace.LoaderView')
//@Require('carapace.ModelBuilder')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var AddChange                       = bugpack.require('AddChange');
    var Class                           = bugpack.require('Class');
    var ClearChange                     = bugpack.require('ClearChange');
    var Exception                       = bugpack.require('Exception');
    var Flows                           = bugpack.require('Flows');
    var Map                             = bugpack.require('Map');
    var ObservableList                  = bugpack.require('ObservableList');
    var RemoveChange                    = bugpack.require('RemoveChange');
    var RemovePropertyChange            = bugpack.require('RemovePropertyChange');
    var Set                             = bugpack.require('Set');
    var SetPropertyChange               = bugpack.require('SetPropertyChange');
    var CommandModule                   = bugpack.require('airbug.CommandModule');
    var RoomMemberListItemContainer     = bugpack.require('airbug.RoomMemberListItemContainer');
    var RoomMemberModel                 = bugpack.require('airbug.RoomMemberModel');
    var AutowiredTag                    = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag                     = bugpack.require('bugioc.PropertyTag');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
    var ListView                        = bugpack.require('carapace.ListView');
    var ListViewEvent                   = bugpack.require('carapace.ListViewEvent');
    var LoaderView                      = bugpack.require('carapace.LoaderView');
    var ModelBuilder                    = bugpack.require('carapace.ModelBuilder');
    var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                         = BugMeta.context();
    var autowired                       = AutowiredTag.autowired;
    var CommandType                     = CommandModule.CommandType;
    var model                           = ModelBuilder.model;
    var property                        = PropertyTag.property;
    var view                            = ViewBuilder.view;
    var $series                         = Flows.$series;
    var $task                           = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var RoomMemberListContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.RoomMemberListContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {RoomModel} roomModel
         */
        _constructor: function(roomModel) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Map.<string, RoomMemberModel>}
             */
            this.roomMemberIdToRoomMemberModelMap   = new Map();

            /**
             * @private
             * @type {ObservableList.<RoomMemberModel>}
             */
            this.roomMemberList                     = new ObservableList();

            /**
             * @private
             * @type {Map.<RoomModel, RoomMemberListItemContainer>}
             */
            this.roomMemberModelToListItemMap       = new Map();


            // Models
            //-------------------------------------------------------------------------------

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
            this.commandModule                      = null;

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

            /**
             * @private
             * @type {LoaderView}
             */
            this.loaderView                         = null;
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


            // Create Views
            //-------------------------------------------------------------------------------

            view(ListView)
                .name("listView")
                .attributes({
                    placeholder: "No one in this room",
                    trackingId: "roomMemberListContainer",
                    trackingClasses: ["list"]
                })
                .children([
                    view(LoaderView)
                        .name("loaderView")
                        .attributes({
                            size: LoaderView.Size.SMALL
                        })
                        .appendTo("#list-{{cid}}")
                ])
                .build(this);


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.listView);
            this.addModel(this.roomModel);
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();

            this.roomModel.unobserve(ClearChange.CHANGE_TYPE, "", this.observeRoomModelClearChange, this);
            this.roomModel.unobserve(SetPropertyChange.CHANGE_TYPE, "roomMemberIdSet", this.observeRoomMemberIdSetSetPropertyChange, this);
            this.roomModel.unobserve(RemovePropertyChange.CHANGE_TYPE, "roomMemberIdSet", this.observeRoomMemberIdSetRemovePropertyChange, this)
            this.roomModel.unobserve(AddChange.CHANGE_TYPE, "roomMemberIdSet", this.observeRoomMemberIdSetAddChange, this);
            this.roomModel.unobserve(RemoveChange.CHANGE_TYPE, "roomMemberIdSet", this.observeRoomMemberIdSetRemoveChange, this);

            this.roomMemberList.unobserve(AddChange.CHANGE_TYPE, "", this.observeRoomMemberListAdd, this);
            this.roomMemberList.unobserve(ClearChange.CHANGE_TYPE, "", this.observeRoomMemberListClear, this);
            this.roomMemberList.unobserve(RemoveChange.CHANGE_TYPE, "", this.observeRoomMemberListRemove, this);

            this.listView.removeEventListener(ListViewEvent.EventType.ITEM_SELECTED, this.hearListViewItemSelectedEvent, this);
        },

        /**
         * @protected
         */
        destroyContainer: function() {
            this._super();
            this.clearRoomMemberList();
            this.destroyAllListItems();
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();

            this.roomModel.observe(ClearChange.CHANGE_TYPE, "", this.observeRoomModelClearChange, this);
            this.roomModel.observe(SetPropertyChange.CHANGE_TYPE, "roomMemberIdSet", this.observeRoomMemberIdSetSetPropertyChange, this);
            this.roomModel.observe(RemovePropertyChange.CHANGE_TYPE, "roomMemberIdSet", this.observeRoomMemberIdSetRemovePropertyChange, this);
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
            var roomMemberModel =
                model(RoomMemberModel)
                    .args([
                        dataObject,
                        roomMemberMeldDocument,
                        userMeldDocument
                    ])
                    .build();
            var roomMemberId    = roomMemberModel.getProperty("id");
            if (!this.roomMemberIdToRoomMemberModelMap.containsKey(roomMemberId)) {
                this.roomMemberIdToRoomMemberModelMap.put(roomMemberModel.getProperty("id"), roomMemberModel);
                this.roomMemberList.add(roomMemberModel);
                this.addModel(roomMemberModel);
                this.listView.hidePlaceholder();
            }
        },

        /**
         * @protected
         * @param {RoomMemberModel} roomMemberModel
         */
        buildRoomMemberListItem: function(roomMemberModel) {
            if (!this.roomMemberModelToListItemMap.containsKey(roomMemberModel)) {
                var roomMemberListItemContainer = new RoomMemberListItemContainer(roomMemberModel);
                this.addContainerChild(roomMemberListItemContainer, "#list-{{cid}}");
                this.roomMemberModelToListItemMap.put(roomMemberModel, roomMemberListItemContainer);
            }
        },

        /**
         * @private
         */
        clearRoomMemberList: function() {
            var _this = this;
            this.roomMemberList.forEach(function(roomMemberModel) {
                _this.removeModel(roomMemberModel);
            });
            this.roomMemberList.clear();
            this.roomMemberIdToRoomMemberModelMap.clear();
        },

        /**
         * @private
         */
        destroyAllListItems: function() {
            var _this = this;
            this.roomMemberModelToListItemMap.forEach(function(listItemContainer) {
                _this.removeContainerChild(listItemContainer, true);
            });
            this.roomMemberModelToListItemMap.clear();
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
                    _this.loaderView.hide();
                    if (roomMemberMeldDocumentSet.getCount() > 0) {
                        roomMemberMeldDocumentSet.forEach(function(roomMemberMeldDocument) {
                            var userMeldDocument = userMeldDocumentMap.get(roomMemberMeldDocument.getData().userId);
                            _this.buildRoomMemberModel({}, roomMemberMeldDocument, userMeldDocument);
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
                this.roomMemberList.remove(model)
                this.removeModel(model);
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
         * @param {Observation} observation
         */
        observeRoomModelClearChange: function(observation) {
            this.clearRoomMemberList();
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeRoomMemberIdSetAddChange: function(observation) {
            var change = /** @type {AddChange} */(observation.getChange());
            this.loadRoomMember(change.getValue());
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeRoomMemberIdSetRemoveChange: function(observation) {
            var change = /** @type {RemoveChange} */(observation.getChange());
            this.removeRoomMember(change.getValue());
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeRoomMemberIdSetRemovePropertyChange: function(observation) {
            this.clearRoomMemberList();
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeRoomMemberIdSetSetPropertyChange: function(observation) {
            var change = /** @type {SetPropertyChange} */(observation.getChange());
            this.clearRoomMemberList();
            if (change.getPropertyValue()) {
                this.loadRoomMemberList(change.getPropertyValue());
            }
        },


        // RoomList Observers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Observation} observation
         */
        observeRoomMemberListAdd: function(observation) {
            var change = /** @type {AddChange} */(observation.getChange());
            var roomMemberModel = change.getValue();
            this.buildRoomMemberListItem(roomMemberModel);
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeRoomMemberListClear: function(observation) {
            this.destroyAllListItems();
            this.roomMemberModelToListItemMap.clear();
            this.processRoomMemberList();
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeRoomMemberListRemove: function(observation) {
            var change = /** @type {RemoveChange} */(observation.getChange());
            var roomMemberModel = change.getValue();
            this.destroyListItem(roomMemberModel);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(RoomMemberListContainer).with(
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
});
