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

//@Export('airbugserver.GithubManager')
//@Autoload

//@Require('Class')
//@Require('TypeUtil')
//@Require('airbugserver.Github')
//@Require('bugentity.EntityManager')
//@Require('bugentity.EntityManagerTag')
//@Require('bugioc.ArgTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var TypeUtil                    = bugpack.require('TypeUtil');
    var Github                      = bugpack.require('airbugserver.Github');
    var EntityManager               = bugpack.require('bugentity.EntityManager');
    var EntityManagerTag     = bugpack.require('bugentity.EntityManagerTag');
    var ArgTag               = bugpack.require('bugioc.ArgTag');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                         = ArgTag.arg;
    var bugmeta                     = BugMeta.context();
    var entityManager               = EntityManagerTag.entityManager;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EntityManager}
     */
    var GithubManager = Class.extend(EntityManager, {

        _name: "airbugserver.GithubManager",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Github} github
         * @param {(Array.<string> | function(Throwable, User=))} dependencies
         * @param {function(Throwable, User=)=} callback
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
            var github = new Github(data);
            this.generate(github);
            return github;
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

    bugmeta.tag(GithubManager).with(
        entityManager("githubManager")
            .ofType("Github")
            .args([
                arg().ref("entityManagerStore"),
                arg().ref("schemaManager"),
                arg().ref("entityDeltaBuilder")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.GithubManager', GithubManager);
});
