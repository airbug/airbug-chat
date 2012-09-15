//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var Class = require('./Class');
var List = require('./List');
var MapTree = require('./MapTree');
var MapTreeNode = require('./MapTreeNode');
var Obj = require('./Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PathMap = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.pathMapTree = new MapTree();
    },


    //-------------------------------------------------------------------------------
    // Class methods
    //-------------------------------------------------------------------------------

    put: function(path, value) {
        var pathPartsList = this.parsePathParts(path);
        var rootNode = this.pathMapTree.getRootNode();
        var targetNode = null;
        if (pathPartsList.getCount() > 0) {
            var currentNode = rootNode;
            pathPartsList.forEach(function(pathPart) {
                var childNode = currentNode.getChildNode(pathPart);
                if (!childNode) {
                    childNode = new MapTreeNode();
                    currentNode.putChildNode(pathPart, childNode);
                }
                currentNode = childNode;
            });
            targetNode = currentNode;
        } else {
            targetNode = rootNode;
        }
        targetNode.setData(value);
    },

    remove: function(path) {
        //TODO BRN (OIN):
    },

    get: function(path) {
        var pathPartsList = this.parsePathParts(path);
        var rootNode = this.pathMapTree.getRootNode();
        var targetNode = null;
        if (pathPartsList.getCount() > 0) {
            var currentNode = rootNode;
            for (var i = 0, size = pathPartsList.getCount(); i < size; i++) {
                var pathPart = pathPartsList.getAt(i);
                var childNode = currentNode.getChildNode(pathPart);
                if (!childNode) {

                    //NOTE BRN: If there is no child match, then try looking up the wild card.

                    childNode = currentNode.getChildNode(PathMap.WILD_CARD_TOKEN);
                    if (!childNode) {
                        return;
                    }
                }
                currentNode = childNode;
            }
            targetNode = currentNode;
        } else {
            targetNode = rootNode;
        }
        return targetNode.getData();
    },

    /**
     * @private
     * @param {string} path
     * @return {List}
     */
    parsePathParts: function(path) {
        var pathPartsList = new List();
        var pathPartsArray = path.split('/');
        for (var i = 0, size = pathPartsArray.length; i < size; i++) {
            var pathPart = pathPartsArray[i];
            pathPartsList.add(pathPart);
        }

        // NOTE BRN: Make sure that the path handler is not empty.

        if (pathPartsList.getCount() === 0) {
            throw new Error("Path string cannot be empty");
        }
        if (pathPartsList.getAt(0) !== '') {
            throw new Error("Path string expected to start with '/'");
        }
        pathPartsList.removeAt(0);
        if (pathPartsList.getAt(pathPartsList.getCount() - 1) === '') {
            pathPartsList.removeAt(pathPartsList.getCount() - 1);
        }
        return pathPartsList;
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

PathMap.WILD_CARD_TOKEN = '*';


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = PathMap;
