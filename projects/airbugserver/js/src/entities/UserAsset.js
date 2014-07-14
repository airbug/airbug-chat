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

//@Export('airbugserver.UserAsset')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityTag')
//@Require('bugentity.PropertyTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Bug             = bugpack.require('Bug');
    var Class           = bugpack.require('Class');
    var Entity          = bugpack.require('bugentity.Entity');
    var EntityTag       = bugpack.require('bugentity.EntityTag');
    var PropertyTag     = bugpack.require('bugentity.PropertyTag');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var entity          = EntityTag.entity;
    var property        = PropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Entity}
     */
    var UserAsset = Class.extend(Entity, {

        _name: "airbugserver.UserAsset",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param data
         */
        _constructor: function(data) {

            this._super(data);


            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Asset}
             */
            this.asset          = null;

            /**
             * @private
             * @type {User}
             */
            this.user           = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /*
         * @return {string}
         */
        getAssetId: function() {
            return this.getEntityData().assetId;
        },

        /*
         * @param {string} assetId
         */
        setAssetId: function(assetId) {
            this.getEntityData().assetId = assetId;
        },

        /*
         * @return {string}
         */
        getName: function() {
            return this.getEntityData().name;
        },

        /*
         * @param {string} name
         */
        setName: function(name) {
            this.getEntityData().name = name;
        },

        /*
         * @return {string}
         */
        getUserId: function() {
            return this.getEntityData().userId;
        },

        /*
         * @param {string} userId
         */
        setUserId: function(userId) {
            this.getEntityData().userId = userId;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Asset}
         */
        getAsset: function() {
            return this.asset;
        },

        /**
         * @param {Asset} asset
         */
        setAsset: function(asset) {
            if (asset.getId()) {
                this.asset = asset;
                this.setAssetId(asset.getId());
            } else {
                throw new Bug("IllegalState", {}, "Asset must have an id first");
            }
        },

        /**
         * @return {User}
         */
        getUser: function() {
            return this.user;
        },

        /**
         * @param {User} user
         */
        setUser: function(user) {
            if (user.getId()) {
                this.user = user;
                this.setUserId(user.getId());
            } else {
                throw new Bug("IllegalState", {}, "user must have an id first");
            }
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(UserAsset).with(
        entity("UserAsset").properties([
            property("assetId")
                .type("string")
                .index(true)
                .require(true)
                .id(),
            property("asset")
                .type("Asset")
                .populates(true)
                .store(false),
            property("createdAt")
                .type("date")
                .require(true)
                .default(Date.now),
            property("id")
                .type("string")
                .primaryId(),
            property("name")
                .type("string"),
            property("updatedAt")
                .type("date")
                .require(true)
                .default(Date.now),
            property("userId")
                .type("string")
                .require(true)
                .index(true)
                .id(),
            property("user")
                .type("User")
                .populates(true)
                .store(false)
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.UserAsset', UserAsset);
});
