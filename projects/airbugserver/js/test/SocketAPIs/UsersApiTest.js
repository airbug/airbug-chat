//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('annotate.Annotate')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Annotate =          bugpack.require('annotate.Annotate');
var TestAnnotation =    bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var test = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------
