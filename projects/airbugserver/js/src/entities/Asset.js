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
    getThumbUrl: function() {
        return this.deltaDocument.getData().thumbUrl;
    },

    /*
     * @param {string} thumbUrl
     */
    setThumbUrl: function(thumbUrl) {
        this.deltaDocument.getData().thumbUrl = thumbUrl;
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
        property("thumbMimeType").type("string"),
        property("thumbUrl").type("string"),
        property("updatedAt").type("date"),
        property("url").type("string")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Asset', Asset);
