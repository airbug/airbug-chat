//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('BetaKeyCounterManager')
//@Autoload

//@Require('Class')
//@Require('Set')
//@Require('TypeUtil')
//@Require('airbugserver.BetaKeyCounter')
//@Require('bugentity.EntityManager')
//@Require('bugentity.EntityManagerAnnotation')
//@Require('bugioc.ArgAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var List                        = bugpack.require('List');
var TypeUtil                    = bugpack.require('TypeUtil');
var BetaKeyCounter              = bugpack.require('airbugserver.BetaKeyCounter');
var EntityManager               = bugpack.require('bugentity.EntityManager');
var EntityManagerAnnotation     = bugpack.require('bugentity.EntityManagerAnnotation');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                         = ArgAnnotation.arg;
var bugmeta                     = BugMeta.context();
var entityManager               = EntityManagerAnnotation.entityManager;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 *
 * @extends {EntityManager}
 */
var BetaKeyCounterManager = Class.extend(EntityManager, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {BetaKeyCounter} betaKeyCounter
     * @param {(Array.<string> | function(Throwable, BetaKeyCounter))} dependencies
     * @param {function(Throwable, BetaKeyCounter)=} callback
     */
    createBetaKeyCounter: function(betaKeyCounter, dependencies, callback) {
        if(TypeUtil.isFunction(dependencies)){
            callback        = dependencies;
            dependencies    = [];
        };
        var options         = {};
        this.create(betaKeyCounter, options, dependencies, callback);
    },

    /**
     * @param {{
     *      createdAt: Date,
     *      betaKey: string,
     *      isBaseKey: boolean,
     *      count: number,
     *      updatedAt: Date
     * }} data
     * @return {BetaKeyCounter}
     */
    generateBetaKeyCounter: function(data) {
        var betaKeyCounter = new BetaKeyCounter(data);
        this.generate(betaKeyCounter);
        return betaKeyCounter;
    },

    /**
     * @param {string} betaKey
     * @param {function(Throwable, BetaKeyCounter)} callback
     */
    retrieveBetaKeyCounterByBetaKey: function(betaKey, callback) {
        var _this = this;
        this.dataStore.findOne({betaKey: betaKey}).lean(true).exec(function(throwable, dbObject){
            if (!throwable) {
                var betaKeyCounter = _this.convertDbObjectToEntity(dbObject);
                betaKeyCounter.commitDelta();
                callback(undefined, betaKeyCounter);
            } else {
                callback(throwable, undefined);
            }
        });
    },

    /**
     * @param {function(Throwable, Map.<string, BetaKeyCounter>=)} callback
     */
    retrieveAllBetaKeyCounters: function(callback) {
        var _this = this;
        this.dataStore.find({}).lean(true).exec(function(throwable, dbObjects) {
            if (!throwable) {
                var newList = new List();
                dbObjects.forEach(function(dbObject) {
                    var betaKeyCounter = _this.convertDbObjectToEntity(dbObject);
                    betaKeyCounter.commitDelta();
                    newList.add(betaKeyCounter);
                });
                callback(undefined, newList);
            } else {
                callback(throwable, undefined);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(BetaKeyCounterManager).with(
    entityManager("betaKeyCounterManager")
        .ofType("BetaKeyCounter")
        .args([
            arg().ref("entityManagerStore"),
            arg().ref("schemaManager"),
            arg().ref("mongoDataStore")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.BetaKeyCounterManager', BetaKeyCounterManager);
