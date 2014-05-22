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

//@Export('airbugserver.EntityPusher')

//@Require('ArgUtil')
//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('Set')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var ArgUtil             = bugpack.require('ArgUtil');
    var Class               = bugpack.require('Class');
    var Exception           = bugpack.require('Exception');
    var Obj                 = bugpack.require('Obj');
    var Set                 = bugpack.require('Set');
    var BugFlow             = bugpack.require('bugflow.BugFlow');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $parallel           = BugFlow.$parallel;
    var $series             = BugFlow.$series;
    var $task               = BugFlow.$task;
    var $iterableParallel   = BugFlow.$iterableParallel;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var EntityPusher = Class.extend(Obj, {

        _name: "airbugserver.EntityPusher",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Logger} logger
         * @param {MeldBuilder} meldBuilder
         * @param {MeldManager} meldManager
         * @param {PushManager} pushManager
         * @param {UserManager} userManager
         * @param {MeldSessionManager} meldSessionManager
         */
        _constructor: function(logger, meldBuilder, meldManager, pushManager, userManager, meldSessionManager) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Logger}
             */
            this.logger                 = logger;

            /**
             * @private
             * @type {MeldBuilder}
             */
            this.meldBuilder            = meldBuilder;

            /**
             * @private
             * @type {MeldManager}
             */
            this.meldManager            = meldManager;

            /**
             * @private
             * @type {MeldSessionManager}
             */
            this.meldSessionManager     = meldSessionManager;

            /**
             * @private
             * @type {PushManager}
             */
            this.pushManager            = pushManager;

            /**
             * @private
             * @type {UserManager}
             */
            this.userManager            = userManager;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Logger}
         */
        getLogger: function() {
            return this.logger;
        },

        /**
         * @return {MeldBuilder}
         */
        getMeldBuilder: function() {
            return this.meldBuilder;
        },

        /**
         * @return {MeldManager}
         */
        getMeldManager: function() {
            return this.meldManager;
        },

        /**
         * @return {MeldSessionManager}
         */
        getMeldSessionManager: function() {
            return this.meldSessionManager;
        },

        /**
         * @return {PushManager}
         */
        getPushManager: function() {
            return this.pushManager;
        },

        /**
         * @return {UserManager}
         */
        getUserManager: function() {
            return this.userManager;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Entity} entity
         * @return {MeldDocumentKey}
         */
        generateMeldDocumentKeyFromEntity: function(entity) {
            return this.meldBuilder.generateMeldDocumentKey(entity.getEntityType(), entity.getId());
        },

        /**
         * @param {string} callUuid
         * @param {Entity} entity
         * @param {function(Throwable)} callback
         */
        meldCallWithEntity: function(callUuid, entity, callback) {
            var _this           = this;
            var meldDocumentKey = this.generateMeldDocumentKeyFromEntity(entity);
            $series([
                $task(function(flow) {
                    _this.meldManager.meldCallUuidWithMeldDocumentKey(callUuid, meldDocumentKey, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(callback);
        },

        /**
         * @param {string} callUuid
         * @param {Array.<Entity>} entities
         * @param {function(Throwable)} callback
         */
        meldCallWithEntities: function(callUuid, entities, callback) {
            var _this               = this;
            var meldDocumentKeys    = [];
            entities.forEach(function(entity) {
                var meldDocumentKey = _this.generateMeldDocumentKeyFromEntity(entity);
                meldDocumentKeys.push(meldDocumentKey);
            });
            $series([
                $task(function(flow) {
                    _this.meldManager.meldCallUuidWithMeldDocumentKeys(callUuid, meldDocumentKeys, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(callback);
        },

        /**
         * @return {Push}
         */
        push: function() {
            return this.pushManager.push();
        },

        /**
         * @param {Entity} entity
         * @param {(Array.<string> | function(Throwable=))} waitForCallUuids
         * @param {function(Throwable=)=} callback
         */
        pushEntity: function(entity, waitForCallUuids, callback) {
            var args = ArgUtil.process(arguments, [
                {name: "entity", optional: false, type: "object"},
                {name: "waitForCallUuids", optional: true, type: "array", default: []},
                {name: "callback", optional: false, type: "function"}
            ]);
            entity              = args.entity;
            waitForCallUuids    = args.waitForCallUuids;
            callback            = args.callback;

            var meldDocumentKey     = this.generateMeldDocumentKeyFromEntity(entity);
            var data                = this.filterEntity(entity);
            var push                = this.getPushManager().push();
            push
                .toAll()
                .setDocument(meldDocumentKey, data);

            if (waitForCallUuids.length > 0) {
                push.waitFor(waitForCallUuids);
            }
            push.exec(callback);
        },

        /**
         * @param {User} user
         * @param {Entity} entity
         * @param {function(Throwable=)} callback
         */
        unmeldUserWithEntity: function(user, entity, callback) {
            this.unmeldUserWithEntities(user, [entity], callback);
        },

        /**
         * @param {User} user
         * @param {(Array.<Entity> | ICollection.<Entity>)} entities
         * @param {function(Throwable=)} callback
         */
        unmeldUserWithEntities: function(user, entities, callback) {
            var _this               = this;
            var callUuidSet         = new Set();
            var meldDocumentKeySet  = new Set();
            entities.forEach(function(entity) {
                meldDocumentKeySet.add(_this.generateMeldDocumentKeyFromEntity(entity));
            });
            $series([
                $task(function(flow) {
                    _this.userManager.populateUser(user, ["sessionSet"], function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    $iterableParallel(user.getSessionSet(), function(flow, session) {
                        var meldSessionKey = _this.meldSessionManager.generateMeldSessionKey(session.getId());
                        _this.meldSessionManager.getCallUuidSetForMeldSessionKey(meldSessionKey, function(throwable, returnedCallUuidSet) {
                            if (!throwable) {
                                callUuidSet.addAll(returnedCallUuidSet);
                            }
                            flow.complete(throwable);
                        });
                    }).execute(function(throwable) {
                            flow.complete(throwable);
                        });
                }),
                $task(function(flow) {
                    _this.meldManager.unmeldCallUuidsWithMeldDocumentKeys(callUuidSet, meldDocumentKeySet, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(callback);
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Entity} entity
         * @return {Object}
         */
        filterEntity: function(entity) {
            return entity.toObject();
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.EntityPusher', EntityPusher);
});
