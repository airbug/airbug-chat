//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('MeldService')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugdelta.DeltaBuilder')
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
var TypeUtil                = bugpack.require('TypeUtil');
var DeltaBuilder            = bugpack.require('bugdelta.DeltaBuilder');
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
     * @param {Entity} entity
     * @return {MeldKey}
     */
    generateMeldKeyFromEntity: function(entity) {
        return this.meldBuilder.generateMeldKey(entity.getEntityType(), entity.getId());
    },

    /**
     * @param {MeldManager} meldManager
     * @param {User} user
     * @param {(Array.<MeldKey> | Collection.<MeldKey>)} meldKeys
     * @param {string} reason
     */
    meldUserWithKeysAndReason: function(meldManager, user, meldKeys, reason) {
        var _this = this;
        user.getSessionSet().forEach(function(session) {
            var callManagerSet = _this.callService.findCallManagerSetBySessionId(session.getSid());
            if (callManagerSet) {
                callManagerSet.forEach(function(callManager) {
                    meldKeys.forEach(function(meldKey) {
                        meldManager.meldCallManagerWithKeyAndReason(callManager, meldKey, reason);
                    });
                });
            }
        });
    },

    /**
     * @param {MeldManager} meldManager
     * @param {(Entity | Array.<Entity>)} entities
     */
    pushEntity: function(meldManager, entities) {
        var _this = this;
        if (TypeUtil.isArray(entities)) {
            entities.forEach(function(entity) {
                _this.doPushEntity(meldManager, entity);
            });
        } else {
            this.doPushEntity(meldManager, entities);
        }
    },

    /**
     * @param {MeldManager} meldManager
     * @param {Entity} entity
     */
    unpushEntity: function(meldManager, entity) {
        var meldKey = this.generateMeldKeyFromEntity(entity);
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
        var _this = this;
        console.log("Inside MeldService#unmeldUserWithKeysAndReason");
        user.getSessionSet().forEach(function(session) {
            var callManagerSet = _this.callService.findCallManagerSetBySessionId(session.getSid());
            if (callManagerSet) {
                callManagerSet.forEach(function(callManager) {
                    console.log("Inside callManagerSet.forEach loop");
                    meldKeys.forEach(function(meldKey) {
                        console.log("Inside meldKeys.forEach loop");
                        meldManager.unmeldCallManagerWithKeyAndReason(callManager, meldKey, reason);
                    });
                });
            }
        });
        console.log("End of MeldService#unmeldUserWithKeysAndReason");
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {MeldManager} meldManager
     * @param {Entity} entity
     */
    doPushEntity: function(meldManager, entity) {
        /** @type {MeldKey} */
        var meldKey = this.generateMeldKeyFromEntity(entity);
        /** @type {MeldDocument} */
        var meldDocument = null;
        if (!meldManager.containsMeldByKey(meldKey)) {

            //TEST
            console.log("MeldService#meldEntity - MeldManager did not contain meldKey:", meldKey.toKey());

            meldDocument = this.meldBuilder.generateMeldDocument(meldKey);
            meldManager.meldMeld(meldDocument);
            meldDocument.meldData(entity.toObject());
        } else {
            meldDocument = meldManager.getMeld(meldKey);

            // TODO BRN: MUST write a unit test that ensures that the operation for this meld generates the meld at
            // this point in time and NOT with all of the additional property changes that will come after it.

            meldManager.meldMeld(meldDocument);

            var deltaBuilder        = new DeltaBuilder();
            var meldDeltaDocument   = meldDocument.getDeltaDocument();
            var entityDeltaDocument = entity.getDeltaDocument();
            var delta               = deltaBuilder.buildDelta(entityDeltaDocument, meldDeltaDocument);
            delta.getDeltaChangeList().forEach(function(deltaChange) {
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
                        meldDocument.meldToSet(deltaChange.getPath(), Obj.clone(deltaChange.getSetValue(), true));
                        break;
                    case SetChange.ChangeTypes.REMOVED_FROM_SET:
                        meldDocument.unmeldFromSet(deltaChange.getPath(), Obj.clone(deltaChange.getSetValue(), true));
                        break;
                }
            });
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.MeldService', MeldService);
