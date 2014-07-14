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

//@Export('airbugserver.UserImageAssetStream')
//@Autoload

//@Require('Class')
//@Require('Set')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityTag')
//@Require('bugentity.PropertyTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Set                     = bugpack.require('Set');
var Entity                  = bugpack.require('bugentity.Entity');
var EntityTag        = bugpack.require('bugentity.EntityTag');
var PropertyTag      = bugpack.require('bugentity.PropertyTag');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var entity                  = EntityTag.entity;
var property                = PropertyTag.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserImageAssetStream = Class.extend(Entity, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(data) {

        this._super(data);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------
    }


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------


});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(UserImageAssetStream).with(
    entity("UserImageAssetStream")
        .properties([
            property("createdAt")
                .type("date")
                .default(Date.now),
            property("id")
                .type("string")
                .primaryId(),
            property("userImageAssetIdSet")
                .type("Set")
                .collectionOf("string")
                .id(),
            property("updatedAt")
                .type("date")
                .default(Date.now)
        ])
        .store(false)
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserImageAssetStream', UserImageAssetStream);
