//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var Annotate = require('../annotate/Annotate');
var Class = require('../Class');
var List = require('../List');
var Obj = require('../Obj');
var ReportCard = require('./ReportCard');
var Test = require('./Test');
var TestRunner = require('./TestRunner');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AnnotateUnit = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

    }


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

AnnotateUnit.registeredTestList = new List();


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

AnnotateUnit.registerTest = function(testName, testFunction) {
    var test = new Test(testName, testFunction);
    AnnotateUnit.registeredTestList.add(test);
};

/**
 * @param {boolean} logResults
 * @return {*}
 */
AnnotateUnit.runTests = function(logResults) {
    var reportCard = new ReportCard();
    AnnotateUnit.registeredTestList.forEach(function(test) {
        var testResult = TestRunner.runTest(test, logResults);
        reportCard.addTestResult(testResult);
    });

    if (logResults) {
        console.log("Number of PASSED tests: " + reportCard.numberPassedTests());
        console.log("Number of FAILED tests: " + reportCard.numberFailedTests());

        reportCard.getFailedTestResultList().forEach(function(testResult) {
            console.log("Test '" + testResult.getTest().getName() + "' FAILED with " + testResult.numberFailedAssertions() + " of " +
                testResult.numberAssertions() + " failed assertions.");
            testResult.getFailedAssertionResultList().forEach(function(assertionResult) {
                console.log(assertionResult.getMessage());
            });
            if (testResult.errorOccurred()) {
                console.log("An error occurred while running this test.");
                console.log(testResult.getError().stack);
            }
        });
    }

    return reportCard;
};


//-------------------------------------------------------------------------------
// Bootstrap
//-------------------------------------------------------------------------------

Annotate.registerAnnotationProcessor('Test', function(annotation) {
    AnnotateUnit.registerTest(annotation.getParamList().getAt(0), annotation.getReference());
});


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = AnnotateUnit;
