/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


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
//@Require('airbug.MessagePartPreviewCodeView')
//@Require('airbug.MessagePartPreviewImageView')
//@Require('airbug.MessagePartPreviewTextView')
//@Require('carapace.ButtonView')
//@Require('carapace.ButtonViewEvent')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.DivView')
//@Require('carapace.IconView')
//@Require('carapace.NakedButtonView')
//@Require('carapace.ViewBuilder')
//@Require('carapace.WellView')


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
    var MessagePartPreviewCodeView      = bugpack.require('airbug.MessagePartPreviewCodeView');
    var MessagePartPreviewImageView     = bugpack.require('airbug.MessagePartPreviewImageView');
    var MessagePartPreviewTextView      = bugpack.require('airbug.MessagePartPreviewTextView');
    var ButtonView                      = bugpack.require('carapace.ButtonView');
    var ButtonViewEvent                 = bugpack.require('carapace.ButtonViewEvent');
    var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
    var DivView                         = bugpack.require('carapace.DivView');
    var IconView                        = bugpack.require('carapace.IconView');
    var NakedButtonView                 = bugpack.require('carapace.NakedButtonView');
    var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');
    var WellView                        = bugpack.require('carapace.WellView');


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
             * @type {DivView}
             */
            this.divView                       = null;

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

            view(DivView)
                .name("divView")
                .attributes({
                    classes: "message-part-preview-wrapper"
                })
                .children([
                    view(WellView)
                        .name("wellView")
                        .appendTo("#div-{{cid}}")
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
                ])
                .build(this);

            this.createMessagePartPreviewView();


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.divView);
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
                    this.divView.css('display', 'inline-block');
                } else {
                    this.divView.css('display', 'none');
                }
            }
        },

        /**
         * @private
         */
        destroyMessagePartPreviewView: function() {
            if (this.messagePartPreviewView) {
                this.wellView.removeViewChild(this.messagePartPreviewView);
                this.divView.css('display', 'none');
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
