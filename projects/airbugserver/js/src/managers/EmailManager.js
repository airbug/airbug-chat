//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.EmailManager')
//@Autoload

//@Require('Class')
//@Require('Set')
//@Require('TypeUtil')
//@Require('airbugserver.Email')
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
    var Set                         = bugpack.require('Set');
    var TypeUtil                    = bugpack.require('TypeUtil');
    var Email                       = bugpack.require('airbugserver.Email');
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
    var EmailManager = Class.extend(EntityManager, {

        _name: "airbugserver.EmailManager",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Email} email
         * @param {(Array.<string> | function(Throwable, Email))} dependencies
         * @param {function(Throwable, Email=)=} callback
         */
        createEmail: function(email, dependencies, callback) {
            if (TypeUtil.isFunction(dependencies)) {
                callback        = dependencies;
                dependencies    = [];
            }
            var options         = {};
            this.create(email, options, dependencies, callback);
        },

        /**
         * @param {Email} email
         * @param {function(Throwable=)} callback
         */
        deleteEmail: function(email, callback) {
            this.delete(email, callback);
        },

        /**
         * @param {{
         *      bounced: boolean,
         *      bouncedAt: Date,
         *      complained: boolean,
         *      complainedAt: Date,
         *      createdAt: Date,
         *      email: string,
         *      id: string,
         *      updatedAt: Date
         * }} data
         * @return {Email}
         */
        generateEmail: function(data) {
            var email = new Email(data);
            this.generate(email);
            return email;
        },

        /**
         * @param {Email} email
         * @param {Array.<string>} properties
         * @param {function(Throwable, Email=)} callback
         */
        populateEmail: function(email, properties, callback) {
            var options = {
                userEmailSet: {
                    idGetter: email.getId,
                    retriever: "retrieveUserEmailsByEmailId",
                    setter: email.setUserEmailSet
                }
            };
            this.populate(email, options, properties, callback);
        },

        /**
         * @param {string} emailId
         * @param {function(Throwable, Email=)} callback
         */
        retrieveEmail: function(emailId, callback) {
            this.retrieve(emailId, callback);
        },

        /**
         * @param {Array.<string>} emailIds
         * @param {function(Throwable, Map.<string, Email>=)} callback
         */
        retrieveEmails: function(emailIds, callback) {
            this.retrieveEach(emailIds, callback);
        },

        /**
         * @param {Email} email
         * @param {function(Throwable, Email=)} callback
         */
        updateEmail: function(email, callback) {
            this.update(email, callback);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(EmailManager).with(
        entityManager("emailManager")
            .ofType("Email")
            .args([
                arg().ref("entityManagerStore"),
                arg().ref("schemaManager"),
                arg().ref("entityDeltaBuilder")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.EmailManager', EmailManager);
});
