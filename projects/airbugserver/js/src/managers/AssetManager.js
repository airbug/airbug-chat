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

//@Export('airbugserver.AssetManager')
//@Autoload

//@Require('Class')
//@Require('Map')
//@Require('TypeUtil')
//@Require('airbugserver.Asset')
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
    var Map                 = bugpack.require('Map');
    var TypeUtil            = bugpack.require('TypeUtil');
    var Asset               = bugpack.require('airbugserver.Asset');
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
    var AssetManager = Class.extend(EntityManager, {

        _name: "airbugserver.AssetManager",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Asset} asset
         * @param {(Array.<string> | function(Throwable, Asset=))} dependencies
         * @param {function(Throwable, Asset=)=} callback
         */
        createAsset: function(asset, dependencies, callback) {
            if (TypeUtil.isFunction(dependencies)) {
                callback        = dependencies;
                dependencies    = [];
            }
            var options         = {};
            this.create(asset, options, dependencies, callback);
        },

        /**
         * @param {Asset} asset
         * @param {function(Throwable=)} callback
         */
        deleteAsset: function(asset, callback) {
            this.delete(asset, callback);
        },

        /**
         * @param {{
         *      createdAt: Date,
         *      mimeType: string,
         *      midsizeMimeType: string,
         *      midsizeUrl: string,
         *      name: string,
         *      thumbnailMimeType: string,
         *      thumbnailUrl: string,
         *      updatedAt: Date,
         *      url: string
         * }} data
         * @return {Asset}
         */
        generateAsset: function(data) {
            var asset = new Asset(data);
            this.generate(asset);
            return asset;
        },

        /**
         * @param {Asset} asset
         * @param {Array.<string>} properties
         * @param {function(Throwable, Asset=)} callback
         */
        populateAsset: function(asset, properties, callback) {
            this.populate(asset, {}, properties, callback);
        },

        /**
         * @param {string} assetId
         * @param {function(Throwable, Asset=)} callback
         */
        retrieveAsset: function(assetId, callback) {
            this.retrieve(assetId, callback);
        },

        /**
         * @param {Array.<string>} assetIds
         * @param {function(Throwable, Map.<string, Asset>=)} callback
         */
        retrieveAssets: function(assetIds, callback) {
            this.retrieveEach(assetIds, callback);
        },

        /**
         * @param {Asset} asset
         * @param {function(Throwable, Asset=)} callback
         */
        updateAsset: function(asset, callback) {
            this.update(asset, callback);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(AssetManager).with(
        entityManager("assetManager")
            .ofType("Asset")
            .args([
                arg().ref("entityManagerStore"),
                arg().ref("schemaManager"),
                arg().ref("entityDeltaBuilder")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.AssetManager', AssetManager);
});
