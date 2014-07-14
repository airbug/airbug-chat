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

//@Export('airbug.ImagePreviewContainer')

//@Require('Class')
//@Require('airbug.ImagePreviewView')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                                   = bugpack.require('Class');
var ImagePreviewView                        = bugpack.require('airbug.ImagePreviewView');
var CarapaceContainer                       = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                             = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view                                = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ImagePreviewContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(imageAssetModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------


        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ImageAssetModel}
         */
        this.imageAssetModel                    = imageAssetModel;


        // Modules
        //-------------------------------------------------------------------------------


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ImagePreviewView}
         */
        this.imagePreviewView                    = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------


    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------


        // Create Views
        //-------------------------------------------------------------------------------

        this.imagePreviewView =
            view(ImagePreviewView)
                .model(this.imageAssetModel)
                .build();

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.imagePreviewView);

    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ImagePreviewContainer", ImagePreviewContainer);
