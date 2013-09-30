//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('MeldService')

//@Require('Class')
//@Require('Obj')
//@Require('bugdelta.PropertyChange')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var PropertyChange  = bugpack.require('bugdelta.PropertyChange');


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
     * @param {string} filter
     * @return {MeldKey}
     */
    generateMeldKey: function(type, id, filter) {
        return this.meldBuilder.generateMeldKey(type, id, filter);
    },

    /**
     * @param {MeldManager} meldManager
     * @param {string} type
     * @param {string} filter
     * @param {Entity} entity
     */
    meldEntity: function(meldManager, type, filter, entity) {
        var meldKey = this.generateMeldKey(type, entity.getId(), filter);
        var meldObject = undefined;
        if (!meldManager.containsMeldByKey(meldKey)) {
            entity.commitDelta();
            meldObject = this.meldBuilder.generateMeldObjectFromObject(entity.toObject());
            meldManager.addMeld(meldObject);
        } else {
            entity.generateDelta().forEach(function(deltaChange) {
                switch (propertyChange.getChangeType()) {
                    case PropertyChange.ChangeTypes.PROPERTY_REMOVED:
                        meldObject.unmeldProperty(propertyChange.getPropertyName());
                        break;
                    case PropertyChange.ChangeTypes.PROPERTY_SET:
                        meldObject.meldProperty(propertyChange.getPropertyName(),  propertyChange.getPropertyValue());
                        break;
                }
            });
            entity.commitDelta();
        }
    },

    /**
     * @param {MeldManager} meldManager
     * @param {User} user
     * @param {(Array.<MeldKey> | Collection.<MeldKey>)} meldKeys
     */
    meldUserWithKeys: function(meldManager, user, meldKeys) {
        var callManagerSet = this.callService.findCallManagerSetByUserId(user.getId());
        callManagerSet.forEach(function(callManager) {
            meldKeys.forEach(function(meldKey) {
                meldManager.meldCallManagerWithKey(callManager, meldKey);
            });
        });
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
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.MeldService', MeldService);
