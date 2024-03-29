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

//@Export('airbug.WorkspaceModule')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('Map')
//@Require('TypeUtil')
//@Require('airbug.CommandModule')
//@Require('airbug.WorkspaceDefines')
//@Require('airbug.WorkspaceEvent')
//@Require('bugioc.ArgTag')
//@Require('bugioc.IInitializingModule')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug                     = bugpack.require('Bug');
    var Class                   = bugpack.require('Class');
    var Event                   = bugpack.require('Event');
    var EventDispatcher         = bugpack.require('EventDispatcher');
    var Map                     = bugpack.require('Map');
    var TypeUtil                = bugpack.require('TypeUtil');
    var CommandModule           = bugpack.require('airbug.CommandModule');
    var WorkspaceDefines        = bugpack.require('airbug.WorkspaceDefines');
    var WorkspaceEvent          = bugpack.require('airbug.WorkspaceEvent');
    var ArgTag                  = bugpack.require('bugioc.ArgTag');
    var IInitializingModule     = bugpack.require('bugioc.IInitializingModule');
    var ModuleTag               = bugpack.require('bugioc.ModuleTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                     = ArgTag.arg;
    var bugmeta                 = BugMeta.context();
    var module                  = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventDispatcher}
     * @implements {IInitializingModule}
     */
    var WorkspaceModule = Class.extend(EventDispatcher, {

        _name: "airbug.WorkspaceModule",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {CommandModule} commandModule
         */
        _constructor: function(commandModule) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CommandModule}
             */
            this.commandModule              = commandModule;

            /**
             * @private
             * @type {string}
             */
            this.currentWorkspaceName       = null;

            /**
             * @private
             * @type {Map.<string, IWorkspace>}
             */
            this.nameToWorkspaceMap         = new Map();

            /**
             * @private
             * @type {WorkspaceDefines.State}
             */
            this.workspaceState             = WorkspaceDefines.State.CLOSED;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {CommandModule}
         */
        getCommandModule: function() {
            return this.commandModule;
        },

        /**
         * @return {string}
         */
        getCurrentWorkspaceName: function() {
            return this.currentWorkspaceName;
        },

        /**
         * @return {WorkspaceDefines.State}
         */
        getWorkspaceState: function() {
            return this.workspaceState;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        isClosed: function() {
            return this.workspaceState === WorkspaceDefines.State.CLOSED;
        },

        /**
         * @return {boolean}
         */
        isOpen: function() {
            return this.workspaceState === WorkspaceDefines.State.OPEN;
        },


        //-------------------------------------------------------------------------------
        // IInitializingModule Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        deinitializeModule: function(callback) {
            callback();
        },

        /**
         * @param {function(Throwable=)} callback
         */
        initializeModule: function(callback) {
            callback();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        closeWorkspace: function() {
            this.updateWorkspaceState(WorkspaceDefines.State.CLOSED);
            this.clearCurrentWorkspace();
        },

        /**
         * @param {string} name
         */
        deregisterWorkspace: function(name) {
            this.nameToWorkspaceMap.remove(name);
        },

        /**
         * @param {string} workspaceName
         */
        openWorkspace: function(workspaceName) {
            this.updateWorkspaceState(WorkspaceDefines.State.OPEN);
            this.updateCurrentWorkspace(workspaceName);
        },

        /**
         * @param {string} name
         * @param {IWorkspace} workspace
         */
        registerWorkspace: function(name, workspace) {
            this.nameToWorkspaceMap.put(name, workspace);
            if (this.currentWorkspaceName === name && this.workspaceState === WorkspaceDefines.State.OPEN) {
                workspace.showWorkspace();
            } else {
                workspace.hideWorkspace();
            }
        },

        /**
         * @param {string} workspaceName
         */
        toggleWorkspace: function(workspaceName) {
            if (this.currentWorkspaceName === workspaceName) {
                this.closeWorkspace();
            } else {
                this.openWorkspace(workspaceName);
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        clearCurrentWorkspace: function() {
            if (this.currentWorkspaceName) {
                var previousWorkspaceName = this.currentWorkspaceName;
                var previousWorkspace = this.nameToWorkspaceMap.get(this.currentWorkspaceName);
                previousWorkspace.hideWorkspace();
                this.currentWorkspaceName = null;
                this.dispatchEvent(new WorkspaceEvent(WorkspaceEvent.EventType.CHANGED, {
                    workspace: null,
                    previousWorkspace: previousWorkspaceName
                }));
            }
        },

        /**
         * @private
         * @param {string} workspaceName
         */
        updateCurrentWorkspace: function(workspaceName) {
            if (this.nameToWorkspaceMap.containsKey(workspaceName)) {
                if (this.currentWorkspaceName !== workspaceName) {
                    var previousWorkspaceName = null;
                    if (this.currentWorkspaceName) {
                        previousWorkspaceName = this.currentWorkspaceName;
                        var previousWorkspace = this.nameToWorkspaceMap.get(this.currentWorkspaceName);
                        previousWorkspace.hideWorkspace();
                    }
                    this.currentWorkspaceName = workspaceName;
                    var newWorkspace = this.nameToWorkspaceMap.get(workspaceName);
                    newWorkspace.showWorkspace();
                    this.dispatchEvent(new WorkspaceEvent(WorkspaceEvent.EventType.CHANGED, {
                        workspace: workspaceName,
                        previousWorkspace: previousWorkspaceName
                    }));
                }
            } else {
                throw new Bug("IllegalState", {}, "Workspace by the name '" + workspaceName + "' does not exist");
            }
        },

        /**
         * @private
         * @param {WorkspaceDefines.State} workspaceState
         */
        updateWorkspaceState: function(workspaceState) {
            if (this.workspaceState !== workspaceState) {
                this.workspaceState = workspaceState;
                if (this.workspaceState === WorkspaceDefines.State.OPEN) {
                    this.dispatchEvent(new WorkspaceEvent(WorkspaceEvent.EventType.OPENED));
                } else {
                    this.dispatchEvent(new WorkspaceEvent(WorkspaceEvent.EventType.CLOSED));
                }
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(WorkspaceModule, IInitializingModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(WorkspaceModule).with(
        module("workspaceModule")
            .args([
                arg().ref("commandModule")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbug.WorkspaceModule', WorkspaceModule);
});
