//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('GithubManager')
//@Autoload

//@Require('Class')
//@Require('airbugserver.Github')
//@Require('bugentity.EntityManager')
//@Require('bugentity.EntityManagerAnnotation')
//@Require('bugioc.ArgAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Set                         = bugpack.require('Set');
var TypeUtil                    = bugpack.require('TypeUtil');
var Github                      = bugpack.require('airbugserver.Github');
var EntityManager               = bugpack.require('bugentity.EntityManager');
var EntityManagerAnnotation     = bugpack.require('bugentity.EntityManagerAnnotation');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                         = ArgAnnotation.arg;
var bugmeta                     = BugMeta.context();
var entityManager               = EntityManagerAnnotation.entityManager;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {EntityManager}
 */
var GithubManager = Class.extend(EntityManager, {

    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param Github github
     * @param {(Array.<string> | function(Throwable, User))} dependencies
     * @param {function(Throwable, User)=} callback
     */
    createGithub: function(github, dependencies, callback) {
        if (TypeUtil.isFunction(dependencies)) {
            callback        = dependencies;
            dependencies    = [];
        }
        var options         = {};
        this.create(github, options, dependencies, callback);
    },

    /**
     * @param Github github
     * @param {function(Throwable)} callback
     */
    deleteGithub: function(github, callback) {
        this.delete(github, callback);
    },

    /**
     * @param {{
     *      createdAt: Date,
     *      githubAuth: string,
     *      githubId: string,
     *      githubLogin: string,
     *      updatedAt: Date,
     *      userId: string
     * }} data
     * @returns {Github}
     */
    generateGithub: function(data) {
        return new Github(data);
    },

    /**
     * @param {Github} github
     * @param {Array.<string>} properties
     * @param {function(Throwable)} callback
     */
    populateGithub: function(github, properties, callback) {
        var options = {
            user: {
                idGetter:   github.getUserId,
                idSetter:   github.setUserId,
                getter:     github.getUser,
                setter:     github.setUser
            }
        };
        this.populate(github, options, properties, callback);
    },

    /**
     * @param {string} id
     * @param {function(Throwable, Github)} callback
     */
    retrieveGithub: function(id, callback) {
        this.retrieve(id, callback);
    },

    /**
     * @param {string} githubId
     * @param @param {function(Throwable, Github)} callback
     */
    retrieveGithubByGithubId: function(githubId, callback) {
        var _this = this;
        console.log("retrieveGithubByGithubId this.dataStore = ", this.dataStore);

        this.dataStore.findOne({githubId: githubId}).lean(true).exec(function(throwable, dbObject) {
            if (!throwable) {
                var github = null;
                if (dbObject) {
                    github = _this.convertDbObjectToEntity(dbObject);
                    github.commitDelta();
                }
                callback(undefined, github);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {Array.<string>} ids
     * @param {function(Throwable, Map.<string, Github>)} callback
     */
    retrieveGithubs: function(ids, callback) {
        this.retrieveEach(ids, callback);
    },

    /**
     *
     * @param {Github} github
     * @param {function(Throwable, Github)} callback
     */
    updateGithub: function(github, callback) {
        this.update(github, callback);
    }
});

//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(GithubManager).with(
    entityManager("githubManager")
        .ofType("Github")
        .args([
            arg().ref("entityManagerStore"),
            arg().ref("schemaManager"),
            arg().ref("mongoDataStore")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.GithubManager', GithubManager);
