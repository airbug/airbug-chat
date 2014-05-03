//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.MessagePartPreviewContainer')

//@Require('Bug')
//@Require('Class')
//@Require('ClearChange')
//@Require('Exception')
//@Require('RemovePropertyChange')
//@Require('SetPropertyChange')
//@Require('airbug.ButtonView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.IconView')
//@Require('airbug.MessagePartPreviewCodeView')
//@Require('airbug.MessagePartPreviewImageView')
//@Require('airbug.MessagePartPreviewTextView')
//@Require('airbug.NakedButtonView')
//@Require('airbug.WellView')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug                             = bugpack.require('Bug');
    var Class                           = bugpack.require('Class');
    var ClearChange                     = bugpack.require('ClearChange');
    var Exception                       = bugpack.require('Exception');
    var RemovePropertyChange            = bugpack.require('RemovePropertyChange');
    var SetPropertyChange               = bugpack.require('SetPropertyChange');
    var ButtonView                      = bugpack.require('airbug.ButtonView');
    var ButtonViewEvent                 = bugpack.require('airbug.ButtonViewEvent');
    var IconView                        = bugpack.require('airbug.IconView');
    var MessagePartPreviewCodeView      = bugpack.require('airbug.MessagePartPreviewCodeView');
    var MessagePartPreviewImageView     = bugpack.require('airbug.MessagePartPreviewImageView');
    var MessagePartPreviewTextView      = bugpack.require('airbug.MessagePartPreviewTextView');
    var NakedButtonView                 = bugpack.require('airbug.NakedButtonView');
    var WellView                        = bugpack.require('airbug.WellView');
    var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
    var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var view                            = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var MessagePartPreviewContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.MessagePartPreviewContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {MessagePartModel} messagePartModel
         */
        _constructor: function(messagePartModel) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            // Models
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {MessagePartModel}
             */
            this.messagePartModel               = messagePartModel;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {MessagePartPreviewView}
             */
            this.messagePartPreviewView         = null;

            /**
             * @private
             * @type {NakedButtonView}
             */
            this.removeButtonView               = null;

            /**
             * @private
             * @type {WellView}
             */
            this.wellView                       = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createContainer: function() {
            this._super();

            // Create Views
            //-------------------------------------------------------------------------------

            view(WellView)
                .name("wellView")
                .attributes({
                    classes: "message-part-preview-wrapper"
                })
                .children([
                    view(NakedButtonView)
                        .name("removeButtonView")
                        .appendTo("#well-{{cid}}")
                        .attributes({
                            type: ButtonView.Type.LINK,
                            align: "right",
                            classes: "message-part-preview-remove-button"
                        })
                        .children([
                            view(IconView)
                                .attributes({
                                    type: IconView.Type.REMOVE
                                })
                                .appendTo("#button-{{cid}}")
                        ])
                ])
                .build(this);

            this.createMessagePartPreviewView();


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.wellView);
            this.addModel(this.messagePartModel);
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.removeButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearRemoveButtonClicked, this);
            this.messagePartModel.unobserve(ClearChange.CHANGE_TYPE, "", this.observeMessagePartClearChange, this);
            this.messagePartModel.unobserve(RemovePropertyChange.CHANGE_TYPE, "type", this.observeMessagePartTypeRemovePropertyChange, this);
            this.messagePartModel.unobserve(SetPropertyChange.CHANGE_TYPE, "type", this.observeMessagePartTypeSetPropertyChange, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.removeButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearRemoveButtonClicked, this);
            this.messagePartModel.observe(ClearChange.CHANGE_TYPE, "", this.observeMessagePartClearChange, this);
            this.messagePartModel.observe(RemovePropertyChange.CHANGE_TYPE, "type", this.observeMessagePartTypeRemovePropertyChange, this);
            this.messagePartModel.observe(SetPropertyChange.CHANGE_TYPE, "type", this.observeMessagePartTypeSetPropertyChange, this);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        createMessagePartPreviewView: function() {
            if (!this.messagePartPreviewView) {
                var messageType = this.messagePartModel.getProperty("type");
                if (messageType) {
                    switch (messageType) {
                        case "code":
                            view(MessagePartPreviewCodeView)
                                .name("messagePartPreviewView")
                                .model(this.messagePartModel)
                                .build(this);
                            break;
                        case "image":
                            view(MessagePartPreviewImageView)
                                .name("messagePartPreviewView")
                                .model(this.messagePartModel)
                                .build(this);
                            break;
                        case "text":
                            view(MessagePartPreviewTextView)
                                .name("messagePartPreviewView")
                                .model(this.messagePartModel)
                                .build(this);
                            break;
                        default:
                            throw new Bug("UnsupportedMessagePart", {}, "Unsupported message part type '" + messageType + "'");
                    }
                    this.wellView.addViewChild(this.messagePartPreviewView, "#well-{{cid}}");
                    this.wellView.show();
                } else {
                    this.wellView.hide();
                }
            }
        },

        /**
         * @private
         */
        destroyMessagePartPreviewView: function() {
            if (this.messagePartPreviewView) {
                this.wellView.removeViewChild(this.messagePartPreviewView);
                this.wellView.hide();
                this.messagePartPreviewView.destroy();
                this.messagePartPreviewView = null;
            }
        },

        /**
         * @private
         */
        refreshMessagePartPreviewView: function() {
            this.destroyMessagePartPreviewView();
            this.createMessagePartPreviewView();
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {ButtonViewEvent} event
         */
        hearRemoveButtonClicked: function(event) {
            this.destroyMessagePartPreviewView();
            this.messagePartModel.clear();
        },


        //-------------------------------------------------------------------------------
        // Observers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Observation} observation
         */
        observeMessagePartClearChange: function(observation) {
            this.destroyMessagePartPreviewView();
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeMessagePartTypeRemovePropertyChange: function(observation) {
            this.destroyMessagePartPreviewView();
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeMessagePartTypeSetPropertyChange: function(observation) {
            this.refreshMessagePartPreviewView();
        }
    });

    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.MessagePartPreviewContainer", MessagePartPreviewContainer);
});