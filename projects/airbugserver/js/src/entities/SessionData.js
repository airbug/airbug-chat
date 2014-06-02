//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.SessionData')
//@Autoload

//@Require('Class')
//@Require('TypeUtil')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityTag')
//@Require('bugentity.PropertyTag')
//@Require('bugmarsh.MarshTag');
//@Require('bugmarsh.MarshPropertyTag');
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();
var cookie                      = require('cookie');

//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var TypeUtil                    = bugpack.require('TypeUtil');
var Entity                      = bugpack.require('bugentity.Entity');
var EntityTag            = bugpack.require('bugentity.EntityTag');
var PropertyTag          = bugpack.require('bugentity.PropertyTag');
var MarshTag             = bugpack.require('bugmarsh.MarshTag');
var MarshPropertyTag     = bugpack.require('bugmarsh.MarshPropertyTag');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var entity                      = EntityTag.entity;
var marsh                       = MarshTag.marsh;
var marshProperty               = MarshPropertyTag.property;
var property                    = PropertyTag.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Entity}
 */
var SessionData = Class.extend(Entity, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {{
     *      githubAuthToken: string,
     *      githubEmails: Array.<string>,
     *      githubId: string,
     *      githubLogin: string,
     *      githubState: string
     * }} data
     */
    _constructor: function(data) {

        this._super(data);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getGithubAuthToken: function() {
        return this.getEntityData().githubAuthToken;
    },

    /**
     * @param {string} githubAuthToken
     */
    setGithubAuthToken: function(githubAuthToken) {
        this.getEntityData().githubAuthToken = githubAuthToken;
    },

    /**
     * @return {Array.<string>}
     */
    getGithubEmails: function() {
        return this.getEntityData().githubEmails;
    },

    /**
     * @param {Array.<string>} githubEmails
     */
    setGithubEmails: function(githubEmails) {
        this.getEntityData().githubEmails = githubEmails;
    },

    /**
     * @return {string}
     */
    getGithubId: function() {
        return this.getEntityData().githubId;
    },

    /**
     * @param {string} githubId
     */
    setGithubId: function(githubId) {
        this.getEntityData().githubId = githubId;
    },

    /**
     * @return {string}
     */
    getGithubLogin: function() {
        return this.getEntityData().githubLogin;
    },

    /**
     * @param {string} githubLogin
     */
    setGithubLogin: function(githubLogin) {
        this.getEntityData().githubLogin = githubLogin;
    },

    /**
     * @return {string}
     */
    getGithubState: function() {
        return this.getEntityData().githubState;
    },

    /**
     * @param {string} githubState
     */
    setGithubState: function(githubState) {
        this.getEntityData().githubState = githubState;
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(SessionData).with(
    entity("SessionData")
        .properties([
            property("githubAuthToken")
                .type("string"),
            property("githubEmails")
                .type("array")
                .collectionOf("string"),
            property("githubId")
                .type("string"),
            property("githubLogin")
                .type("string"),
            property("githubState")
                .type("string")
        ])
        .embed(true),
    marsh("SessionData")
        .properties([
            marshProperty("githubAuthToken"),
            marshProperty("githubEmails"),
            marshProperty("githubId"),
            marshProperty("githubLogin"),
            marshProperty("githubState")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbugserver.SessionData", SessionData);
