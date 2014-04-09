//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.Github')
//@Autoload

//@Require('Bug')
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

var Bug                     = bugpack.require('Bug');
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
        return this.getEntityData().githubAuthCode;
    },

    /*
     * @param {string} githubAuthCode
     */
    setGithubAuthCode: function(githubAuthCode) {
        this.getEntityData().githubAuthCode = githubAuthCode;
    },

    /*
     * @return {string}
     */
    getGithubId: function() {
        return this.getEntityData().githubId;
    },

    /*
     * @param {string} githubId
     */
    setGithubId: function(githubId) {
        this.getEntityData().githubId = githubId;
    },

    /*
     * @return {string}
     */
    getGithubLogin: function() {
        return this.getEntityData().githubLogin;
    },

    /*
     * @param {string} githubLogin
     */
    setGithubLogin: function(githubLogin) {
        this.getEntityData().githubLogin = githubLogin;
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
            throw new Bug("IllegalState", {}, "user entity must have an id first");
        }
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(Github).with(
    entity("Github").properties([
        property("createdAt")
            .type("date")
            .require(true)
            .default(Date.now),
        property("githubAuthCode")
            .type("string"),
        property("githubId")
            .type("string")
            .require(true)
            .index(true)
            .unique(true),
        property("githubLogin")
            .type("string"),
        property("updatedAt")
            .type("date")
            .require(true)
            .default(Date.now),
        property("userId")
            .type("string")
            .index(true)
            .require(true),
        property("user")
            .type("User")
            .populates(true)
            .store(false)
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Github', Github);
