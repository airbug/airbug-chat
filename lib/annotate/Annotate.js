//TODO BRN: This should be moved to a resources folder and consumed by the compiler which will add it in to any code it compiles


//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var Annotation = require('./Annotation');
var AnnotationProcessor = require('./AnnotationProcessor');
var Class = require('../Class');
var List = require('../List');
var Map = require('../Map');
var Obj = require('../Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Annotate = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(reference) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.reference = reference;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    with: function() {
        for (var i = 0, size = arguments.length; i < size; i++) {
            var annotationString = arguments[i];
            this.parseAnnotationString(annotationString);
        }

        // NOTE BRN: Return the reference so that whatever function we're annotating is passed through and the reference
        // is assigned correctly.

        return this.reference;
    },


    parseAnnotationString: function(annotationString) {

        //TODO BRN: This is a super hacky parse job. If annotations get more complex it might be worth building a more sophisticated Lexical parsing system.

        var annotationType = "";
        var annotationParamList = new List();

        // Validate that the first character is @ and then remove it. If it's not throw an error.

        var firstCharacter = annotationString.substring(0, 1);
        if (firstCharacter === '@') {
            annotationString = annotationString.substring(1, annotationString.length);
            var openParenthesisIndex = annotationString.indexOf('(');
            if (openParenthesisIndex >= 0) {
                annotationType = annotationString.substring(0, openParenthesisIndex);
                var closeParenthesisIndex = annotationString.indexOf(')');
                if (closeParenthesisIndex !== annotationString.length - 1) {
                    throw new Error("Could not find closing parenthesis of annotation");
                }
                var argumentsString = annotationString.substring(openParenthesisIndex+1, closeParenthesisIndex);
                var argumentsArray = argumentsString.split(',');

                for (var i = 0, size = argumentsArray.length; i < size; i++) {
                    var paramString = argumentsArray[i];

                    if (argumentsString.substring(0, 1) === '"') {
                        if (argumentsString.substring(argumentsString.length - 1, argumentsString.length) !== '"') {
                            throw new Error("Expecting closing \" for annotation argument");
                        }
                        argumentsString = argumentsString.substring(1, argumentsString.length - 1);
                    } else if (argumentsString.substring(0, 1) === "'") {
                        if (argumentsString.substring(argumentsString.length - 1, argumentsString.length) !== "'") {
                            throw new Error("Expecting closing ' for annotation argument");
                        }
                        argumentsString = argumentsString.substring(1, argumentsString.length - 1);
                    }
                    annotationParamList.add(argumentsString);
                }

            } else {
                annotationType = annotationString;
            }

        } else {
            throw new Error("Annotation must start with @");
        }


        var annotation = new Annotation(this.reference, annotationType, annotationParamList);
        var annotationTypeList =  Annotate.annotationMap.get(annotationType);
        if (!annotationTypeList) {
            annotationTypeList = new List();
            Annotate.annotationMap.put(annotationType, annotationTypeList);
        }
        annotationTypeList.add(annotation);
        Annotate.processAnnotation(annotation);
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

Annotate.annotationMap = new Map();

Annotate.annotationProcessorMap = new Map();

Annotate.processingAnnotationsTimeout = null;


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

Annotate.annotate = function(reference) {
    return new Annotate(reference);
};

Annotate.processAnnotation = function(annotation) {
    var annotationProcessorTypeList = Annotate.annotationProcessorMap.get(annotation.getType());
    if (annotationProcessorTypeList) {
        annotationProcessorTypeList.forEach(function(annotationProcessor) {
            annotationProcessor.processAnnotation(annotation);
        });
    }
};

Annotate.registerAnnotationProcessor = function(annotationType, annotationProcessorFunction) {
    var annotationProcessorTypeList = Annotate.annotationProcessorMap.get(annotationType);
    if (!annotationProcessorTypeList) {
        annotationProcessorTypeList = new List();
        Annotate.annotationProcessorMap.put(annotationType, annotationProcessorTypeList);
    }
    var annotationProcessor = new AnnotationProcessor(annotationProcessorFunction);
    annotationProcessorTypeList.add(annotationProcessor);

    // Process any annotations that have already been registered for this type.

    var annotationTypeList =  Annotate.annotationMap.get(annotationType);
    if (annotationTypeList) {
        annotationTypeList.forEach(function(annotation) {
            Annotate.processAnnotation(annotation);
        });
    }
};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = Annotate;
