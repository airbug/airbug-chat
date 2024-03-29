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

//@Export('airbug.ImageListContainer')

//@Require('AddChange')
//@Require('Class')
//@Require('ClearChange')
//@Require('Flows')
//@Require('ISet')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('RemoveChange')
//@Require('RemovePropertyChange')
//@Require('Set')
//@Require('SetPropertyChange')
//@Require('airbug.ListContainer')
//@Require('airbug.UserImageAssetContainer')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var AddChange                   = bugpack.require('AddChange');
    var Class                       = bugpack.require('Class');
    var ClearChange                 = bugpack.require('ClearChange');
    var Flows                       = bugpack.require('Flows');
    var ISet                        = bugpack.require('ISet');
    var Map                         = bugpack.require('Map');
    var Obj                         = bugpack.require('Obj');
    var RemoveChange                = bugpack.require('RemoveChange');
    var RemovePropertyChange        = bugpack.require('RemovePropertyChange');
    var Set                         = bugpack.require('Set');
    var SetPropertyChange           = bugpack.require('SetPropertyChange');
    var ListContainer               = bugpack.require('airbug.ListContainer');
    var UserImageAssetContainer     = bugpack.require('airbug.UserImageAssetContainer');
    var AutowiredTag                = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag                 = bugpack.require('bugioc.PropertyTag');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');
    var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                   = AutowiredTag.autowired;
    var bugmeta                     = BugMeta.context();
    var property                    = PropertyTag.property;
    var view                        = ViewBuilder.view;
    var $series                     = Flows.$series;
    var $task                       = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ListContainer}
     */
    var ImageListContainer = Class.extend(ListContainer, {

        _name: "airbug.ImageListContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ObservableList.<UserImageAssetModel>} userImageAssetList
         */
        _constructor: function(userImageAssetList) {

            this._super("No images in your list");


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Logger}
             */
            this.logger                             = null;


            // Models
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ObservableList.<UserImageAssetModel>}
             */
            this.userImageAssetList                 = userImageAssetList;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createContainerChildren: function() {
            this._super();
            this.processUserImageAssetList();
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.userImageAssetList.unobserve(AddChange.CHANGE_TYPE, "", this.observeUserImageAssetListAdd, this);
            this.userImageAssetList.unobserve(ClearChange.CHANGE_TYPE, "", this.observeUserImageAssetListClear, this);
            this.userImageAssetList.unobserve(RemoveChange.CHANGE_TYPE, "", this.observeUserImageAssetListRemove, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.userImageAssetList.observe(AddChange.CHANGE_TYPE, "", this.observeUserImageAssetListAdd, this);
            this.userImageAssetList.observe(ClearChange.CHANGE_TYPE, "", this.observeUserImageAssetListClear, this);
            this.userImageAssetList.observe(RemoveChange.CHANGE_TYPE, "", this.observeUserImageAssetListRemove, this);
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {UserImageAssetContainer} userImageAssetContainer
         */
        appendUserImageAssetContainer: function(userImageAssetContainer) {
            this.hidePlaceholder();
            this.addContainerChild(userImageAssetContainer, "#list-" + this.getListView().getCid());
        },

        /**
         * @protected
         * @param {UserImageAssetModel} userImageAssetModel
         * @return {UserImageAssetContainer}
         */
        createUserImageAssetContainer: function(userImageAssetModel) {
            if (!this.hasCarapaceModel(userImageAssetModel)) {
                var userImageAssetContainer = new UserImageAssetContainer(userImageAssetModel);
                this.mapModelToContainer(userImageAssetModel, userImageAssetContainer);
                return userImageAssetContainer;
            }
            return null;
        },

        /**
         * @protected
         */
        processUserImageAssetList: function() {
            var _this = this;
            this.userImageAssetList.forEach(function(userImageAssetModel) {
                var userImageAssetContainer = _this.createUserImageAssetContainer(userImageAssetModel);
                _this.appendUserImageAssetContainer(userImageAssetContainer);
            });
        },

        /**
         * @protected
         * @param {UserImageAssetContainer} userImageAssetContainer
         */
        prependUserImageAssetContainer: function(userImageAssetContainer) {
            this.hidePlaceholder();
            this.prependContainerChild(userImageAssetContainer, "#list-" + this.getListView().getCid());
        },


        //-------------------------------------------------------------------------------
        // Model Observers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Observation} observation
         */
        observeUserImageAssetListAdd: function(observation) {
            var change                   = /** @type {AddAtChange} */(observation.getChange());
            var userImageAssetModel     = change.getValue();
            var index                   = change.getIndex();
            var userImageAssetContainer = this.createUserImageAssetContainer(userImageAssetModel);
            if (index === 0) {
                this.prependUserImageAssetContainer(userImageAssetContainer);
            } else {
                this.appendUserImageAssetContainer(userImageAssetContainer);
            }
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeUserImageAssetListClear: function(observation) {
            this.removeAllContainerChildren(true);
            this.clearModelMap();
            this.processUserImageAssetList();
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeUserImageAssetListRemove: function(observation) {
            var change                      = /** @type {RemoveAtChange} */(observation.getChange());
            var userImageAssetModel         = change.getValue();
            var userImageAssetContainer     = this.getContainerForModel(userImageAssetModel);
            this.unmapModel(userImageAssetModel);
            this.removeContainerChild(userImageAssetContainer, true);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(ImageListContainer).with(
        autowired().properties([
            property("logger").ref("logger")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ImageListContainer", ImageListContainer);
});
