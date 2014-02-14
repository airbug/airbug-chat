//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('BetaKeyDashboardPageContainer')

//@Require('Class')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.BetaKeyCounterModel')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.ButtonView')
//@Require('airbug.FormControlGroupView')
//@Require('airbug.FormView')
//@Require('airbug.FormViewEvent')
//@Require('airbug.HomeButtonContainer')
//@Require('airbug.LogoutButtonContainer')
//@Require('airbug.PageView')
//@Require('airbug.PanelWithHeaderView')
//@Require('airbug.InputView')
//@Require('airbug.NakedSubmitButtonView')
//@Require('airbug.TableDataView')
//@Require('airbug.TableHeadingView')
//@Require('airbug.TableRowView')
//@Require('airbug.TableView')
//@Require('bugmeta.BugMeta')
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

var Class                       = bugpack.require('Class');
var ApplicationContainer        = bugpack.require('airbug.ApplicationContainer');
var BetaKeyCounterModel         = bugpack.require('airbug.BetaKeyCounterModel');
var ButtonViewEvent             = bugpack.require('airbug.ButtonViewEvent');
var ButtonView                  = bugpack.require('airbug.ButtonView');
var FormView                    = bugpack.require('airbug.FormView');
var FormViewEvent               = bugpack.require('airbug.FormViewEvent');
var HomeButtonContainer         = bugpack.require('airbug.HomeButtonContainer');
var InputView                   = bugpack.require('airbug.InputView');
var LogoutButtonContainer       = bugpack.require('airbug.LogoutButtonContainer');
var PageView                    = bugpack.require('airbug.PageView');
var PanelWithHeaderView         = bugpack.require('airbug.PanelWithHeaderView');
var NakedSubmitButtonView       = bugpack.require('airbug.NakedSubmitButtonView');
var TableDataView               = bugpack.require('airbug.TableDataView');
var TableHeadingView            = bugpack.require('airbug.TableHeadingView');
var TableRowView                = bugpack.require('airbug.TableRowView');
var TableView                   = bugpack.require('airbug.TableView');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation         = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                   = AutowiredAnnotation.autowired;
var bugmeta                     = BugMeta.context();
var property                    = PropertyAnnotation.property;
var view                        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BetaKeyDashboardPageContainer = Class.extend(ApplicationContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------



        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {HomeButtonContainer}
         */
        this.homeButtonContainer            = null;

        /**
         * @private
         * @type {LogoutButtonContainer}
         */
        this.logoutButtonContainer          = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {FormView}
         */
        this.formView                       = null;

        /**
         * @protected
         * @type {PageView}
         */
        this.pageView                       = null;

        /**
         * @protected
         * @type {NakedSubmitButtonView}
         */
        this.submitButtonView               = null;

        /**
         * @protected
         * @type {TableView}
         */
        this.tableView                      = null;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BetaKeyCounterManagerModule}
         */
        this.betaKeyCounterManagerModule    = null;

        /**
         * @private
         * @type {DocumentUtil}
         */
        this.documentUtil                   = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array.<*>} routingArgs
     */
    activateContainer: function(routingArgs) {
        this._super(routingArgs);
        this.documentUtil.setTitle("Beta Key Dashboard - airbug");
    },

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
                    view(PanelWithHeaderView)
                        .attributes({headerTitle: "Beta Key Dashboard"})
                        .children([
                            view(FormView)
                                .name("formView")
                                .id("beta-key-form")
                                .attributes({
                                    classes: "form-inline"
                                })
                                .appendTo(".panel-body")
                                .children([
                                    view(InputView)
                                        .id("beta-key-input-field")
                                        .attributes({
                                            placeholder: "Beta Key",
                                            name: "betaKey",
                                            type: "text"
                                        })
                                        .appendTo("#beta-key-form"),
                                    view(NakedSubmitButtonView)
                                        .name("submitButtonView")
                                        .attributes({
                                            size: ButtonView.Size.NORMAL,
                                            type: ButtonView.Type.PRIMARY,
                                            buttonName: "Search"
                                        })
                                        .appendTo("#beta-key-form")
                                ]),
                            view(TableView)
                                .name("tableView")
                                .appendTo(".panel-body")
                                .children([
                                    view(TableRowView)
                                        .children([
                                            view(TableHeadingView)
                                                .attributes({text: "Beta Key"}),
                                            view(TableHeadingView)
                                                .attributes({text: "Count"})
                                        ])
                                ])
                        ])
                ])
                .build(this);


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.applicationView.addViewChild(this.pageView, "#application-" + this.applicationView.cid);

    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.homeButtonContainer        = new HomeButtonContainer();
        this.logoutButtonContainer      = new LogoutButtonContainer();
        this.addContainerChild(this.homeButtonContainer,   "#header-left");
        this.addContainerChild(this.logoutButtonContainer, '#header-right');
    },

    initializeContainer: function() {
        console.log("formView:", this.formView);
//        this.formView.addEventListener(FormViewEvent.EventType.SUBMIT, this.handleFormSubmitEvent, this);
        this.submitButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.handleSubmitButtonClickedEvent, this);
    },

    deinitializeContainer: function() {
//        this.formView.removeEventListener(FormViewEvent.EventType.SUBMIT, this.handleFormSubmitEvent, this);
        this.submitButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.handleSubmitButtonClickedEvent, this);
    },

    handleSubmitButtonClickedEvent: function() {
        console.log("handleSubmitButtonClickedEvent");
        var formData = this.formView.getFormData();
        var betaKey = formData.betaKey;
        console.log("formData:", formData);
        console.log("betaKey:", betaKey);
        this.loadBetaKeyCountersByBetaKey(betaKey);
    },

    handleFormSubmitEvent: function(event) {
        var formData = event.getData().formData;
        var betaKey = formData.betaKey;
        console.log("formData:", formData);
        console.log("betaKey:", betaKey);
        this.loadBetaKeyCountersByBetaKey(betaKey);
    },

    loadBetaKeyCountersByBetaKey: function(betaKey) {
        var _this = this;
        this.betaKeyCounterManagerModule.retrieveBetaKeyCounterByBetaKey(betaKey, function(throwable, meldDocument){
            if(!throwable) {
                if(meldDocument) {
                    _this.clearTable();
                    if(Class.doesExtend(meldDocument, List)){
                        meldDocument.forEach(function(meldDocument){
                            _this.addBetaKeyCounterToTable(meldDocument);
                        });
                    } else if (meldDocument){
                        _this.addBetaKeyCounterToTable(meldDocument);
                    }
                } else {
                    console.log("There are no beta keys by the the name", betaKey);
                }
            } else {
                console.log("failed to load beta key counter for", betaKey, "throwable:", throwable);
            }
        });
    },

    addBetaKeyCounterToTable: function(meldDocument) {
        console.log("addBetaKeyCounterToTable");
        var betaKeyCounterModel = new BetaKeyCounterModel({}, meldDocument);
        var tableRowView = view(TableRowView)
            .children([
                view(TableDataView)
                    .attributes({text: betaKeyCounterModel.getProperty("betaKey")}),
                view(TableDataView)
                    .attributes({text: betaKeyCounterModel.getProperty("count")})
            ])
            .build();

        this.getViewTop().addViewChild(tableRowView, "#table-" + this.tableView.getCid());
    },

    clearTable: function() {
        this.tableView.$el.find("tr").each(function(index, row){
            if(index !== 0) {
                row.remove();
            }
        });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(BetaKeyDashboardPageContainer).with(
    autowired().properties([
        property("betaKeyCounterManagerModule").ref("betaKeyCounterManagerModule"),
        property("documentUtil").ref("documentUtil")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.BetaKeyDashboardPageContainer", BetaKeyDashboardPageContainer);
