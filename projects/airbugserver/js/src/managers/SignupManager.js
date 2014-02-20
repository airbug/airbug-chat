//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SignupManager')
//@Autoload

//@Require('Class')
//@Require('Set')
//@Require('TypeUtil')
//@Require('airbugserver.Signup')
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
var Signup                      = bugpack.require('airbugserver.Signup');
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

var SignupManager = Class.extend(EntityManager, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Signup} signup
     * @param {(Array.<string> | function(Throwable, Signup))} dependencies
     * @param {function(Throwable, Signup)=} callback
     */
    createSignup: function(signup, dependencies, callback) {
        if(TypeUtil.isFunction(dependencies)){
            callback        = dependencies;
            dependencies    = [];
        };
        var options         = {};
        this.create(signup, options, dependencies, callback);
    },

    /**
     * @param {Signup} signup
     * @param {function(Throwable)} callback
     */
    deleteSignup: function(signup, callback) {
        this.delete(signup, callback);
    },

    /**
     * @param {{
     *      createdAt: Date,
     *      id: string,
     *      updatedAt: Date
     * }} data
     * @return {Signup}
     */
    generateSignup: function(data) {
        var signup = new Signup(data);
        this.generate(signup);
        return signup;
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(SignupManager).with(
    entityManager("signupManager")
        .ofType("Signup")
        .args([
            arg().ref("entityManagerStore"),
            arg().ref("schemaManager"),
            arg().ref("mongoDataStore")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.SignupManager', SignupManager);
