//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('TrackerModule')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class   = bugpack.require('Class');
var Obj     = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var TrackerModule = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(sonarbugClient) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {SonarbugClient}
         */
        this.sonarbugClient = sonarbugClient;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    track: function(eventName, data){
        this.trackSB(eventName, data);
    },
    trackAppLoad: function() {
        this.trackSB("appLoad", null);
    },
    trackGoalComplete: function(goalName) {
        this.trackSB("goalComplete", {goalName: goalName});
    },
    trackPageView: function(pageId) {
        this.trackSB("pageView", {pageId: pageId});
    },
    trackSB: function(eventName, data){
        this.sonarbugClient.track(eventName, data);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbug.TrackerModule', TrackerModule);
