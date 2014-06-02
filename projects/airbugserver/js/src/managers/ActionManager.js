//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.ActionManager')
//@Autoload

//@Require('Class')
//@Require('Set')
//@Require('TypeUtil')
//@Require('airbugserver.Action')
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
    var Action                      = bugpack.require('airbugserver.Action');
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

    var ActionManager = Class.extend(EntityManager, {

        _name: "airbugserver.ActionManager",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Action} action
         * @param {(Array.<string> | function(Throwable, Action))} dependencies
         * @param {function(Throwable, Action)=} callback
         */
        createAction: function(action, dependencies, callback) {
            if(TypeUtil.isFunction(dependencies)){
                callback        = dependencies;
                dependencies    = [];
            }
            var options         = {};
            this.create(action, options, dependencies, callback);
        },

        /**
         * @param {Action} action
         * @param {function(Throwable)} callback
         */
        deleteAction: function(action, callback) {
            this.delete(action, callback);
        },

        /**
         * @param {{
                actionData: Object,
                actionType: string,
                actionVersion: string,
                createdAt: Date,
                id: string,
                occurredAt: Date,
                updatedAt: Date,
                userId: string
            }} data
         * @return {Action}
         */
        generateAction: function(data) {
            var action = new Action(data);
            this.generate(action);
            return action;
        },

        /**
         * @param {string} actionId
         * @param {function(Throwable, Action=)} callback
         */
        retrieveAction: function(actionId, callback) {
            this.retrieve(actionId, callback);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(ActionManager).with(
        entityManager("actionManager")
            .ofType("Action")
            .args([
                arg().ref("entityManagerStore"),
                arg().ref("schemaManager"),
                arg().ref("mongoDataStore"),
                arg().ref("entityDeltaBuilder")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.ActionManager', ActionManager);
});
