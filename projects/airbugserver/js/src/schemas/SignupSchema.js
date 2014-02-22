//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SignupSchema')
//@Autoload


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
var mongoose    = require('mongoose');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var Schema      = mongoose.Schema;
var ObjectId    = mongoose.Schema.Types.ObjectId;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SignupSchema = new Schema({
    acceptedLanguages:  {type: String},
    airbugVersion:      {type: String,      index: true,    required: true},
    baseBetaKey:        {type: String,      index: true},
    betaKey:            {type: String,      index: true,    required: true},
    city:               {type: String,      index: true},
    country:            {type: String,      index: true},
    createdAt:          {type: Date,        index: true,    required: true,     default: Date.now},
    day:                {type: Number,      index: true}, //1-31 getDate
    geoCoordinates:     {type: [Number],    index: true},
    ipAddress:          {type: String,      index: false}, // required: true
    languages:          {type: [String],    index: true},
    month:              {type: Number,      index: true}, //0-11 getMonth
    secondaryBetaKeys:  {type: [String],    index: true},
    state:              {type: String,      index: true},
    updatedAt:          {type: Date,        index: true,    required: true,     default: Date.now},
    userAgent:          {type: String,      index: true},
    userId:             {type: ObjectId,    index: true,                        ref: "user"},
    version:            {type: String,      index: true,    required: true,     default: "0.1.0"},
    weekday:            {type: Number,      index: true}, //0-6 getDay
    year:               {type: Number,      index: true}  //e.g. 2014 getFullYear
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.SignupSchema', SignupSchema);
