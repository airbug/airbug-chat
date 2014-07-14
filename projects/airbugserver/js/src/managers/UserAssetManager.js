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

//@Export('airbugserver.UserAssetManager')
//@Autoload

//@Require('Class')
//@Require('List')
//@Require('Map')
//@Require('TypeUtil')
//@Require('airbugserver.UserAsset')
//@Require('bugentity.EntityManager')
//@Require('bugentity.EntityManagerTag')
//@Require('bugioc.ArgTag')
//@Require('bugmeta.BugMeta')

//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var List                = bugpack.require('List');
    var Map                 = bugpack.require('Map');
    var TypeUtil            = bugpack.require('TypeUtil');
    var UserAsset           = bugpack.require('airbugserver.UserAsset');
    var EntityManager       = bugpack.require('bugentity.EntityManager');
    var EntityManagerTag    = bugpack.require('bugentity.EntityManagerTag');
    var ArgTag              = bugpack.require('bugioc.ArgTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgTag.arg;
    var bugmeta             = BugMeta.context();
    var entityManager       = EntityManagerTag.entityManager;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EntityManager}
     */
    var UserAssetManager = Class.extend(EntityManager, {

        _name: "airbugserver.UserAssetManager",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {UserAsset} userAsset
         * @param {(Array.<string> | function(Throwable, UserAsset=))=} dependencies
         * @param {function(Throwable, UserAsset=)=} callback
         */
        createUserAsset: function(userAsset, dependencies, callback) {
            if (TypeUtil.isFunction(dependencies)) {
                callback        = dependencies;
                dependencies    = [];
            }
            var options         = {};
            this.create(userAsset, options, dependencies, callback);
        },

        /**
         * @param {UserAsset} userAsset
         * @param {function(Throwable=)} callback
         */
        deleteUserAsset: function(userAsset, callback) {
            this.delete(userAsset, callback);
        },

        /**
         * @param {{
         *      assetId: string,
         *      createdAt: Date,
         *      name: string,
         *      updatedAt: Date,
         *      userId: string
         * }} data
         * @return {UserAsset}
         */
        generateUserAsset: function(data) {
            var userAsset = new UserAsset(data);
            this.generate(userAsset);
            return userAsset;
        },

        /**
         * @param {UserAsset} userAsset
         * @param {Array.<string>} properties
         * @param {function(Throwable, UserAsset)} callback
         */
        populateUserAsset: function(userAsset, properties, callback) {
            var options = {
                asset: {
                    idGetter:   userAsset.getAssetId,
                    idSetter:   userAsset.setAssetId,
                    getter:     userAsset.getAsset,
                    setter:     userAsset.setAsset
                },
                user: {
                    idGetter:   userAsset.getUserId,
                    idSetter:   userAsset.setUserId,
                    getter:     userAsset.getUser,
                    setter:     userAsset.setUser
                }
            };
            this.populate(userAsset, options, properties, callback);
        },

        /**
         * @param {string} userAssetId
         * @param {function(Throwable, UserAsset=)} callback
         */
        retrieveUserAsset: function(userAssetId, callback) {
            this.retrieve(userAssetId, callback);
        },

        /**
         * @param {Array.<string>} userAssetIds
         * @param {function(Throwable, Map.<string, UserAsset>=)} callback
         */
        retrieveUserAssets: function(userAssetIds, callback) {
            this.retrieveEach(userAssetIds, callback);
        },

        /**
         * @param {string} userId
         * @param {function(Throwable, List.<UserAsset>=)} callback
         */
        retrieveUserAssetsByUserId: function(userId, callback) {
            var _this = this;
            this.dataStore.find({userId: userId}).lean(true).exec(function(throwable, dbObjects) {
                if (!throwable) {
                    var newList = new List();
                    dbObjects.forEach(function(dbObject) {
                        var userAsset = _this.convertDbObjectToEntity(dbObject);
                        userAsset.commitDelta();
                        newList.add(userAsset);
                    });
                    callback(undefined, newList);
                } else {
                    callback(throwable, undefined);
                }
            });
        },

        /**
         * @param {string} userId
         * @param {function(Throwable, List.<UserAsset>)} callback
         */
        retrieveUserImageAssetsByUserId: function(userId, callback) {
            //TODO NOTE:UserAssets currently do not have a type
            var _this = this;
            this.dataStore.find({userId: userId, type: "image"}).lean(true).exec(function(throwable, dbObjects) {
                if (!throwable) {
                    var newList = new List();
                    dbObjects.forEach(function(dbObject) {
                        var userAsset = _this.convertDbObjectToEntity(dbObject);
                        userAsset.commitDelta();
                        newList.add(userAsset);
                    });
                    callback(undefined, newList);
                } else {
                    callback(throwable, undefined);
                }
            });
        },

        /**
         * @param {string} userId
         * @param {function(Throwable, List.<UserAsset>=)} callback
         */
        retrieveUserAssetsByUserIdSortByCreatedAt: function(userId, callback) {
            var _this = this;
            this.dataStore.find({userId: userId}).sort({createdAt: -1}).lean(true).exec(function(throwable, dbObjects) {
                if (!throwable) {
                    var newList = new List();
                    dbObjects.forEach(function(dbObject) {
                        var userAsset = _this.convertDbObjectToEntity(dbObject);
                        userAsset.commitDelta();
                        newList.add(userAsset);
                    });
                    callback(null, newList);
                } else {
                    callback(throwable);
                }
            });
        },

        /**
         * @param {UserAsset} userAsset
         * @param {function(Throwable, UserAsset)} callback
         */
        updateUserAsset: function(userAsset, callback) {
            this.update(userAsset, callback);
        }
    });

    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(UserAssetManager).with(
        entityManager("userAssetManager")
            .ofType("UserAsset")
            .args([
                arg().ref("entityManagerStore"),
                arg().ref("schemaManager"),
                arg().ref("entityDeltaBuilder")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.UserAssetManager', UserAssetManager);
});
