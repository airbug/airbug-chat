//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('MeldService')

//@Require('Class')
//@Require('Obj')
//@Require('bugdelta.DeltaDocumentChange')
//@Require('bugdelta.ObjectChange')
//@Require('bugdelta.SetChange')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var DeltaDocumentChange     = bugpack.require('bugdelta.DeltaDocumentChange');
var ObjectChange            = bugpack.require('bugdelta.ObjectChange');
var SetChange               = bugpack.require('bugdelta.SetChange');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(meldManagerFactory, meldBuilder, callService) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CallService}
         */
        this.callService            = callService;

        /**
         * @private
         * @type {MeldBuilder}
         */
        this.meldBuilder            = meldBuilder;

        /**
         * @private
         * @type {MeldManagerFactory}
         */
        this.meldManagerFactory     = meldManagerFactory;
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {MeldManager}
     */
    factoryManager: function() {
        return this.meldManagerFactory.factoryManager();
    },

    /**
     * @param {string} type
     * @param {string} id
     * @param {string=} filter
     * @return {MeldKey}
     */
    generateMeldKey: function(type, id, filter) {
        if (!filter) {
            filter = "basic";
        }
        return this.meldBuilder.generateMeldKey(type, id, filter);
    },

    /**
     * @param {MeldManager} meldManager
     * @param {string} type
     * @param {string} filter
     * @param {Entity} entity
     */
    meldEntity: function(meldManager, type, filter, entity) {
        try{
            var meldKey = this.generateMeldKey(type, entity.getId(), filter);
            var meldDocument = undefined;
            if (!meldManager.containsMeldByKey(meldKey)) {
                try{
                    try{
                        entity.commitDelta();
                    } catch(error){
                        console.log("Error inside entity.commitDelta");
                    }
                    try{
                        meldDocument = this.meldBuilder.generateMeldDocument(meldKey);
                    } catch(error){
                        console.log("Error inside meldBuilder.generateMeldDocument");
                    }
                    try{
                        meldManager.meldMeld(meldDocument);
                    } catch(error){
                        console.log("Error inside meldManager.meldMeld");
                    }
                    try{
                        meldDocument.meldData(Obj.clone(entity.getDeltaDocument().getData(), true));
                    } catch(error){
                        //Error here
                        console.log("Error inside meldDocument.meldData or entty.getDeltaDocument().getData()")
                    }
                } catch(error){
                    console.log("Error inside first part of if");
                }

            } else {
                meldDocument = meldManager.getMeld(meldKey);

                // TODO BRN: MUST write a unit test that ensures that the operation for this meld generates the meld at
                // this point in time and NOT with all of the additional property changes that will come after it.

                meldManager.meldMeld(meldDocument);
                entity.generateDelta().getDeltaChangeList().forEach(function(deltaChange) {
                    switch (deltaChange.getChangeType()) {
                        case DeltaDocumentChange.ChangeTypes.DATA_SET:
                            meldDocument.meldData(Obj.clone(deltaChange.getData(), true));
                            break;
                        case ObjectChange.ChangeTypes.PROPERTY_REMOVED:
                            meldDocument.unmeldObjectProperty(deltaChange.getPath(), deltaChange.getPropertyName());
                            break;
                        case ObjectChange.ChangeTypes.PROPERTY_SET:
                            meldDocument.meldObjectProperty(deltaChange.getPath(), deltaChange.getPropertyName(), Obj.clone(deltaChange.getPropertyValue(), true));
                            break;
                        case SetChange.ChangeTypes.ADDED_TO_SET:
                            meldDocument.meldToSet(deltaChange.getPath(), deltaChange.getSetValue());
                            break;
                        case SetChange.ChangeTypes.REMOVED_FROM_SET:
                            meldDocument.unmeldFromSet(deltaChange.getPath(), deltaChange.getSetValue());
                            break;
                    }
                });
                entity.commitDelta();
            }
        } catch(error) {
            console.log("Error inside of MeldService#meldEntity");
            console.log("error:", error);
        }
    },

    /**
     * @param {MeldManager} meldManager
     * @param {User} user
     * @param {(Array.<MeldKey> | Collection.<MeldKey>)} meldKeys
     * @param {string} reason
     */
    meldUserWithKeysAndReason: function(meldManager, user, meldKeys, reason) {

        //TEST
        console.log("Inside MeldService#meldUserWithKeysAndReason - user.getId():", user.getId());

        var callManagerSet = this.callService.findCallManagerSetByUserId(user.getId());
        // if (callManagerSet) {
            callManagerSet.forEach(function(callManager) {
                meldKeys.forEach(function(meldKey) {
                    meldManager.meldCallManagerWithKeyAndReason(callManager, meldKey, reason);
                });
            });
        // }
    },

    /**
     * @param {MeldManager} meldManager
     * @param {string} type
     * @param {string} filter
     * @param {Entity} entity
     */
    unmeldEntity: function(meldManager, type, filter, entity) {
        var meldKey = this.generateMeldKey(type, entity.getId(), filter);
        if (meldManager.containsMeldByKey(meldKey)) {
            meldManager.removeMeld(meldKey);
        }
    },

    /**
     * @param {MeldManager} meldManager
     * @param {User} user
     * @param {(Array.<MeldKey> | Collection.<MeldKey>)} meldKeys
     * @param {string} reason
     */
    unmeldUserWithKeysAndReason: function(meldManager, user, meldKeys, reason) {
        console.log("Inside MeldService#unmeldUserWithKeysAndReason");
        var callManagerSet = this.callService.findCallManagerSetByUserId(user.getId());
        callManagerSet.forEach(function(callManager) {
            console.log("Inside callManagerSet.forEach loop");
            meldKeys.forEach(function(meldKey) {
                console.log("Inside meldKeys.forEach loop");
                meldManager.unmeldCallManagerWithKeyAndReason(callManager, meldKey, reason);
            });
        });
        console.log("End of MeldService#unmeldUserWithKeysAndReason");
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.MeldService', MeldService);
