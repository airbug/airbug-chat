//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ButtonDropdownView')

//@Require('Class')
//@Require('airbug.ButtonView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var ButtonView  = bugpack.require('airbug.ButtonView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ButtonView}
     */
    var ButtonDropdownView = Class.extend(ButtonView, {

        _name: "airbug.ButtonDropdownView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:   '<div id="dropdown-button-wrapper-{{cid}}" class="button-wrapper {{classes}}">' +
                        '<div class="btn-group">' +
                            '<button id="dropdown-button-{{cid}}" class="btn dropdown-toggle {{buttonClasses}}" data-toggle="dropdown">' +
                            '</button>' +
                            '<ul id="dropdown-list-{{cid}}" class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                            '</ul>' +
                        '</div>' +
                    '</div>',

        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {$}
         */
        getDropdownButtonElement: function() {
            return this.findElement("#dropdown-button-{{cid}}");
        },


        //-------------------------------------------------------------------------------
        // BugView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        initializeView: function() {
            this._super();
            this.getDropdownButtonElement().dropdown();
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ButtonDropdownView", ButtonDropdownView);
});
