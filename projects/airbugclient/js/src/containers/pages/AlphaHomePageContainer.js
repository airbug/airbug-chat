//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AlphaHomePageContainer')

//@Require('Class')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.CreateRoomFormView')
//@Require('airbug.FormViewEvent')
//@Require('airbug.PageView')
//@Require('annotate.Annotate')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =                 bugpack.require('Class');
var ApplicationContainer =  bugpack.require('airbug.ApplicationContainer');
var CreateRoomFormView =    bugpack.require('airbug.CreateRoomFormView');
var FormViewEvent =         bugpack.require('airbug.FormViewEvent');
var PageView =              bugpack.require('airbug.PageView');
var Annotate =              bugpack.require('annotate.Annotate');
var AutowiredAnnotation =   bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation =    bugpack.require('bugioc.PropertyAnnotation');
var ViewBuilder =           bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var autowired = AutowiredAnnotation.autowired;
var property = PropertyAnnotation.property;
var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AlphaHomePageContainer = Class.extend(ApplicationContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule = null;

        /**
         * @private
         * @type {RoomManagerModule}
         */
        this.roomManagerModule = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {CreateRoomFormView}
         */
        this.createRoomFormView = null;

        /**
         * @protected
         * @type {PageView}
         */
        this.pageView = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Views
        //-------------------------------------------------------------------------------

        this.pageView =
            view(PageView)
                .children([
                    view(CreateRoomFormView)
                        .id("createRoomFormView")
                        .appendTo("*[id|=page]")
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.createRoomFormView = this.findViewById("createRoomFormView");
        this.applicationView.addViewChild(this.pageView, "#application-" + this.applicationView.cid);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.createRoomFormView.addEventListener(FormViewEvent.EventType.SUBMIT, this.hearCreateRoomFormViewSubmitEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {FormViewEvent} event
     */
    hearCreateRoomFormViewSubmitEvent: function(event) {
        //TODO BRN: Validate the event data

        this.roomManagerModule.createRoom(event.getData().roomName, function(error, roomModel) {
            if (!error) {

            } else {
                console.log(error);
                //TODO BRN: Handle the server error
            }
        });
    }
});
annotate(AlphaHomePageContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule"),
        property("roomManagerModule").ref("roomManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AlphaHomePageContainer", AlphaHomePageContainer);

