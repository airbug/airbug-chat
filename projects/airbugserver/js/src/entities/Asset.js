//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.Asset')
//@Autoload

//@Require('Class')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityTag')
//@Require('bugentity.PropertyTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Entity                  = bugpack.require('bugentity.Entity');
var EntityTag        = bugpack.require('bugentity.EntityTag');
var PropertyTag      = bugpack.require('bugentity.PropertyTag');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var entity                  = EntityTag.entity;
var property                = PropertyTag.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Entity}
 */
var Asset = Class.extend(Entity, {

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @returns {string}
     */
    getMidsizeMimeType: function() {
        return this.getEntityData().midsizeMimeType;
    },

    /**
     * @param {string} midsizeMimeType
     */
    setMidsizeMimeType: function(midsizeMimeType) {
        this.getEntityData().midsizeMimeType = midsizeMimeType;
    },

    /**
     * @returns {string}
     */
    getMidsizeUrl: function() {
        return this.getEntityData().midsizeUrl;
    },

    /**
     * @param {string} midsizeUrl
     */
    setMidsizeUrl: function(midsizeUrl) {
        this.getEntityData().midsizeUrl = midsizeUrl;
    },

    /**
     * @return {string}
     */
    getMimeType: function() {
        return this.getEntityData().mimeType;
    },

    /**
     * @param {string} mimeType
     */
    setMimeType: function(mimeType) {
        this.getEntityData().mimeType = mimeType;
    },

    /**
     * @return {string}
     */
    getName: function() {
        return this.getEntityData().name;
    },

    /**
     * @param {string} name
     */
    setName: function(name) {
        this.getEntityData().name = name;
    },

    /**
     * @return {number}
     */
    getSize: function() {
        return this.getEntityData().size;
    },

    /**
     * @param {number} size
     */
    setSize: function(size) {
        this.getEntityData().size = size;
    },

    /**
     * @return {string}
     */
    getThumbnailMimeType: function() {
        return this.getEntityData().thumbnailMimeType;
    },

    /**
     * @param {string} thumbnailMimeType
     */
    setThumbnailMimeType: function(thumbnailMimeType) {
        this.getEntityData().thumbnailMimeType = thumbnailMimeType;
    },

    /**
     * @return {string}
     */
    getThumbnailUrl: function() {
        return this.getEntityData().thumbnailUrl;
    },

    /**
     * @param {string} thumbUrl
     */
    setThumbnailUrl: function(thumbUrl) {
        this.getEntityData().thumbnailUrl = thumbUrl;
    },

    /**
     * @return {string}
     */
    getUrl: function() {
        return this.getEntityData().url;
    },

    /**
     * @param {string} url
     */
    setUrl: function(url) {
        this.getEntityData().url = url;
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(Asset).with(
    entity("Asset").properties([
        property("createdAt")
            .type("date")
            .require(true)
            .default(Date.now),
        property("id")
            .type("string")
            .primaryId(),
        property("midsizeMimeType")
            .type("string"),
        property("midsizeUrl")
            .type("string"),
        property("mimeType")
            .type("string"),
        property("name")
            .type("string"),
        property("thumbnailMimeType")
            .type("string"),
        property("thumbnailUrl")
            .type("string"),
        property("type")
            .type("string"),
        property("updatedAt")
            .type("date")
            .require(true)
            .default(Date.now),
        property("url")
            .type("string")
            .index(true)
            .unique(true)
            .require(true)
            .default("")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Asset', Asset);
