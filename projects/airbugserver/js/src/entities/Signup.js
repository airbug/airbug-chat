//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('Signup')

//@Require('Class')
//@Require('Set')
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
var Set                     = bugpack.require('Set');
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

var Signup = Class.extend(Entity, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(data) {

        this._super(data);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------


    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------



    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------


});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(Signup).with(
    entity("Signup").properties([
        property("acceptedLanguages")
            .type("string"),
        property("airbugVersion")
            .type("string"),
        property("baseBetaKey")
            .type("string"),
        property("betaKey")
            .type("string"),
        property("city")
            .type("string"),
        property("country")
            .type("string"),
        property("createdAt")
            .type("date"),
        property("day")
            .type("string"),
        property("geoCoordinates")
            .type("Set")
            .collectionOf("number"),
        property("id")
            .type("string")
            .primaryId(),
        property("ipAddress")
            .type("string"),
        property("languages")
            .type("Set")
            .collectionOf("string"),
        property("month")
            .type("string"),
        property("secondaryBetaKeys")
            .type("Set")
            .collectionOf("string"),
        property("state")
            .type("string"),
        property("updatedAt")
            .type("date"),
        property("userAgent")
            .type("string"),
        property("userId")
            .type("string")
            .id(),
        property("version")
            .type("string"),
        property("weekday")
            .type("string"),
        property("year")
            .type("string")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Signup', Signup);
