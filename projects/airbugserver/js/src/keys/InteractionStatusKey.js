//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('InteractionStatusKey')

//@Require('ArgumentBug')
//@Require('Class')
//@Require('IObjectable')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgumentBug         = bugpack.require('ArgumentBug');
var Class               = bugpack.require('Class');
var IObjectable         = bugpack.require('IObjectable');
var Obj                 = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var InteractionStatusKey = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} userId
     */
    _constructor: function(userId) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.userId         = userId;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getUserId: function() {
        return this.userId;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, InteractionStatusKey)) {
            return (value.getUserId() === this.getUserId());
        }
        return false;
    },

    /**
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[InteractionStatusKey]" +
                Obj.hashCode(this.userId));
        }
        return this._hashCode;
    },


    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    toObject: function() {
        return {
            userId: this.userId
        };
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    toStringKey: function() {
        return "interactionStatus" + ":" + this.userId;
    }
});



//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {string} stringKey
 * @returns {InteractionStatusKey}
 */
InteractionStatusKey.fromStringKey = function(stringKey) {
    var keyParts = stringKey.split(":");
    if (keyParts.length === 2) {
        var userStatus  = keyParts[0];
        var userId      = keyParts[1];
        if (userStatus === "interactionStatus") {
            return new InteractionStatusKey(userId);
        } else {
            throw new ArgumentBug(ArgumentBug.ILLEGAL, "stringKey", stringKey, "parameter must in InteractionStatusKey string format");
        }
    } else {
        throw new ArgumentBug(ArgumentBug.ILLEGAL, "stringKey", stringKey, "parameter must in InteractionStatusKey string format");
    }
};


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(InteractionStatusKey, IObjectable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.InteractionStatusKey', InteractionStatusKey);
