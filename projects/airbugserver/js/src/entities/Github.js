//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('Github')

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

var Github = Class.extend(Entity, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(data) {

        this._super(data);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {User}
         */
        this.user           = undefined;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /*
     * @return {string}
     */
    getGithubAuthCode: function() {
        return this.deltaDocument.getData().githubAuthCode;
    },

    /*
     * @param {string} githubAuthCode
     */
    setGithubAuthCode: function(githubAuthCode) {
        this.deltaDocument.getData().githubAuthCode = githubAuthCode;
    },

    /*
     * @return {string}
     */
    getGithubId: function() {
        return this.deltaDocument.getData().githubId;
    },

    /*
     * @param {string} githubId
     */
    setGithubId: function(githubId) {
        this.deltaDocument.getData().githubId = githubId;
    },

    /*
     * @return {string}
     */
    getGithubLogin: function() {
        return this.deltaDocument.getData().githubLogin;
    },

    /*
     * @param {string} githubLogin
     */
    setGithubLogin: function(githubLogin) {
        this.deltaDocument.getData().githubLogin = githubLogin;
    },

    /*
     * @return {string}
     */
    getUserId: function() {
        return this.deltaDocument.getData().userId;
    },

    /*
     * @param {string} userId
     */
    setUserId: function(userId) {
        this.deltaDocument.getData().userId = userId;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

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
            throw new Error("user entity must have an id first");
        }
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(Github).with(
    entity("Github").properties([
        property("createdAt")
            .type("date"),
        property("githubAuthCode")
            .type("string"),
        property("githubId")
            .type("string"),
        property("githubLogin")
            .type("string"),
        property("updatedAt")
            .type("date"),
        property("userId")
            .type("string"),
        property("user")
            .type("User")
            .populates(true)
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Github', Github);
