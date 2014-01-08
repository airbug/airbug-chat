//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('Asset')

//@Require('Class')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityAnnotation')
//@Require('bugentity.PropertyAnnotation')
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
var EntityAnnotation        = bugpack.require('bugentity.EntityAnnotation');
var PropertyAnnotation      = bugpack.require('bugentity.PropertyAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var entity                  = EntityAnnotation.entity;
var property                = PropertyAnnotation.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Asset = Class.extend(Entity, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(data) {
        this._super(data);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /*
     * @return {string}
     */
    getMimeType: function() {
        return this.deltaDocument.getData().mimeType;
    },

    /*
     * @param {string} mimeType
     */
    setMimeType: function(mimeType) {
        this.deltaDocument.getData().mimeType = mimeType;
    },

    /*
     * @return {string}
     */
    getName: function() {
        return this.deltaDocument.getData().name;
    },

    /*
     * @param {string} name
     */
    setName: function(name) {
        this.deltaDocument.getData().name = name;
    },

    /*
     * @return {number}
     */
    getSize: function() {
        return this.deltaDocument.getData().size;
    },

    /*
     * @param {number} size
     */
    setSize: function(size) {
        this.deltaDocument.getData().size = size;
    },

    /*
     * @return {string}
     */
    getThumbMimeType: function() {
        return this.deltaDocument.getData().thumbMimeType;
    },

    /*
     * @param {string} thumbMimeType
     */
    setThumbMimeType: function(thumbMimeType) {
        this.deltaDocument.getData().thumbMimeType = thumbMimeType;
    },

    /*
     * @return {string}
     */
    getThumbnailUrl: function() {
        return this.deltaDocument.getData().thumbnailUrl;
    },

    /*
     * @param {string} thumbUrl
     */
    setThumbnailUrl: function(thumbUrl) {
        this.deltaDocument.getData().thumbnailUrl = thumbUrl;
    },

    /*
     * @return {string}
     */
    getUrl: function() {
        return this.deltaDocument.getData().url;
    },

    /*
     * @param {string} url
     */
    setUrl: function(url) {
        this.deltaDocument.getData().url = url;
    }

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(Asset).with(
    entity("Asset").properties([
        property("createdAt").type("date"),
        property("mimeType").type("string"),
        property("name").type("string"),
        property("size").type("number"),
        property("thumbMimeType").type("string"),
        property("thumbnailUrl").type("string"),
        property("updatedAt").type("date"),
        property("url").type("string")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Asset', Asset);
