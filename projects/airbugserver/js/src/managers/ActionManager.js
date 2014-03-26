//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ActionManager')
//@Autoload

//@Require('Class')
//@Require('Set')
//@Require('TypeUtil')
//@Require('airbugserver.Action')
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
var Action                      = bugpack.require('airbugserver.Action');
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

var ActionManager = Class.extend(EntityManager, {

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

bugmeta.annotate(ActionManager).with(
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