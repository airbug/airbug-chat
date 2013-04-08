//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AirbugApi')

//@Require('Class')
//@Require('Obj')
//@Require('Queue')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =             bugpack.require('Class');
var Obj =               bugpack.require('Obj');
var Queue =             bugpack.require('Queue');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AirbugApi = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {boolean}
         */
        this.initialized = false;

        /**
         * @private
         * @type {boolean}
         */
        this.initializing = false;

        /**
         * @private
         * @type {Queue}
         */
        this.initializeQueue = new Queue();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------



    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    createUser: function(fullName, email, callback) {
        this.initialize(function() {
            //Do some socket io call to create a user
        });
    },

    initialize: function(callback) {
        if (!this.initialized) {
            if (!this.initializing) {
                this.initializing = true;


                //Initialize here (connect to socket server)
                //this.initialized = true;

            } else {
                this.initializeQueue.enqueue(callback);
            }
        } else {
            callback();
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AirbugApi", AirbugApi);
