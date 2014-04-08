//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('airbugserver.Action')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();

//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Action                  = bugpack.require('airbugserver.Action');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var actionInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testActionData   = {
            actionData: {},
            actionType: "testActionType",
            actionVersion: "testActionVersion",
            createdAt: new Date(Date.now()),
            id: "testId",
            occurredAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
            userId: "testUserId"
        };
        this.testAction = new Action(this.testActionData);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testAction.getActionData(), this.testActionData.actionData,
            "Assert that #getActionData is equal to testActionData.actionData");
        test.assertEqual(this.testAction.getActionType(), this.testActionData.actionType,
            "Assert that #getActionType is equal to testActionData.airbugVersion value");
        test.assertEqual(this.testAction.getActionVersion(), this.testActionData.actionVersion,
            "Assert that #getActionVersion is equal to testActionData.actionVersion");
        test.assertEqual(this.testAction.getCreatedAt(), this.testActionData.createdAt,
            "Assert that #getCreatedAt is equal to testActionData.createdAt value");
        test.assertEqual(this.testAction.getId(), this.testActionData.id,
            "Assert that #getId is equal to testActionData.id value");
        test.assertEqual(this.testAction.getOccurredAt(), this.testActionData.occurredAt,
            "Assert that #getOccurredAt is equal to testActionData.occurredAt value");
        test.assertEqual(this.testAction.getUpdatedAt(), this.testActionData.updatedAt,
            "Assert that #getUpdatedAt is equal to testActionData.updatedAt value");
        test.assertEqual(this.testAction.getUserId(), this.testActionData.userId,
            "Assert that #getUserId is equal to testActionData.userId value");
    }
};

var actionDeepCloneTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testActionData   = {
            actionData: {
                key: "value"
            },
            actionType: "testActionType",
            actionVersion: "testActionVersion",
            createdAt: new Date(Date.now()),
            id: "testId",
            occurredAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
            userId: "testUserId"
        };
        this.testAction = new Action(this.testActionData);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        /** @type {Action} */
        var clone = this.testAction.clone(true);
        test.assertEqual(clone.getActionData().key, this.testAction.getActionData().key,
            "Assert that #getActionData.key is equal to testAction#getActionData.key");
        test.assertEqual(clone.getActionType(), this.testAction.getActionType(),
            "Assert that #getActionType is equal to testAction#getActionType");
        test.assertEqual(clone.getActionVersion(), this.testAction.getActionVersion(),
            "Assert that #getActionVersion is equal to this.testAction#getActionVersion");
        test.assertEqual(clone.getCreatedAt(), this.testAction.getCreatedAt(),
            "Assert that #getCreatedAt is equal to testAction#getCreatedAt value");
        test.assertEqual(clone.getId(), this.testAction.getId(),
            "Assert that #getId is equal to testAction#getId value");
        test.assertEqual(clone.getOccurredAt(), this.testAction.getOccurredAt(),
            "Assert that #getOccurredAt is equal to testAction#getOccurredAt value");
        test.assertEqual(clone.getUpdatedAt(), this.testAction.getUpdatedAt(),
            "Assert that #getUpdatedAt is equal to testAction#getUpdatedAt value");
        test.assertEqual(clone.getUserId(), this.testAction.getUserId(),
            "Assert that #getUserId is equal to testAction#getUserId value");

        test.assertTrue(clone !== this.testAction,
            "Assert that Action instances are not the same");
    }
};

var actionMongooseSchemaTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn = bugyarn.yarn(this);
        yarn.spin([
            "setupDummyMongoDataStore"
        ]);
        this.schemaManager.processModule();
        this.mongoDataStore.processModule();
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var mongooseModel   = this.mongoDataStore.getMongooseModelForName("Action");
        var mongooseSchema  = mongooseModel.schema;

        //TEST
        console.log("BIG TEST: Action mongooseSchema.schemaObject:", mongooseSchema.schemaObject);
        var expectedSchemaObject = {
            actionData: {
                index: false,
                required: false,
                type: this.mongoose.Schema.Types.Mixed,
                unique: false
            },
            actionType: {
                index: true,
                required: true,
                type: String,
                unique: false
            },
            actionVersion:{
                index: true,
                required: true,
                type: String,
                unique:false
            },
            createdAt: {
                index: false,
                required: true,
                type: Date,
                unique: false
            },
            userId: {
                index: true,
                required: true,
                type: this.mongoose.Schema.Types.ObjectId,
                unique: false
            },
            occurredAt: {
                index: true,
                required: true,
                type: Date,
                unique: false
            },
            updatedAt: {
                index: false,
                required: true,
                type: Date,
                unique: false
            }
        };

        test.assertEqual(JSON.stringify(mongooseSchema.schemaObject), JSON.stringify(expectedSchemaObject),
            "Assert Action mongooseSchema is expected result");
    }
};


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(actionInstantiationTest).with(
    test().name("Action - instantiation Test")
);
bugmeta.annotate(actionDeepCloneTest).with(
    test().name("Action - #clone deep Test")
);
bugmeta.annotate(actionMongooseSchemaTest).with(
    test().name("Action - mongoose schema Test")
);
