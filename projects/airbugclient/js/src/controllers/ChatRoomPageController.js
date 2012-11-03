//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ChatRoomPageController')

//@Require('Annotate')
//@Require('AnnotateRoute')
//@Require('ApplicationController')
//@Require('ChatRoomPageContainer')
//@Require('Class')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var annotation = Annotate.annotation;
var route = AnnotateRoute.route;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatRoomPageController = Class.extend(ApplicationController, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(router) {

        this._super(router);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatRoomPageContainer}
         */
        this.chatRoomPageContainer = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createController: function() {
        this._super();
        this.chatRoomPageContainer = new ChatRoomPageContainer(this.apiPublisher);
        this.setContainerTop(this.chatRoomPageContainer);
    }
});
annotate(ChatRoomPageController).with(
    annotation("Controller").params(
        route("room/:uid")
    )
);
