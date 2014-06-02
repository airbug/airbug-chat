//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.Action')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityTag')
//@Require('bugentity.IndexTag')
//@Require('bugentity.PropertyTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Bug                     = bugpack.require('Bug');
    var Class                   = bugpack.require('Class');
    var Entity                  = bugpack.require('bugentity.Entity');
    var EntityTag        = bugpack.require('bugentity.EntityTag');
    var IndexTag         = bugpack.require('bugentity.IndexTag');
    var PropertyTag      = bugpack.require('bugentity.PropertyTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var entity                  = EntityTag.entity;
    var index                   = IndexTag.index;
    var property                = PropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Entity}
     */
    var Action = Class.extend(Entity, {

        _name: "airbugserver.Action",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param data
         * @private
         */
        _constructor: function(data) {

            this._super(data);


            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {User}
             */
            this.user               = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getActionData: function() {
            return this.getEntityData().actionData;
        },

        /**
         * @param {string} actionData
         */
        setActionData: function(actionData) {
            this.getEntityData().actionData = actionData;
        },

        /**
         * @return {string}
         */
        getActionType: function() {
            return this.getEntityData().actionType;
        },

        /**
         * @param {string} actionType
         */
        setActionType: function(actionType) {
            this.getEntityData().actionType = actionType;
        },

        /**
         * @return {string}
         */
        getActionVersion: function() {
            return this.getEntityData().actionVersion;
        },

        /**
         * @param {string} actionVersion
         */
        setActionVersion: function(actionVersion) {
            this.getEntityData().actionVersion = actionVersion;
        },

        /**
         * @return {Date}
         */
        getOccurredAt: function() {
            return this.getEntityData().occurredAt;
        },

        /**
         * @param {Date} occurredAt
         */
        setOccurredAt: function(occurredAt) {
            this.getEntityData().occurredAt = occurredAt;
        },

        /**
         * @return {string}
         */
        getUserId: function() {
            return this.getEntityData().userId;
        },

        /**
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
                throw new Bug("IllegalState", {}, "user must have an id first");
            }
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(Action).with(
        entity("Action")
            .properties([
                property("actionData")
                    .type("mixed"),
                property("actionType")
                    .type("string")
                    .require(true)
                    .index(true),
                property("actionVersion")
                    .type("string")
                    .require(true)
                    .index(true),
                property("createdAt")
                    .type("date")
                    .require(true)
                    .default(Date.now),
                property("id")
                    .type("string")
                    .primaryId(),
                property("userId")
                    .type("string")
                    .index(true)
                    .require(true)
                    .id(),
                property("user")
                    .type("User")
                    .populates(true)
                    .store(false),
                property("occurredAt")
                    .type("date")
                    .index(true)
                    .require(true),
                property("updatedAt")
                    .type("date")
                    .require(true)
                    .default(Date.now)
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.Action', Action);
});
