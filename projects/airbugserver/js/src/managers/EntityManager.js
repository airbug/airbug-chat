//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('EntityManager')

//@Require('Class')
//@Require('Obj')
//@Require('StringUtil')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var StringUtil  = bugpack.require('StringUtil');
var BugFlow     = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $forEachParallel    = BugFlow.$forEachParallel;
var $iterableParallel   = BugFlow.$iterableParallel;
var $parallel           = BugFlow.$parallel;
var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EntityManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} entityType
     * @param {mongo.MongoDataStore} mongoDataStore
     */
    _constructor: function(entityType, mongoDataStore) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MongoManager}
         */
        this.dataStore      = mongoDataStore.generateManager(entityType);

        /**
         * @private
         * @type {string}
         */
        this.entityType     = entityType;
    },

    /**
     * @param {Entity} entityInstance
     * @param {function(Throwable, Entity)} callback
     */
    create: function(entityInstance, callback){
        if(!entityInstance.getCreatedAt()){
            entityInstance.setCreatedAt(new Date());
            entityInstance.setUpdatedAt(new Date());
        }
        this.dataStore.create(entityInstance.toObject(), function(throwable, dbObject) {
            if (!throwable) {
                entityInstance.setId(dbObject.id);
                callback(undefined, entityInstance);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {{
     *      propertyNames: Array.<string> //uncapitalized
     *      propertyKeys: {
     *                idGetter: function,
     *                idSetter: function,
     *                getter: function,
     *                setter: function,
     *                manager: EntityManager,
     *                retriever: function
     * }
     * }} options
     * @param {Entity} entityInstance
     * @param {Array.<string>} properties
     * @param {function(Throwable)} callback
     */
    populate: function(options, entityInstance, properties, callback){
        var _this = this;
        var propertyKeys = options.propertyKeys;
        $forEachParallel(properties, function(flow, property) {
            var propIndex = options.propertyNames.indexOf(property);
            if( propIndex > -1){
                var returnedProperty = propertyKeys.getter.call(entityInstance);
                switch(type){
                    case: "Set"
                        var idSet           = propertyKeys.idGetter.call(entityInstance);
                        var set             = returnedProperty;
                        var lookupIdSet     = idSet.clone();

                        set.clone().forEach(function(ent) {
                            if (idSet.contains(ent.getId())) {
                                lookupIdSet.remove(ent.getId());
                            } else {
                                set.remove(ent);
                        }

                        $iterableParallel(lookupIdSet, function(flow, entId) {
                            propertyKeys.retriever.call(propertyKeys.manager, entId, function(throwable, returnEnt) {
                                    if (!throwable) {
                                        set.add(returnEnt);
                                    }
                                    flow.complete(throwable);
                                });
                            }).execute(function(throwable) {
                                flow.complete(throwable);
                            });
                        });
                        break;
                    default:
                        var id  = propertyKeys.idGetter.call(entityInstance);
                        if (id) {
                            if (!returnedProperty || returnedProperty.getId() !== id) {
                                propertyKeys.retriever.call(propertyKeys.manager, id, function(throwable, retrievedEntity) {
                                    if (!throwable) {
                                        propertyKeys.setter.call(entityInstance, retrievedEntity);
                                    }
                                    flow.complete(throwable);
                                })
                            } else {
                                flow.complete();
                            }
                        } else {
                            flow.complete();
                        }
                        break;
                }
            } else {
                flow.error(new Error("Unknown property '" + property + "'"));
            }
        }).execute(callback);
    },

    /**
     * @param {string} id
     * @param {function(Throwable, Entity)} callback
     */
    retrieve: function(id, callback){
        var _this = this;
        this.dataStore.findById(id).lean(true).exec(function(throwable, dbJson) {
            if (!throwable) {
                var entityObject = null;
                if (dbJson) {
                    entityObject = _this["generate" + _this.entityType](dbJson);
                    entityObject.commitDelta();
                }
                callback(undefined, entityObject);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {Array.<string>} ids
     * @param {function(Throwable, Map.<string, Entity>)} callback
     */
    retrieveEach: function(ids, callback){
        var _this = this;
        this.dataStore.where("_id").in(ids).lean(true).exec(function(throwable, results) {
            if(!throwable){
                var newMap = new Map();
                results.forEach(function(result) {
                    var entityObject = _this["generate" + _this.entityType](result);
                    entityObject.commitDelta();
                    newMap.put(entityObject.getId(), entityObject);
                });
                ids.forEach(function(id) {
                    if (!newMap.containsKey(id)) {
                        newMap.put(id, null);
                    }
                });
                callback(undefined, newMap);
            } else {
                callback(throwable);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.EntityManager', EntityManager);
