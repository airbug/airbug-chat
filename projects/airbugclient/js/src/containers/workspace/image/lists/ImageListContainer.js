//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ImageListContainer')

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
//@Require('airbug.ListContainer')
//@Require('airbug.UserImageAssetContainer')
//@Require('bugflow.BugFlow')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
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
    var ISet                                = bugpack.require('ISet');
    var Map                                 = bugpack.require('Map');
    var Obj                                 = bugpack.require('Obj');
    var RemoveChange                        = bugpack.require('RemoveChange');
    var RemovePropertyChange                = bugpack.require('RemovePropertyChange');
    var Set                                 = bugpack.require('Set');
    var SetPropertyChange                   = bugpack.require('SetPropertyChange');
    var ListContainer                       = bugpack.require('airbug.ListContainer');
    var UserImageAssetContainer             = bugpack.require('airbug.UserImageAssetContainer');
    var BugFlow                             = bugpack.require('bugflow.BugFlow');
    var AutowiredAnnotation                 = bugpack.require('bugioc.AutowiredAnnotation');
    var PropertyAnnotation                  = bugpack.require('bugioc.PropertyAnnotation');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');
    var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                           = AutowiredAnnotation.autowired;
    var bugmeta                             = BugMeta.context();
    var property                            = PropertyAnnotation.property;
    var view                                = ViewBuilder.view;
    var $series                             = BugFlow.$series;
    var $task                               = BugFlow.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ListContainer}
     */
    var ImageListContainer = Class.extend(ListContainer, {

        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {UserImageAssetList} userImageAssetList
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
             * @type {UserImageAssetList}
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
        // Private Methods
        //-------------------------------------------------------------------------------


        //-------------------------------------------------------------------------------
        // Model Observers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {AddAtChange} change
         */
        observeUserImageAssetListAdd: function(change){
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
         * @param {ClearChange} change
         */
        observeUserImageAssetListClear: function(change) {
            this.removeAllContainerChildren(true);
            this.clearModelMap();
            this.processUserImageAssetList();
        },

        /**
         * @private
         * @param {RemoveAtChange} change
         */
        observeUserImageAssetListRemove: function(change) {
            var userImageAssetModel         = change.getValue();
            var userImageAssetContainer     = this.getContainerForModel(userImageAssetModel);
            this.unmapModel(userImageAssetModel);
            this.removeContainerChild(userImageAssetContainer, true);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(ImageListContainer).with(
        autowired().properties([
            property("logger").ref("logger")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ImageListContainer", ImageListContainer);
});