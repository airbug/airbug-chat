//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('BetaKeyManager')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Set')
//@Require('TypeUtil')
//@Require('airbugserver.BetaKey')
//@Require('bugentity.EntityManager')
//@Require('bugentity.EntityManagerAnnotation')
//@Require('bugflow.BugFlow')
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
var Exception                   = bugpack.require('Exception');
var List                        = bugpack.require('List');
var TypeUtil                    = bugpack.require('TypeUtil');
var BetaKey                     = bugpack.require('airbugserver.BetaKey');
var EntityManager               = bugpack.require('bugentity.EntityManager');
var EntityManagerAnnotation     = bugpack.require('bugentity.EntityManagerAnnotation');
var BugFlow                     = bugpack.require('bugflow.BugFlow');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series                     = BugFlow.$series;
var $task                       = BugFlow.$task;
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
var BetaKeyManager = Class.extend(EntityManager, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {BetaKey} betaKey
     * @param {(Array.<string> | function(Throwable, BetaKey))} dependencies
     * @param {function(Throwable, BetaKey)=} callback
     */
    createBetaKey: function(betaKey, dependencies, callback) {
        if (TypeUtil.isFunction(dependencies)) {
            callback        = dependencies;
            dependencies    = [];
        }
        var options         = {};
        this.create(betaKey, options, dependencies, callback);
    },

    /**
     * @param {{
     *      betaKey: string,
     *      cap: Number,
     *      createdAt: Date,
     *      hasCap: boolean,
     *      isBaseKey: boolean,
     *      count: number,
     *      updatedAt: Date
     * }} data
     * @return {BetaKey}
     */
    generateBetaKey: function(data) {
        var betaKey = new BetaKey(data);
        this.generate(betaKey);
        return betaKey;
    },

    /**
     * @param {string} betaKeyId
     * @param {function(Throwable, BetaKey=)} callback
     */
    retrieveBetaKey: function(betaKeyId, callback) {
        this.retrieve(betaKeyId, callback);
    },

    /**
     * @param {string} betaKey
     * @param {function(Throwable, BetaKey)} callback
     */
    retrieveBetaKeyByBetaKey: function(betaKey, callback) {
        var _this = this;
        this.dataStore.findOne({betaKey: betaKey}).lean(true).exec(function(throwable, dbObject){
            if (!throwable) {
                var betaKey = _this.convertDbObjectToEntity(dbObject);
                betaKey.commitDelta();
                callback(undefined, betaKey);
            } else {
                callback(throwable, undefined);
            }
        });
    },

    /**
     * @param {function(Throwable, List.<string, BetaKey>=)} callback
     */
    retrieveBetaKeysByBaseKey: function(baseKey, callback) {
        var _this = this;
        this.dataStore.find({baseKey: baseKey}).lean(true).exec(function(throwable, dbObjects) {
            if (!throwable) {
                var newList = new List();
                dbObjects.forEach(function(dbObject) {
                    var betaKey = _this.convertDbObjectToEntity(dbObject);
                    betaKey.commitDelta();
                    newList.add(betaKey);
                });
                callback(undefined, newList);
            } else {
                callback(throwable, undefined);
            }
        });
    },

    /**
     * @param {function(Throwable, List.<string, BetaKey>=)} callback
     */
    retrieveAllBetaKeys: function(callback) {
        var _this = this;
        this.getDataStore().find({}).lean(true).exec(function(throwable, dbObjects) {
            if (!throwable) {
                var newList = new List();
                dbObjects.forEach(function(dbObject) {
                    var betaKey = _this.convertDbObjectToEntity(dbObject);
                    betaKey.commitDelta();
                    newList.add(betaKey);
                });
                callback(undefined, newList);
            } else {
                callback(throwable, undefined);
            }
        });
    },

    /**
     * @param {string} baseKey
     * @param {function(Error=)} callback
     */
    incrementCountForBaseBetaKey: function(baseKey, callback) {
        this.getDataStore().findOneAndUpdate(
            {   betaKey: baseKey,
                isBaseKey: true,
                $where: function(){
                    if(this.hasCap){
                        return this.cap < this.count;
                    } else {
                        return true;
                    }
                }
            },
            { $inc: {count: 1}},
            function(error, betaKeyDoc) {
                if (error) {
                    callback(error);
                } else {
                    if (betaKeyDoc) {
                        callback();
                    } else {
                        callback(new Exception("InvalidBetaKey", {}, "Beta Key '" + baseKey + "' is full"));
                    }
                }
            }
        );
    },

    /**
     * @param {string} betaKey
     * @param {function(?Error)} callback
     */
    incrementCountForBetaKeyAndParentKeys: function(betaKey, callback) {
        var _this           = this;
        var keyPieces       = betaKey.split("+");
        var baseKey         = keyPieces[0];
        var numberOfPieces  = keyPieces.length;
        var allBetaKeys     = [betaKey];

        for(var i = numberOfPieces; i > 2; i--){
            keyPieces.pop();
            allBetaKeys.push(keyPieces.join("+"));
        }

        //create all keys
        //ignore duplicate errors
        //update all keys

        $series([
            $task(function(flow){
                allBetaKeyObjects = allBetaKeys.map(function(key){
                    return {betaKey: key, baseKey: baseKey, isBaseKey: (key === baseKey), secondaryKeys: key.split("+").slice(1)};
                });

                _this.dataStore.create(allBetaKeyObjects, function(error){
                    if(error && error.code !== 11000) {
                        flow.error(error);
                    } else if (error && error.code === 11000) {
                        flow.complete();
                    } else {
                        flow.complete();
                    }
                });
            }),
            $task(function(flow){
                _this.dataStore.update({betaKey: {$in: allBetaKeys}},
                    { $inc: { count: 1 } },
                    {multi: true},
                    function(error, numberAffected, raw) {
                        if(error) {
                            flow.error(error);
                        } else {
                            console.log("numberAffected:", numberAffected, "numberOfPieces:", numberOfPieces);
                            if(numberAffected !== numberOfPieces) {
                                flow.error(new Error("An incorrect number of Beta Keys were updated"));
                            } else {
                                flow.complete();
                            }
                        }
                    });
            })
        ])
        .execute(function(throwable){
            callback(throwable);
        });
    },

    validateAndIncrementBaseBetaKey: function(betaKey, callback) {
        var baseKey = betaKey.split("+")[0];
        this.getDataStore().findOneAndUpdate(
            {   betaKey: baseKey,
                isBaseKey: true,
                $where: function(){
                    if(this.hasCap){
                        return this.count < this.cap;
                    } else {
                        return true;
                    }
                }
            },
            { $inc: {count: 1}},
            function(error, betaKeyDoc) {
                if(error){
                    callback(error, false);
                } else {
                    if(betaKeyDoc) {
                        callback(undefined, true);
                    } else {
                        callback(new Exception("InvalidBetaKey", {}, "Beta Key '" + betaKey + "' not found or full"), false);
                    }
                }
            }
        );
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(BetaKeyManager).with(
    entityManager("betaKeyManager")
        .ofType("BetaKey")
        .args([
            arg().ref("entityManagerStore"),
            arg().ref("schemaManager"),
            arg().ref("mongoDataStore"),
            arg().ref("entityDeltaBuilder")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.BetaKeyManager', BetaKeyManager);
