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

//@Autoload

//@Export('airbug.AssetManagerModule')

//@Require('Class')
//@Require('airbug.ManagerModule')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var ManagerModule   = bugpack.require('airbug.ManagerModule');
    var ArgTag          = bugpack.require('bugioc.ArgTag');
    var ModuleTag       = bugpack.require('bugioc.ModuleTag');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg             = ArgTag.arg;
    var bugmeta         = BugMeta.context();
    var module          = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ManagerModule}
     */
    var AssetManagerModule = Class.extend(ManagerModule, {

        _name: "airbug.AssetManagerModule",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} url
         * @param {function(Throwable, MeldDocument=)} callback
         */
        addAssetFromUrl: function(url, callback) {
            var requestData = {url: url};
            this.request("addAssetFromUrl", requestData, callback);
        },

        /**
         * @param {{
         *      name: string
         * }} assetObject
         * @param {function(Throwable, MeldDocument=)} callback
         */
        createAsset: function(assetObject, callback) {
            this.create("Asset", assetObject, callback);
        },

        /**
         * @param {string} assetId
         * @param {function(Throwable, MeldDocument=)} callback
         */
        retrieveAsset: function(assetId, callback) {
            this.retrieve("Asset", assetId, callback);
        },

        /**
         * @param {Array.<string>} assetIds
         * @param {function(Throwable, Map.<string, MeldDocument>=)} callback
         */
        retrieveAssets: function(assetIds, callback) {
            this.retrieveEach("Asset", assetIds, callback);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(AssetManagerModule).with(
        module("assetManagerModule")
            .args([
                arg().ref("airbugApi"),
                arg().ref("meldStore"),
                arg().ref("meldBuilder")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.AssetManagerModule", AssetManagerModule);
});
